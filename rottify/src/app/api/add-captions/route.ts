import { NextApiRequest } from "next";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const API_KEY =
  "929d933d4e5e414ca87b640270c3f8570b127488212630f642c7af00cf9a3557";
const TEMPLATE_ID = "e7e758de-4eb4-460f-aeca-b2801ac7f8cc";
const API_BASE = "https://api.zapcap.ai";

export async function POST(req: NextApiRequest) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405 }
    );
  }

  try {
    const videoPath = path.join(process.cwd(), "public/videos/final_video.mp4");

    if (!fs.existsSync(videoPath)) {
      return new Response(
        JSON.stringify({ error: "Input video not found" }),
        { status: 400 }
      );
    }

    // 1. Upload Video
    console.log("Uploading video...");
    const form = new FormData();
    form.append("file", fs.createReadStream(videoPath));

    const uploadResponse = await axios.post(`${API_BASE}/videos`, form, {
      headers: { "x-api-key": API_KEY, ...form.getHeaders() },
    });

    const videoId = uploadResponse.data.id;
    console.log("Video uploaded, Video ID:", videoId);

    // 2. Create Caption Task
    console.log("Creating captioning task...");
    const taskResponse = await axios.post(
      `${API_BASE}/videos/${videoId}/task`,
      { templateId: TEMPLATE_ID, autoApprove: true, language: "en" },
      { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
    );

    const taskId = taskResponse.data.taskId;
    console.log("Task created, Task ID:", taskId);

    // 3. Poll for Task Completion
    console.log("Processing video...");
    let attempts = 0;
    let downloadUrl = null;

    while (attempts < 30) {
      const statusResponse = await axios.get(
        `${API_BASE}/videos/${videoId}/task/${taskId}`,
        {
          headers: { "x-api-key": API_KEY },
        }
      );

      const { status, error } = statusResponse.data;
      console.log("Status:", status);

      if (status === "completed") {
        downloadUrl = statusResponse.data.downloadUrl;
        break;
      } else if (status === "failed") {
        throw new Error(`Task failed: ${error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    }

    if (!downloadUrl) {
      return new Response(
        JSON.stringify({ error: "Captioning process timed out" }),
        { status: 500 }
      );
    }

    // 4. Download the Video
    console.log("Downloading captioned video...");
    const videoResponse = await axios.get(downloadUrl, {
      responseType: "stream",
    });

    const outputPath = path.join(process.cwd(), "public/videos/finalVideo.mp4");
    const writeStream = fs.createWriteStream(outputPath);

    await new Promise<void>((resolve, reject) => {
      videoResponse.data.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("Video saved to:", outputPath);

    return new Response(
      JSON.stringify({
        message: "Captioned video saved",
        videoUrl: "/videos/finalVideo.mp4",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

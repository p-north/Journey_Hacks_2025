import axios from "axios";
import FormData from "form-data";

import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";


const API_KEY = process.env.ZAPCAP_KEY;
const TEMPLATE_ID = "e7e758de-4eb4-460f-aeca-b2801ac7f8cc";
const API_BASE = "https://api.zapcap.ai";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const { mergedPath } = await req.json();

    if (!mergedPath) {
      return new Response(JSON.stringify({ error: "Input video not found" }), {
        status: 400,
      });
    }

    // 1. Upload Video
    console.log("Uploading video...");
    const form = new FormData();
    form.append("file", mergedPath);

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

    const outputPath = UploadAndFetchVideo(downloadUrl);

    return new Response(
      JSON.stringify({
        message: "Captioned video saved",
        videoUrl: `${outputPath}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// save and retrieve from Supabase bucket
async function UploadAndFetchVideo(downloadUrl: any) {
  try {
    // Download the video as a buffer
    const videoResponse = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });
    const videoBuffer = Buffer.from(videoResponse.data);

    // create a filename
    const filename = `transcribedVid_${Date.now()}.mp4`;

    // Upload the video as video buffer to Supabase bucket
    const { data, error } = await supabase.storage
      .from("Captioned")
      .upload(filename, videoBuffer, {
        contentType: "video/mp4",
        cacheControl: "3600",
        upsert: false, // Prevent overwriting
      });

    if (error) {
      console.error("Error uploading the video to Supabase", error);
      return null;
    }

    // Get the public url of the uploaded video
    const { data: publicUrl } = supabase.storage
      .from("Captioned")
      .getPublicUrl(filename);

    // return the public url
    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Error saving video:", error);
  }
}

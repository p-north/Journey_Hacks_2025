import { exec } from "child_process";
import path from "path";
import fs from "fs-extra";

export async function POST(req) {
    try {
        const { audioUrl } = await req.json();
        if (!audioUrl) {
            return new Response("Missing audio file", { status: 400 });
        }

        // Step 1: Decode Base64 audio and save it as a file
        const audioBuffer = Buffer.from(audioUrl.split(",")[1], "base64"); // Remove data URL prefix and decode Base64
        const audioPath = path.join(process.cwd(), "public", "speech.mp3");
        fs.writeFileSync(audioPath, audioBuffer);
        console.log("✅ Audio file saved:", audioPath);

        // Step 2: Get a list of video files in the public folder
        const videoFolder = path.join(process.cwd(), "public/videos");
        const videoFiles = ["1m.mp4", "2m.mp4", "3m.mp4"]; // List of available videos
        const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)]; // Pick one randomly
        console.log("🎥 Selected Video:", randomVideo);

        // Step 3: Define file paths
        const videoPath = path.join(videoFolder, randomVideo);
        const outputPath = path.join(videoFolder, "final_video.mp4");

        // Step 4: Run FFmpeg command to merge video + audio
     const command = '';

        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`❌ Error merging video and audio: ${error.message}`);
                    console.error("FFmpeg stderr:", stderr);
                    resolve(new Response("Error merging video", { status: 500 }));
                } else {
                    console.log("✅ Video and audio merged successfully.");
                    console.log("FFmpeg stdout:", stdout);
                    resolve(new Response(JSON.stringify({ outputPath: "final_video.mp4" }), { status: 200 }));
                }
            });
        });
    } catch (error) {
        console.error("❌ Error merging video and audio:", error);
        return new Response("Error merging video and audio", { status: 500 });
    }
}

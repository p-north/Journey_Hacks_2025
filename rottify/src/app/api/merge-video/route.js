import { createFFmpeg } from "@ffmpeg/ffmpeg"; // Only import createFFmpeg
import path from "path";
import fs from "fs-extra";

export async function POST(req) {
  try {
    const { audioUrl } = await req.json();
    if (!audioUrl) {
      return new Response("Missing audio file", { status: 400 });
    }

    // Step 1: Decode Base64 audio and save it as a .wav file
    const audioBuffer = Buffer.from(audioUrl.split(",")[1], "base64"); // Remove data URL prefix and decode Base64
    const audioPath = path.join(process.cwd(), "public", "speech.wav"); // Save audio as .wav
    fs.writeFileSync(audioPath, audioBuffer);
    console.log("✅ Audio file saved:", audioPath);

    // Step 2: Get a list of video files in the public folder
    const videoFolder = path.join(process.cwd(), "public/videos");
    const videoFiles = ["1m.mp4", "2m.mp4", "3m.mp4"]; // List of available videos
    const randomVideo =
      videoFiles[Math.floor(Math.random() * videoFiles.length)]; // Pick one randomly
    console.log("🎥 Selected Video:", randomVideo);

    // Step 3: Define file paths
    const videoPath = path.join(videoFolder, randomVideo);
    const outputPath = path.join(videoFolder, "final_video.mp4");

    // Step 4: Use ffmpeg.wasm to merge video + audio
    const ffmpeg = createFFmpeg({ log: true }); // Make sure to pass options if needed
    await ffmpeg.load();

    // Step 5: Write video and audio files to FFmpeg's virtual file system
    ffmpeg.FS("writeFile", "video.mp4", fs.readFileSync(videoPath)); // Read the video file as a Buffer and write to FFmpeg FS
    ffmpeg.FS("writeFile", "audio.wav", fs.readFileSync(audioPath)); // Read the audio file as a Buffer and write to FFmpeg FS

    // Step 6: Run FFmpeg to merge the video and audio
    // await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.wav', '-c:v', 'copy', '-shortest', 'output.mp4');
    await ffmpeg.run(
      "-i",
      "video.mp4",
      "-i",
      "audio.wav",
      "-map",
      "0:v:0", // Select video from first input
      "-map",
      "1:a:0", // Select audio from second input
      "-c:v",
      "copy", // Copy video codec
      "-c:a",
      "aac", // Convert audio to MP4-compatible format
      "-shortest", // Use shortest duration
      "-y", // Overwrite output
      "output.mp4"
    );
    // Step 7: Read the output video file
    let data = await ffmpeg.FS("readFile", "output.mp4");

    // Step 8: Convert the output data to a Uint8Array
    const outputBuffer = new Uint8Array(data.buffer);

    // Step 9: Write the merged video to disk
    fs.writeFileSync(outputPath, outputBuffer);

    console.log("✅ Video and audio merged successfully.");

    return new Response(JSON.stringify({ outputPath: "final_video.mp4" }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error merging video and audio:", error);
    return new Response("Error merging video and audio", { status: 500 });
  }
}

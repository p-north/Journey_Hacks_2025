import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { supabase } from "@/lib/supabase";
import util from "util";


// convert exec into async
const execPromise = util.promisify(exec);

export async function POST(req) {
    try {
        const { audioUrl } = await req.json();
        if (!audioUrl) {
            return new Response("Missing audio file", { status: 400 });
        }

        // Upload the audio file to Supabase
        const audioPath = UploadAudioToSupabase(audioUrl);
        console.log("✅ Audio file saved:", audioPath);

        // Step 2: Get a list of default video files from Supabase bucket
        const randomVidUrl = getRandomDefaultVideo();
        console.log("Default video url: ", randomVidUrl)
        

        // Step 3: Define file paths
        const videoPath = randomVidUrl;

        const mergedPath = mergeAndUploadFinal(videoPath, audioPath);
    

        return new Promise((resolve) => {    
            console.log("✅ Video and audio merged successfully.");
            resolve(new Response(JSON.stringify({ outputPath: `${mergedPath}` }), { status: 200 }));
                
        });
    } catch (error) {
        console.error("❌ Error merging video and audio:", error);
        return new Response("Error merging video and audio", { status: 500 });
    }
}

//upload the audio to supabaseStorage
async function UploadAudioToSupabase(base64Audio) {
    try {
        // Step 1: Decode Base64 audio and save it as a .wav file
        const audioBuffer = Buffer.from(base64Audio.split(",")[1], "base64"); // Remove data URL prefix and decode Base64

        // Step 2: define the filename
        const filename = `speech_${Date.now()}.wav`;

        // Step 3: upload to Supabase storage
        const { data, error } = await supabase.storage.from("Speech").upload(filename, audioBuffer, {
            contentType: "audio/wav",
            cacheControl: "3600",
            upsert: false, // Prevent overwriting existing files
        });

        if(error){
            console.error("Error uploading audio to Supabase", error);
            return null;
        }


        // get the public url of audio
        const { data: publicUrl } = supabase.storage.from("Speech").getPublicUrl(filename);
        console.log("Audio uploaded sucessfully:", publicUrl.publicUrl);
        return publicUrl.publicUrl;
    
    } catch (error) {
        console.error("Error processing the audio: ", error);
        return null;
        
    }
}


// get a random video from Supabase bucket
async function getRandomDefaultVideo() {
    // Get list of video files from Supabase storage
    const { data, error} = await supabase.storage.from("DefaultVids").list();

    if(error){
        console.error("Error fetching video from Supabase", error);
        return null;
    }

    if(!data || data.length == 0){
        console.error("No videos found in bucket");
        return null;
    }

    // pick a random video from the list
    const randomVideo = data[Math.floor(Math.random()*data.length)].name;
    console.log("Selected default video", randomVideo);

    // get the public url for the random video
    const { data: publicUrl } = supabase.storage.from("DefaultVids").getPublicUrl(randomVideo);

    return publicUrl.publicUrl; 
}

// merge and upload the final video
async function mergeAndUploadFinal(videoPath, audioPath) {
    try {
        // Define a temporary file for merged video
        const tempDir = path.join(process.cwd(), "temp");
        if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir) // Ensure temp directory exists

        // add a unique filename
        const outputFileName = `final_video_${Date.now()}.mp4`;
        const outputPath = path.join(tempDir, outputFileName);

        // Run the FFMpeg command
        const command = `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -strict experimental -shortest "${outputPath}"`;
        await execPromise(command);
        console.log("FFmpeg merge complete!", outputPath);

        // Read merged file as buffer
        const videoBuffer = fs.readFileSync(outputPath);

        // Upload to Supabase
        const {data, error} = await supabase.storage.from("FinalVid").upload(outputFileName, videoBuffer, {
            contentType: "video/mp4",
            cacheControl: "3600",
            upsert: false, // Prevent overwriting existing
        });

        if (error) {
            console.error("Error uploading final video:", error);
            return null;
        }

        // get public url
        const { data:publicUrl } = supabase.storage.from("FinalVid").getPublicUrl(outputFileName);
        console.log("Final video uploaded: ", publicUrl.publicUrl);


        // Delete temp local file
        fs.unlinkSync(outputPath);
        console.log("Temp file deleted");
        return publicUrl.publicUrl;

    } catch (error) {
        console.error("❌ Error merging and uploading video:", err);
        return null;
        
    }
}


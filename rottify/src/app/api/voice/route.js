import { ElevenLabsClient } from "elevenlabs";

export async function POST(req) {
    try {
        const ELEVEN_LABS_KEY = process.env.ELEVEN_LABS_KEY;
        console.log(ELEVEN_LABS_KEY);
        const client = new ElevenLabsClient({
            apiKey: ELEVEN_LABS_KEY // Load API key securely
        });
        //  console.log(client.apiKey);
        const { text } = await req.json(); // Get text input from frontend
        // console.log("🔑 Using API Key:", client.apiKey.slice(0, 5) + "*****"); // Log only first 5 characters for debugging
        const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // Your ElevenLabs voice ID
        const modelId = "eleven_multilingual_v2";
        const outputFormat = "mp3_22050_32";
        
        // convert for TTS
        const responseStream = await client.textToSpeech.convert(voiceId, {
            output_format: outputFormat,
            text: text,
            model_id: modelId,
        });
         // Convert readable stream to a Buffer
         const audioBuffer = await streamToBuffer(responseStream);

         // Convert Buffer to Base64 so it can be sent as a playable audio file
         const audioBase64 = audioBuffer.toString("base64");
 
         return new Response(JSON.stringify({ audioUrl: `data:audio/mp3;base64,${audioBase64}` }), {
             status: 200,
             headers: { "Content-Type": "application/json" },
         });
    } catch (error) {
        console.error("🚨 Error generating speech:", error);
        return new Response(
            JSON.stringify({ error: "Error generating speech", details: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// Helper function to convert readable stream to buffer
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

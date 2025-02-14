import { ElevenLabsClient } from "elevenlabs";



export async function POST(req) {
    try {
        const client = new ElevenLabsClient({
            apiKey: "sk_7671f484eb1c943252ba07df5027c718c73d8f1a2b38993f" // Load API key securely
        });
        //  console.log(client.apiKey);
        const { text } = await req.json(); // Get text input from frontend
        // if (!client.apiKey) {
        //     console.error("🚨 Missing ElevenLabs API Key!");
        //     return new Response(JSON.stringify({ error: "Server misconfiguration: API key missing" }), {
        //         status: 500,
        //         headers: { "Content-Type": "application/json" },
        //     });
        // }

        // console.log("🔑 Using API Key:", client.apiKey.slice(0, 5) + "*****"); // Log only first 5 characters for debugging
        const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // Your ElevenLabs voice ID
        const modelId = "eleven_multilingual_v2";
        const outputFormat = "mp3_44100_128";

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

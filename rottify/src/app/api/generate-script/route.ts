import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { content } = body;
    console.log(content);
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "Convert this lecture content into a brain rot style TikTok script using internet slang and dramatic phrasing. Keep the script limited to 40 seconds of playback time. Do not include timestamps, headers, speaker labels, emojis, or any formatting or special characters. Provide the output as plain text.",
          },
          { role: "user", content },
        ],
      }),
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json({ script: data.choices[0].message.content });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "API call failed" }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { imageData, mediaType } = body;
  if (!imageData || !mediaType) {
    return Response.json({ error: "Missing imageData or mediaType" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are a professional fashion stylist and beauty expert with an eye for detail. Analyse this photo honestly and specifically. Return ONLY raw JSON — no markdown, no backticks, no explanation.

{
  "overall": <number 1-10>,
  "vibe": "<2-5 word aesthetic descriptor e.g. 'Effortless coastal luxe' or 'Dark romantic minimalism'>",
  "categories": [
    { "name": "Clothing", "score": <1-10>, "note": "<1-2 specific, honest sentences>" },
    { "name": "Colour Palette", "score": <1-10>, "note": "<1-2 specific sentences>" },
    { "name": "Makeup", "score": <1-10>, "note": "<observation, or 'Not clearly visible in this photo'>" },
    { "name": "Hair", "score": <1-10>, "note": "<observation, or 'Not clearly visible in this photo'>" },
    { "name": "Accessories", "score": <1-10>, "note": "<observation, or 'None visible'>" },
    { "name": "Silhouette", "score": <1-10>, "note": "<1-2 specific sentences>" },
    { "name": "Overall Styling", "score": <1-10>, "note": "<how everything comes together>" }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageData,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = message.content.map((b) => b.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return Response.json(parsed);
  } catch (err) {
    console.error("Anthropic error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

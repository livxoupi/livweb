import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: "API key not configured" }, { status: 500 });

  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid request body" }, { status: 400 }); }

  const { imageData, mediaType, roastMode = false, occasion = "Any" } = body;
  if (!imageData || !mediaType) return Response.json({ error: "Missing imageData or mediaType" }, { status: 400 });

  const client = new Anthropic({ apiKey });

  const occasionContext = occasion !== "Any" ? `The person is dressed for: ${occasion}. Judge appropriateness and execution for this specific context.` : "";

  const tone = roastMode
    ? `You are a savage but hilarious fashion critic — think brutally honest, witty, no filter. Roast the outfit mercilessly but keep it funny not mean. Use sharp, punchy language. Still give real scores.`
    : `You are a professional fashion stylist and beauty expert with an eye for detail. Be honest but constructive.`;

  const prompt = `${tone} Analyse this photo specifically. ${occasionContext}

Return ONLY raw JSON — no markdown, no backticks, no explanation.
Use decimal scores for precision (e.g. 7.4, 8.9, 6.2) — not whole numbers.

{
  "overall": <decimal 1.0-10.0>,
  "vibe": "<2-5 word aesthetic descriptor e.g. 'Effortless coastal luxe'>",
  "occasion": "${occasion}",
  "categories": [
    { "name": "Clothing", "score": <decimal 1.0-10.0>, "note": "<1-2 specific${roastMode ? ", savage" : ", honest"} sentences>" },
    { "name": "Colour Palette", "score": <decimal 1.0-10.0>, "note": "<1-2 specific sentences>" },
    { "name": "Heels & Shoes", "score": <decimal 1.0-10.0>, "note": "<observation about footwear, or 'Not clearly visible'>" },
    { "name": "Makeup", "score": <decimal 1.0-10.0>, "note": "<observation, or 'Not clearly visible'>" },
    { "name": "Hair", "score": <decimal 1.0-10.0>, "note": "<observation, or 'Not clearly visible'>" },
    { "name": "Accessories", "score": <decimal 1.0-10.0>, "note": "<observation, or 'None visible'>" },
    { "name": "Silhouette", "score": <decimal 1.0-10.0>, "note": "<1-2 specific sentences>" },
    { "name": "Overall Styling", "score": <decimal 1.0-10.0>, "note": "<how everything comes together>" }
  ],
  "tips": [
    "<specific actionable style tip 1>",
    "<specific actionable style tip 2>",
    "<specific actionable style tip 3>"
  ]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageData } },
          { type: "text", text: prompt }
        ]
      }]
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

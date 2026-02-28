import { kv } from "@vercel/kv";

function getWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `leaderboard:week_${now.getFullYear()}_${week}`;
}

// GET — fetch top 3 for current week
export async function GET() {
  try {
    const weekKey = getWeekKey();
    // Get all entry IDs sorted by score (we store as a sorted set)
    const entries = await kv.zrange(weekKey, 0, 2, { rev: true, withScores: true });

    const results = [];
    for (let i = 0; i < entries.length; i += 2) {
      const id = entries[i];
      const score = entries[i + 1];
      const data = await kv.hgetall(id);
      if (data) results.push({ ...data, score: parseFloat(score) });
    }

    return Response.json({ entries: results });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST — submit a new entry
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, score, vibe, occasion, showPhoto, src } = body;

    if (!score || !vibe) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const weekKey = getWeekKey();
    const entryId = `entry:${weekKey}:${Date.now()}`;

    // Store entry data as a hash
    await kv.hset(entryId, {
      id: entryId,
      name: name || "Anonymous",
      score: score.toString(),
      vibe,
      occasion: occasion || "Any",
      showPhoto: showPhoto ? "1" : "0",
      src: showPhoto && src ? src : "",
      ts: Date.now().toString(),
    });

    // Add to sorted set for this week (scored by rating)
    await kv.zadd(weekKey, { score, member: entryId });

    // Expire after 8 days so old weeks clean themselves up
    await kv.expire(weekKey, 60 * 60 * 24 * 8);
    await kv.expire(entryId, 60 * 60 * 24 * 8);

    // Keep only top 10 in the sorted set
    await kv.zremrangebyrank(weekKey, 0, -11);

    return Response.json({ success: true, id: entryId });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

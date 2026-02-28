function getWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `leaderboard:week_${now.getFullYear()}_${week}`;
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command) {
  const res = await fetch(UPSTASH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  return data.result;
}

// GET — fetch top 3 for current week
export async function GET() {
  try {
    const weekKey = getWeekKey();

    // Get top 3 entry IDs by score descending
    const ids = await redis(["ZRANGE", weekKey, "+inf", "-inf", "BYSCORE", "REV", "LIMIT", "0", "3"]);

    if (!ids || ids.length === 0) {
      return Response.json({ entries: [] });
    }

    const entries = await Promise.all(
      ids.map(async (id) => {
        const data = await redis(["HGETALL", id]);
        if (!data || data.length === 0) return null;
        const obj = {};
        for (let i = 0; i < data.length; i += 2) {
          obj[data[i]] = data[i + 1];
        }
        return obj;
      })
    );

    return Response.json({ entries: entries.filter(Boolean) });
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
    const ttl = 60 * 60 * 24 * 8;

    await redis([
      "HSET", entryId,
      "id", entryId,
      "name", name || "Anonymous",
      "score", score.toString(),
      "vibe", vibe,
      "occasion", occasion || "Any",
      "showPhoto", showPhoto ? "1" : "0",
      "src", showPhoto && src ? src : "",
      "ts", Date.now().toString(),
    ]);

    await redis(["EXPIRE", entryId, ttl]);
    await redis(["ZADD", weekKey, score, entryId]);
    await redis(["EXPIRE", weekKey, ttl]);
    await redis(["ZREMRANGEBYRANK", weekKey, 0, -11]);

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

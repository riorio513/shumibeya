const crypto = require("crypto");
const tools = require("./_data/tools.json");

const SECRET = process.env.EMBED_SECRET || "dev-only-secret-change-me";
const TTL_SECONDS = 5 * 60;

function sign(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

exports.handler = async (event) => {
  const slug = (event.queryStringParameters || {}).slug;
  const tool = slug && tools[slug];

  const headers = {
    "Content-Type": "application/json",
    "X-Robots-Tag": "noai, noimageai, noindex",
    "Cache-Control": "no-store",
  };

  if (!tool) {
    return { statusCode: 404, headers, body: JSON.stringify({ error: "tool not found" }) };
  }

  const expires = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `${slug}.${expires}`;
  const signature = sign(payload);
  const token = Buffer.from(`${payload}.${signature}`).toString("base64url");

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      url: `/.netlify/functions/embed-redirect?token=${token}`,
      expiresIn: TTL_SECONDS,
    }),
  };
};

const crypto = require("crypto");
const tools = require("./_data/tools.json");

const SECRET = process.env.EMBED_SECRET || "dev-only-secret-change-me";

function sign(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

exports.handler = async (event) => {
  const headers = {
    "X-Robots-Tag": "noai, noimageai, noindex",
    "Cache-Control": "no-store",
  };

  const token = (event.queryStringParameters || {}).token;
  if (!token) {
    return { statusCode: 400, headers, body: "missing token" };
  }

  let decoded;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return { statusCode: 400, headers, body: "invalid token" };
  }

  const parts = decoded.split(".");
  if (parts.length !== 3) {
    return { statusCode: 400, headers, body: "invalid token" };
  }
  const [slug, expiresStr, signature] = parts;
  const payload = `${slug}.${expiresStr}`;
  const expected = sign(payload);

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  const validSignature =
    sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);

  if (!validSignature) {
    return { statusCode: 403, headers, body: "invalid signature" };
  }

  const expires = Number(expiresStr);
  if (!expires || Date.now() / 1000 > expires) {
    return { statusCode: 410, headers, body: "token expired" };
  }

  const tool = tools[slug];
  if (!tool) {
    return { statusCode: 404, headers, body: "tool not found" };
  }

  return {
    statusCode: 302,
    headers: { ...headers, Location: tool.embedUrl },
    body: "",
  };
};

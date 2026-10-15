export const config = {
  api: {
    bodyParser: false,
  },
};

const SKIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
]);

const SKIP_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "transfer-encoding",
  "content-length",
  "connection",
]);

function targetUrl(req) {
  const base = String(process.env.API_BASE_URL || "").replace(/\/$/, "");
  const incoming = new URL(req.url || "/", "https://admin.local");
  return `${base}${incoming.pathname}${incoming.search}`;
}

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (!process.env.API_BASE_URL) {
    res.status(500).json({ message: "API is not configured." });
    return;
  }

  const headers = {};
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (!value || SKIP_REQUEST_HEADERS.has(key.toLowerCase())) continue;
    headers[key] = Array.isArray(value) ? value.join(",") : value;
  }
  if (process.env.ADMIN_TOKEN) {
    headers["x-admin-token"] = process.env.ADMIN_TOKEN;
  }

  try {
    const response = await fetch(targetUrl(req), {
      method: req.method,
      headers,
      body: await readBody(req),
    });
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (SKIP_RESPONSE_HEADERS.has(key.toLowerCase())) return;
      res.setHeader(key, value);
    });
    const payload = Buffer.from(await response.arrayBuffer());
    res.send(payload);
  } catch (error) {
    console.error(error);
    res.status(502).json({ message: "The API could not be reached." });
  }
}

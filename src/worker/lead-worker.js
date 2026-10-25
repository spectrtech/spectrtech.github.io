// SpectrTech — lead form receiver (Cloudflare Worker). Optional: until it is deployed,
// the contact form falls back to opening the visitor's email app (mailto).
//
// Deploy:
//   cd src/worker && npx wrangler deploy
//   npx wrangler secret put TELEGRAM_BOT_TOKEN   (bot from @BotFather)
//   npx wrangler secret put TELEGRAM_CHAT_ID     (owner's chat id)
// Then put the Worker URL into src/config.json → "leadEndpoint", run `node src/build.mjs`, commit.
// No secrets are stored in this file or in the repository.

const ALLOWED = ["https://spectrtech.si", "https://www.spectrtech.si", "http://127.0.0.1:8899"];
const LIMIT = { name: 120, email: 160, company: 160, country: 80, link: 300, interest: 120, message: 4000, page: 300, lang: 8 };

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const h = cors(origin);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (req.method !== "POST" || !ALLOWED.includes(origin)) return new Response("Forbidden", { status: 403, headers: h });
    if (Number(req.headers.get("Content-Length") || 0) > 20000) return new Response("Too large", { status: 413, headers: h });

    let d;
    try { d = await req.json(); } catch { return new Response("Bad JSON", { status: 400, headers: h }); }
    if (d.website) return new Response("OK", { status: 200, headers: h }); // honeypot
    const v = {};
    for (const [k, max] of Object.entries(LIMIT)) v[k] = String(d[k] ?? "").trim().slice(0, max);
    if (!v.name || !v.message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) || d.consent !== "yes")
      return new Response("Invalid", { status: 422, headers: h });

    const text = [
      "🆕 SpectrTech.si — new request",
      `Name: ${v.name}`, `Email: ${v.email}`, `Company: ${v.company || "-"}`, `Country: ${v.country || "-"}`,
      `Link: ${v.link || "-"}`, `Interest: ${v.interest || "-"}`, `Lang: ${v.lang}`, "", v.message, "", v.page,
    ].join("\n");

    const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
    });
    return new Response(r.ok ? "OK" : "Upstream error", { status: r.ok ? 200 : 502, headers: h });
  },
};

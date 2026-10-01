// Cloudflare Worker — FREE (Workers AI free tier), কোনো API key লাগে না।
// Setup: Workers & Pages > Create Worker > এই কোড paste > Settings > Bindings > Workers AI (নাম: AI) > Deploy
// তারপর worker-এর লিংকটা HTML-এর CHAT_API_URL-এ বসাও। নিচে ALLOW-তে নিজের সাইটের ডোমেইন দাও।
const ALLOW = ["https://your-site.com"]; // টেস্টের জন্য ["*"]
export default {
  async fetch(req, env) {
    const o = req.headers.get("Origin") || "";
    const ok = ALLOW.includes("*") || ALLOW.includes(o);
    const cors = { "Access-Control-Allow-Origin": ok ? (o || "*") : "null", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST" || !ok) return new Response("forbidden", { status: 403, headers: cors });
    try {
      const { messages = [], system = "" } = await req.json();
      const msgs = [{ role: "system", content: String(system).slice(0, 6000) }]
        .concat(messages.slice(-10).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: String(m.content).slice(0, 1500) })));
      const r = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { messages: msgs, max_tokens: 600 });
      return new Response(JSON.stringify({ text: r.response || "" }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) { return new Response(JSON.stringify({ error: "upstream" }), { status: 502, headers: cors }); }
  }
};

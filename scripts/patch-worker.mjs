import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(__dirname, "../dist/server/index.js");

const original = readFileSync(indexPath, "utf-8");

const apiHandler = `
const __AGENT_PROMPTS = {
  scanner: \`You are the SCANNER NODE (SYS-SCAN v2.04) of Guardian OS.
Extract topic, intent, key signals, and initial risks from the input.
Format: TOPIC, INTENT, KEY SIGNALS, INITIAL RISKS. 2-3 sentences per section.\`,
  analyst: \`You are the ANALYST NODE (LOGIC-CORE v4.11) of Guardian OS.
Separate facts from assumptions, identify data gaps, reveal opportunities.
Format: CONFIRMED FACTS, ASSUMPTIONS, CRITICAL GAPS, OPPORTUNITIES. 2-3 sentences per section.\`,
  decision: \`You are the DECISION NODE (DECIDE-MATRIX v3.80) of Guardian OS.
Evaluate options, weigh trade-offs, recommend the optimal path.
Format: OPTION A, OPTION B, RECOMMENDATION. 2-3 sentences per section.\`,
  strategy: \`You are the STRATEGY NODE (EXEC-ENGINE v1.95) of Guardian OS.
Translate the decision into a concrete execution plan.
Format: numbered ACTION STEPS (5-7), KEY DEPENDENCIES, REQUIRED RESOURCES.\`,
  risk: \`You are the RISK NODE (RISK-SHIELD v5.00) of Guardian OS.
Assess systemic danger, assign threat score 0-100, flag warnings.
Format: RISK SCORE: X/100, THREAT VECTORS, CRITICAL WARNINGS, VERDICT.\`,
};

async function __handleRunAgent(request, env) {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  try {
    const { agent, input, prior } = await request.json();
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set" }), { status: 500, headers });
    const priorContext = Object.keys(prior ?? {}).length > 0
      ? "\\n\\nPRIOR AGENT OUTPUTS:\\n" + Object.entries(prior).map(([k, v]) => "[" + k.toUpperCase() + "]:\\n" + v).join("\\n\\n")
      : "";
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: __AGENT_PROMPTS[agent] ?? "You are a Guardian OS agent." }] },
          contents: [{ role: "user", parts: [{ text: "INPUT:\\n" + input + priorContext }] }],
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );
    if (!res.ok) { const e = await res.text(); return new Response(JSON.stringify({ error: "Gemini error: " + e }), { status: 500, headers }); }
    const json = await res.json();
    const result = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return new Response(JSON.stringify({ result }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message ?? "Agent failed" }), { status: 500, headers });
  }
}
`;

// Replace the default export with a wrapped version
const patched = original
  .replace(
    /export\s*\{[^}]*\b(\w+)\s+as\s+default[^}]*\};?\s*$/m,
    (match, exportName) => `
${apiHandler}
const __tanstackDefault = ${exportName};
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/run-agent" && request.method === "POST") {
      return __handleRunAgent(request, env);
    }
    if (url.pathname === "/api/run-agent" && request.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } });
    }
    if (__tanstackDefault && __tanstackDefault.fetch) {
      return __tanstackDefault.fetch(request, env, ctx);
    }
    return new Response("Not found", { status: 404 });
  }
};
`
  );

if (patched === original) {
  console.error("❌ patch-worker: could not find export pattern in dist/server/index.js");
  process.exit(1);
}

writeFileSync(indexPath, patched);
console.log("✅ patch-worker: dist/server/index.js patched with /api/run-agent handler");

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distServer = resolve(__dirname, "../dist/server");
const distClient = resolve(__dirname, "../dist/client");

// Find client assets
const clientAssets = readdirSync(resolve(distClient, "assets"));
const cssFile = clientAssets.find((f) => f.endsWith(".css"));
const manifestFile = readdirSync(resolve(distServer, "assets")).find((f) =>
  f.startsWith("_tanstack-start-manifest")
);

if (!cssFile) { console.error("❌ patch-worker: no CSS file found in dist/client/assets/"); process.exit(1); }
if (!manifestFile) { console.error("❌ patch-worker: no manifest file found in dist/server/assets/"); process.exit(1); }

// Read client entry from manifest
const manifestSrc = readFileSync(resolve(distServer, "assets", manifestFile), "utf-8");
const entryMatch = manifestSrc.match(/"?clientEntry"?\s*:\s*"([^"]+)"/);
if (!entryMatch) { console.error("❌ patch-worker: could not find clientEntry in manifest"); process.exit(1); }
const clientEntry = entryMatch[1]; // e.g. "/assets/index-Cn97Ez5_.js"
const cssHref = `/assets/${cssFile}`;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Guardian OS</title>
  <link rel="stylesheet" href="${cssHref}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="${clientEntry}"></script>
</body>
</html>`;

const worker = `
const __AGENT_PROMPTS = {
  scanner: \`You are the SCANNER NODE (SYS-SCAN v2.04) of Guardian OS.
Extract topic, intent, key signals, and initial risks from the input.
Format: TOPIC, INTENT, KEY SIGNALS, INITIAL RISKS. 2-3 sentences per section.\`,
  analyst: \`You are the ANALYST NODE (LOGIC-CORE v4.11) of Guardian OS.
Separate facts from assumptions, identify data gaps, reveal opportunities.
Format: CONFIRMED FACTS, ASSUMPTIONS, CRITICAL GAPS, OPPORTUNITIES. 2-3 sentences per section.\`,
  decision: \`You are the DECISION NODE (DECIDE-MATRIX v3.80) of Guardian OS.
Evaluate options, weigh trade-offs, recommend the optimal path.
Format: OPTION A, OPTION B, OPTION C (if relevant), RECOMMENDATION. 2-3 sentences per section.\`,
  strategy: \`You are the STRATEGY NODE (EXEC-ENGINE v1.95) of Guardian OS.
Translate the decision into a concrete execution plan.
Format: numbered ACTION STEPS (5-7), KEY DEPENDENCIES, REQUIRED RESOURCES.\`,
  risk: \`You are the RISK NODE (RISK-SHIELD v5.00) of Guardian OS.
Assess systemic danger, assign threat score 0-100, flag warnings.
Format: RISK SCORE: X/100, THREAT VECTORS, CRITICAL WARNINGS, VERDICT.\`,
};

const HTML = ${JSON.stringify(HTML)};

async function handleRunAgent(request, env) {
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/run-agent" && request.method === "POST") {
      return handleRunAgent(request, env);
    }
    if (url.pathname === "/api/run-agent" && request.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } });
    }
    return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
};
`.trimStart();

writeFileSync(resolve(distServer, "index.js"), worker);
console.log("✅ patch-worker: dist/server/index.js replaced with minimal self-contained worker");
console.log("   Client entry: " + clientEntry);
console.log("   CSS:          " + cssHref);

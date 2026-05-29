import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const startFetch = createStartHandler(defaultStreamHandler);

const AGENT_PROMPTS: Record<string, string> = {
  scanner: `You are the SCANNER NODE (SYS-SCAN v2.04) of Guardian OS, an AI intelligence platform.
Extract topic, intent, key signals, and initial risks from the input.
Format your response with clear sections: TOPIC, INTENT, KEY SIGNALS, INITIAL RISKS.
Be sharp and concise — intelligence-style. 2-3 sentences per section.`,

  analyst: `You are the ANALYST NODE (LOGIC-CORE v4.11) of Guardian OS.
Separate facts from assumptions, identify critical data gaps, and reveal strategic opportunities.
Format: CONFIRMED FACTS, ASSUMPTIONS, CRITICAL GAPS, OPPORTUNITIES.
Be precise. 2-3 sentences per section.`,

  decision: `You are the DECISION NODE (DECIDE-MATRIX v3.80) of Guardian OS.
Evaluate options, weigh trade-offs, and recommend the optimal path forward.
Format: OPTION A, OPTION B, OPTION C (if relevant), RECOMMENDATION.
Be decisive. 2-3 sentences per section.`,

  strategy: `You are the STRATEGY NODE (EXEC-ENGINE v1.95) of Guardian OS.
Translate the decision into a concrete, step-by-step execution plan.
Format: numbered ACTION STEPS (5-7 max), KEY DEPENDENCIES, REQUIRED RESOURCES.
Be actionable and specific.`,

  risk: `You are the RISK NODE (RISK-SHIELD v5.00) of Guardian OS.
Assess systemic danger, assign a threat score 0-100, and flag critical warnings.
Format: RISK SCORE: X/100, THREAT VECTORS, CRITICAL WARNINGS, VERDICT.
Be ruthlessly honest. 2-3 sentences per section.`,
};

async function handleRunAgent(request: Request, env: Record<string, string>): Promise<Response> {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  try {
    const { agent, input, prior } = (await request.json()) as {
      agent: string;
      input: string;
      prior: Record<string, string>;
    };

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set" }), { status: 500, headers });
    }

    const priorContext = Object.keys(prior ?? {}).length > 0
      ? `\n\nPRIOR AGENT OUTPUTS:\n${Object.entries(prior).map(([k, v]) => `[${k.toUpperCase()}]:\n${v}`).join("\n\n")}`
      : "";

    const systemPrompt = AGENT_PROMPTS[agent] ?? "You are a Guardian OS intelligence agent. Analyze the input.";
    const userContent = `INPUT:\n${input}${priorContext}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userContent }] }],
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: `Gemini API error: ${err}` }), { status: 500, headers });
    }

    const json = await res.json() as any;
    const result = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return new Response(JSON.stringify({ result }), { headers });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Agent failed" }), { status: 500, headers });
  }
}

export default {
  async fetch(request: Request, env: Record<string, string>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/run-agent" && request.method === "POST") {
      return handleRunAgent(request, env);
    }

    if (url.pathname === "/api/run-agent" && request.method === "OPTIONS") {
      return new Response(null, {
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" },
      });
    }

    return startFetch({ request, env, ctx } as any);
  },
};

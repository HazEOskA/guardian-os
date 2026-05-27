/* eslint-disable @typescript-eslint/no-explicit-any */
// AI Agent runner - calls the configured AI gateway for a single agent step
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type AgentId = "scanner" | "analyst" | "decision" | "strategy" | "risk";

const AGENTS: Record<AgentId, { system: string; schema: any }> = {
  scanner: {
    system:
      "You are the Scanner Agent. Extract key information from the user input. Identify topic, intent, signals (notable patterns/keywords), and risks. Be concise and structured.",
    schema: {
      type: "object",
      properties: {
        topic: { type: "string" },
        intent: { type: "string" },
        signals: { type: "array", items: { type: "string" } },
        risks: { type: "array", items: { type: "string" } },
        summary: { type: "string" },
      },
      required: ["topic", "intent", "signals", "risks", "summary"],
      additionalProperties: false,
    },
  },
  analyst: {
    system:
      "You are the Analyst Agent. Break the input down into facts, assumptions, risks, opportunities, and missing data. Be sharp and objective.",
    schema: {
      type: "object",
      properties: {
        facts: { type: "array", items: { type: "string" } },
        assumptions: { type: "array", items: { type: "string" } },
        risks: { type: "array", items: { type: "string" } },
        opportunities: { type: "array", items: { type: "string" } },
        missing_data: { type: "array", items: { type: "string" } },
      },
      required: ["facts", "assumptions", "risks", "opportunities", "missing_data"],
      additionalProperties: false,
    },
  },
  decision: {
    system:
      "You are the Decision Agent. Compare options/interpretations, rank possible outcomes, and ALWAYS produce a final recommendation.",
    schema: {
      type: "object",
      properties: {
        options: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              pros: { type: "array", items: { type: "string" } },
              cons: { type: "array", items: { type: "string" } },
              score: { type: "number" },
            },
            required: ["name", "pros", "cons", "score"],
            additionalProperties: false,
          },
        },
        recommendation: { type: "string" },
        rationale: { type: "string" },
      },
      required: ["options", "recommendation", "rationale"],
      additionalProperties: false,
    },
  },
  strategy: {
    system:
      "You are the Strategy Agent. Convert prior analysis into an actionable, step-by-step execution plan. Include tools needed and risks per step.",
    schema: {
      type: "object",
      properties: {
        objective: { type: "string" },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              step: { type: "string" },
              tools: { type: "array", items: { type: "string" } },
              risks: { type: "array", items: { type: "string" } },
            },
            required: ["step", "tools", "risks"],
            additionalProperties: false,
          },
        },
        success_metrics: { type: "array", items: { type: "string" } },
      },
      required: ["objective", "steps", "success_metrics"],
      additionalProperties: false,
    },
  },
  risk: {
    system:
      "You are the Risk Agent. Detect scams, weak logic, manipulation, or high-risk patterns. Output a risk_score from 0-100 (higher = more risky), red_flags, and a verdict.",
    schema: {
      type: "object",
      properties: {
        risk_score: { type: "number" },
        red_flags: { type: "array", items: { type: "string" } },
        verdict: { type: "string", enum: ["safe", "caution", "high_risk"] },
        notes: { type: "string" },
      },
      required: ["risk_score", "red_flags", "verdict", "notes"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { agent, input, prior } = await req.json();
    const cfg = AGENTS[agent as AgentId];
    if (!cfg) {
      return new Response(JSON.stringify({ error: "Unknown agent" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userContent = `USER INPUT:\n${input}\n\n${
      prior ? `PRIOR AGENT OUTPUTS (JSON):\n${JSON.stringify(prior, null, 2)}` : ""
    }`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: cfg.system },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: `emit_${agent}`,
              description: `Emit structured output for the ${agent} agent`,
              parameters: cfg.schema,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: `emit_${agent}` } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      if (resp.status === 429)
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      if (resp.status === 402)
        return new Response(
          JSON.stringify({
            error: "AI credits exhausted. Add credits in Settings → Workspace → Usage.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = toolCall?.function?.arguments ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(argsStr);
    } catch {
      parsed = { raw: argsStr };
    }

    return new Response(JSON.stringify({ agent, result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("run-agent error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

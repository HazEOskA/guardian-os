/* eslint-disable @typescript-eslint/no-explicit-any */
export type AgentId = "scanner" | "analyst" | "decision" | "strategy" | "risk";

export const AGENT_ORDER: AgentId[] = ["scanner", "analyst", "decision", "strategy", "risk"];

export const AGENT_META: Record<
  AgentId,
  {
    name: string;
    tagline: string;
    icon: string;
    color: string;
    system: string;
    description: string;
  }
> = {
  scanner: {
    name: "Scanner",
    tagline: "Extract topic, intent, signals & risks",
    icon: "Radar",
    color: "scanner",
    system: "SYS-SCAN v2.04",
    description:
      "Ingests input seed, extracts signals, determines intent, and performs initial semantic threat screening.",
  },
  analyst: {
    name: "Analyst",
    tagline: "Facts, assumptions, gaps & opportunities",
    icon: "Fingerprint",
    color: "analyst",
    system: "LOGIC-CORE v4.11",
    description:
      "Segregates facts from assumptions, identifies critical data gaps, and reveals latent strategic opportunities.",
  },
  decision: {
    name: "Decision",
    tagline: "Compare options & recommend",
    icon: "GitBranch",
    color: "decision",
    system: "DECIDE-MATRIX v3.80",
    description:
      "Simulates multiple courses of action, weights pros/cons, and recommends the optimal pathway.",
  },
  strategy: {
    name: "Strategy",
    tagline: "Step-by-step actionable plan",
    icon: "Target",
    color: "strategy",
    system: "EXEC-ENGINE v1.95",
    description:
      "Translates logical decisions into step-by-step tactical roadmaps, highlighting dependencies and toolkits.",
  },
  risk: {
    name: "Risk",
    tagline: "Detect scams & risk score 0–100",
    icon: "ShieldAlert",
    color: "risk",
    system: "RISK-SHIELD v5.00",
    description:
      "Evaluates systemic danger, computes threat quotients (0-100), and flags critical warnings and anomalies.",
  },
};

export const TAGS = ["general", "crypto", "business", "coding"] as const;
export type Tag = (typeof TAGS)[number];

export type AgentResult = {
  agent: AgentId;
  status: "pending" | "running" | "done" | "error";
  result?: any;
  error?: string;
  durationMs?: number;
};

export type Run = {
  id: string;
  createdAt: number;
  input: string;
  tag: Tag;
  agents: AgentId[];
  results: AgentResult[];
};

const KEY = "guardian-os.runs";

export function loadRuns(): Run[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRuns(runs: Run[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(runs.slice(0, 50)));
}

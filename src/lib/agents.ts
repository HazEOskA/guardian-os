export type AgentId = "scanner" | "analyst" | "decision" | "strategy" | "risk";

export const AGENT_ORDER: AgentId[] = ["scanner", "analyst", "decision", "strategy", "risk"];

export const AGENT_META: Record<AgentId, { name: string; tagline: string; icon: string }> = {
  scanner: { name: "Scanner", tagline: "Extract topic, intent, signals & risks", icon: "Radar" },
  analyst: { name: "Analyst", tagline: "Facts, assumptions, gaps & opportunities", icon: "Microscope" },
  decision: { name: "Decision", tagline: "Compare options & recommend", icon: "GitBranch" },
  strategy: { name: "Strategy", tagline: "Step-by-step actionable plan", icon: "Target" },
  risk: { name: "Risk", tagline: "Detect scams & risk score 0–100", icon: "ShieldAlert" },
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

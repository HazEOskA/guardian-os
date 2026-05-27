import * as React from "react";
import { CheckCircle2, Loader2, Plus } from "lucide-react";

import type { AgentId } from "@/lib/agents";
import { AGENT_ORDER } from "@/lib/agents";
import { GuardianOsAgentChip } from "@/components/guardian-os/GuardianOsAgentChip";
import { cn } from "@/lib/utils";

const ACTIVE_WORKSPACE_ROWS = [
  { title: "Q2 Market Entry Strategy", status: "In Progress" as const, pct: 62 },
  { title: "Supply Chain Risk Review", status: "Complete" as const, pct: 100 },
  { title: "Investment Opportunity Scan", status: "Complete" as const, pct: 100 },
  { title: "Product Launch Strategy", status: "Complete" as const, pct: 100 },
];

export function GuardianOsWorkspace({
  enabled,
  input,
  setInput,
  running,
  onPrimaryAction,
  onToggleAgent,
}: {
  enabled: Record<AgentId, boolean>;
  input: string;
  setInput: (value: string) => void;
  running: boolean;
  onPrimaryAction: () => void;
  onToggleAgent?: (agent: AgentId) => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-5 pb-6 pt-1">
      <div className="mt-2">
        <div className="text-[12px] font-mono text-[#aeb4c7]">Good morning, Commander.</div>
        <div className="mt-2 text-[10px] font-mono text-[#aeb4c7] leading-relaxed">
          What shall we analyze today?
        </div>
      </div>

      {/* Console input */}
      <div className="mt-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your objective, or use a preset prompt..."
              className="flex-1 bg-transparent text-[12px] outline-none placeholder-[#6b7180] font-mono"
              disabled={running}
            />

            {/* Dropdown */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <span className="text-[10px] font-mono text-[#aeb4c7] uppercase tracking-wide">
                Smart Route
              </span>
            </div>

            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={running || !input.trim()}
              className={cn(
                "h-10 w-10 rounded-2xl border border-white/10 bg-[#090a0f]/50",
                "flex items-center justify-center hover:bg-white/5 transition-colors",
              )}
              aria-label="Submit"
            >
              {running ? (
                <Loader2 className="h-4 w-4 text-white/80 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 text-white/80" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active workspace */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#aeb4c7] uppercase tracking-wider">
            Active Workspace
          </div>
          <button
            type="button"
            className="h-9 w-9 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 transition-colors flex items-center justify-center"
            aria-label="Add workspace"
          >
            <Plus className="h-4 w-4 text-[#aeb4c7]" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {ACTIVE_WORKSPACE_ROWS.map((row, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.22)] backdrop-blur-sm p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-mono font-bold text-white truncate">
                    {row.title}
                  </div>
                  <div className="mt-1 text-[9px] font-mono text-[#aeb4c7] uppercase tracking-wider">
                    {row.status}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {row.status === "In Progress" ? (
                    <Loader2 className="h-4 w-4 text-scanner animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    row.status === "In Progress" ? "bg-scanner/70" : "bg-emerald-500/60",
                  )}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent chips row */}
      <div className="mt-5">
        <div className="text-[10px] font-mono text-[#aeb4c7] uppercase tracking-wider mb-3">
          Routes
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 mobile-scrollbar">
          {AGENT_ORDER.map((agent) => (
            <GuardianOsAgentChip
              key={agent}
              agent={agent}
              enabled={enabled[agent]}
              onClick={() => onToggleAgent?.(agent)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

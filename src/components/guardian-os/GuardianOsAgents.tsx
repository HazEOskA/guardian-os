import * as React from "react";
import { ChevronRight, Plus } from "lucide-react";

import type { AgentId } from "@/lib/agents";
import { AGENT_ORDER } from "@/lib/agents";
import { GuardianOsAgentMiniCard } from "@/components/guardian-os/GuardianOsAgentMiniCard";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "analysis" | "strategy" | "risk" | "ops";

const FILTER_TABS: Array<{ id: FilterTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "analysis", label: "Analysis" },
  { id: "strategy", label: "Strategy" },
  { id: "risk", label: "Risk" },
  { id: "ops", label: "Ops" },
];

const FILTER_MAP: Record<FilterTab, AgentId[]> = {
  all: ["scanner", "analyst", "decision", "strategy", "risk"],
  analysis: ["scanner", "analyst"],
  strategy: ["strategy", "decision"],
  risk: ["risk"],
  ops: ["decision", "strategy", "risk"],
};

export function GuardianOsAgents({ enabled }: { enabled: Record<AgentId, boolean> }) {
  const [activeFilter, setActiveFilter] = React.useState<FilterTab>("all");
  const visibleAgents = FILTER_MAP[activeFilter] ?? AGENT_ORDER;

  return (
    <div className="flex-1 overflow-y-auto mobile-scrollbar pb-6">
      <div className="px-5 pt-2">
        <h1 className="text-[14px] font-bold text-white tracking-wide">Guardian Agents</h1>
        <p className="mt-1 text-[10px] text-[#aeb4c7] font-mono leading-relaxed">
          Specialized AI. Aligned to your mission.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mt-4 px-5">
        <div className="flex gap-2 overflow-x-auto pb-1 mobile-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "shrink-0 rounded-2xl border px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all",
                activeFilter === tab.id
                  ? "bg-scanner/15 border-scanner/40 text-scanner"
                  : "bg-black/20 border-white/10 text-[#525666] hover:text-[#aeb4c7] hover:border-white/20",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agent cards */}
      <div className="mt-4 px-5 space-y-2">
        {visibleAgents.map((agent) => (
          <div key={agent} className="relative">
            <GuardianOsAgentMiniCard agent={agent} enabled={enabled[agent]} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="h-4 w-4 text-[#525666]" />
            </div>
          </div>
        ))}
      </div>

      {/* Custom workflows */}
      <div className="mt-4 px-5">
        <div className="rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.25)] backdrop-blur-md p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                Custom Agent Workflows
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#aeb4c7] leading-relaxed">
                Combine agents and build repeatable workflows tailored to your mission.
              </div>
            </div>
            <button
              type="button"
              className="h-10 w-10 rounded-2xl border border-white/10 bg-black/30 hover:bg-white/5 transition-colors flex items-center justify-center shrink-0"
              aria-label="Add workflow"
            >
              <Plus className="h-4 w-4 text-[#aeb4c7]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

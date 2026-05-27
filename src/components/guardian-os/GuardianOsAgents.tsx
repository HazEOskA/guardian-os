import * as React from "react";
import { Plus } from "lucide-react";

import type { AgentId } from "@/lib/agents";
import { AGENT_ORDER } from "@/lib/agents";
import { GuardianOsAgentMiniCard } from "@/components/guardian-os/GuardianOsAgentMiniCard";

export function GuardianOsAgents({
  enabled,
}: {
  enabled: Record<AgentId, boolean>;
}) {
  return (
    <div className="pt-3 pb-24">
      <div className="px-5 pt-2">
        <h1 className="text-[14px] font-bold text-white tracking-wide">
          Guardian Agents
        </h1>
        <p className="mt-1 text-[10px] text-[#aeb4c7] font-mono leading-relaxed">
          Specialized agents for high-impact analysis.
        </p>
      </div>

      <div className="mt-4 px-5 space-y-3">
        {AGENT_ORDER.map((agent) => (
          <GuardianOsAgentMiniCard key={agent} agent={agent} enabled={enabled[agent]} />
        ))}
      </div>

      {/* Custom workflows (visual only) */}
      <div className="mt-6 px-5">
        <div className="rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.25)] backdrop-blur-md p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                Custom Agent Workflows
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#aeb4c7] leading-relaxed">
                Combine agents and build repeatable workflows tailored to your goals.
              </div>
            </div>
            <button
              type="button"
              className="h-10 w-10 rounded-2xl border border-white/10 bg-black/30 hover:bg-white/5 transition-colors flex items-center justify-center"
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


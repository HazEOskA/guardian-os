import * as React from "react";
import { Fingerprint, GitBranch, Radar, ShieldAlert, Target, CheckCircle2 } from "lucide-react";

import type { AgentId } from "@/lib/agents";
import { AGENT_META } from "@/lib/agents";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Radar: Radar,
  Fingerprint: Fingerprint,
  GitBranch: GitBranch,
  Target: Target,
  ShieldAlert: ShieldAlert,
};

const COLOR_TEXT: Record<AgentId, string> = {
  scanner: "text-scanner",
  analyst: "text-analyst",
  decision: "text-decision",
  strategy: "text-strategy",
  risk: "text-risk",
};

export function GuardianOsAgentMiniCard({ agent, enabled }: { agent: AgentId; enabled: boolean }) {
  const meta = AGENT_META[agent];
  const Icon = ICON_MAP[meta.icon];

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.25)] backdrop-blur-md",
        "p-4 transition-all hover:bg-white/5",
        enabled ? "shadow-[0_0_28px_rgba(115,185,255,0.10)]" : "",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              "h-10 w-10 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center",
              enabled ? "shadow-[0_0_18px_rgba(115,185,255,0.10)]" : "",
            )}
          >
            {Icon ? (
              <Icon className={cn("h-5 w-5", enabled ? COLOR_TEXT[agent] : "text-neutral-600")} />
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "text-[12px] font-black uppercase tracking-wider font-mono truncate",
                  enabled ? COLOR_TEXT[agent] : "text-neutral-500",
                )}
              >
                {meta.name} Agent
              </div>
            </div>
            <div className="mt-1 text-[10px] font-mono text-[#525666] leading-relaxed line-clamp-2">
              {meta.description}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider border",
              enabled
                ? "text-black bg-[oklch(0.78_0.16_145)/0.95] border-white/10"
                : "text-neutral-500 bg-black/30 border-white/10",
            )}
          >
            {enabled ? "Active" : "Idle"}
          </span>
          {enabled ? <CheckCircle2 className={cn("h-4 w-4", COLOR_TEXT[agent])} /> : null}
        </div>
      </div>
    </div>
  );
}

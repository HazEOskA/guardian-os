import * as React from "react";
import { Radar, Fingerprint, GitBranch, Target, ShieldAlert, CheckCircle2 } from "lucide-react";

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

export function GuardianOsAgentChip({
  agent,
  enabled,
  className,
  onClick,
}: {
  agent: AgentId;
  enabled: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const meta = AGENT_META[agent];
  const Icon = ICON_MAP[meta.icon];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2",
        "rounded-2xl border px-3 py-2",
        "bg-black/25 backdrop-blur-sm",
        "transition-all hover:bg-white/5 active:scale-[0.99]",
        enabled
          ? "border-white/10 shadow-[0_0_18px_rgba(115,185,255,0.10)]"
          : "border-white/5 text-[#525666] opacity-90",
        className,
      )}
      aria-pressed={enabled}
    >
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-xl",
          enabled ? "bg-[#070910] border border-white/10" : "bg-black/30 border border-white/5",
        )}
      >
        {Icon ? (
          <Icon className={cn("h-4 w-4", enabled ? COLOR_TEXT[agent] : "text-neutral-600")} />
        ) : null}
      </span>

      <span className="min-w-0 text-left">
        <span
          className={cn(
            "block text-[11px] font-mono font-bold uppercase tracking-wider truncate",
            enabled ? COLOR_TEXT[agent] : "text-neutral-500",
          )}
        >
          {meta.name}
        </span>
        <span className="block text-[9px] font-mono text-[#525666] tracking-widest uppercase leading-tight">
          {enabled ? "Active" : "Idle"}
        </span>
      </span>

      {enabled ? (
        <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[oklch(0.78_0.16_145)]/90 flex items-center justify-center shadow-[0_0_18px_rgba(115,185,255,0.2)]">
          <CheckCircle2 className="h-3 w-3 text-black" />
        </span>
      ) : null}
    </button>
  );
}

import * as React from "react";
import { CheckCircle2, Clock, Trash2 } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { AgentId, Run } from "@/lib/agents";
import { cn } from "@/lib/utils";

const AGENT_COLORS: Record<AgentId, string> = {
  scanner: "bg-scanner/60",
  analyst: "bg-analyst/60",
  decision: "bg-decision/60",
  strategy: "bg-strategy/60",
  risk: "bg-risk/60",
};

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) {
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    return `${mins}m ago`;
  }
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function GuardianOsHistoryDrawer({
  open,
  onClose,
  history,
  onLoadRun,
  onClearHistory,
}: {
  open: boolean;
  onClose: () => void;
  history: Run[];
  onLoadRun: (run: Run) => void;
  onClearHistory: () => void;
}) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="bg-[#090a0f] border-t border-white/10 max-h-[82vh]">
        <DrawerHeader className="px-5 pt-2 pb-3">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-[12px] font-mono font-bold uppercase tracking-widest text-white">
              Run History
            </DrawerTitle>
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1 text-[9px] font-mono text-destructive/60 hover:text-destructive transition-colors uppercase tracking-wider"
              >
                <Trash2 className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto mobile-scrollbar px-5 pb-8 space-y-2">
          {history.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-[10px] font-mono text-[#525666] uppercase tracking-wider">
                No history yet
              </div>
            </div>
          ) : (
            history.map((run) => {
              const allDone = run.results.every((r) => r.status === "done");
              return (
                <button
                  key={run.id}
                  type="button"
                  onClick={() => {
                    onLoadRun(run);
                    onClose();
                  }}
                  className="w-full text-left rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-mono text-white leading-relaxed line-clamp-2">
                        {run.input}
                      </div>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-[8px] font-mono text-[#525666] uppercase tracking-wider border border-white/10 px-1.5 py-0.5 rounded-md">
                          {run.tag}
                        </span>
                        <span className="text-[8px] font-mono text-[#525666]">
                          {run.agents.length} agents
                        </span>
                        <span className="text-[#3e414c]">·</span>
                        <span className="text-[8px] font-mono text-[#525666]">
                          {relativeTime(run.createdAt)}
                        </span>
                      </div>
                    </div>
                    {allDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="h-4 w-4 text-[#525666] shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Agent colour bar */}
                  <div className="mt-3 flex gap-1">
                    {run.agents.map((agentId) => {
                      const res = run.results.find((r) => r.agent === agentId);
                      return (
                        <div
                          key={agentId}
                          className={cn(
                            "h-1 flex-1 rounded-full",
                            res?.status === "done"
                              ? AGENT_COLORS[agentId]
                              : res?.status === "error"
                                ? "bg-destructive/50"
                                : "bg-white/5",
                          )}
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

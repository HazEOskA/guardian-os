import * as React from "react";
import { ArrowUp, CheckCircle2, ChevronDown, Clock, Loader2 } from "lucide-react";

import type { AgentId, AgentResult, Run } from "@/lib/agents";
import { AGENT_META, AGENT_ORDER } from "@/lib/agents";
import { AgentCard } from "@/components/AgentCard";
import { GuardianOsAgentChip } from "@/components/guardian-os/GuardianOsAgentChip";
import { cn } from "@/lib/utils";

/* ── tiny pipeline chip inside the workspace card ─────────────────── */
function PipelineChip({ agentId, result }: { agentId: AgentId; result?: AgentResult }) {
  const meta = AGENT_META[agentId];
  const dotClass =
    result?.status === "done"
      ? "bg-emerald-500"
      : result?.status === "running"
        ? "bg-scanner animate-ping"
        : result?.status === "error"
          ? "bg-destructive"
          : "bg-[#3e414c]";

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-black/30 px-2 py-1 shrink-0">
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotClass)} />
      <span className="text-[9px] font-mono text-[#aeb4c7] uppercase tracking-wider">
        {meta.name}
      </span>
    </div>
  );
}

function progress(results: AgentResult[]): number {
  if (!results.length) return 0;
  return Math.round((results.filter((r) => r.status === "done").length / results.length) * 100);
}

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const h = Math.floor(diff / 3600000);
  if (h < 1) {
    const m = Math.floor(diff / 60000);
    return m < 1 ? "just now" : `${m}m ago`;
  }
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── main workspace ────────────────────────────────────────────────── */
export function GuardianOsWorkspace({
  enabled,
  input,
  setInput,
  running,
  onPrimaryAction,
  onToggleAgent,
  results = [],
  terminalLogs = [],
  history = [],
  onLoadRun,
  onHistoryOpen,
}: {
  enabled: Record<AgentId, boolean>;
  input: string;
  setInput: (v: string) => void;
  running: boolean;
  onPrimaryAction: () => void;
  onToggleAgent?: (a: AgentId) => void;
  results?: AgentResult[];
  terminalLogs?: string[];
  history?: Run[];
  onLoadRun?: (run: Run) => void;
  onHistoryOpen?: () => void;
}) {
  const hasResults = results.length > 0;
  const pct = progress(results);
  const activeRun = history[0] ?? null;
  const recentSessions = history.slice(hasResults ? 1 : 0, (hasResults ? 1 : 0) + 3);

  const logsEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  return (
    <div className="flex-1 overflow-y-auto mobile-scrollbar px-5 pt-2 pb-4 space-y-4">
      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div>
        <div className="text-[14px] font-bold text-white">
          Good morning,{" "}
          <span className="text-scanner">Commander.</span>
        </div>
        <div className="mt-0.5 text-[11px] font-mono text-[#aeb4c7]">
          What shall we analyze today?
        </div>
      </div>

      {/* ── Input box ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !running && input.trim()) {
              e.preventDefault();
              onPrimaryAction();
            }
          }}
          placeholder="Describe your objective or paste input..."
          rows={2}
          disabled={running}
          className="w-full bg-transparent text-[12px] outline-none placeholder-[#525666] font-mono text-white px-4 pt-3 pb-1 resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          {/* Smart Route pill */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 hover:bg-white/5 transition-colors"
          >
            <span className="text-[9px] font-mono text-[#aeb4c7] uppercase tracking-wide">
              Smart Route
            </span>
            <ChevronDown className="h-3 w-3 text-[#aeb4c7]" />
          </button>

          {/* Send button */}
          <button
            type="button"
            onClick={onPrimaryAction}
            disabled={running || !input.trim()}
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
              running || !input.trim()
                ? "bg-[#1a1c24] opacity-40 cursor-not-allowed"
                : "bg-gradient-to-br from-[oklch(0.75_0.14_195)] to-[oklch(0.7_0.17_290)] shadow-[0_0_14px_oklch(0.75_0.14_195/0.40)] hover:opacity-90 active:scale-95",
            )}
            aria-label="Run analysis"
          >
            {running ? (
              <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
            ) : (
              <ArrowUp className="h-3.5 w-3.5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* ── Active Workspace ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono text-[#525666] uppercase tracking-widest">
            Active Workspace
          </span>
          <button
            type="button"
            className="text-[9px] font-mono text-[#525666] hover:text-[#aeb4c7] transition-colors"
          >
            Edit
          </button>
        </div>

        {running || hasResults ? (
          /* Live / just-completed run card */
          <div className="rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.28)] backdrop-blur-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[12px] font-mono font-bold text-white line-clamp-1 flex-1">
                {input.length > 52 ? input.substring(0, 52) + "…" : input || "Analyzing…"}
              </div>
              <span
                className={cn(
                  "shrink-0 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-lg border",
                  running
                    ? "text-scanner border-scanner/30 bg-scanner/10"
                    : pct === 100
                      ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                      : "text-warning border-warning/30 bg-warning/10",
                )}
              >
                {running ? "In Progress" : "Complete"}
              </span>
            </div>

            <div className="mt-3 flex gap-1.5 flex-wrap">
              {results.map((r) => (
                <PipelineChip key={r.agent} agentId={r.agent} result={r} />
              ))}
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] font-mono text-[#525666] uppercase tracking-wider">
                  Progress
                </span>
                <span
                  className={cn(
                    "text-[9px] font-mono font-bold",
                    pct === 100 ? "text-emerald-400" : "text-scanner",
                  )}
                >
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    pct === 100 ? "bg-emerald-500/70" : "bg-scanner/70",
                    running && progress(results) < 100 && "shimmer",
                  )}
                  style={{ width: `${Math.max(3, pct)}%` }}
                />
              </div>
            </div>
          </div>
        ) : activeRun ? (
          /* Last history run */
          <button
            type="button"
            onClick={() => onLoadRun?.(activeRun)}
            className="w-full text-left rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.28)] backdrop-blur-sm p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-[12px] font-mono font-bold text-white line-clamp-1 flex-1">
                {activeRun.input.length > 52
                  ? activeRun.input.substring(0, 52) + "…"
                  : activeRun.input}
              </div>
              <span className="shrink-0 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-lg border text-emerald-400 border-emerald-400/30 bg-emerald-400/10">
                Complete
              </span>
            </div>
            <div className="mt-3 flex gap-1.5 flex-wrap">
              {activeRun.agents.map((id) => (
                <PipelineChip
                  key={id}
                  agentId={id}
                  result={activeRun.results.find((r) => r.agent === id)}
                />
              ))}
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] font-mono text-[#525666] uppercase tracking-wider">
                  Progress
                </span>
                <span className="text-[9px] font-mono font-bold text-emerald-400">
                  {progress(activeRun.results)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500/70"
                  style={{ width: `${progress(activeRun.results)}%` }}
                />
              </div>
            </div>
          </button>
        ) : (
          /* Empty state */
          <div className="rounded-2xl border border-white/5 bg-black/20 p-5 text-center">
            <div className="text-[10px] font-mono text-[#525666] uppercase tracking-wider">
              No active workspace
            </div>
            <div className="mt-1 text-[9px] font-mono text-[#3e414c]">
              Submit your first input above
            </div>
          </div>
        )}
      </div>

      {/* ── Terminal strip (live during run) ─────────────────────────── */}
      {running && terminalLogs.length > 0 && (
        <div className="rounded-2xl border border-scanner/15 bg-black/40 overflow-hidden">
          <div className="px-3 py-2 border-b border-white/5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-scanner animate-ping shrink-0" />
            <span className="text-[8px] font-mono text-[#525666] uppercase tracking-widest">
              Pipeline Active
            </span>
          </div>
          <div className="px-3 py-2 max-h-[72px] overflow-y-auto mobile-scrollbar space-y-0.5">
            {terminalLogs.slice(-10).map((log, i) => (
              <div key={i} className="text-[9px] font-mono text-[#525666] leading-relaxed">
                <span className="text-scanner/50 mr-1">›</span>
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* ── Agent result cards ───────────────────────────────────────── */}
      {hasResults && !running && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-[#525666] uppercase tracking-widest">
              Analysis Output
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          {results.map((r) => (
            <AgentCard key={r.agent} result={r} />
          ))}
        </div>
      )}

      {/* ── Recent Sessions ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono text-[#525666] uppercase tracking-widest">
            Recent Sessions
          </span>
          {history.length > 3 && (
            <button
              type="button"
              onClick={onHistoryOpen}
              className="text-[9px] font-mono text-[#525666] hover:text-[#aeb4c7] transition-colors"
            >
              See all
            </button>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <div className="text-[9px] font-mono text-[#3e414c] italic px-1">No sessions yet</div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((run) => {
              const allDone = run.results.every((r) => r.status === "done");
              return (
                <button
                  key={run.id}
                  type="button"
                  onClick={() => onLoadRun?.(run)}
                  className="w-full text-left flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-mono text-white truncate">
                      {run.input.length > 52 ? run.input.substring(0, 52) + "…" : run.input}
                    </div>
                    <div className="mt-0.5 text-[9px] font-mono text-[#525666]">
                      {allDone ? "Completed" : "Partial"} · {relativeTime(run.createdAt)}
                    </div>
                  </div>
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4 shrink-0",
                      allDone ? "text-emerald-400" : "text-[#3e414c]",
                    )}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Routes (agent chips) ─────────────────────────────────────── */}
      <div>
        <div className="text-[9px] font-mono text-[#525666] uppercase tracking-widest mb-2">
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

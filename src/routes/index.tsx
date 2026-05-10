import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AGENT_META, AGENT_ORDER, TAGS, loadRuns, saveRuns, type AgentId, type AgentResult, type Run, type Tag } from "@/lib/agents";
import { AgentCard } from "@/components/AgentCard";
import { Brain, Play, Trash2, History, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Guardian OS — Multi-Agent Reasoning Pipeline" },
      { name: "description", content: "Route any input through Scanner, Analyst, Decision, Strategy, and Risk AI agents to get structured, actionable results." },
    ],
  }),
});

function Index() {
  const [input, setInput] = useState("");
  const [tag, setTag] = useState<Tag>("general");
  const [enabled, setEnabled] = useState<Record<AgentId, boolean>>({
    scanner: true, analyst: true, decision: true, strategy: true, risk: true,
  });
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<AgentResult[]>([]);
  const [history, setHistory] = useState<Run[]>([]);

  useEffect(() => { setHistory(loadRuns()); }, []);

  const selectedAgents = useMemo(
    () => AGENT_ORDER.filter((a) => enabled[a]),
    [enabled],
  );

  const run = async () => {
    if (!input.trim()) {
      toast.error("Enter an input first");
      return;
    }
    if (selectedAgents.length === 0) {
      toast.error("Select at least one agent");
      return;
    }
    setRunning(true);
    const initial: AgentResult[] = selectedAgents.map((a) => ({ agent: a, status: "pending" }));
    setResults(initial);

    const collected: Record<string, any> = {};
    for (let i = 0; i < selectedAgents.length; i++) {
      const agent = selectedAgents[i];
      setResults((prev) => prev.map((r) => (r.agent === agent ? { ...r, status: "running" } : r)));
      const t0 = performance.now();
      try {
        const { data, error } = await supabase.functions.invoke("run-agent", {
          body: { agent, input, prior: collected },
        });
        if (error) throw new Error(error.message);
        if ((data as any)?.error) throw new Error((data as any).error);
        const dur = Math.round(performance.now() - t0);
        collected[agent] = (data as any).result;
        setResults((prev) =>
          prev.map((r) =>
            r.agent === agent ? { ...r, status: "done", result: (data as any).result, durationMs: dur } : r,
          ),
        );
      } catch (e: any) {
        const dur = Math.round(performance.now() - t0);
        setResults((prev) =>
          prev.map((r) =>
            r.agent === agent ? { ...r, status: "error", error: e.message || "Failed", durationMs: dur } : r,
          ),
        );
        toast.error(`${agent} failed: ${e.message}`);
        break;
      }
    }

    setRunning(false);

    // save run
    setResults((prev) => {
      const run: Run = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        input,
        tag,
        agents: selectedAgents,
        results: prev,
      };
      const updated = [run, ...loadRuns()].slice(0, 50);
      saveRuns(updated);
      setHistory(updated);
      return prev;
    });
  };

  const loadRun = (r: Run) => {
    setInput(r.input);
    setTag(r.tag);
    setResults(r.results);
  };

  const clearHistory = () => {
    saveRuns([]);
    setHistory([]);
    toast.success("History cleared");
  };

  return (
    <div className="min-h-screen">
      <Toaster theme="dark" />
      <header className="border-b border-border/60 backdrop-blur-sm sticky top-0 z-10 bg-background/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Guardian OS</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Multi-agent reasoning pipeline</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>{selectedAgents.length} agents armed</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <section className="space-y-4">
          {/* Input */}
          <div className="rounded-xl border border-border bg-card p-4">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a message, plan, contract, idea, token pitch — anything. The agents will analyze it."
              className="mt-2 w-full min-h-[120px] resize-y bg-input/50 rounded-md p-3 text-sm font-mono outline-none focus:ring-2 focus:ring-ring border border-border"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`text-xs px-2 py-1 rounded-full border ${tag === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
              <button
                onClick={run}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4" />
                {running ? "Running pipeline…" : "Run AI Agents"}
              </button>
            </div>

            {/* Agent toggles */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {AGENT_ORDER.map((a) => (
                <label
                  key={a}
                  className={`text-xs rounded-md border p-2 cursor-pointer flex items-center gap-2 ${enabled[a] ? "border-primary/40 bg-primary/5" : "border-border opacity-60"}`}
                >
                  <input
                    type="checkbox"
                    checked={enabled[a]}
                    onChange={(e) => setEnabled((s) => ({ ...s, [a]: e.target.checked }))}
                    className="accent-primary"
                  />
                  {AGENT_META[a].name}
                </label>
              ))}
            </div>
          </div>

          {/* Pipeline visualization */}
          {results.length > 0 && (
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {results.map((r, i) => (
                  <div key={r.agent} className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 text-[11px] rounded-md border font-mono ${
                        r.status === "done"
                          ? "border-primary/50 text-primary bg-primary/10"
                          : r.status === "running"
                            ? "border-primary/50 text-primary pipe-pulse"
                            : r.status === "error"
                              ? "border-destructive/50 text-destructive"
                              : "border-border text-muted-foreground"
                      }`}
                    >
                      {AGENT_META[r.agent].name}
                    </div>
                    {i < results.length - 1 && (
                      <div className={`h-[2px] w-6 ${r.status === "done" ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="space-y-3">
            {results.map((r) => (
              <AgentCard key={r.agent} result={r} />
            ))}
            {results.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Output will appear here. Each agent passes structured data to the next.
              </div>
            )}
          </div>
        </section>

        {/* History */}
        <aside className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <History className="h-3.5 w-3.5" /> History
            </div>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {history.length === 0 && (
              <div className="text-xs text-muted-foreground rounded-md border border-dashed border-border p-3">
                No runs yet.
              </div>
            )}
            {history.map((r) => (
              <button
                key={r.id}
                onClick={() => loadRun(r)}
                className="w-full text-left rounded-md border border-border bg-card hover:bg-secondary/40 p-2"
              >
                <div className="text-[11px] text-muted-foreground flex justify-between">
                  <span>#{r.tag}</span>
                  <span>{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-xs line-clamp-2 mt-0.5">{r.input}</div>
              </button>
            ))}
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-[11px] text-muted-foreground">
        Pipeline: Scanner → Analyst → Decision → Strategy → Risk
      </footer>
    </div>
  );
}

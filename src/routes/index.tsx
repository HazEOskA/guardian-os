/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AGENT_META,
  AGENT_ORDER,
  TAGS,
  loadRuns,
  saveRuns,
  type AgentId,
  type AgentResult,
  type Run,
  type Tag,
} from "@/lib/agents";
import { AgentCard } from "@/components/AgentCard";
import {
  Radar,
  Fingerprint,
  GitBranch,
  Target,
  ShieldAlert,
  Play,
  Trash2,
  History,
  Sparkles,
  Terminal,
  Cpu,
  ChevronUp,
  X,
  Copy,
  Check,
  Info,
  Layers,
  Database,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Guardian OS — AI Operating Layer" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      },
      {
        name: "description",
        content:
          "Mobile-first AI operating layer routing inputs through Scanner, Analyst, Decision, Strategy, and Risk agents.",
      },
    ],
  }),
});

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Radar: Radar,
  Fingerprint: Fingerprint,
  GitBranch: GitBranch,
  Target: Target,
  ShieldAlert: ShieldAlert,
};

const PRESETS = [
  {
    label: "DeFi Pool Audit",
    tag: "crypto" as Tag,
    text: "Audit proposal: 'Guardian Protocol ($GRD) launching a high-yield algorithmic liquidity pool with a 3% developer tax, 12-hour timelock, and unaudited smart contracts deployed directly on Arbitrum.'",
  },
  {
    label: "Japan SaaS Launch",
    tag: "business" as Tag,
    text: "Strategic expansion: 'Enter the Japanese enterprise SaaS market by translating the UI, hiring three local contract sales reps, and targeting mid-size financial institutions without establishing a local physical office.'",
  },
  {
    label: "Monolith Migration",
    tag: "coding" as Tag,
    text: "Migration pitch: 'Refactor our legacy monolithic Node.js backend into serverless Cloudflare Workers in TypeScript, migrating 2.5TB of relational database storage to Cloudflare D1 in a single 12-hour maintenance window.'",
  },
];

const AGENT_CLASSES: Record<
  AgentId,
  {
    text: string;
    bgRunning: string;
    bgDone: string;
    bgArmed: string;
    borderActive: string;
    borderArmed: string;
    glow: string;
    dot: string;
  }
> = {
  scanner: {
    text: "text-scanner",
    bgRunning: "bg-scanner/5",
    bgDone: "bg-scanner/10",
    bgArmed: "bg-scanner/5",
    borderActive: "border-scanner",
    borderArmed: "border-scanner/40",
    glow: "glow-scanner",
    dot: "bg-scanner",
  },
  analyst: {
    text: "text-analyst",
    bgRunning: "bg-analyst/5",
    bgDone: "bg-analyst/10",
    bgArmed: "bg-analyst/5",
    borderActive: "border-analyst",
    borderArmed: "border-analyst/40",
    glow: "glow-analyst",
    dot: "bg-analyst",
  },
  decision: {
    text: "text-decision",
    bgRunning: "bg-decision/5",
    bgDone: "bg-decision/10",
    bgArmed: "bg-decision/5",
    borderActive: "border-decision",
    borderArmed: "border-decision/40",
    glow: "glow-decision",
    dot: "bg-decision",
  },
  strategy: {
    text: "text-strategy",
    bgRunning: "bg-strategy/5",
    bgDone: "bg-strategy/10",
    bgArmed: "bg-strategy/5",
    borderActive: "border-strategy",
    borderArmed: "border-strategy/40",
    glow: "glow-strategy",
    dot: "bg-strategy",
  },
  risk: {
    text: "text-risk",
    bgRunning: "bg-risk/5",
    bgDone: "bg-risk/10",
    bgArmed: "bg-risk/5",
    borderActive: "border-risk",
    borderArmed: "border-risk/40",
    glow: "glow-risk",
    dot: "bg-risk",
  },
};

function Index() {
  const [input, setInput] = useState("");
  const [tag, setTag] = useState<Tag>("general");
  const [enabled, setEnabled] = useState<Record<AgentId, boolean>>({
    scanner: true,
    analyst: true,
    decision: true,
    strategy: true,
    risk: true,
  });
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<AgentResult[]>([]);
  const [history, setHistory] = useState<Run[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"workspace" | "results">("workspace");

  useEffect(() => {
    setHistory(loadRuns());
    // Ingest startup terminal logs
    setTerminalLogs([
      "SYSTEM BOOT: Guardian OS v1.0.4 initialized",
      "SECURE CORE: Encrypted memory buffers armed",
      "COGNITIVE LAYER: 5/5 reasoning agents standby",
      "READY FOR INPUT INJECTION...",
    ]);
  }, []);

  const selectedAgents = useMemo(() => AGENT_ORDER.filter((a) => enabled[a]), [enabled]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setTerminalLogs((prev) => [...prev, `[${time}] ${msg}`].slice(-40));
  };

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
    setActiveTab("workspace");
    const initial: AgentResult[] = selectedAgents.map((a) => ({ agent: a, status: "pending" }));
    setResults(initial);

    setTerminalLogs([]);
    addLog("SYS: Initiating multi-agent cognitive pipeline...");
    addLog(`SYS: Ingested seed input (${input.length} chars) [#${tag}]`);

    const collected: Record<string, any> = {};
    for (let i = 0; i < selectedAgents.length; i++) {
      const agent = selectedAgents[i];
      const meta = AGENT_META[agent];

      addLog(`${agent.toUpperCase()}: Deploying ${meta.system}...`);
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
            r.agent === agent
              ? { ...r, status: "done", result: (data as any).result, durationMs: dur }
              : r,
          ),
        );
        addLog(`${agent.toUpperCase()}: Computation success in ${dur}ms`);
      } catch (e: any) {
        const dur = Math.round(performance.now() - t0);
        setResults((prev) =>
          prev.map((r) =>
            r.agent === agent
              ? { ...r, status: "error", error: e.message || "Failed", durationMs: dur }
              : r,
          ),
        );
        addLog(`${agent.toUpperCase()}: Critical failure during compilation: ${e.message}`);
        toast.error(`${meta.name} Agent error: ${e.message}`);
        break;
      }
    }

    setRunning(false);
    addLog("SYS: Multi-agent execution cycle finalized.");

    // Switch to results automatically when finished
    setTimeout(() => {
      setActiveTab("results");
    }, 800);

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
    setDrawerOpen(false);
    setActiveTab("results");

    setTerminalLogs([]);
    addLog(`SYS: Loaded historical run execution [ID: ${r.id.substring(0, 8)}]`);
    r.results.forEach((res) => {
      const meta = AGENT_META[res.agent];
      if (res.status === "done") {
        addLog(`${res.agent.toUpperCase()}: Restored success logs (${res.durationMs}ms)`);
      } else {
        addLog(`${res.agent.toUpperCase()}: Restored ${res.status} state`);
      }
    });
  };

  const clearHistory = () => {
    saveRuns([]);
    setHistory([]);
    toast.success("History cleared");
  };

  const toggleAgent = (agent: AgentId) => {
    if (running) return;
    setEnabled((prev) => {
      const updated = { ...prev, [agent]: !prev[agent] };
      const selected = AGENT_ORDER.filter((a) => updated[a]);
      addLog(`CONFIG: Armed agents modified [armedCount: ${selected.length}]`);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#05060a] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Dynamic ambient grid background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(30,41,59,0.35),transparent_60%)] bg-[size:28px_28px] opacity-25" />

      {/* Device wrapper */}
      <div className="w-full h-screen sm:h-[820px] sm:max-w-[400px] sm:rounded-[48px] sm:border-[6px] sm:border-[#1d1e24] bg-[#090a0f] sm:shadow-[0_0_80px_rgba(0,0,0,0.95),inset_0_0_24px_rgba(255,255,255,0.02)] relative overflow-hidden flex flex-col text-foreground font-sans scanlines">
        {/* Device Notch/Island */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#1d1e24] rounded-b-xl z-50 flex items-center justify-center">
          <div className="w-8 h-1 bg-[#090a0f] rounded-full mr-1.5" />
          <div className="w-2 h-2 bg-[#090a0f] rounded-full" />
        </div>

        {/* System Bar */}
        <header className="pt-6 sm:pt-7 pb-2 px-5 flex justify-between items-center text-[9px] font-mono tracking-widest text-[#525666] border-b border-border/10 bg-[#090a0f]/80 backdrop-blur-md z-40 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${running ? "bg-primary status-glow-scanner" : "bg-emerald-500 status-glow-strategy"}`}
            />
            <span>SYS_LINK: SECURE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>CPU: {running ? "87%" : "02%"}</span>
            <span>BAT: 100%</span>
          </div>
        </header>

        <Toaster theme="dark" position="top-center" />

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto mobile-scrollbar flex flex-col pb-20">
          {/* Guardian Title */}
          <div className="px-5 pt-4 pb-2 text-center shrink-0">
            <h1 className="text-xl font-black tracking-[0.25em] bg-gradient-to-r from-scanner via-analyst to-strategy bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(115,185,255,0.25)]">
              GUARDIAN OS
            </h1>
            <p className="text-[9px] font-mono tracking-[0.3em] text-muted-foreground mt-0.5 uppercase">
              COGNITIVE REASONING LAYER
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 py-2 shrink-0">
            <div className="grid grid-cols-2 p-0.5 rounded-xl border border-white/5 bg-black/40">
              <button
                onClick={() => setActiveTab("workspace")}
                className={`py-1.5 text-2xs font-mono tracking-wider rounded-lg transition-all uppercase ${
                  activeTab === "workspace"
                    ? "bg-[#181922] text-white shadow-sm border border-white/5"
                    : "text-[#525666] hover:text-neutral-300"
                }`}
              >
                1. Core Console
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`py-1.5 text-2xs font-mono tracking-wider rounded-lg transition-all uppercase relative ${
                  activeTab === "results"
                    ? "bg-[#181922] text-white shadow-sm border border-white/5"
                    : "text-[#525666] hover:text-neutral-300"
                }`}
              >
                2. HUD Feed
                {results.some((r) => r.status === "done") && (
                  <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-primary status-glow-scanner" />
                )}
              </button>
            </div>
          </div>

          {/* Workspace Tab View */}
          {activeTab === "workspace" && (
            <div className="flex-1 flex flex-col gap-4">
              {/* Circuit Pipeline Flow */}
              <div className="px-5 py-1">
                <div className="rounded-2xl border border-white/5 bg-black/35 p-3.5 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01),transparent_70%)]" />
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono tracking-widest text-[#525666] uppercase">
                      SYS_INTEGRITY_CIRCUIT
                    </span>
                    <span className="text-[9px] font-mono text-[#525666] uppercase">
                      {selectedAgents.length}/5 NODES ARMED
                    </span>
                  </div>

                  {/* Nodes grid layout */}
                  <div className="grid grid-cols-5 gap-1.5 relative z-10">
                    {AGENT_ORDER.map((agentId) => {
                      const meta = AGENT_META[agentId];
                      const isArmed = enabled[agentId];
                      const result = results.find((r) => r.agent === agentId);
                      const status = result?.status || "idle";
                      const Icon = ICON_MAP[meta.icon];

                      const classes = AGENT_CLASSES[agentId];
                      let borderClass = "border-white/5 bg-neutral-900/40 text-[#434652]";
                      let glowClass = "";
                      let iconColor = "text-neutral-600";
                      let dotClass = "bg-neutral-700";

                      if (isArmed) {
                        iconColor = classes.text;
                        if (status === "running") {
                          borderClass = `${classes.borderActive} ${classes.bgRunning} ${classes.text} animate-pulse`;
                          glowClass = classes.glow;
                          dotClass = `${classes.dot} animate-ping`;
                        } else if (status === "done") {
                          borderClass = `${classes.borderActive} ${classes.bgDone} ${classes.text}`;
                          glowClass = classes.glow;
                          dotClass = classes.dot;
                        } else if (status === "error") {
                          borderClass = "border-destructive bg-destructive/5 text-destructive";
                          iconColor = "text-destructive";
                          dotClass = "bg-destructive";
                        } else {
                          // standby armed
                          borderClass = `${classes.borderArmed} ${classes.bgArmed} text-white`;
                          dotClass = `${classes.dot}/50`;
                        }
                      }

                      return (
                        <button
                          key={agentId}
                          onClick={() => toggleAgent(agentId)}
                          disabled={running}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all relative ${borderClass} ${glowClass} ${
                            running
                              ? "cursor-not-allowed"
                              : "hover:bg-neutral-800/20 active:scale-95"
                          }`}
                        >
                          <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-black/40 border border-white/5 mb-1 shrink-0">
                            {Icon && <Icon className={`h-3 w-3 ${iconColor}`} />}
                          </div>
                          <span className="text-[9px] font-mono tracking-wide">{meta.name}</span>

                          {/* Node status dot */}
                          <span
                            className={`absolute top-1 right-1 w-1 h-1 rounded-full ${dotClass}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Console Input Module */}
              <div className="px-5 py-1">
                <div className="rounded-2xl border border-white/5 bg-black/35 p-3.5 shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#525666] uppercase">
                      {">"} COGNITIVE_SEED_INPUT
                    </span>
                    <span className="text-[9px] font-mono text-[#525666] uppercase">
                      {input.length}/1000 CHARS
                    </span>
                  </div>

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Provide a scenario, market transaction, smart contract, business outline or system logic to inject into the compiler matrix..."
                    className="w-full h-24 bg-transparent text-xs font-mono text-white placeholder-neutral-700 outline-none resize-none border-0 p-0 text-left mobile-scrollbar focus:placeholder-transparent"
                    disabled={running}
                  />

                  {/* Preset Templates */}
                  <div className="mt-2.5 pt-2.5 border-t border-white/5">
                    <div className="text-[8px] font-mono text-[#525666] uppercase mb-1.5 tracking-wider">
                      LOAD SEED TEMPLATES:
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 mobile-scrollbar">
                      {PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          disabled={running}
                          onClick={() => {
                            setInput(preset.text);
                            setTag(preset.tag);
                            addLog(`CONFIG: Loaded preset template [#${preset.tag}]`);
                          }}
                          className="shrink-0 text-[8px] font-mono px-2 py-1 rounded-md border border-white/5 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all uppercase"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seed tagging & Run Actions */}
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex gap-1">
                      {TAGS.map((t) => (
                        <button
                          key={t}
                          disabled={running}
                          onClick={() => {
                            setTag(t);
                            addLog(`CONFIG: Tag modified to #${t}`);
                          }}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                            tag === t
                              ? "bg-primary border-primary text-black font-semibold"
                              : "border-white/5 bg-black/40 text-neutral-500 hover:text-neutral-300"
                          }`}
                        >
                          #{t}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={run}
                      disabled={running || !input.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-2xs font-mono uppercase tracking-wider text-black font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all relative overflow-hidden group shadow-[0_0_15px_rgba(115,185,255,0.3)]"
                    >
                      <Play className="h-3 w-3 fill-black text-black shrink-0" />
                      <span>{running ? "Compiling..." : "Engage"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Rolling Terminal Logs */}
              <div className="px-5 py-1 flex-1 flex flex-col min-h-[120px] max-h-[180px]">
                <div className="flex-1 rounded-2xl border border-white/5 bg-[#07080b] p-3 font-mono text-[9px] text-[#525666] overflow-y-auto flex flex-col gap-1.5 mobile-scrollbar shadow-inner relative">
                  <div className="absolute top-2 right-3 flex items-center gap-1 text-[8px] tracking-wider font-semibold text-neutral-700">
                    <Terminal className="h-2.5 w-2.5 text-neutral-600" />
                    SYSTEM LOGS TIER-1
                  </div>

                  {terminalLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`leading-normal ${
                        log.includes("success") ||
                        log.includes("finalized") ||
                        log.includes("READY")
                          ? "text-emerald-500/80"
                          : log.includes("failure") || log.includes("error")
                            ? "text-destructive"
                            : log.includes("initiating") || log.includes("SYS:")
                              ? "text-primary"
                              : "text-[#525666]"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Tab View */}
          {activeTab === "results" && (
            <div className="flex-1 px-5 py-2 space-y-4">
              {results.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center shrink-0">
                    <span className="text-[9px] font-mono tracking-widest text-[#525666] uppercase">
                      PIPELINE HUD FEED
                    </span>
                    <span className="text-[9px] font-mono text-primary flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> READY
                    </span>
                  </div>

                  {results.map((r) => (
                    <AgentCard key={r.agent} result={r} />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-white/5 rounded-2xl bg-black/10">
                  <div className="h-10 w-10 rounded-full border border-white/5 bg-neutral-900/40 flex items-center justify-center mb-3">
                    <Database className="h-4 w-4 text-neutral-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-neutral-300">HUD Feed Standby</h3>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1 max-w-[200px] mx-auto leading-relaxed uppercase">
                    Engage the reactor flow in the workspace tab to populate this display matrix.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating OS Control Strip (Persistent Navigation Drawer & Reset) */}
        <div className="absolute bottom-0 inset-x-0 h-16 border-t border-white/5 bg-[#090a0f]/90 backdrop-blur-md px-6 flex items-center justify-between z-40 shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-white text-[#525666] transition-all cursor-pointer"
          >
            <History className="h-4 w-4" />
            <span className="text-[8px] font-mono tracking-wider uppercase">System Logs</span>
          </button>

          <div className="h-7 w-[1px] bg-white/5" />

          <button
            onClick={() => {
              if (running) return;
              setInput("");
              setResults([]);
              setActiveTab("workspace");
              setTerminalLogs([
                "SYS: Ingress buffers cleared",
                "SYS: Memory allocation scrubbed",
                "READY FOR INPUT INJECTION...",
              ]);
              toast.success("System scrubbed successfully");
            }}
            disabled={running}
            className="flex flex-col items-center gap-1 hover:text-white text-[#525666] transition-all disabled:opacity-30 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-[8px] font-mono tracking-wider uppercase">Scrub Memory</span>
          </button>

          <div className="h-7 w-[1px] bg-white/5" />

          <button
            onClick={() => {
              if (running) return;
              // Reset nodes to armed
              setEnabled({
                scanner: true,
                analyst: true,
                decision: true,
                strategy: true,
                risk: true,
              });
              addLog("CONFIG: Reset all system nodes to armed");
              toast.success("All nodes armed");
            }}
            disabled={running}
            className="flex flex-col items-center gap-1 hover:text-white text-[#525666] transition-all disabled:opacity-30 cursor-pointer"
          >
            <Sliders className="h-4 w-4" />
            <span className="text-[8px] font-mono tracking-wider uppercase">Arm Nodes</span>
          </button>
        </div>

        {/* Sliding History Drawer Sheet */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-[#090a0f]/98 border-t border-white/10 rounded-t-[28px] p-5 z-50 transition-all duration-300 ease-out shadow-2xl flex flex-col max-h-[75%] ${
            drawerOpen ? "transform translate-y-0" : "transform translate-y-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-3 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
                Run History
              </h2>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg border border-white/5 hover:bg-neutral-800 transition-all text-neutral-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Drawer scrollable content */}
          <div className="flex-1 overflow-y-auto mobile-scrollbar py-3 space-y-2.5 pr-0.5">
            {history.length === 0 ? (
              <div className="text-[10px] text-neutral-500 font-mono text-center py-8 uppercase tracking-wide">
                No archived run logs found.
              </div>
            ) : (
              history.map((r) => (
                <button
                  key={r.id}
                  onClick={() => loadRun(r)}
                  className="w-full text-left rounded-xl border border-white/5 bg-[#121319]/80 hover:bg-[#181922] p-3 transition-all flex flex-col gap-1.5"
                >
                  <div className="text-[8px] font-mono text-[#525666] flex justify-between w-full uppercase">
                    <span className="text-primary font-semibold">#{r.tag}</span>
                    <span>
                      {new Date(r.createdAt).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-300 line-clamp-2 leading-relaxed">
                    {r.input}
                  </div>

                  {/* Nodes in run indicator */}
                  <div className="flex gap-1 mt-0.5">
                    {r.agents.map((ag) => (
                      <span
                        key={ag}
                        className="text-[7px] font-mono px-1 rounded-sm border border-white/5 bg-black/40 text-neutral-500 uppercase"
                      >
                        {ag.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Drawer Actions */}
          {history.length > 0 && (
            <div className="pt-3 border-t border-white/5 flex gap-2 shrink-0">
              <button
                onClick={clearHistory}
                className="w-full py-2.5 rounded-xl border border-destructive/20 hover:border-destructive/40 bg-destructive/5 hover:bg-destructive/10 text-[10px] font-mono uppercase tracking-wider text-destructive font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear System Logs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

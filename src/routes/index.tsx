/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AGENT_META,
  AGENT_ORDER,
  loadRuns,
  saveRuns,
  type AgentId,
  type AgentResult,
  type Run,
  type Tag,
} from "@/lib/agents";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { GuardianOsPhoneFrame } from "@/components/guardian-os/GuardianOsPhoneFrame";
import { GuardianOsTopBar } from "@/components/guardian-os/GuardianOsTopBar";
import { GuardianOsHome } from "@/components/guardian-os/GuardianOsHome";
import { GuardianOsWorkspace } from "@/components/guardian-os/GuardianOsWorkspace";
import { GuardianOsHowItWorks } from "@/components/guardian-os/GuardianOsHowItWorks";
import { GuardianOsAgents } from "@/components/guardian-os/GuardianOsAgents";

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
  const [screen, setScreen] = useState<"home" | "workspace" | "learn" | "agents">("home");

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
    // Visual parity with the reference: stay on the workspace screen.
    setScreen("workspace");

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
    setScreen("workspace");

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
    <GuardianOsPhoneFrame>
      <div className="relative flex flex-col h-full w-full">
        <Toaster theme="dark" position="top-center" />

        {screen === "home" ? <GuardianOsHome onGetStarted={() => setScreen("workspace")} /> : null}

        {screen === "workspace" ? (
          <>
            <GuardianOsTopBar
              variant="workspace"
              onAgents={() => setScreen("agents")}
              onHow={() => setScreen("learn")}
            />
            <GuardianOsWorkspace
              enabled={enabled}
              input={input}
              setInput={setInput}
              running={running}
              onPrimaryAction={run}
              onToggleAgent={(agent) => toggleAgent(agent)}
            />
          </>
        ) : null}

        {screen === "learn" ? (
          <>
            <GuardianOsTopBar variant="learn" onBack={() => setScreen("workspace")} />
            <GuardianOsHowItWorks />
          </>
        ) : null}

        {screen === "agents" ? (
          <>
            <GuardianOsTopBar variant="agents" onBack={() => setScreen("workspace")} />
            <GuardianOsAgents enabled={enabled} />
          </>
        ) : null}
      </div>
    </GuardianOsPhoneFrame>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  AlertCircle,
  Radar,
  Fingerprint,
  GitBranch,
  Target,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  Flame,
  Wrench,
} from "lucide-react";
import type { AgentResult, AgentId } from "@/lib/agents";
import { AGENT_META } from "@/lib/agents";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Radar: Radar,
  Fingerprint: Fingerprint,
  GitBranch: GitBranch,
  Target: Target,
  ShieldAlert: ShieldAlert,
};

const CARD_CLASSES: Record<
  AgentId,
  {
    border: string;
    borderHover: string;
    text: string;
    glow: string;
    bg: string;
    bgGlow: string;
  }
> = {
  scanner: {
    border: "border-scanner/20",
    borderHover: "hover:border-scanner/40",
    text: "text-scanner",
    glow: "glow-scanner",
    bg: "bg-scanner/5",
    bgGlow: "bg-[radial-gradient(circle_at_top_left,oklch(0.75_0.14_195_/_0.06),transparent_60%)]",
  },
  analyst: {
    border: "border-analyst/20",
    borderHover: "hover:border-analyst/40",
    text: "text-analyst",
    glow: "glow-analyst",
    bg: "bg-analyst/5",
    bgGlow: "bg-[radial-gradient(circle_at_top_left,oklch(0.70_0.17_290_/_0.06),transparent_60%)]",
  },
  decision: {
    border: "border-decision/20",
    borderHover: "hover:border-decision/40",
    text: "text-decision",
    glow: "glow-decision",
    bg: "bg-decision/5",
    bgGlow: "bg-[radial-gradient(circle_at_top_left,oklch(0.80_0.15_70_/_0.06),transparent_60%)]",
  },
  strategy: {
    border: "border-strategy/20",
    borderHover: "hover:border-strategy/40",
    text: "text-strategy",
    glow: "glow-strategy",
    bg: "bg-strategy/5",
    bgGlow: "bg-[radial-gradient(circle_at_top_left,oklch(0.78_0.16_145_/_0.06),transparent_60%)]",
  },
  risk: {
    border: "border-risk/20",
    borderHover: "hover:border-risk/40",
    text: "text-risk",
    glow: "glow-risk",
    bg: "bg-risk/5",
    bgGlow: "bg-[radial-gradient(circle_at_top_left,oklch(0.65_0.22_25_/_0.06),transparent_60%)]",
  },
};

export function AgentCard({ result }: { result: AgentResult }) {
  const meta = AGENT_META[result.agent];
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const classes = CARD_CLASSES[result.agent];
  const Icon = ICON_MAP[meta.icon];

  const copy = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(result.result ?? result.error ?? "", null, 2),
    );
    setCopied(true);
    toast.success(`${meta.name} data copied`);
    setTimeout(() => setCopied(false), 1200);
  };

  const StatusLight = () => {
    if (result.status === "running")
      return <span className={`h-2 w-2 rounded-full ${classes.text} animate-ping bg-current`} />;
    if (result.status === "done")
      return <span className={`h-1.5 w-1.5 rounded-full ${classes.text} bg-current`} />;
    if (result.status === "error")
      return <span className="h-1.5 w-1.5 rounded-full bg-destructive" />;
    return <span className="h-1.5 w-1.5 rounded-full bg-[#3e414c]" />;
  };

  return (
    <div
      className={`rounded-2xl border ${classes.border} bg-[#0c0e14] overflow-hidden backdrop-blur-sm transition-all ${classes.borderHover} ${result.status === "running" ? "shadow-inner" : ""}`}
    >
      {/* HUD Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-neutral-800/20 active:bg-neutral-800/40 transition-all text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Circular Icon shell */}
          <div
            className={`h-7 w-7 rounded-lg flex items-center justify-center bg-black/40 border ${classes.border} ${classes.glow}`}
          >
            {Icon && <Icon className={`h-3.5 w-3.5 ${classes.text}`} />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-2xs font-bold text-white uppercase tracking-wider">
                {meta.name} Node
              </span>
              <span className="text-[8px] font-mono text-[#525666] tracking-widest">
                {meta.system}
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono tracking-wide leading-relaxed truncate">
              {meta.tagline}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {result.durationMs != null && (
            <span className="text-[8px] text-[#525666] font-mono">{result.durationMs}ms</span>
          )}

          <div className="flex items-center gap-1.5">
            <StatusLight />
            {open ? (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-600" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            )}
          </div>
        </div>
      </button>

      {open && (
        <div className={`px-4 pb-4 border-t border-white/5 relative ${classes.bgGlow}`}>
          {result.status === "running" && (
            <div className="mt-4">
              <div className="h-1 w-full rounded shimmer bg-neutral-900" />
              <div className="text-[9px] font-mono text-[#525666] mt-2 tracking-widest animate-pulse">
                SOLVING REASONING NODES...
              </div>
            </div>
          )}
          {result.status === "error" && (
            <div className="mt-3 p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-2xs text-destructive font-mono flex items-start gap-2 leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
              <div>
                <div className="font-semibold uppercase tracking-wider mb-1">
                  Execution Interrupted
                </div>
                {result.error}
              </div>
            </div>
          )}
          {result.status === "done" && result.result && (
            <div className="mt-3 space-y-4">
              <RenderResult
                agent={result.agent}
                data={result.result}
                copyFn={copy}
                copied={copied}
              />
            </div>
          )}
          {result.status === "pending" && (
            <div className="text-[10px] font-mono text-[#525666] mt-3 uppercase tracking-widest animate-pulse">
              QUEUED IN BUFFER...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3">
      <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest text-[#525666] uppercase mb-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-neutral-600" />}
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function List({
  items,
  type = "dot",
}: {
  items: unknown;
  type?: "dot" | "check" | "warning" | "opportunity";
}) {
  if (!Array.isArray(items) || items.length === 0)
    return (
      <div className="text-[10px] text-neutral-600 font-mono italic uppercase tracking-wider">
        NONE DETECTED
      </div>
    );

  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-[10px] font-mono text-neutral-300 leading-normal"
        >
          {type === "check" && <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-emerald-500" />}
          {type === "warning" && (
            <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-destructive" />
          )}
          {type === "opportunity" && <Sparkles className="h-3 w-3 mt-0.5 shrink-0 text-analyst" />}
          {type === "dot" && <span className="text-primary font-bold shrink-0">›</span>}
          <span className="flex-1">{typeof it === "string" ? it : JSON.stringify(it)}</span>
        </li>
      ))}
    </ul>
  );
}

function RenderResult({
  agent,
  data,
  copyFn,
  copied,
}: {
  agent: string;
  data: any;
  copyFn: () => void;
  copied: boolean;
}) {
  if (agent === "scanner") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Section title="Extracted Topic" icon={Info}>
            <div className="text-[10px] font-mono text-scanner uppercase font-bold tracking-wide leading-relaxed">
              {data.topic || "UNKNOWN"}
            </div>
          </Section>
          <Section title="User Intent" icon={Zap}>
            <div className="text-[10px] font-mono text-white uppercase font-bold tracking-wide leading-relaxed">
              {data.intent || "UNKNOWN"}
            </div>
          </Section>
        </div>

        <Section title="System Signals" icon={Radar}>
          <List items={data.signals} />
        </Section>

        <Section title="Threat Vectors" icon={ShieldAlert}>
          <List items={data.risks} type="warning" />
        </Section>

        <Section title="Compiler Summary" icon={Info}>
          <p className="text-[10px] font-mono text-neutral-300 leading-relaxed">{data.summary}</p>
        </Section>

        <CopyFooter copyFn={copyFn} copied={copied} />
      </div>
    );
  }

  if (agent === "analyst") {
    return (
      <div className="space-y-3">
        <Section title="Verified Facts" icon={ShieldCheck}>
          <List items={data.facts} type="check" />
        </Section>

        <Section title="Exposed Assumptions" icon={HelpCircle}>
          <List items={data.assumptions} type="warning" />
        </Section>

        <Section title="Critical Data Gaps" icon={AlertTriangle}>
          <List items={data.missing_data} type="warning" />
        </Section>

        <Section title="Latent Opportunities" icon={Sparkles}>
          <List items={data.opportunities} type="opportunity" />
        </Section>

        <CopyFooter copyFn={copyFn} copied={copied} />
      </div>
    );
  }

  if (agent === "decision") {
    return (
      <div className="space-y-3">
        <Section title="Evaluated Scenarios" icon={GitBranch}>
          <div className="space-y-3 mt-1">
            {(data.options || []).map((o: any, i: number) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-black/30 p-3 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <div className="font-bold text-[10px] font-mono text-white uppercase tracking-wide">
                    {o.name}
                  </div>
                  <div className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-decision/10 border border-decision/20 text-decision uppercase tracking-wider">
                    Score: {o.score}/100
                  </div>
                </div>

                {/* Visual score slider bar */}
                <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-decision rounded-full"
                    style={{ width: `${o.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div>
                    <div className="text-[8px] font-mono font-bold text-[#525666] uppercase tracking-wider mb-1">
                      PROS:
                    </div>
                    <List items={o.pros} type="check" />
                  </div>
                  <div>
                    <div className="text-[8px] font-mono font-bold text-[#525666] uppercase tracking-wider mb-1">
                      CONS:
                    </div>
                    <List items={o.cons} type="warning" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Recommended Pathway" icon={CheckCircle}>
          <div className="rounded-xl border border-decision/30 bg-decision/5 p-3 leading-relaxed shadow-sm">
            <div className="text-[8px] font-mono font-bold text-decision uppercase tracking-wider mb-1">
              RECOMMENDED VECTOR:
            </div>
            <p className="text-[10px] font-mono text-white leading-normal font-medium">
              {data.recommendation}
            </p>
          </div>
        </Section>

        <Section title="Recommendation Rationale" icon={Info}>
          <p className="text-[10px] font-mono text-neutral-300 leading-relaxed">{data.rationale}</p>
        </Section>

        <CopyFooter copyFn={copyFn} copied={copied} />
      </div>
    );
  }

  if (agent === "strategy") {
    return (
      <div className="space-y-3">
        <Section title="Primary Objective" icon={Target}>
          <p className="text-[10px] font-mono text-strategy font-bold uppercase tracking-wider leading-relaxed">
            {data.objective}
          </p>
        </Section>

        <Section title="Execution Steps" icon={Target}>
          <div className="space-y-3 mt-1 relative pl-3.5">
            {/* Thread timeline line */}
            <div className="absolute top-2 bottom-2 left-[5px] w-[1px] bg-neutral-800" />

            {(data.steps || []).map((s: any, i: number) => (
              <div key={i} className="relative flex flex-col gap-1.5">
                {/* Stepper dot */}
                <span className="absolute -left-[16px] top-1 w-2.5 h-2.5 rounded-full border-2 border-neutral-900 bg-strategy shadow-[0_0_6px_var(--strategy)]" />

                <div className="font-bold text-[10px] font-mono text-white leading-relaxed">
                  <span className="text-strategy mr-1">0{i + 1}.</span> {s.step}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/5 bg-black/20 p-2.5">
                  <div>
                    <div className="text-[7px] font-mono font-bold text-[#525666] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Wrench className="h-2 w-2" /> Toolkits:
                    </div>
                    <List items={s.tools} />
                  </div>
                  <div>
                    <div className="text-[7px] font-mono font-bold text-[#525666] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-2 w-2" /> Threats:
                    </div>
                    <List items={s.risks} type="warning" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Success Metrics" icon={CheckCircle}>
          <List items={data.success_metrics} type="check" />
        </Section>

        <CopyFooter copyFn={copyFn} copied={copied} />
      </div>
    );
  }

  if (agent === "risk") {
    const score = Number(data.risk_score ?? 0);
    const scoreColor =
      score >= 70 ? "text-destructive" : score >= 40 ? "text-warning" : "text-emerald-400";

    const riskVerdict =
      data.verdict ||
      (score >= 70 ? "CRITICAL THREAT" : score >= 40 ? "ELEVATED RISK" : "SECURE PROFILE");

    return (
      <div className="space-y-3">
        <Section title="Threat Core Assessment" icon={ShieldAlert}>
          <div className="flex flex-col gap-3.5 py-1">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[8px] font-mono font-bold text-[#525666] uppercase tracking-wider mb-0.5">
                  MATRIX VERDICT:
                </div>
                <div
                  className={`text-xs font-black tracking-widest font-mono uppercase ${scoreColor}`}
                >
                  {riskVerdict}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] font-mono font-bold text-[#525666] uppercase tracking-wider mb-0.5">
                  SCORE:
                </div>
                <div className={`text-xl font-black font-mono leading-none ${scoreColor}`}>
                  {score}/100
                </div>
              </div>
            </div>

            {/* Visual Risk Gauge Meter */}
            <div className="h-3 rounded-full bg-neutral-900 border border-white/5 overflow-hidden p-0.5 flex">
              <div
                className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                style={{
                  width: `${Math.max(4, score)}%`,
                  background:
                    score >= 70
                      ? "oklch(0.62 0.22 27)" // Crimson
                      : score >= 40
                        ? "oklch(0.80 0.16 75)" // Amber
                        : "oklch(0.78 0.18 155)", // Emerald
                }}
              />
            </div>
          </div>
        </Section>

        <Section title="Critical Red Flags" icon={Flame}>
          <List items={data.red_flags} type="warning" />
        </Section>

        <Section title="Threat Shield Notes" icon={Info}>
          <p className="text-[10px] font-mono text-neutral-300 leading-relaxed">{data.notes}</p>
        </Section>

        <CopyFooter copyFn={copyFn} copied={copied} />
      </div>
    );
  }

  return (
    <pre className="text-[10px] font-mono text-neutral-300 leading-relaxed overflow-x-auto bg-black/40 border border-white/5 p-3 rounded-xl">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function CopyFooter({ copyFn, copied }: { copyFn: () => void; copied: boolean }) {
  return (
    <div className="pt-2 flex justify-end shrink-0">
      <button
        onClick={copyFn}
        className="inline-flex items-center gap-1 text-[8px] font-mono px-2.5 py-1 rounded bg-[#13141a] hover:bg-neutral-800 border border-white/5 text-neutral-400 hover:text-white transition-all uppercase tracking-wider"
      >
        {copied ? (
          <Check className="h-2.5 w-2.5 text-emerald-500" />
        ) : (
          <Copy className="h-2.5 w-2.5" />
        )}
        <span>{copied ? "Copied" : "Copy Payload"}</span>
      </button>
    </div>
  );
}

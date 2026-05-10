import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check, AlertCircle, Loader2, CheckCircle2, Circle } from "lucide-react";
import type { AgentResult } from "@/lib/agents";
import { AGENT_META } from "@/lib/agents";
import { toast } from "sonner";

export function AgentCard({ result }: { result: AgentResult }) {
  const meta = AGENT_META[result.agent];
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result.result ?? result.error ?? "", null, 2));
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1200);
  };

  const StatusIcon = () => {
    if (result.status === "running")
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    if (result.status === "done")
      return <CheckCircle2 className="h-4 w-4 text-primary" />;
    if (result.status === "error")
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusIcon />
          <div className="text-left min-w-0">
            <div className="font-semibold text-sm tracking-tight">{meta.name} Agent</div>
            <div className="text-xs text-muted-foreground truncate">{meta.tagline}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result.durationMs != null && (
            <span className="text-xs text-muted-foreground font-mono">{result.durationMs}ms</span>
          )}
          {result.status === "done" && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                copy();
              }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-secondary border border-border"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              Copy
            </span>
          )}
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {result.status === "running" && (
            <div className="h-1 w-full rounded shimmer bg-secondary" />
          )}
          {result.status === "error" && (
            <div className="text-sm text-destructive font-mono">{result.error}</div>
          )}
          {result.status === "done" && result.result && (
            <RenderResult agent={result.agent} data={result.result} />
          )}
          {result.status === "pending" && (
            <div className="text-xs text-muted-foreground">Queued…</div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function List({ items }: { items: unknown }) {
  if (!Array.isArray(items) || items.length === 0)
    return <div className="text-muted-foreground text-sm">—</div>;
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-primary">›</span>
          <span>{typeof it === "string" ? it : JSON.stringify(it)}</span>
        </li>
      ))}
    </ul>
  );
}

function RenderResult({ agent, data }: { agent: string; data: any }) {
  if (agent === "scanner") {
    return (
      <div>
        <Section title="Topic">{data.topic}</Section>
        <Section title="Intent">{data.intent}</Section>
        <Section title="Signals"><List items={data.signals} /></Section>
        <Section title="Risks"><List items={data.risks} /></Section>
        <Section title="Summary">{data.summary}</Section>
      </div>
    );
  }
  if (agent === "analyst") {
    return (
      <div>
        <Section title="Facts"><List items={data.facts} /></Section>
        <Section title="Assumptions"><List items={data.assumptions} /></Section>
        <Section title="Risks"><List items={data.risks} /></Section>
        <Section title="Opportunities"><List items={data.opportunities} /></Section>
        <Section title="Missing Data"><List items={data.missing_data} /></Section>
      </div>
    );
  }
  if (agent === "decision") {
    return (
      <div>
        <Section title="Options">
          <div className="space-y-2">
            {(data.options || []).map((o: any, i: number) => (
              <div key={i} className="rounded-md border border-border p-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{o.name}</div>
                  <div className="text-xs font-mono text-primary">score {o.score}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                  <div>
                    <div className="text-muted-foreground">Pros</div>
                    <List items={o.pros} />
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cons</div>
                    <List items={o.cons} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Recommendation">
          <div className="rounded-md border border-primary/40 bg-primary/10 p-2">{data.recommendation}</div>
        </Section>
        <Section title="Rationale">{data.rationale}</Section>
      </div>
    );
  }
  if (agent === "strategy") {
    return (
      <div>
        <Section title="Objective">{data.objective}</Section>
        <Section title="Steps">
          <ol className="space-y-2">
            {(data.steps || []).map((s: any, i: number) => (
              <li key={i} className="rounded-md border border-border p-2">
                <div className="font-medium text-sm">
                  <span className="text-primary mr-2">{i + 1}.</span>
                  {s.step}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                  <div>
                    <div className="text-muted-foreground">Tools</div>
                    <List items={s.tools} />
                  </div>
                  <div>
                    <div className="text-muted-foreground">Risks</div>
                    <List items={s.risks} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>
        <Section title="Success metrics"><List items={data.success_metrics} /></Section>
      </div>
    );
  }
  if (agent === "risk") {
    const score = Number(data.risk_score ?? 0);
    const color =
      score >= 70 ? "text-destructive" : score >= 40 ? "text-warning" : "text-primary";
    return (
      <div>
        <Section title="Risk Score">
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold font-mono ${color}`}>{score}</div>
            <div className="flex-1 h-2 rounded bg-secondary overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${Math.min(100, score)}%`,
                  background:
                    score >= 70
                      ? "var(--destructive)"
                      : score >= 40
                        ? "var(--warning)"
                        : "var(--primary)",
                }}
              />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {data.verdict}
            </div>
          </div>
        </Section>
        <Section title="Red Flags"><List items={data.red_flags} /></Section>
        <Section title="Notes">{data.notes}</Section>
      </div>
    );
  }
  return <pre className="text-xs font-mono overflow-auto">{JSON.stringify(data, null, 2)}</pre>;
}

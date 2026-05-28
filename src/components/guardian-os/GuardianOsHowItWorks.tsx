import * as React from "react";
import { ShieldCheck, Sparkles, Terminal, Zap } from "lucide-react";

const STEPS = [
  {
    num: "1",
    title: "You Input",
    body: "Provide a question, document, or objective in natural language.",
    icon: Terminal,
    color: "text-scanner",
    borderBg: "border-scanner/20 bg-scanner/5",
  },
  {
    num: "2",
    title: "Routed to Agents",
    body: "Guardian OS analyzes and routes to the best specialized AI agents.",
    icon: Zap,
    color: "text-analyst",
    borderBg: "border-analyst/20 bg-analyst/5",
  },
  {
    num: "3",
    title: "Multi-Agent Analysis",
    body: "Agents work in parallel to research, validate, and generate insights.",
    icon: Sparkles,
    color: "text-strategy",
    borderBg: "border-strategy/20 bg-strategy/5",
  },
  {
    num: "4",
    title: "Structured Output",
    body: "You receive a clear, structured output for faster decisions and actions.",
    icon: ShieldCheck,
    color: "text-risk",
    borderBg: "border-risk/20 bg-risk/5",
  },
];

export function GuardianOsHowItWorks() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto mobile-scrollbar">
      <div className="flex-1 px-5 pb-4">
        <div className="pt-2">
          <h1 className="text-[14px] font-bold text-white tracking-wide">
            How Guardian OS Works
          </h1>
          <p className="mt-1 text-[10px] text-[#aeb4c7] font-mono leading-relaxed">
            Multi-agent intelligence. Structured output.
          </p>
        </div>

        {/* Layered stack illustration */}
        <div className="mt-5 relative mx-auto w-full max-w-[260px] h-[160px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(115,185,255,0.28),transparent_58%)]" />
          <svg viewBox="0 0 260 165" className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="hiw_g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="oklch(0.75 0.14 195)" stopOpacity="0.85" />
                <stop offset="1" stopColor="oklch(0.7 0.17 290)" stopOpacity="0.55" />
              </linearGradient>
              <filter id="hiw_f" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.8" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stacked hexagonal layers */}
            {[
              { cy: 32, rx: 68, ry: 28, o: 0.22 },
              { cy: 52, rx: 60, ry: 25, o: 0.18 },
              { cy: 70, rx: 52, ry: 22, o: 0.14 },
              { cy: 86, rx: 44, ry: 19, o: 0.10 },
            ].map((l, i) => (
              <ellipse
                key={i}
                cx={130}
                cy={l.cy}
                rx={l.rx}
                ry={l.ry}
                fill="none"
                stroke="url(#hiw_g)"
                strokeWidth="1.4"
                opacity={l.o + 0.15}
              />
            ))}

            {/* Connector dashes to outer nodes */}
            {[
              { x1: 35, y1: 100, x2: 100, y2: 62 },
              { x1: 225, y1: 100, x2: 160, y2: 62 },
              { x1: 55, y1: 128, x2: 108, y2: 95 },
              { x1: 205, y1: 128, x2: 152, y2: 95 },
            ].map((l, i) => (
              <line
                key={i}
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="url(#hiw_g)"
                strokeWidth="1.4"
                strokeDasharray="5 5"
                opacity="0.55"
                filter="url(#hiw_f)"
              />
            ))}

            {/* Centre circle */}
            <circle
              cx={130} cy={82}
              r={22}
              fill="oklch(0.09 0.02 256 / 0.88)"
              stroke="oklch(0.75 0.14 195 / 0.55)"
              strokeWidth="1.5"
            />
            <path
              d="M123 80 C125 72, 135 72, 137 80 C139 88, 121 88, 123 80 Z"
              fill="none"
              stroke="url(#hiw_g)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#hiw_f)"
            />

            {/* Outer node dots */}
            {[
              { x: 35, y: 100 }, { x: 225, y: 100 },
              { x: 55, y: 128 }, { x: 205, y: 128 },
            ].map((p, i) => (
              <circle
                key={i}
                cx={p.x} cy={p.y} r="4.5"
                fill="oklch(0.75 0.14 195 / 0.75)"
                filter="url(#hiw_f)"
              />
            ))}
          </svg>
        </div>

        {/* Numbered steps */}
        <div className="mt-5 space-y-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className={`flex items-start gap-3 rounded-2xl border ${s.borderBg} p-4`}
              >
                <div
                  className={`h-8 w-8 rounded-xl border border-current/20 bg-black/30 flex items-center justify-center shrink-0 ${s.color}`}
                >
                  <span className={`text-[11px] font-black font-mono ${s.color}`}>{s.num}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono font-bold text-white">{s.title}</div>
                  <div className="mt-0.5 text-[10px] font-mono text-[#aeb4c7] leading-relaxed">
                    {s.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom banner */}
      <div className="shrink-0 mx-5 mb-6">
        <div className="rounded-2xl bg-[linear-gradient(135deg,oklch(0.75_0.14_195/0.12),oklch(0.7_0.17_290/0.08))] border border-scanner/20 px-5 py-4 text-center">
          <div className="text-[11px] font-bold text-white tracking-wide">
            Built for clarity. Designed for impact.
          </div>
        </div>
      </div>
    </div>
  );
}

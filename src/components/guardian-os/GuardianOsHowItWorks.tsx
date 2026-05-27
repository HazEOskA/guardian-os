import * as React from "react";
import { ArrowRight, ShieldCheck, Sparkles, Terminal, Zap } from "lucide-react";

const STEPS = [
  {
    title: "1. You Input",
    body: "Provide input, scenario, document, or objective in natural language.",
    icon: Terminal,
  },
  {
    title: "2. Route to Agents",
    body: "Guardian OS routes your task to specialized reasoning agents.",
    icon: Zap,
  },
  {
    title: "3. Multi-Agent Analysis",
    body: "Scanner, Analyst, Decision, Strategy & Risk operate in parallel—converging on output.",
    icon: Sparkles,
  },
  {
    title: "4. Structured Output",
    body: "You receive clear results: validated facts, risk flags, and action steps.",
    icon: ShieldCheck,
  },
];

export function GuardianOsHowItWorks() {
  return (
    <div className="px-5 pb-24">
      <div className="pt-4">
        <h1 className="text-[14px] font-bold text-white tracking-wide">How Guardian OS Works</h1>
        <p className="mt-1 text-[10px] text-[#aeb4c7] font-mono leading-relaxed">
          Multi-agent architecture, summarized below.
        </p>
      </div>

      <div className="mt-6 relative">
        {/* Central layered stack */}
        <div className="relative mx-auto w-[210px] h-[170px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(115,185,255,0.30),transparent_60%)]" />
          <svg viewBox="0 0 220 180" className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="how_line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="oklch(0.75 0.14 195)" stopOpacity="0.7" />
                <stop offset="1" stopColor="oklch(0.7 0.17 290)" stopOpacity="0.45" />
              </linearGradient>
              <filter id="how_glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left connectors */}
            <path
              d="M25 110 C55 75, 75 60, 92 52"
              fill="none"
              stroke="url(#how_line)"
              strokeWidth="2"
              strokeDasharray="6 6"
              filter="url(#how_glow)"
            />
            <path
              d="M42 140 C70 120, 80 108, 98 98"
              fill="none"
              stroke="url(#how_line)"
              strokeWidth="1.6"
              strokeDasharray="4 7"
              filter="url(#how_glow)"
              opacity="0.8"
            />

            {/* Right connectors */}
            <path
              d="M195 110 C165 75, 145 60, 128 52"
              fill="none"
              stroke="url(#how_line)"
              strokeWidth="2"
              strokeDasharray="6 6"
              filter="url(#how_glow)"
            />
            <path
              d="M178 140 C150 120, 140 108, 122 98"
              fill="none"
              stroke="url(#how_line)"
              strokeWidth="1.6"
              strokeDasharray="4 7"
              filter="url(#how_glow)"
              opacity="0.8"
            />

            {/* Stack cards */}
            {[
              { y: 42, s: 0.92, o: 0.35, c: "oklch(0.75 0.14 195 / 0.28)" },
              { y: 62, s: 0.86, o: 0.25, c: "oklch(0.7 0.17 290 / 0.24)" },
              { y: 82, s: 0.8, o: 0.22, c: "oklch(0.78 0.16 145 / 0.2)" },
            ].map((layer, idx) => (
              <g key={idx} transform={`translate(110 ${layer.y}) scale(${layer.s})`}>
                <path
                  d="M-55 0 L0 -40 L55 0 L0 40 Z"
                  fill={layer.c}
                  stroke="url(#how_line)"
                  strokeWidth="1.2"
                  opacity={layer.o}
                />
              </g>
            ))}

            {/* Inner icon marker */}
            <g transform="translate(110 85)">
              <circle
                r="20"
                fill="oklch(0.11 0.02 256 / 0.65)"
                stroke="oklch(0.75 0.14 195 / 0.5)"
              />
              <path
                d="M-6 -2 C-4 -8, 4 -8, 6 -2 C8 4, -8 4, -6 -2 Z"
                fill="none"
                stroke="oklch(0.75 0.14 195 / 0.85)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Steps list */}
      <div className="mt-6 space-y-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="relative flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-4"
            >
              <div className="relative mt-0.5">
                <div className="h-10 w-10 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(115,185,255,0.25),transparent_55%)] flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#aeb4c7]" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                  {s.title}
                </div>
                <div className="mt-1 text-[10px] font-mono text-[#aeb4c7] leading-relaxed">
                  {s.body}
                </div>
              </div>
              <div className="ml-auto pt-1 opacity-70">
                <ArrowRight className="h-4 w-4 text-[#5b6170]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

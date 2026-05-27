import * as React from "react";

import { cn } from "@/lib/utils";

export function GuardianOsLogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "w-[126px] h-[126px] sm:w-[140px] sm:h-[140px]",
        className,
      )}
    >
      {/* Outer neon ring */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,oklch(0.75_0.14_195/0.55),transparent_55%),radial-gradient(circle_at_70%_75%,oklch(0.7_0.17_290/0.35),transparent_60%)] blur-[0px] opacity-90" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(115,185,255,0.55),transparent_62%)]" />
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-[10px] rounded-full bg-gradient-to-br from-[#0b1020] via-[#070910] to-[#070810] opacity-90 blur-[0px]" />
      <div className="absolute inset-[26px] rounded-full bg-[#04060c]/90 border border-white/10 backdrop-blur-sm" />

      {/* Stylized “G” */}
      <svg
        viewBox="0 0 120 120"
        className="relative z-[1]"
        width="72"
        height="72"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="go_blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.75 0.14 195)" stopOpacity="1" />
            <stop offset="1" stopColor="oklch(0.78 0.16 145)" stopOpacity="1" />
          </linearGradient>
          <filter id="go_glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ring-ish stroke */}
        <path
          d="M60 28c-18 0-32 14-32 32s14 32 32 32c10 0 19-4.7 25-12.1V60h-26v10h14.7C69.3 75.6 64.9 78 60 78c-10.7 0-18-7.4-18-18s7.3-18 18-18c6 0 11 2.7 14.6 7.3l8.7-6.2C77.5 33.7 69.4 28 60 28Z"
          fill="none"
          stroke="url(#go_blue)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#go_glow)"
        />
      </svg>
    </div>
  );
}


import * as React from "react";

import { cn } from "@/lib/utils";

export function GuardianOsPhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="w-full min-h-screen bg-[#05060a] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Ambient grid background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(30,41,59,0.35),transparent_60%)] bg-[size:28px_28px] opacity-25" />

      {/* Device wrapper */}
      <div
        className={cn(
          "relative w-full h-screen sm:h-[820px] sm:max-w-[400px] sm:rounded-[48px] sm:border-[6px] sm:border-[#1d1e24] bg-[#090a0f]",
          "sm:shadow-[0_0_80px_rgba(0,0,0,0.95),inset_0_0_24px_rgba(255,255,255,0.02)]",
          "overflow-hidden flex flex-col text-foreground font-sans scanlines",
          className,
        )}
      >
        {/* Extra glass glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(115,185,255,0.12),transparent_55%),radial-gradient(circle_at_80%_85%,rgba(180,80,255,0.10),transparent_55%)]" />
        {children}
      </div>
    </div>
  );
}

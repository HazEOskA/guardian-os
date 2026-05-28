import * as React from "react";
import { ChevronRight } from "lucide-react";

import { GuardianOsLogoMark } from "@/components/guardian-os/GuardianOsLogoMark";

export function GuardianOsHome({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-5 pt-20 pb-10">
      {/* Logo + headline */}
      <div className="flex flex-col items-center text-center gap-6">
        <GuardianOsLogoMark />

        <div>
          <h1 className="text-[22px] font-black tracking-tight text-white drop-shadow-[0_0_24px_rgba(115,185,255,0.30)]">
            Guardian OS
          </h1>
          <p className="mt-3 text-[10px] font-mono tracking-[0.13em] text-[#aeb4c7] uppercase leading-loose">
            AI AGENTS. STRUCTURED INTELLIGENCE.
            <br />
            BETTER DECISIONS.
          </p>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-4 rounded-full bg-scanner" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>

      {/* CTA */}
      <div className="w-full flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full max-w-[320px] rounded-2xl bg-[linear-gradient(135deg,oklch(0.75_0.14_195/1),oklch(0.7_0.17_290/1),oklch(0.78_0.16_145/1))] p-[1px] shadow-[0_0_34px_rgba(115,185,255,0.25)]"
        >
          <div className="rounded-[16px] bg-[#05060a] px-4 py-4 flex items-center justify-between">
            <span className="text-[12px] font-black uppercase tracking-[0.18em] text-white">
              Get Started
            </span>
            <ChevronRight className="h-4 w-4 text-white/90" />
          </div>
        </button>

        <div className="text-[9px] font-mono tracking-[0.14em] text-[#525666] uppercase">
          Secure. Private. Built for High-Stakes Decisions.
        </div>
      </div>
    </div>
  );
}

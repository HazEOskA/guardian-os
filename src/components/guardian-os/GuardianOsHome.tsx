import * as React from "react";
import { ChevronRight } from "lucide-react";

import { GuardianOsLogoMark } from "@/components/guardian-os/GuardianOsLogoMark";

export function GuardianOsHome({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-5 pt-20 pb-10">
      <div className="flex flex-col items-center">
        <GuardianOsLogoMark />

        <div className="mt-6 text-center">
          <h1 className="text-[18px] font-black tracking-[0.16em] text-white drop-shadow-[0_0_20px_rgba(115,185,255,0.25)]">
            Guardian OS
          </h1>
          <p className="mt-2 text-[10px] font-mono tracking-[0.14em] text-[#aeb4c7] uppercase">
            AI OPERATING LAYER
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-[rgba(0,0,0,0.22)] backdrop-blur-md p-4 w-full max-w-[340px]">
            <div className="text-[10px] font-mono text-[#aeb4c7] uppercase tracking-wider">
              SECURE CORE
            </div>
            <div className="mt-2 text-[11px] font-mono text-white/90 leading-relaxed">
              Private. Verifiable. Built for high-stakes decisions.
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-[#aeb4c7] uppercase tracking-wider">
                  STATUS
                </span>
                <span className="text-[9px] font-mono text-scanner uppercase tracking-wider">
                  READY
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-[#aeb4c7] uppercase tracking-wider">
                  MODE
                </span>
                <span className="text-[9px] font-mono text-strategy uppercase tracking-wider">
                  MULTI-AGENT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

        <div className="text-center">
          <div className="text-[9px] font-mono tracking-[0.14em] text-[#525666] uppercase">
            Secure • Private • Built for High-Stakes Decisions
          </div>
        </div>
      </div>
    </div>
  );
}


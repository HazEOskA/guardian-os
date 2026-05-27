import * as React from "react";
import { Bell, CircleHelp, Grid2X2, Menu, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export function GuardianOsTopBar({
  className,
  variant,
  onBack,
  onMenu,
  onHow,
  onAgents,
}: {
  className?: string;
  variant: "workspace" | "learn" | "agents" | "home";
  onBack?: () => void;
  onMenu?: () => void;
  onHow?: () => void;
  onAgents?: () => void;
}) {
  const showBack = variant === "learn" || variant === "agents";

  return (
    <header
      className={cn(
        "px-5 pt-6 pb-3 flex items-center justify-between",
        "text-[10px] font-mono tracking-widest text-[#525666]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-400" />
          </button>
        ) : (
          <button
            onClick={onMenu}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4 text-neutral-400" />
          </button>
        )}
        {variant === "workspace" && (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-black/30">
              <span className="text-[9px] font-black text-white tracking-wider">G</span>
            </span>
            <span className="text-[#aeb4c7] tracking-widest">GUARDIAN OS</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Right-side action icons to match the screenshot chrome */}
        {variant === "workspace" && (
          <>
            <button
              onClick={onAgents}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Agents"
            >
              <Bell className="h-4 w-4 text-neutral-400" />
            </button>
            <button
              onClick={onHow}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="How it works"
            >
              <CircleHelp className="h-4 w-4 text-neutral-400" />
            </button>
          </>
        )}

        {(variant === "learn" || variant === "agents") && (
          <button className="p-1 rounded-lg hover:bg-white/5 transition-colors" aria-label="More">
            <Grid2X2 className="h-4 w-4 text-neutral-400" />
          </button>
        )}
      </div>
    </header>
  );
}

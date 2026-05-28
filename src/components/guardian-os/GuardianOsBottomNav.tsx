import * as React from "react";
import { Bot, Grid2X2, Home, Plus, User } from "lucide-react";

import { cn } from "@/lib/utils";

export type NavTab = "home" | "workspaces" | "new" | "agents" | "profile";

export function GuardianOsBottomNav({
  active,
  onTab,
}: {
  active: NavTab;
  onTab: (tab: NavTab) => void;
}) {
  return (
    <nav className="shrink-0 border-t border-white/[0.06] bg-[#07080d]/95 backdrop-blur-md px-2 pt-2 pb-4 flex items-center justify-around">
      <NavBtn tab="home" icon={Home} label="Home" active={active} onTab={onTab} />
      <NavBtn tab="workspaces" icon={Grid2X2} label="Workspaces" active={active} onTab={onTab} />

      {/* Centre + button */}
      <button
        type="button"
        onClick={() => onTab("new")}
        className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.14_195)] to-[oklch(0.7_0.17_290)] flex items-center justify-center shadow-[0_0_22px_oklch(0.75_0.14_195/0.45)] -mt-4"
        aria-label="New analysis"
      >
        <Plus className="h-5 w-5 text-white" />
      </button>

      <NavBtn tab="agents" icon={Bot} label="Agents" active={active} onTab={onTab} />
      <NavBtn tab="profile" icon={User} label="Profile" active={active} onTab={onTab} />
    </nav>
  );
}

function NavBtn({
  tab,
  icon: Icon,
  label,
  active,
  onTab,
}: {
  tab: NavTab;
  icon: React.ElementType;
  label: string;
  active: NavTab;
  onTab: (tab: NavTab) => void;
}) {
  const isActive = active === tab;
  return (
    <button
      type="button"
      onClick={() => onTab(tab)}
      className="flex flex-col items-center gap-0.5 px-4 py-0.5"
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          isActive ? "text-scanner" : "text-[#525666]",
        )}
      />
      <span
        className={cn(
          "text-[8px] font-mono uppercase tracking-wider transition-colors",
          isActive ? "text-scanner" : "text-[#525666]",
        )}
      >
        {label}
      </span>
    </button>
  );
}

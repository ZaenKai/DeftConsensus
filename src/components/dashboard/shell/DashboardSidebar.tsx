"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GridIcon,
  LogoMarkIcon,
  MessageIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "@/components/landing/icons";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { useDashboardContext } from "./DashboardContext";

const sharedNavItems = [
  { href: "/dashboard", label: "My Work", Icon: RouteIcon },
  { href: "/projects", label: "Companies & Projects", Icon: GridIcon },
  { href: "/inbox", label: "Inbox", Icon: MessageIcon },
] as const;

type ThemeMode = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const THEME_KEY = "deftconsensus-theme";

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }
  const resolvedTheme = mode === "system" ? resolveSystemTheme() : mode;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.setAttribute("data-theme-mode", mode);
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function DashboardSidebar() {
  const pathname = usePathname() ?? "";
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const { isCompanyAdmin } = useDashboardContext();
  const isNavActive = (href: string) => {
    if (href === "/projects") {
      return pathname.startsWith("/projects");
    }
    return pathname === href;
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const initialMode: ThemeMode =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "light";
    setThemeMode(initialMode);
    applyTheme(initialMode);

    if (typeof window.matchMedia !== "function") {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      const activeMode = (window.localStorage.getItem(THEME_KEY) as ThemeMode) ?? "light";
      if (activeMode === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", handleSystemThemeChange);
    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    window.localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
  };

  return (
    <aside className="mb-4 lg:mb-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <div className="dashboard-panel h-full">
        <div className="flex h-full flex-col gap-6 p-4 sm:p-5">
          <header className="space-y-3">
            <span className="dashboard-chip w-fit">
              <LogoMarkIcon className="h-3.5 w-3.5 text-primary" />
              Workspace
            </span>
            <h2 className="font-heading text-xl font-bold tracking-tight">deftConsensus</h2>
            <p className="text-xs text-muted">Primary navigation for work surfaces and triage routes.</p>
          </header>

          <nav aria-label="Dashboard navigation" className="space-y-2">
            {sharedNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="dashboard-nav-link flex items-center gap-2.5 text-sm font-medium"
                data-active={isNavActive(item.href) ? "true" : "false"}
              >
                <item.Icon className="h-4 w-4 text-primary" />
                {item.label}
              </Link>
            ))}
            {isCompanyAdmin ? (
              <Link
                href="/admin/company"
                className="dashboard-nav-link flex items-center gap-2.5 text-sm font-semibold"
                data-active={pathname.startsWith("/admin") ? "true" : "false"}
              >
                <ShieldCheckIcon className="h-4 w-4 text-primary" />
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="dashboard-subcard mt-auto p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Theme</p>
            <div className="mt-2">
              <ThemeToggle value={themeMode} onChange={handleThemeChange} />
            </div>
          </div>

          <div className="dashboard-subcard p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Flow Principle</p>
            <p className="mt-1 text-xs text-muted">
              Keep navigation predictable and context visible to reduce cognitive switching cost.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

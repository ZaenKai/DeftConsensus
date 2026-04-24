"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
  Separator,
} from "@deftai/deft-components";
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

export function DashboardSidebar() {
  const pathname = usePathname() ?? "";
  const { isCompanyAdmin } = useDashboardContext();
  const isNavActive = (href: string) => {
    if (href === "/projects") {
      return pathname.startsWith("/projects");
    }
    return pathname === href;
  };

  return (
    <aside className="mb-4 lg:mb-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <Card className="flex h-full flex-col">
        <CardHeader className="gap-3">
          <Badge variant="outline" className="w-fit">
            <LogoMarkIcon className="h-3.5 w-3.5" />
            Workspace
          </Badge>
          <CardTitle className="text-xl">deftConsensus</CardTitle>
          <CardDescription>
            Primary navigation for work surfaces and triage routes.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-6">
          <ScrollArea className="flex-1">
            <nav aria-label="Dashboard navigation" className="space-y-1">
              {sharedNavItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/20 hover:text-foreground",
                    ].join(" ")}
                  >
                    <item.Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              {isCompanyAdmin ? (
                <Link
                  href="/admin/company"
                  aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                  className={[
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/20 hover:text-foreground",
                  ].join(" ")}
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                  Admin
                </Link>
              ) : null}
            </nav>
          </ScrollArea>

          <Separator />

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Theme
            </p>
            <ThemeToggle />
          </div>

          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Flow Principle
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep navigation predictable and context visible to reduce cognitive switching cost.
            </p>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

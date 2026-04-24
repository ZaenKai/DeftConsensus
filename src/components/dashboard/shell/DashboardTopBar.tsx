"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Badge,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@deftai/deft-components";
import { MessageIcon, UsersIcon } from "@/components/landing/icons";
import { dashboardMock, getUnreadInboxCount } from "@/mocks/dashboard";
import { useDashboardContext } from "./DashboardContext";

type ParsedFeatureRoute = {
  companyId?: string;
  projectId: string;
  featureId: string;
};

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const featureStatusVariant: Record<string, BadgeVariant> = {
  Proposed: "info",
  "In Discussion": "accent",
  "Consensus Locked": "success",
  "In Build": "info",
  "In Verification": "warning",
  Blocked: "destructive",
  Done: "success",
};

function getStatusVariant(status?: string): BadgeVariant {
  if (!status) return "outline";
  return featureStatusVariant[status] ?? "outline";
}

function parseFeatureRoute(pathname: string): ParsedFeatureRoute | null {
  const segments = pathname.split("?")[0]?.split("/").filter(Boolean) ?? [];
  const featureTokenIndex = segments.lastIndexOf("features");
  if (featureTokenIndex < 0 || featureTokenIndex + 1 >= segments.length) {
    return null;
  }

  if (featureTokenIndex < 2 || segments[featureTokenIndex - 2] !== "projects") {
    return null;
  }

  const featureId = segments[featureTokenIndex + 1];
  const projectId = segments[featureTokenIndex - 1];
  const companyId =
    featureTokenIndex >= 4 && segments[featureTokenIndex - 4] === "companies"
      ? segments[featureTokenIndex - 3]
      : undefined;

  return {
    companyId,
    projectId,
    featureId,
  };
}

export function DashboardTopBar() {
  const pathname = usePathname() ?? "";
  const {
    user,
    companies,
    selectedCompany,
    selectedCompanyId,
    selectedProject,
    selectedProjectId,
    availableProjects,
    setSelectedCompanyId,
    setSelectedProjectId,
    features,
    inboxEvents,
    markInboxEventRead,
  } = useDashboardContext();

  const scopedEvents = inboxEvents.filter((event) => event.companyId === selectedCompany.id);
  const unreadCount = getUnreadInboxCount(scopedEvents);
  const featureRoute = parseFeatureRoute(pathname);
  const routeProject = featureRoute
    ? dashboardMock.projects.find((project) => project.id === featureRoute.projectId)
    : undefined;
  const routeCompanyId = featureRoute?.companyId ?? routeProject?.companyId;
  const routeCompany = routeCompanyId
    ? dashboardMock.companies.find((company) => company.id === routeCompanyId)
    : undefined;
  const routeFeature = featureRoute
    ? features.find(
        (feature) =>
          feature.id === featureRoute.featureId &&
          feature.projectId === featureRoute.projectId,
      ) ??
      dashboardMock.features.find(
        (feature) =>
          feature.id === featureRoute.featureId &&
          feature.projectId === featureRoute.projectId,
      )
    : undefined;
  const isFeatureRoute = Boolean(featureRoute && routeProject && routeFeature);
  const headingLabel = isFeatureRoute ? routeFeature?.name ?? "Feature" : selectedProject?.name ?? "Select a project";
  const contextLabel = `${selectedCompany.name}${selectedProject ? ` / ${selectedProject.name}` : ""}`;
  const featureStatusLabel = isFeatureRoute ? routeFeature?.status : undefined;

  return (
    <header className="sticky top-2 z-20">
      <Card className="px-3 py-2 sm:px-4 lg:px-5">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline">
                  {isFeatureRoute ? "Feature context" : "Active context"}
                </Badge>
                {isFeatureRoute && routeProject && routeFeature ? (
                  <nav aria-label="Feature route breadcrumb" className="min-w-0">
                    <ol className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                      <li>
                        <Link
                          href="/dashboard"
                          className="font-medium text-accent hover:underline"
                          onClick={() => {
                            if (routeCompany?.id) {
                              setSelectedCompanyId(routeCompany.id);
                            }
                          }}
                        >
                          {routeCompany?.name ?? "Company"}
                        </Link>
                      </li>
                      <li aria-hidden>/</li>
                      <li>
                        <Link
                          href={`/projects/${routeProject.id}`}
                          className="font-medium text-accent hover:underline"
                          onClick={() => {
                            setSelectedCompanyId(routeProject.companyId);
                          }}
                        >
                          {routeProject.name}
                        </Link>
                      </li>
                      <li aria-hidden>/</li>
                      <li className="truncate">{routeFeature.name}</li>
                    </ol>
                  </nav>
                ) : (
                  <p className="truncate text-[11px] text-muted-foreground">{contextLabel}</p>
                )}
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <h1 className="max-w-[42rem] truncate text-lg font-semibold tracking-tight sm:text-xl">
                  {headingLabel}
                </h1>
                {featureStatusLabel ? (
                  <Badge variant={getStatusVariant(featureStatusLabel)}>{featureStatusLabel}</Badge>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent/20 hover:text-foreground"
                >
                  <MessageIcon className="h-3.5 w-3.5" />
                  Notifications
                  {unreadCount > 0 ? (
                    <Badge variant="accent" size="sm" className="ml-1 min-w-5 justify-center">
                      {unreadCount}
                    </Badge>
                  ) : null}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Quick triage</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {scopedEvents.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      No notifications for this company.
                    </div>
                  ) : (
                    scopedEvents.slice(0, 5).map((event) => (
                      <DropdownMenuItem key={event.id} asChild className="flex-col items-start gap-1">
                        <Link href={event.href} className="w-full">
                          <span className="block text-sm font-medium">{event.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            {event.threadPreview}
                          </span>
                          <span className="mt-1 flex w-full items-center justify-between">
                            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              {event.unread ? "Unread" : "Seen"}
                            </span>
                            {event.unread ? (
                              <button
                                type="button"
                                className="text-xs font-semibold text-accent"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  markInboxEventRead(event.id);
                                }}
                              >
                                Mark read
                              </button>
                            ) : null}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/inbox" className="w-full text-sm font-semibold">
                      Open full inbox
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent/20 hover:text-foreground"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
                    {user.avatarInitials}
                  </span>
                  <span className="hidden sm:inline">{user.name}</span>
                  <UsersIcon className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.title}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings/profile" className="w-full text-sm font-semibold">
                      Open profile settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {!isFeatureRoute ? (
            <div className="mt-2 grid gap-1.5 sm:max-w-3xl sm:grid-cols-2">
              <label className="space-y-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                Company
                <select
                  id="topbar-company-switcher"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm normal-case tracking-normal text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCompanyId}
                  onChange={(event) => setSelectedCompanyId(event.target.value)}
                  aria-label="Company"
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name} ({company.membershipRole})
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                Project
                <select
                  id="topbar-project-switcher"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm normal-case tracking-normal text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedProjectId}
                  onChange={(event) => setSelectedProjectId(event.target.value)}
                  aria-label="Project"
                >
                  {availableProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </header>
  );
}

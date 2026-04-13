"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageIcon, UsersIcon } from "@/components/landing/icons";
import { dashboardMock, getUnreadInboxCount } from "@/mocks/dashboard";
import { useDashboardContext } from "./DashboardContext";

type ParsedFeatureRoute = {
  companyId?: string;
  projectId: string;
  featureId: string;
};

const featureStatusAccentClass: Record<string, string> = {
  Proposed: "border-sky-400/45 bg-sky-500/12 text-sky-700 dark:text-sky-300",
  "In Discussion": "border-violet-400/45 bg-violet-500/14 text-violet-700 dark:text-violet-300",
  "Consensus Locked": "border-emerald-400/45 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  "In Build": "border-indigo-400/45 bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
  "In Verification": "border-amber-400/55 bg-amber-500/14 text-amber-700 dark:text-amber-300",
  Blocked: "border-rose-400/55 bg-rose-500/14 text-rose-700 dark:text-rose-300",
  Done: "border-teal-400/45 bg-teal-500/12 text-teal-700 dark:text-teal-300",
};

function getStatusChipClass(status?: string): string {
  if (!status) {
    return "";
  }
  return featureStatusAccentClass[status] ?? "border-primary/45 bg-primary/12 text-primary";
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
      <div className="dashboard-panel px-3 py-2 sm:px-4 lg:px-5">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="dashboard-chip">{isFeatureRoute ? "Feature context" : "Active context"}</span>
              {isFeatureRoute && routeProject && routeFeature ? (
                <nav aria-label="Feature route breadcrumb" className="min-w-0">
                  <ol className="flex flex-wrap items-center gap-1 text-[11px] text-muted">
                    <li>
                      <Link
                        href="/dashboard"
                        className="font-medium text-primary hover:underline"
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
                        className="font-medium text-primary hover:underline"
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
                <p className="truncate text-[11px] text-muted">{contextLabel}</p>
              )}
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <h1 className="max-w-[42rem] truncate font-heading text-lg font-semibold tracking-tight sm:text-xl">
                {headingLabel}
              </h1>
              {featureStatusLabel ? (
                <span className={`dashboard-chip ${getStatusChipClass(featureStatusLabel)}`}>{featureStatusLabel}</span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <details className="relative">
              <summary className="dashboard-nav-link flex h-8 min-h-0 list-none cursor-pointer items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium marker:content-['']">
                <MessageIcon className="h-3.5 w-3.5 text-primary" />
                Notifications
                {unreadCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-80 rounded-neu border border-surfaceEdge/70 bg-surface/95 p-3 shadow-neu backdrop-blur-md">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Quick triage</p>
                {scopedEvents.length === 0 ? (
                  <p className="text-sm text-muted">No notifications for this company.</p>
                ) : (
                  <ul className="space-y-2">
                    {scopedEvents.slice(0, 5).map((event) => (
                      <li key={event.id} className="dashboard-subcard p-2.5">
                        <Link href={event.href} className="block text-sm font-medium text-text hover:text-primary">
                          {event.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted">{event.threadPreview}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-wide text-muted">
                            {event.unread ? "Unread" : "Seen"}
                          </span>
                          {event.unread ? (
                            <button
                              type="button"
                              className="text-xs font-semibold text-primary"
                              onClick={() => markInboxEventRead(event.id)}
                            >
                              Mark read
                            </button>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/inbox" className="mt-3 inline-flex text-sm font-semibold text-primary">
                  Open full inbox
                </Link>
              </div>
            </details>

            <details className="relative">
              <summary className="dashboard-nav-link flex h-8 min-h-0 list-none cursor-pointer items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium marker:content-['']">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                  {user.avatarInitials}
                </span>
                <span className="hidden sm:inline">{user.name}</span>
                <UsersIcon className="h-3.5 w-3.5 text-primary" />
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-72 rounded-neu border border-surfaceEdge/70 bg-surface/95 p-3 shadow-neu backdrop-blur-md">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted">{user.email}</p>
                <p className="mt-1 text-xs text-muted">{user.title}</p>
                <Link href="/settings/profile" className="mt-3 inline-flex text-sm font-semibold text-primary">
                  Open profile settings
                </Link>
              </div>
            </details>
          </div>
        </div>
        {!isFeatureRoute ? (
          <div className="mt-2 grid gap-1.5 sm:max-w-3xl sm:grid-cols-2">
            <label className="space-y-1 text-[11px] uppercase tracking-wide text-muted">
              Company
              <select
                id="topbar-company-switcher"
                className="dashboard-control h-9 min-h-0 text-sm normal-case tracking-normal"
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
            <label className="space-y-1 text-[11px] uppercase tracking-wide text-muted">
              Project
              <select
                id="topbar-project-switcher"
                className="dashboard-control h-9 min-h-0 text-sm normal-case tracking-normal"
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
      </div>
    </header>
  );
}

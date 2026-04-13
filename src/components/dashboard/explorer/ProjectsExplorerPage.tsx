"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  type DashboardProject,
  type ExplorerFilter,
  type ExplorerSort,
  type ExplorerView,
  dashboardMock,
  filterAndSortProjects,
  getProjectStatusSummary,
} from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

function ProjectRow({
  project,
  onEnterProject,
}: {
  project: DashboardProject;
  onEnterProject: (project: DashboardProject) => void;
}) {
  const { features } = useDashboardContext();
  const summary = getProjectStatusSummary(project.id, features);

  return (
    <article className="surface-card p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`/projects/${project.id}`}
            className="font-heading text-lg font-semibold text-text hover:text-primary"
            onClick={() => onEnterProject(project)}
          >
            {project.name}
          </Link>
          <p className="mt-1 text-sm text-muted">{project.description}</p>
        </div>
        <p className="text-xs uppercase tracking-wide text-muted">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="dashboard-chip">Blocked: {summary.Blocked}</span>
        <span className="dashboard-chip">In Build: {summary["In Build"]}</span>
        <span className="dashboard-chip">Done: {summary.Done}</span>
      </div>
    </article>
  );
}

export function ProjectsExplorerPage() {
  const searchParams = useSearchParams();
  const uiState = searchParams.get("state");
  const isLoading = uiState === "loading";
  const isError = uiState === "error";
  const forceEmpty = uiState === "empty";

  const { companies, features, setSelectedCompanyId, setSelectedProjectId } = useDashboardContext();
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<ExplorerSort>("updated-desc");
  const [filterBy, setFilterBy] = useState<ExplorerFilter>("all");
  const [viewMode, setViewMode] = useState<ExplorerView>("grouped");
  const [expandedCompanyIds, setExpandedCompanyIds] = useState<Record<string, boolean>>(
    Object.fromEntries(companies.map((company) => [company.id, true])),
  );

  const filteredProjects = useMemo(() => {
    const source = forceEmpty ? [] : dashboardMock.projects;
    return filterAndSortProjects(source, features, {
      search: searchValue,
      filter: filterBy,
      sort: sortBy,
    });
  }, [features, filterBy, forceEmpty, searchValue, sortBy]);

  const groupedResults = useMemo(
    () =>
      companies.map((company) => ({
        company,
        projects: filteredProjects.filter((project) => project.companyId === company.id),
      })),
    [companies, filteredProjects],
  );

  const handleEnterProject = (project: DashboardProject) => {
    setSelectedCompanyId(project.companyId);
    setSelectedProjectId(project.id);
  };

  const hasResults = filteredProjects.length > 0;

  return (
    <div className="space-y-7">
      <section aria-labelledby="projects-explorer-title">
        <span className="dashboard-chip">Companies & Projects</span>
        <h2 id="projects-explorer-title" className="mt-1 font-heading text-3xl font-bold tracking-tight">
          Shared workspace explorer
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Locate shared company projects quickly, then jump into summary dashboards for triage and lightweight actions.
        </p>
      </section>

      {isError ? (
        <section className="dashboard-subcard border-danger/40 bg-danger/10 p-4">
          <h3 className="font-heading text-lg font-semibold text-danger">Explorer unavailable</h3>
          <p className="mt-1 text-sm text-muted">Retry loading the route or clear active filters.</p>
        </section>
      ) : null}

      <section className="surface-card p-4" aria-label="Explorer controls">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Search</span>
            <input
              className="dashboard-control text-sm"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search project name"
              aria-label="Search projects"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Sort</span>
            <select
              className="dashboard-control text-sm"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as ExplorerSort)}
              aria-label="Sort projects"
            >
              <option value="updated-desc">Recently updated</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Filter</span>
            <select
              className="dashboard-control text-sm"
              value={filterBy}
              onChange={(event) => setFilterBy(event.target.value as ExplorerFilter)}
              aria-label="Filter projects"
            >
              <option value="all">All</option>
              <option value="needs-attention">Needs attention</option>
              <option value="recently-updated">Recently updated (48h)</option>
            </select>
          </label>
          <div className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">View</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`dashboard-nav-link px-3 py-2 text-sm ${
                  viewMode === "grouped" ? "border-primary/45 bg-primary/12 text-primary" : "text-muted"
                }`}
                onClick={() => setViewMode("grouped")}
              >
                Grouped
              </button>
              <button
                type="button"
                className={`dashboard-nav-link px-3 py-2 text-sm ${
                  viewMode === "flat" ? "border-primary/45 bg-primary/12 text-primary" : "text-muted"
                }`}
                onClick={() => setViewMode("flat")}
              >
                Flat
              </button>
            </div>
          </div>
        </div>
        <p aria-live="polite" className="mt-3 text-xs uppercase tracking-wide text-muted">
          {isLoading ? "Loading project results…" : `${filteredProjects.length} result(s)`}
        </p>
      </section>

      {isLoading ? (
        <section className="grid gap-3">
          {[1, 2, 3].map((item) => (
            <article key={item} className="surface-card p-4 text-sm text-muted">
              Loading project rows…
            </article>
          ))}
        </section>
      ) : !hasResults ? (
        <section className="dashboard-subcard p-5 text-sm text-muted">No projects match the current search and filters.</section>
      ) : viewMode === "flat" ? (
        <section className="grid gap-3">
          {filteredProjects.map((project) => (
            <ProjectRow key={project.id} project={project} onEnterProject={handleEnterProject} />
          ))}
        </section>
      ) : (
        <section className="space-y-4">
          {groupedResults.map(({ company, projects }) => (
            <article key={company.id} className="surface-card p-4 md:p-5">
              <button
                type="button"
                className="dashboard-subcard flex w-full items-center justify-between px-3 py-2 text-left"
                onClick={() =>
                  setExpandedCompanyIds((current) => ({
                    ...current,
                    [company.id]: !current[company.id],
                  }))
                }
                aria-expanded={expandedCompanyIds[company.id] ?? true}
              >
                <span className="font-heading text-xl font-semibold">{company.name}</span>
                <span className="text-xs uppercase tracking-wide text-muted">{projects.length} project(s)</span>
              </button>

              {(expandedCompanyIds[company.id] ?? true) ? (
                projects.length === 0 ? (
                  <p className="dashboard-subcard mt-3 px-3 py-2 text-sm text-muted">No matching projects in this company.</p>
                ) : (
                  <div className="mt-3 grid gap-3">
                    {projects.map((project) => (
                      <ProjectRow key={project.id} project={project} onEnterProject={handleEnterProject} />
                    ))}
                  </div>
                )
              ) : null}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

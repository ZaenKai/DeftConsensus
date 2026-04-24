"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Card,
  CardContent,
  Input,
  SegmentedControl,
  SegmentedControlItem,
} from "@deftai/deft-components";
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

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

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
    <Card>
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              href={`/projects/${project.id}`}
              className="text-lg font-semibold text-foreground hover:text-accent"
              onClick={() => onEnterProject(project)}
            >
              {project.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">Blocked: {summary.Blocked}</Badge>
          <Badge variant="outline">In Build: {summary["In Build"]}</Badge>
          <Badge variant="outline">Done: {summary.Done}</Badge>
        </div>
      </CardContent>
    </Card>
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
        <Badge variant="outline">Companies & Projects</Badge>
        <h2 id="projects-explorer-title" className="mt-1 text-3xl font-bold tracking-tight">
          Shared workspace explorer
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Locate shared company projects quickly, then jump into summary dashboards for triage and lightweight actions.
        </p>
      </section>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Explorer unavailable</AlertTitle>
          <AlertDescription>Retry loading the route or clear active filters.</AlertDescription>
        </Alert>
      ) : null}

      <Card aria-label="Explorer controls">
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-1 text-sm">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Search</span>
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search project name"
                aria-label="Search projects"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Sort</span>
              <select
                className={selectClassName}
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
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Filter</span>
              <select
                className={selectClassName}
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
              <span className="text-xs uppercase tracking-wide text-muted-foreground">View</span>
              <SegmentedControl
                value={viewMode}
                onValueChange={(value) => setViewMode(value as ExplorerView)}
                size="sm"
                aria-label="Explorer view"
              >
                <SegmentedControlItem value="grouped">Grouped</SegmentedControlItem>
                <SegmentedControlItem value="flat">Flat</SegmentedControlItem>
              </SegmentedControl>
            </div>
          </div>
          <p aria-live="polite" className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
            {isLoading ? "Loading project results…" : `${filteredProjects.length} result(s)`}
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <section className="grid gap-3">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="p-4 text-sm text-muted-foreground">
                Loading project rows…
              </CardContent>
            </Card>
          ))}
        </section>
      ) : !hasResults ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            No projects match the current search and filters.
          </CardContent>
        </Card>
      ) : viewMode === "flat" ? (
        <section className="grid gap-3">
          {filteredProjects.map((project) => (
            <ProjectRow key={project.id} project={project} onEnterProject={handleEnterProject} />
          ))}
        </section>
      ) : (
        <section className="space-y-4">
          {groupedResults.map(({ company, projects }) => (
            <Card key={company.id}>
              <CardContent className="p-4 md:p-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-left"
                  onClick={() =>
                    setExpandedCompanyIds((current) => ({
                      ...current,
                      [company.id]: !current[company.id],
                    }))
                  }
                  aria-expanded={expandedCompanyIds[company.id] ?? true}
                >
                  <span className="text-xl font-semibold">{company.name}</span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {projects.length} project(s)
                  </span>
                </button>

                {(expandedCompanyIds[company.id] ?? true) ? (
                  projects.length === 0 ? (
                    <p className="mt-3 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                      No matching projects in this company.
                    </p>
                  ) : (
                    <div className="mt-3 grid gap-3">
                      {projects.map((project) => (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          onEnterProject={handleEnterProject}
                        />
                      ))}
                    </div>
                  )
                ) : null}
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}

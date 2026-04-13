"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  FEATURE_STATUS_ORDER,
  dashboardMock,
  getProjectStatusSummary,
  groupFeaturesByStatus,
} from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

export function ProjectSummaryPage() {
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const uiState = searchParams.get("state");
  const isLoading = uiState === "loading";
  const isError = uiState === "error";
  const forceEmpty = uiState === "empty";

  const {
    features,
    selectedProject,
    updateFeature,
    setSelectedCompanyId,
    setSelectedProjectId,
  } = useDashboardContext();

  const project = dashboardMock.projects.find((item) => item.id === params.projectId);

  useEffect(() => {
    if (!project) {
      return;
    }
    setSelectedCompanyId(project.companyId);
    setSelectedProjectId(project.id);
  }, [project, setSelectedCompanyId, setSelectedProjectId]);

  const ownerOptions = Array.from(new Set(dashboardMock.features.map((feature) => feature.owner)));

  if (!project || isError) {
    return (
      <section className="dashboard-subcard border-danger/40 bg-danger/10 p-5">
        <h2 className="font-heading text-2xl font-bold text-danger">Project summary unavailable</h2>
        <p className="mt-2 text-sm text-muted">
          The project could not be resolved in the current mock data context.
        </p>
        <Link href="/projects" className="mt-3 inline-flex text-sm font-semibold text-primary">
          Return to project explorer
        </Link>
      </section>
    );
  }


  const scopedFeatures = forceEmpty ? [] : features.filter((feature) => feature.projectId === project.id);
  const grouped = groupFeaturesByStatus(scopedFeatures);
  const summary = getProjectStatusSummary(project.id, scopedFeatures);
  const totalFeatures = scopedFeatures.length;

  return (
    <div className="space-y-7">
      <section aria-labelledby="project-summary-title">
        <span className="dashboard-chip">Project Dashboard</span>
        <h2 id="project-summary-title" className="mt-1 font-heading text-3xl font-bold tracking-tight">
          {project.name}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">{project.description}</p>
      </section>

      <section aria-label="Project summary metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Total Features</p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">{isLoading ? "…" : totalFeatures}</p>
        </article>
        <article className="surface-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-muted">In Build</p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">{isLoading ? "…" : summary["In Build"]}</p>
        </article>
        <article className="surface-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-muted">In Verification</p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">
            {isLoading ? "…" : summary["In Verification"]}
          </p>
        </article>
        <article className="surface-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Blocked</p>
          <p className="mt-2 font-heading text-3xl font-bold text-danger">{isLoading ? "…" : summary.Blocked}</p>
        </article>
      </section>

      <section className="space-y-5" aria-label="Status grouped feature summaries">
        {FEATURE_STATUS_ORDER.map((status) => (
          <article key={status} className="surface-card p-4 md:p-5" aria-labelledby={`status-${status}`}>
            <div className="flex items-center justify-between gap-3">
              <h3 id={`status-${status}`} className="font-heading text-xl font-semibold">
                {status}
              </h3>
              <span className="dashboard-chip">{grouped[status].length} item(s)</span>
            </div>

            {isLoading ? (
              <p className="mt-3 text-sm text-muted">Loading status group…</p>
            ) : grouped[status].length === 0 ? (
              <p className="dashboard-subcard mt-3 px-3 py-2 text-sm text-muted">No features in this status.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {grouped[status].map((feature) => (
                  <li key={feature.id} className="dashboard-subcard p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{feature.name}</p>
                        <p className="mt-1 text-sm text-muted">{feature.shortDescription}</p>
                      </div>
                      <Link
                        href={`/companies/${project.companyId}/projects/${project.id}/features/${feature.id}`}
                        className="text-sm font-semibold text-primary"
                      >
                        Open detail
                      </Link>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <label className="space-y-1 text-xs uppercase tracking-wide text-muted">
                        Owner
                        <select
                          className="dashboard-control px-2 py-1.5 text-sm text-text"
                          value={feature.owner}
                          onChange={(event) => updateFeature(feature.id, { owner: event.target.value })}
                        >
                          {ownerOptions.map((owner) => (
                            <option key={owner} value={owner}>
                              {owner}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-1 text-xs uppercase tracking-wide text-muted">
                        Priority
                        <select
                          className="dashboard-control px-2 py-1.5 text-sm text-text"
                          value={feature.priority}
                          onChange={(event) =>
                            updateFeature(feature.id, {
                              priority: event.target.value as "Low" | "Medium" | "High",
                            })
                          }
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </label>

                      <div className="flex items-end">
                        <button
                          type="button"
                          className={`dashboard-nav-link w-full px-2 py-1.5 text-sm font-medium ${
                            feature.bookmarked
                              ? "border-primary/45 bg-primary/12 text-primary"
                              : "text-muted"
                          }`}
                          onClick={() => updateFeature(feature.id, { bookmarked: !feature.bookmarked })}
                        >
                          {feature.bookmarked ? "Bookmarked" : "Bookmark"}
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs uppercase tracking-wide text-muted">
                      {feature.commentCount} comments · Updated {new Date(feature.updatedAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      <section className="dashboard-subcard p-4">
        <p className="text-sm text-muted">
          This summary is triage-focused. Full collaboration, thread management, and deep editing remain in dedicated
          feature detail pages.
        </p>
        {selectedProject ? (
          <Link href={`/projects/${selectedProject.id}`} className="mt-2 inline-flex text-sm font-semibold text-primary">
            Refresh current project context
          </Link>
        ) : null}
      </section>
    </div>
  );
}

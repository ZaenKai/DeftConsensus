"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { dashboardMock } from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

export function FeatureDetailPage() {
  const params = useParams<{ projectId: string; featureId: string }>();
  const searchParams = useSearchParams();
  const uiState = searchParams.get("state");

  const { features, setSelectedCompanyId, setSelectedProjectId } = useDashboardContext();
  const project = dashboardMock.projects.find((item) => item.id === params.projectId);
  const feature = features.find((item) => item.id === params.featureId && item.projectId === params.projectId);

  useEffect(() => {
    if (!project) {
      return;
    }
    setSelectedCompanyId(project.companyId);
    setSelectedProjectId(project.id);
  }, [project, setSelectedCompanyId, setSelectedProjectId]);

  if (!project || !feature || uiState === "error") {
    return (
      <section className="dashboard-subcard border-danger/40 bg-danger/10 p-5">
        <h2 className="font-heading text-2xl font-bold text-danger">Feature detail unavailable</h2>
        <p className="mt-2 text-sm text-muted">The selected feature could not be found for this project context.</p>
        <Link href={`/projects/${params.projectId}`} className="mt-3 inline-flex text-sm font-semibold text-primary">
          Back to project summary
        </Link>
      </section>
    );
  }

  if (uiState === "loading") {
    return (
      <section className="dashboard-subcard p-5 text-sm text-muted" aria-live="polite">
        Loading feature detail…
      </section>
    );
  }

  return (
    <div className="space-y-7">
      <section aria-labelledby="feature-detail-title">
        <span className="dashboard-chip">Feature Detail</span>
        <h2 id="feature-detail-title" className="mt-1 font-heading text-3xl font-bold tracking-tight">
          {feature.name}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">{feature.shortDescription}</p>
      </section>

      <section className="grid gap-3 md:grid-cols-3" aria-label="Feature metadata">
        <article className="surface-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Status</p>
          <p className="mt-2 text-sm font-semibold text-primary">{feature.status}</p>
        </article>
        <article className="surface-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Owner</p>
          <p className="mt-2 text-sm font-semibold">{feature.owner}</p>
        </article>
        <article className="surface-card p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Priority</p>
          <p className="mt-2 text-sm font-semibold">{feature.priority}</p>
        </article>
      </section>
      <section className="surface-card p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold">Deep workflow boundary</h3>
        <p className="mt-2 text-sm text-muted">
          Full editing, collaboration threads, and implementation artifacts live here, separate from the project summary
          triage view.
        </p>
        {uiState === "empty" ? (
          <p className="dashboard-subcard mt-3 px-3 py-2 text-sm text-muted">
            No discussion threads yet for this feature.
          </p>
        ) : (
          <div className="mt-3 space-y-2 text-sm text-muted">
            <p>Thread timeline placeholder: requirements, rationale, and approval history.</p>
            <p>Implementation checklist placeholder: scoped tasks and verification gates.</p>
            <p>Artifacts placeholder: linked documents, drafts, and validation notes.</p>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={`/projects/${project.id}`} className="dashboard-nav-link inline-flex items-center px-4 py-2 text-sm font-medium">
          Back to project summary
        </Link>
        <Link href="/inbox" className="gradient-button px-4 py-2 text-sm font-semibold">
          Open Inbox Context
        </Link>
      </div>
    </div>
  );
}

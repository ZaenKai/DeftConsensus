"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@deftai/deft-components";
import {
  FEATURE_STATUS_ORDER,
  dashboardMock,
  getProjectStatusSummary,
  groupFeaturesByStatus,
} from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

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
      <Alert variant="destructive">
        <AlertTitle>Project summary unavailable</AlertTitle>
        <AlertDescription>
          The project could not be resolved in the current mock data context.
          <Link href="/projects" className="ml-1 font-semibold text-accent">
            Return to project explorer
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  const scopedFeatures = forceEmpty ? [] : features.filter((feature) => feature.projectId === project.id);
  const grouped = groupFeaturesByStatus(scopedFeatures);
  const summary = getProjectStatusSummary(project.id, scopedFeatures);
  const totalFeatures = scopedFeatures.length;

  const metricCards: Array<{ label: string; value: number; tone?: "accent" | "destructive" }> = [
    { label: "Total Features", value: totalFeatures, tone: "accent" },
    { label: "In Build", value: summary["In Build"], tone: "accent" },
    { label: "In Verification", value: summary["In Verification"], tone: "accent" },
    { label: "Blocked", value: summary.Blocked, tone: "destructive" },
  ];

  return (
    <div className="space-y-7">
      <section aria-labelledby="project-summary-title">
        <Badge variant="outline">Project Dashboard</Badge>
        <h2 id="project-summary-title" className="mt-1 text-3xl font-bold tracking-tight">
          {project.name}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{project.description}</p>
      </section>

      <section aria-label="Project summary metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <p
                className={[
                  "mt-2 text-3xl font-bold",
                  card.tone === "destructive" ? "text-destructive" : "text-accent",
                ].join(" ")}
              >
                {isLoading ? "…" : card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-5" aria-label="Status grouped feature summaries">
        {FEATURE_STATUS_ORDER.map((status) => (
          <Card key={status} aria-labelledby={`status-${status}`}>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle id={`status-${status}`}>{status}</CardTitle>
              <Badge variant="outline">{grouped[status].length} item(s)</Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading status group…</p>
              ) : grouped[status].length === 0 ? (
                <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                  No features in this status.
                </p>
              ) : (
                <ul className="space-y-3">
                  {grouped[status].map((feature) => (
                    <li key={feature.id} className="rounded-md border border-border bg-muted/30 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{feature.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{feature.shortDescription}</p>
                        </div>
                        <Link
                          href={`/companies/${project.companyId}/projects/${project.id}/features/${feature.id}`}
                          className="text-sm font-semibold text-accent hover:underline"
                        >
                          Open detail
                        </Link>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <label className="space-y-1 text-xs uppercase tracking-wide text-muted-foreground">
                          Owner
                          <select
                            className={selectClassName}
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

                        <label className="space-y-1 text-xs uppercase tracking-wide text-muted-foreground">
                          Priority
                          <select
                            className={selectClassName}
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
                          <Button
                            type="button"
                            variant={feature.bookmarked ? "secondary" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => updateFeature(feature.id, { bookmarked: !feature.bookmarked })}
                          >
                            {feature.bookmarked ? "Bookmarked" : "Bookmark"}
                          </Button>
                        </div>
                      </div>

                      <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                        {feature.commentCount} comments · Updated {new Date(feature.updatedAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            This summary is triage-focused. Full collaboration, thread management, and deep editing remain in dedicated
            feature detail pages.
          </p>
          {selectedProject ? (
            <Link
              href={`/projects/${selectedProject.id}`}
              className="mt-2 inline-flex text-sm font-semibold text-accent hover:underline"
            >
              Refresh current project context
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

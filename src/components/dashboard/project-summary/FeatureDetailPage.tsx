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
      <Alert variant="destructive">
        <AlertTitle>Feature detail unavailable</AlertTitle>
        <AlertDescription>
          The selected feature could not be found for this project context.{" "}
          <Link href={`/projects/${params.projectId}`} className="font-semibold text-accent">
            Back to project summary
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (uiState === "loading") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground" aria-live="polite">
          Loading feature detail…
        </CardContent>
      </Card>
    );
  }

  const metadataCards = [
    { label: "Status", value: feature.status, highlight: true },
    { label: "Owner", value: feature.owner },
    { label: "Priority", value: feature.priority },
  ];

  return (
    <div className="space-y-7">
      <section aria-labelledby="feature-detail-title">
        <Badge variant="outline">Feature Detail</Badge>
        <h2 id="feature-detail-title" className="mt-1 text-3xl font-bold tracking-tight">
          {feature.name}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{feature.shortDescription}</p>
      </section>

      <section className="grid gap-3 md:grid-cols-3" aria-label="Feature metadata">
        {metadataCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <p
                className={[
                  "mt-2 text-sm font-semibold",
                  card.highlight ? "text-accent" : "",
                ].join(" ")}
              >
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Deep workflow boundary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Full editing, collaboration threads, and implementation artifacts live here, separate from the project summary
            triage view.
          </p>
          {uiState === "empty" ? (
            <p className="mt-3 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              No discussion threads yet for this feature.
            </p>
          ) : (
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Thread timeline placeholder: requirements, rationale, and approval history.</p>
              <p>Implementation checklist placeholder: scoped tasks and verification gates.</p>
              <p>Artifacts placeholder: linked documents, drafts, and validation notes.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href={`/projects/${project.id}`}>Back to project summary</Link>
        </Button>
        <Button asChild>
          <Link href="/inbox">Open Inbox Context</Link>
        </Button>
      </div>
    </div>
  );
}

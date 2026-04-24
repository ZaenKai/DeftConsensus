import { Suspense } from "react";
import { FeatureWorkspace } from "@/components/feature-page/FeatureWorkspace";
import { dashboardMock } from "@/mocks/dashboard";

type SearchParamValue = string | string[] | undefined;

function normalizeUiState(value: SearchParamValue): "default" | "loading" | "empty" | "error" {
  if (value === "loading" || value === "empty" || value === "error") {
    return value;
  }
  return "default";
}

export default async function FeatureDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; featureId: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const project = dashboardMock.projects.find((item) => item.id === resolvedParams.projectId);
  return (
    <Suspense fallback={<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading feature detail…</div>}>
      <FeatureWorkspace
        companyId={project?.companyId ?? ""}
        projectId={resolvedParams.projectId}
        featureId={resolvedParams.featureId}
        uiState={{
          brief: normalizeUiState(resolvedSearchParams.briefState),
          chat: normalizeUiState(resolvedSearchParams.chatState),
          vote: normalizeUiState(resolvedSearchParams.voteState),
          fork: normalizeUiState(resolvedSearchParams.forkState),
        }}
      />
    </Suspense>
  );
}

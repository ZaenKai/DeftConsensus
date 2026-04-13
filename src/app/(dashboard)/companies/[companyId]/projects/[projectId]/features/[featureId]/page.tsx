import { Suspense } from "react";
import { FeatureWorkspace } from "@/components/feature-page/FeatureWorkspace";

type SearchParamValue = string | string[] | undefined;

function normalizeUiState(value: SearchParamValue): "default" | "loading" | "empty" | "error" {
  if (value === "loading" || value === "empty" || value === "error") {
    return value;
  }
  return "default";
}

export default async function CompanyProjectFeatureRoute({
  params,
  searchParams,
}: {
  params: Promise<{ companyId: string; projectId: string; featureId: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div className="surface-card p-4 text-sm text-muted">Loading feature detail…</div>}>
      <FeatureWorkspace
        companyId={resolvedParams.companyId}
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

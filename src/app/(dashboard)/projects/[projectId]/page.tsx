import { Suspense } from "react";
import { ProjectSummaryPage } from "@/components/dashboard/project-summary/ProjectSummaryPage";

export default function ProjectSummaryRoute() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading project summary…</div>}>
      <ProjectSummaryPage />
    </Suspense>
  );
}

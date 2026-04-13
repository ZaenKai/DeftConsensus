import { Suspense } from "react";
import { ProjectSummaryPage } from "@/components/dashboard/project-summary/ProjectSummaryPage";

export default function ProjectSummaryRoute() {
  return (
    <Suspense fallback={<div className="surface-card p-4 text-sm text-muted">Loading project summary…</div>}>
      <ProjectSummaryPage />
    </Suspense>
  );
}

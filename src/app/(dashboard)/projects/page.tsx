import { Suspense } from "react";
import { ProjectsExplorerPage } from "@/components/dashboard/explorer/ProjectsExplorerPage";

export default function ProjectsExplorerRoute() {
  return (
    <Suspense fallback={<div className="surface-card p-4 text-sm text-muted">Loading projects…</div>}>
      <ProjectsExplorerPage />
    </Suspense>
  );
}

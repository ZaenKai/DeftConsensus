import { Suspense } from "react";
import { ProjectsExplorerPage } from "@/components/dashboard/explorer/ProjectsExplorerPage";

export default function ProjectsExplorerRoute() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading projects…</div>}>
      <ProjectsExplorerPage />
    </Suspense>
  );
}

import Link from "next/link";
import { Button } from "@deftai/deft-components";
import type { FeatureRouteContext } from "@/mocks/feature-page";

export function FeatureContextHeader({ route }: { route: FeatureRouteContext }) {
  return (
    <header
      aria-label="Feature context"
      className="rounded-lg border border-border bg-card p-3 text-card-foreground shadow-sm md:p-3.5"
    >
      <nav className="text-xs text-muted-foreground" aria-label="Context breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>{route.companyName}</li>
          <li aria-hidden>/</li>
          <li>{route.projectName}</li>
          <li aria-hidden>/</li>
          <li className="font-semibold text-foreground">{route.featureName}</li>
        </ol>
      </nav>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">{route.featureName}</h1>
          <p className="text-xs text-muted-foreground">Status: {route.featureStatus}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${route.projectId}`}>Back to project dashboard</Link>
        </Button>
      </div>
    </header>
  );
}

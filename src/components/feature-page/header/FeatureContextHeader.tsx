import Link from "next/link";
import type { FeatureRouteContext } from "@/mocks/feature-page";

export function FeatureContextHeader({ route }: { route: FeatureRouteContext }) {
  return (
    <header className="surface-card p-3 md:p-3.5" aria-label="Feature context">
      <nav className="text-xs text-muted" aria-label="Context breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>{route.companyName}</li>
          <li aria-hidden>/</li>
          <li>{route.projectName}</li>
          <li aria-hidden>/</li>
          <li className="font-semibold text-text">{route.featureName}</li>
        </ol>
      </nav>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-heading text-xl font-semibold">{route.featureName}</h1>
          <p className="text-xs text-muted">Status: {route.featureStatus}</p>
        </div>
        <Link
          href={`/projects/${route.projectId}`}
          className="dashboard-nav-link inline-flex items-center px-2.5 py-1.5 text-xs font-semibold"
        >
          Back to project dashboard
        </Link>
      </div>
    </header>
  );
}

import Link from "next/link";
import type { Subfeature } from "@/mocks/feature-page";

type SubfeaturePanelProps = {
  subfeatures: Subfeature[];
  shouldSuggestSplit: boolean;
  splitConfirmed: boolean;
  parentComplete: boolean;
  onConfirmSplit: () => void;
};

export function SubfeaturePanel({
  subfeatures,
  shouldSuggestSplit,
  splitConfirmed,
  parentComplete,
  onConfirmSplit,
}: SubfeaturePanelProps) {
  return (
    <section className="surface-card space-y-3 p-4" aria-label="Subfeature orchestration">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold">Subfeatures</h2>
        <span className={`dashboard-chip ${parentComplete ? "text-success" : ""}`}>
          Parent {parentComplete ? "complete" : "incomplete"}
        </span>
      </div>

      {shouldSuggestSplit && !splitConfirmed ? (
        <div className="dashboard-subcard p-3 text-sm text-muted">
          <p className="font-semibold text-text">Complexity threshold reached</p>
          <p className="mt-1">Split this feature into subfeatures to reduce implementation risk.</p>
          <button type="button" className="dashboard-nav-link mt-2 px-3 py-2 text-sm" onClick={onConfirmSplit}>
            Confirm split suggestion
          </button>
        </div>
      ) : null}

      <ul className="space-y-2">
        {subfeatures.map((subfeature) => (
          <li key={subfeature.id} className="dashboard-subcard p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-text">
                {subfeature.title} {subfeature.required ? "(Required)" : "(Optional)"}
              </p>
              <span className={`dashboard-chip ${subfeature.completed ? "text-success" : "text-muted"}`}>
                {subfeature.completed ? "Complete" : "Open"}
              </span>
            </div>
            <Link href={subfeature.route} className="mt-1 inline-flex text-xs font-semibold text-primary">
              Open subfeature
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

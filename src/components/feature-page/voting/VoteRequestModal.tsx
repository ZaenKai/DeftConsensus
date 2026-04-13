import { useState } from "react";
import type { BriefSection, FeaturePageUiState } from "@/mocks/feature-page";

type VoteRequestModalProps = {
  open: boolean;
  sections: BriefSection[];
  uiState: FeaturePageUiState;
  onClose: () => void;
  onSubmit: (payload: { sectionId: string; rationale: string }) => void;
};

export function VoteRequestModal({ open, sections, uiState, onClose, onSubmit }: VoteRequestModalProps) {
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [rationale, setRationale] = useState("");

  if (!open) {
    return null;
  }

  if (uiState === "loading") {
    return (
      <div className="surface-card p-4 text-sm text-muted" role="dialog" aria-modal="true" aria-label="Vote request">
        Loading vote request form…
      </div>
    );
  }

  if (uiState === "error") {
    return (
      <div className="surface-card border-danger/40 bg-danger/10 p-4 text-sm text-danger" role="dialog" aria-modal="true">
        Vote request flow is unavailable right now.
      </div>
    );
  }

  return (
    <div className="surface-card fixed inset-0 z-40 m-auto h-fit max-w-lg p-4" role="dialog" aria-modal="true">
      <h2 className="font-heading text-lg font-semibold">Propose section vote</h2>
      <p className="mt-1 text-sm text-muted">Request completion approval for one brief section.</p>
      <label className="mt-3 block text-xs uppercase tracking-wide text-muted">
        Section
        <select
          className="dashboard-control mt-1 text-sm"
          value={sectionId}
          onChange={(event) => setSectionId(event.target.value)}
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block text-xs uppercase tracking-wide text-muted">
        Rationale
        <textarea
          className="dashboard-control mt-1 min-h-24 text-sm"
          value={rationale}
          onChange={(event) => setRationale(event.target.value)}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="gradient-button px-3 py-2 text-sm font-semibold"
          onClick={() => {
            onSubmit({ sectionId, rationale: rationale.trim() });
            setRationale("");
            onClose();
          }}
          disabled={!sectionId || rationale.trim().length === 0}
        >
          Create vote request
        </button>
        <button type="button" className="dashboard-nav-link px-3 py-2 text-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

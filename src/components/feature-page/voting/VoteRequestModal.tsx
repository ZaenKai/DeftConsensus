import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormLabel,
  Textarea,
} from "@deftai/deft-components";
import type { BriefSection, FeaturePageUiState } from "@/mocks/feature-page";

type VoteRequestModalProps = {
  open: boolean;
  sections: BriefSection[];
  uiState: FeaturePageUiState;
  onClose: () => void;
  onSubmit: (payload: { sectionId: string; rationale: string }) => void;
};

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export function VoteRequestModal({ open, sections, uiState, onClose, onSubmit }: VoteRequestModalProps) {
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [rationale, setRationale] = useState("");

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent aria-describedby="vote-request-description">
        <DialogHeader>
          <DialogTitle>Propose section vote</DialogTitle>
          <DialogDescription id="vote-request-description">
            Request completion approval for one brief section.
          </DialogDescription>
        </DialogHeader>

        {uiState === "loading" ? (
          <p className="text-sm text-muted-foreground">Loading vote request form…</p>
        ) : uiState === "error" ? (
          <p className="text-sm text-destructive">Vote request flow is unavailable right now.</p>
        ) : (
          <div className="space-y-3">
            <FormField id="vote-section" className="space-y-1">
              <FormLabel className="text-xs uppercase tracking-wide">Section</FormLabel>
              <select
                id="vote-section"
                className={selectClassName}
                value={sectionId}
                onChange={(event) => setSectionId(event.target.value)}
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="vote-rationale" className="space-y-1">
              <FormLabel className="text-xs uppercase tracking-wide">Rationale</FormLabel>
              <Textarea
                id="vote-rationale"
                className="min-h-24"
                value={rationale}
                onChange={(event) => setRationale(event.target.value)}
              />
            </FormField>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit({ sectionId, rationale: rationale.trim() });
              setRationale("");
              onClose();
            }}
            disabled={
              uiState === "loading" ||
              uiState === "error" ||
              !sectionId ||
              rationale.trim().length === 0
            }
          >
            Create vote request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

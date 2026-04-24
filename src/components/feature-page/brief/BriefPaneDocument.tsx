import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  SegmentedControl,
  SegmentedControlItem,
} from "@deftai/deft-components";
import type {
  AiUpdateEvent,
  BriefSection,
  BriefView,
  FeaturePageUiState,
  SectionProvenance,
} from "@/mocks/feature-page";

type BriefPaneProps = {
  activeView: BriefView;
  onChangeView: (next: BriefView) => void;
  originalSections: BriefSection[];
  inProgressSections: BriefSection[];
  aiUpdates: AiUpdateEvent[];
  provenance: SectionProvenance[];
  approvedUpdateIds: string[];
  rejectedUpdateIds: string[];
  pendingApprovalUpdateIds: string[];
  onApproveUpdate: (updateId: string) => void;
  onRejectUpdate: (updateId: string) => void;
  uiState: FeaturePageUiState;
};

type UpdateReviewState = "auto-applied" | "pending" | "approved" | "rejected";

type DiffReviewEntry = {
  updateId: string;
  oldText: string;
  newText: string;
  summary: string;
  timestamp: string;
  state: UpdateReviewState;
};

function resolveUpdateState(
  update: AiUpdateEvent,
  approvedUpdateIds: string[],
  rejectedUpdateIds: string[],
): UpdateReviewState {
  if (update.risk === "low") {
    return "auto-applied";
  }
  if (approvedUpdateIds.includes(update.id)) {
    return "approved";
  }
  if (rejectedUpdateIds.includes(update.id)) {
    return "rejected";
  }
  return "pending";
}

function statusLabel(state: UpdateReviewState): string {
  if (state === "auto-applied") {
    return "Auto-applied";
  }
  if (state === "approved") {
    return "Approved";
  }
  if (state === "rejected") {
    return "Rejected";
  }
  return "Pending review";
}

function buildReviewEntriesForSection(
  originalText: string,
  updates: AiUpdateEvent[],
  provenanceByUpdateId: Map<string, SectionProvenance>,
  approvedUpdateIds: string[],
  rejectedUpdateIds: string[],
): {
  entries: DiffReviewEntry[];
  currentText: string;
} {
  const orderedUpdates = [...updates].sort(
    (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );
  const entries: DiffReviewEntry[] = [];
  let previousText = originalText;

  orderedUpdates.forEach((update) => {
    const state = resolveUpdateState(update, approvedUpdateIds, rejectedUpdateIds);
    const provenance = provenanceByUpdateId.get(update.id);
    entries.push({
      updateId: update.id,
      oldText: previousText,
      newText: update.updatedContent,
      summary: provenance?.summary ?? update.summary,
      timestamp: provenance?.timestamp ?? update.timestamp,
      state,
    });
    if (state === "approved" || state === "auto-applied") {
      previousText = update.updatedContent;
    }
  });

  return {
    entries,
    currentText: previousText,
  };
}

export function BriefPane({
  activeView,
  onChangeView,
  originalSections,
  inProgressSections,
  aiUpdates,
  provenance,
  approvedUpdateIds,
  rejectedUpdateIds,
  pendingApprovalUpdateIds,
  onApproveUpdate,
  onRejectUpdate,
  uiState,
}: BriefPaneProps) {
  if (uiState === "loading") {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">Loading brief…</CardContent>
      </Card>
    );
  }
  if (uiState === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Brief unavailable</AlertTitle>
        <AlertDescription>Brief content is unavailable.</AlertDescription>
      </Alert>
    );
  }
  if (uiState === "empty") {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          No brief content has been drafted yet.
        </CardContent>
      </Card>
    );
  }

  const provenanceByUpdateId = new Map(provenance.map((item) => [item.updateId, item]));
  const updatesBySectionId = new Map<string, AiUpdateEvent[]>();
  aiUpdates.forEach((update) => {
    const existing = updatesBySectionId.get(update.sectionId) ?? [];
    updatesBySectionId.set(update.sectionId, [...existing, update]);
  });
  const inProgressBySectionId = new Map(inProgressSections.map((section) => [section.id, section]));

  return (
    <section aria-label="Brief pane" className="h-full">
      <Card className="h-full" aria-label="Brief document">
        <CardContent className="p-3 md:p-4">
          <div className="mx-auto w-full max-w-3xl rounded-md border border-border bg-card px-5 py-5 md:px-8 md:py-8">
            <header className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {activeView === "original" ? "Original snapshot · immutable" : "In progress · governed edits"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Feature Brief</h2>
              </div>
              <SegmentedControl
                value={activeView}
                onValueChange={(value) => onChangeView(value as BriefView)}
                size="sm"
                aria-label="Brief view"
              >
                <SegmentedControlItem value="original">Original</SegmentedControlItem>
                <SegmentedControlItem value="in-progress">In Progress</SegmentedControlItem>
              </SegmentedControl>
            </header>

            <div className="mt-6 space-y-6">
              {originalSections.map((section) => {
                const inProgressSection = inProgressBySectionId.get(section.id) ?? section;
                const sectionUpdates = updatesBySectionId.get(section.id) ?? [];
                const review = buildReviewEntriesForSection(
                  section.content,
                  sectionUpdates,
                  provenanceByUpdateId,
                  approvedUpdateIds,
                  rejectedUpdateIds,
                );

                return (
                  <section key={section.id}>
                    <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>

                    {activeView === "original" ? (
                      <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-foreground">{section.content}</p>
                    ) : sectionUpdates.length === 0 ? (
                      <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-foreground">
                        {inProgressSection.content}
                      </p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {review.entries.map((entry) => {
                          const pending = pendingApprovalUpdateIds.includes(entry.updateId);
                          const addedTextClass =
                            entry.state === "rejected"
                              ? "border-border bg-background text-muted-foreground line-through"
                              : "border-success/30 bg-success/10 text-foreground";
                          const removedTextClass =
                            entry.state === "approved" || entry.state === "auto-applied"
                              ? "text-destructive/75 line-through decoration-destructive/70"
                              : "text-muted-foreground line-through";

                          return (
                            <article
                              key={entry.updateId}
                              className="group rounded-md border border-border bg-muted/20 p-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <Badge variant="outline">{statusLabel(entry.state)}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">{entry.summary}</p>
                              <div className="mt-2 space-y-2">
                                <div className={`whitespace-pre-wrap text-sm leading-7 ${removedTextClass}`}>
                                  {entry.oldText}
                                </div>
                                <div
                                  className={`whitespace-pre-wrap rounded-sm border border-l-2 px-2 py-1 text-sm leading-7 ${addedTextClass}`}
                                >
                                  {entry.newText}
                                </div>
                              </div>
                              {pending ? (
                                <div className="mt-3 flex justify-end">
                                  <div className="flex items-center gap-2 md:opacity-0 md:pointer-events-none md:transition-opacity md:duration-150 md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => onRejectUpdate(entry.updateId)}
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => onApproveUpdate(entry.updateId)}
                                    >
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              ) : null}
                            </article>
                          );
                        })}
                        <div className="rounded-md border border-border bg-background p-3">
                          <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                            Current in-progress text
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-base leading-8 text-foreground">
                            {review.currentText}
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

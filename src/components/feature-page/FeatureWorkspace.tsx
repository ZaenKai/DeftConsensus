"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SegmentedControl,
  SegmentedControlItem,
} from "@deftai/deft-components";
import { BriefPane } from "@/components/feature-page/brief/BriefPaneDocument";
import { ChatPane } from "@/components/feature-page/chat/ChatPane";
import { SubfeaturePanel } from "@/components/feature-page/subfeatures/SubfeaturePanel";
import { VoteRequestModal } from "@/components/feature-page/voting/VoteRequestModal";
import {
  deriveInProgressSections,
  evaluateSectionVote,
  getFeaturePageFixture,
  isParentFeatureComplete,
  resolveGovernancePolicy,
  shouldSuggestSubfeatureSplit,
  type BriefView,
  type ChatMessage,
  type FeaturePageUiState,
  type FeatureSectionVote,
} from "@/mocks/feature-page";

type FeatureWorkspaceProps = {
  companyId: string;
  projectId: string;
  featureId: string;
  uiState?: Partial<Record<"brief" | "chat" | "vote" | "fork", FeaturePageUiState>>;
};

export function FeatureWorkspace({ companyId, projectId, featureId, uiState }: FeatureWorkspaceProps) {
  const fixture = getFeaturePageFixture(companyId, projectId, featureId);
  const [activePane, setActivePane] = useState<"brief" | "chat">("brief");
  const [activeBriefView, setActiveBriefView] = useState<BriefView>("original");
  const [approvedHighRiskUpdateIds, setApprovedHighRiskUpdateIds] = useState<string[]>([]);
  const [rejectedHighRiskUpdateIds, setRejectedHighRiskUpdateIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(fixture?.chatMessages ?? []);
  const [votes, setVotes] = useState<FeatureSectionVote[]>(fixture?.sectionVotes ?? []);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [splitConfirmed, setSplitConfirmed] = useState(false);
  const [confirmedForkIds, setConfirmedForkIds] = useState<string[]>([]);

  if (!fixture) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Feature detail unavailable</AlertTitle>
        <AlertDescription>Route context could not be resolved from mock data.</AlertDescription>
      </Alert>
    );
  }

  const effectivePolicy = resolveGovernancePolicy(fixture.companyDefaultPolicy, fixture.projectPolicyOverride);
  const { sections: inProgressSections, provenance } = deriveInProgressSections(
    fixture.originalBrief,
    fixture.aiUpdateEvents,
    approvedHighRiskUpdateIds,
  );
  const pendingApprovalUpdateIds = fixture.aiUpdateEvents
    .filter(
      (update) =>
        update.risk === "high" &&
        !approvedHighRiskUpdateIds.includes(update.id) &&
        !rejectedHighRiskUpdateIds.includes(update.id),
    )
    .map((update) => update.id);
  const shouldSuggestSplit = shouldSuggestSubfeatureSplit(
    fixture.parentComplexityScore,
    fixture.splitComplexityThreshold,
  );
  const parentComplete = isParentFeatureComplete(fixture.subfeatures);

  const voteOutcomes = votes.map((vote) => ({
    ...vote,
    ...evaluateSectionVote(vote, effectivePolicy),
  }));

  return (
    <div className="space-y-3">
      <Card className="md:hidden" aria-label="Mobile pane switcher">
        <CardContent className="p-2">
          <SegmentedControl
            value={activePane}
            onValueChange={(value) => setActivePane(value as "brief" | "chat")}
            size="sm"
            fullWidth
            aria-label="Feature pane"
          >
            <SegmentedControlItem value="brief">Brief</SegmentedControlItem>
            <SegmentedControlItem value="chat">Chat</SegmentedControlItem>
          </SegmentedControl>
        </CardContent>
      </Card>
      <div className="grid gap-3 lg:grid-cols-2 lg:items-stretch">
        <div className={`${activePane === "chat" ? "hidden md:block" : ""} h-full`}>
          <BriefPane
            activeView={activeBriefView}
            onChangeView={setActiveBriefView}
            originalSections={fixture.originalBrief}
            inProgressSections={inProgressSections}
            aiUpdates={fixture.aiUpdateEvents}
            provenance={provenance}
            approvedUpdateIds={approvedHighRiskUpdateIds}
            rejectedUpdateIds={rejectedHighRiskUpdateIds}
            pendingApprovalUpdateIds={pendingApprovalUpdateIds}
            onApproveUpdate={(updateId) => {
              setApprovedHighRiskUpdateIds((current) => Array.from(new Set([...current, updateId])));
              setRejectedHighRiskUpdateIds((current) => current.filter((item) => item !== updateId));
            }}
            onRejectUpdate={(updateId) => {
              setRejectedHighRiskUpdateIds((current) => Array.from(new Set([...current, updateId])));
              setApprovedHighRiskUpdateIds((current) => current.filter((item) => item !== updateId));
            }}
            uiState={uiState?.brief ?? "default"}
          />
        </div>
        <div className={`${activePane === "brief" ? "hidden md:block" : ""} h-full`}>
          <ChatPane
            messages={messages}
            participants={fixture.participants}
            currentUserId={fixture.currentUserId}
            uiState={uiState?.chat ?? "default"}
            onSendMessage={(body, parentId) => {
              const nextMessage: ChatMessage = {
                id: `msg-${messages.length + 1}`,
                authorId: fixture.currentUserId,
                body,
                timestamp: new Date().toISOString(),
                parentId,
              };
              setMessages((current) => [...current, nextMessage]);
            }}
            onOpenVoteModal={() => setVoteModalOpen(true)}
          />
        </div>
      </div>

      <Card aria-label="Voting outcomes">
        <CardHeader>
          <CardTitle>Section votes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Policy: {effectivePolicy.voteModel} · quorum {effectivePolicy.quorum} · threshold{" "}
            {Math.round(effectivePolicy.passThreshold * 100)}%
          </p>
        </CardHeader>
        <CardContent>
          {(uiState?.vote ?? "default") === "loading" ? (
            <p className="text-sm text-muted-foreground">Loading votes…</p>
          ) : (uiState?.vote ?? "default") === "error" ? (
            <p className="text-sm text-destructive">Vote outcomes unavailable.</p>
          ) : votes.length === 0 || (uiState?.vote ?? "default") === "empty" ? (
            <p className="text-sm text-muted-foreground">No vote requests yet.</p>
          ) : (
            <ul className="space-y-2">
              {voteOutcomes.map((vote) => (
                <li
                  key={vote.id}
                  className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground"
                >
                  <p className="font-semibold text-foreground">Section: {vote.sectionId}</p>
                  <p>
                    Y/N/A: {vote.yesVotes}/{vote.noVotes}/{vote.abstainVotes}
                  </p>
                  <p>
                    {vote.metQuorum ? "Quorum met" : "Quorum not met"} ·{" "}
                    {vote.approved ? "Approved" : "Not approved"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card aria-label="Fork suggestion">
        <CardHeader>
          <CardTitle>Out-of-scope suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {(uiState?.fork ?? "default") === "loading" ? (
            <p className="text-sm text-muted-foreground">Evaluating fork candidates…</p>
          ) : (uiState?.fork ?? "default") === "error" ? (
            <p className="text-sm text-destructive">Fork suggestions unavailable.</p>
          ) : fixture.forkCandidates.length === 0 || (uiState?.fork ?? "default") === "empty" ? (
            <p className="text-sm text-muted-foreground">No fork suggestions detected.</p>
          ) : (
            <ul className="space-y-2">
              {fixture.forkCandidates.map((candidate) => {
                const isConfirmed = confirmedForkIds.includes(candidate.id);
                return (
                  <li key={candidate.id} className="rounded-md border border-border bg-muted/30 p-3">
                    <p className="text-sm font-semibold">{candidate.title}</p>
                    <p className="text-sm text-muted-foreground">{candidate.rationale}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      disabled={isConfirmed}
                      onClick={() => setConfirmedForkIds((current) => [...current, candidate.id])}
                    >
                      {isConfirmed ? "Fork created (mock)" : "Create fork"}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <SubfeaturePanel
        subfeatures={fixture.subfeatures}
        shouldSuggestSplit={shouldSuggestSplit}
        splitConfirmed={splitConfirmed}
        parentComplete={parentComplete}
        onConfirmSplit={() => setSplitConfirmed(true)}
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href="/inbox">Open Inbox references</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/projects/${projectId}`}>Return to project dashboard</Link>
        </Button>
      </div>

      <VoteRequestModal
        open={voteModalOpen}
        uiState={uiState?.vote ?? "default"}
        sections={inProgressSections}
        onClose={() => setVoteModalOpen(false)}
        onSubmit={({ sectionId }) => {
          setVotes((current) => [
            ...current,
            {
              id: `vote-${current.length + 1}`,
              sectionId,
              requestedBy: fixture.currentUserId,
              yesVotes: 0,
              noVotes: 0,
              abstainVotes: 0,
            },
          ]);
        }}
      />
    </div>
  );
}

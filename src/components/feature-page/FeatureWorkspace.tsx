"use client";

import Link from "next/link";
import { useState } from "react";
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
      <section className="surface-card border-danger/40 bg-danger/10 p-5">
        <h1 className="font-heading text-2xl font-bold text-danger">Feature detail unavailable</h1>
        <p className="mt-2 text-sm text-muted">Route context could not be resolved from mock data.</p>
      </section>
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
      <section className="surface-card p-2 md:hidden" aria-label="Mobile pane switcher">
        <div className="flex gap-1.5">
          <button
            type="button"
            className="dashboard-nav-link px-2.5 py-1.5 text-xs"
            data-active={activePane === "brief"}
            onClick={() => setActivePane("brief")}
          >
            Brief
          </button>
          <button
            type="button"
            className="dashboard-nav-link px-2.5 py-1.5 text-xs"
            data-active={activePane === "chat"}
            onClick={() => setActivePane("chat")}
          >
            Chat
          </button>
        </div>
      </section>
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

      <section className="surface-card p-4" aria-label="Voting outcomes">
        <h2 className="font-heading text-lg font-semibold">Section votes</h2>
        <p className="mt-1 text-sm text-muted">
          Policy: {effectivePolicy.voteModel} · quorum {effectivePolicy.quorum} · threshold{" "}
          {Math.round(effectivePolicy.passThreshold * 100)}%
        </p>
        {(uiState?.vote ?? "default") === "loading" ? (
          <p className="mt-2 text-sm text-muted">Loading votes…</p>
        ) : (uiState?.vote ?? "default") === "error" ? (
          <p className="mt-2 text-sm text-danger">Vote outcomes unavailable.</p>
        ) : votes.length === 0 || (uiState?.vote ?? "default") === "empty" ? (
          <p className="mt-2 text-sm text-muted">No vote requests yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {voteOutcomes.map((vote) => (
              <li key={vote.id} className="dashboard-subcard p-3 text-sm text-muted">
                <p className="font-semibold text-text">Section: {vote.sectionId}</p>
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
      </section>

      <section className="surface-card p-4" aria-label="Fork suggestion">
        <h2 className="font-heading text-lg font-semibold">Out-of-scope suggestions</h2>
        {(uiState?.fork ?? "default") === "loading" ? (
          <p className="mt-2 text-sm text-muted">Evaluating fork candidates…</p>
        ) : (uiState?.fork ?? "default") === "error" ? (
          <p className="mt-2 text-sm text-danger">Fork suggestions unavailable.</p>
        ) : fixture.forkCandidates.length === 0 || (uiState?.fork ?? "default") === "empty" ? (
          <p className="mt-2 text-sm text-muted">No fork suggestions detected.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {fixture.forkCandidates.map((candidate) => {
              const isConfirmed = confirmedForkIds.includes(candidate.id);
              return (
                <li key={candidate.id} className="dashboard-subcard p-3">
                  <p className="text-sm font-semibold">{candidate.title}</p>
                  <p className="text-sm text-muted">{candidate.rationale}</p>
                  <button
                    type="button"
                    className="dashboard-nav-link mt-2 px-3 py-2 text-sm"
                    disabled={isConfirmed}
                    onClick={() => setConfirmedForkIds((current) => [...current, candidate.id])}
                  >
                    {isConfirmed ? "Fork created (mock)" : "Create fork"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <SubfeaturePanel
        subfeatures={fixture.subfeatures}
        shouldSuggestSplit={shouldSuggestSplit}
        splitConfirmed={splitConfirmed}
        parentComplete={parentComplete}
        onConfirmSplit={() => setSplitConfirmed(true)}
      />

      <div className="flex flex-wrap gap-2">
        <Link href="/inbox" className="dashboard-nav-link px-3 py-2 text-sm">
          Open Inbox references
        </Link>
        <Link href={`/projects/${projectId}`} className="dashboard-nav-link px-3 py-2 text-sm">
          Return to project dashboard
        </Link>
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

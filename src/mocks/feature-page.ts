import { dashboardMock } from "@/mocks/dashboard";

export type FeaturePageUiState = "default" | "loading" | "empty" | "error";
export type BriefView = "original" | "in-progress";
export type UpdateRisk = "low" | "high";
export type VoteModel = "simple-majority" | "two-thirds";

export type FeatureRouteContext = {
  companyId: string;
  companyName: string;
  projectId: string;
  projectName: string;
  featureId: string;
  featureName: string;
  featureStatus: string;
};

export type FeatureParticipant = {
  id: string;
  name: string;
  avatarInitials: string;
  role: "product" | "engineering" | "design" | "qa";
};

export type BriefSection = {
  id: string;
  title: string;
  content: string;
};

export type AiUpdateEvent = {
  id: string;
  sectionId: string;
  updatedContent: string;
  summary: string;
  risk: UpdateRisk;
  timestamp: string;
};

export type SectionProvenance = {
  sectionId: string;
  updateId: string;
  timestamp: string;
  summary: string;
  risk: UpdateRisk;
  autoApplied: boolean;
};

export type ChatMessage = {
  id: string;
  authorId: string;
  body: string;
  timestamp: string;
  parentId?: string;
};

export type GovernancePolicy = {
  voteModel: VoteModel;
  quorum: number;
  passThreshold: number;
  sectionVotingEnabled: boolean;
};

export type FeatureSectionVote = {
  id: string;
  sectionId: string;
  requestedBy: string;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
};

export type Subfeature = {
  id: string;
  title: string;
  required: boolean;
  completed: boolean;
  route: string;
};

export type ForkCandidate = {
  id: string;
  title: string;
  rationale: string;
};

export type FeaturePageFixture = {
  route: FeatureRouteContext;
  participants: FeatureParticipant[];
  currentUserId: string;
  originalBrief: BriefSection[];
  aiUpdateEvents: AiUpdateEvent[];
  chatMessages: ChatMessage[];
  companyDefaultPolicy: GovernancePolicy;
  projectPolicyOverride?: Partial<GovernancePolicy>;
  sectionVotes: FeatureSectionVote[];
  parentComplexityScore: number;
  splitComplexityThreshold: number;
  subfeatures: Subfeature[];
  forkCandidates: ForkCandidate[];
};

const participantFixture: FeatureParticipant[] = [
  { id: "user-1", name: "Jordan Reeves", avatarInitials: "JR", role: "engineering" },
  { id: "user-2", name: "Mina Park", avatarInitials: "MP", role: "product" },
  { id: "user-3", name: "Ari Kim", avatarInitials: "AK", role: "design" },
  { id: "user-4", name: "Eli Watson", avatarInitials: "EW", role: "qa" },
];

const originalBriefFixture: BriefSection[] = [
  {
    id: "scope",
    title: "Scope",
    content: "Deliver consensus lock workflow with rationale sign-off prior to engineering build handoff.",
  },
  {
    id: "constraints",
    title: "Constraints",
    content: "Must preserve auditability, avoid silent scope changes, and keep onboarding under 15 minutes.",
  },
  {
    id: "acceptance",
    title: "Acceptance Criteria",
    content: "Users can compare original vs in-progress brief, propose section votes, and track vote outcomes.",
  },
];

const aiUpdateFixture: AiUpdateEvent[] = [
  {
    id: "update-1",
    sectionId: "constraints",
    updatedContent:
      "Must preserve auditability, avoid silent scope changes, and keep contributor onboarding below 15 minutes.",
    summary: "Wording clarity update",
    risk: "low",
    timestamp: "2026-04-12T13:15:00.000Z",
  },
  {
    id: "update-2",
    sectionId: "scope",
    updatedContent:
      "Deliver consensus lock workflow and include external partner approval checkpoints before engineering build handoff.",
    summary: "Scope expansion proposal",
    risk: "high",
    timestamp: "2026-04-12T13:22:00.000Z",
  },
];

const chatFixture: ChatMessage[] = [
  {
    id: "msg-1",
    authorId: "user-2",
    body: "We should tighten language in constraints before proposing completion.",
    timestamp: "2026-04-12T12:59:00.000Z",
  },
  {
    id: "msg-2",
    authorId: "user-1",
    body: "Agree. The AI suggestion for constraints looks safe and can auto-apply.",
    timestamp: "2026-04-12T13:02:00.000Z",
  },
  {
    id: "msg-3",
    authorId: "user-3",
    body: "The scope expansion proposal should require explicit approval from the team.",
    timestamp: "2026-04-12T13:06:00.000Z",
    parentId: "msg-2",
  },
];

const sectionVoteFixture: FeatureSectionVote[] = [
  {
    id: "vote-1",
    sectionId: "constraints",
    requestedBy: "user-2",
    yesVotes: 3,
    noVotes: 1,
    abstainVotes: 0,
  },
  {
    id: "vote-2",
    sectionId: "scope",
    requestedBy: "user-1",
    yesVotes: 2,
    noVotes: 2,
    abstainVotes: 0,
  },
];

const parentFeatureId = "feat-consensus";

export function getFeatureRouteContext(
  companyId: string,
  projectId: string,
  featureId: string,
): FeatureRouteContext | null {
  const company = dashboardMock.companies.find((item) => item.id === companyId);
  const project = dashboardMock.projects.find((item) => item.id === projectId && item.companyId === companyId);
  const feature = dashboardMock.features.find((item) => item.id === featureId && item.projectId === projectId);

  if (!company || !project || !feature) {
    return null;
  }

  return {
    companyId,
    companyName: company.name,
    projectId,
    projectName: project.name,
    featureId,
    featureName: feature.name,
    featureStatus: feature.status,
  };
}

export function resolveGovernancePolicy(
  companyDefault: GovernancePolicy,
  projectOverride?: Partial<GovernancePolicy>,
): GovernancePolicy {
  return {
    voteModel: projectOverride?.voteModel ?? companyDefault.voteModel,
    quorum: projectOverride?.quorum ?? companyDefault.quorum,
    passThreshold: projectOverride?.passThreshold ?? companyDefault.passThreshold,
    sectionVotingEnabled: projectOverride?.sectionVotingEnabled ?? companyDefault.sectionVotingEnabled,
  };
}

export function deriveInProgressSections(
  originalSections: BriefSection[],
  updates: AiUpdateEvent[],
  approvedHighRiskUpdateIds: string[],
): {
  sections: BriefSection[];
  provenance: SectionProvenance[];
} {
  const sectionById = new Map(originalSections.map((section) => [section.id, section]));
  const inProgress = new Map(originalSections.map((section) => [section.id, section.content]));
  const provenance: SectionProvenance[] = [];

  updates.forEach((update) => {
    const section = sectionById.get(update.sectionId);
    if (!section) {
      return;
    }
    const autoApplied = update.risk === "low";
    const approved = approvedHighRiskUpdateIds.includes(update.id);
    if (autoApplied || approved) {
      inProgress.set(update.sectionId, update.updatedContent);
    }
    provenance.push({
      sectionId: update.sectionId,
      updateId: update.id,
      timestamp: update.timestamp,
      summary: update.summary,
      risk: update.risk,
      autoApplied,
    });
  });

  return {
    sections: originalSections.map((section) => ({
      ...section,
      content: inProgress.get(section.id) ?? section.content,
    })),
    provenance,
  };
}

export function evaluateSectionVote(
  vote: FeatureSectionVote,
  policy: GovernancePolicy,
): {
  metQuorum: boolean;
  approved: boolean;
  supportRatio: number;
} {
  const totalVotes = vote.yesVotes + vote.noVotes + vote.abstainVotes;
  const metQuorum = totalVotes >= policy.quorum;
  const consideredVotes = vote.yesVotes + vote.noVotes;
  const supportRatio = consideredVotes === 0 ? 0 : vote.yesVotes / consideredVotes;
  const approved = metQuorum && supportRatio >= policy.passThreshold;
  return {
    metQuorum,
    approved,
    supportRatio,
  };
}

export function shouldSuggestSubfeatureSplit(complexityScore: number, splitThreshold: number): boolean {
  return complexityScore >= splitThreshold;
}

export function isParentFeatureComplete(subfeatures: Subfeature[]): boolean {
  return subfeatures.filter((subfeature) => subfeature.required).every((subfeature) => subfeature.completed);
}

export function getFeaturePageFixture(
  companyId: string,
  projectId: string,
  featureId: string,
): FeaturePageFixture | null {
  const route = getFeatureRouteContext(companyId, projectId, featureId);
  if (!route) {
    return null;
  }

  const isPrimaryFixture = featureId === parentFeatureId;
  const subfeatures: Subfeature[] = isPrimaryFixture
    ? [
        {
          id: "sub-1",
          title: "Rationale schema",
          required: true,
          completed: true,
          route: `/companies/${companyId}/projects/${projectId}/features/feat-briefing`,
        },
        {
          id: "sub-2",
          title: "Approval gate UI",
          required: true,
          completed: false,
          route: `/companies/${companyId}/projects/${projectId}/features/feat-verification`,
        },
        {
          id: "sub-3",
          title: "Audit copy edits",
          required: false,
          completed: false,
          route: `/companies/${companyId}/projects/${projectId}/features/feat-briefing`,
        },
      ]
    : [
        {
          id: "sub-4",
          title: "Scoped follow-up",
          required: true,
          completed: true,
          route: `/companies/${companyId}/projects/${projectId}/features/${featureId}`,
        },
      ];

  return {
    route,
    participants: participantFixture,
    currentUserId: "user-1",
    originalBrief: originalBriefFixture,
    aiUpdateEvents: aiUpdateFixture,
    chatMessages: chatFixture,
    companyDefaultPolicy: {
      voteModel: "simple-majority",
      quorum: 3,
      passThreshold: 0.5,
      sectionVotingEnabled: true,
    },
    projectPolicyOverride: {
      voteModel: "two-thirds",
      passThreshold: 0.66,
    },
    sectionVotes: sectionVoteFixture,
    parentComplexityScore: 8,
    splitComplexityThreshold: 7,
    subfeatures,
    forkCandidates: [
      {
        id: "fork-1",
        title: "External partner compliance extension",
        rationale: "Discussion includes partner-only flows outside the current feature scope.",
      },
    ],
  };
}

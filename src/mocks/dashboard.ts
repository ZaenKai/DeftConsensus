export const FEATURE_STATUS_ORDER = [
  "Proposed",
  "In Discussion",
  "Consensus Locked",
  "In Build",
  "In Verification",
  "Blocked",
  "Done",
] as const;

export type DashboardFeatureStatus = (typeof FEATURE_STATUS_ORDER)[number];
export type DashboardRole = "member" | "manager" | "admin";
export type ProjectPriority = "Low" | "Medium" | "High";
export type ExplorerSort = "name-asc" | "name-desc" | "updated-desc";
export type ExplorerFilter = "all" | "needs-attention" | "recently-updated";
export type ExplorerView = "grouped" | "flat";
export type InboxFilter = "all" | "mentions" | "needs-reply";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  title: string;
};

export type DashboardCompany = {
  id: string;
  name: string;
  shortName: string;
};

export type DashboardProject = {
  id: string;
  companyId: string;
  name: string;
  description: string;
  updatedAt: string;
};

export type DashboardFeature = {
  id: string;
  projectId: string;
  name: string;
  shortDescription: string;
  status: DashboardFeatureStatus;
  owner: string;
  priority: ProjectPriority;
  bookmarked: boolean;
  commentCount: number;
  updatedAt: string;
};

export type MyWorkItem = {
  id: string;
  companyId: string;
  projectId: string;
  featureId: string;
  title: string;
  description: string;
  href: string;
  updatedAt: string;
};

export type InboxEventType = "mention" | "comment" | "status-change" | "assignment";

export type InboxEvent = {
  id: string;
  threadId: string;
  companyId: string;
  projectId: string;
  type: InboxEventType;
  title: string;
  threadPreview: string;
  unread: boolean;
  needsReply: boolean;
  href: string;
  timestamp: string;
};

export type InboxThread = {
  id: string;
  companyId: string;
  projectId: string;
  subject: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
  href: string;
};

export type NotificationPreferences = {
  mentions: boolean;
  assignments: boolean;
  digestEmails: boolean;
};

export type SessionEntry = {
  id: string;
  label: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export type CompanyAdminSettings = {
  companyId: string;
  profile: {
    name: string;
    domain: string;
    timezone: string;
  };
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: DashboardRole;
  }>;
  projectPolicies: string[];
};

export type FeatureStatusSummary = Record<DashboardFeatureStatus, number>;

export const dashboardMock = {
  user: {
    id: "user-1",
    name: "Jordan Reeves",
    email: "jordan@acme.example",
    avatarInitials: "JR",
    title: "Staff Product Engineer",
  } satisfies DashboardUser,
  companies: [
    { id: "acme", name: "Acme Labs", shortName: "Acme" },
    { id: "northstar", name: "Northstar Health", shortName: "Northstar" },
  ] satisfies DashboardCompany[],
  companyMemberships: {
    acme: "member",
    northstar: "admin",
  } as Record<string, DashboardRole>,
  projects: [
    {
      id: "apollo",
      companyId: "acme",
      name: "Apollo Workspace",
      description: "Unified operating model for roadmap and delivery alignment.",
      updatedAt: "2026-04-11T08:40:00.000Z",
    },
    {
      id: "horizon",
      companyId: "acme",
      name: "Horizon Onboarding",
      description: "Cross-functional onboarding redesign with compliance signoff.",
      updatedAt: "2026-04-10T17:20:00.000Z",
    },
    {
      id: "carepath",
      companyId: "northstar",
      name: "CarePath Mobile",
      description: "Patient app modernization and release cadence hardening.",
      updatedAt: "2026-04-11T09:10:00.000Z",
    },
    {
      id: "pulseops",
      companyId: "northstar",
      name: "PulseOps Analytics",
      description: "Operational analytics platform for service quality teams.",
      updatedAt: "2026-04-09T16:10:00.000Z",
    },
  ] satisfies DashboardProject[],
  features: [
    {
      id: "feat-briefing",
      projectId: "apollo",
      name: "Stakeholder briefing timeline",
      shortDescription: "Standardize intake checkpoints before engineering kickoff.",
      status: "In Discussion",
      owner: "Jordan Reeves",
      priority: "High",
      bookmarked: true,
      commentCount: 11,
      updatedAt: "2026-04-11T08:12:00.000Z",
    },
    {
      id: "feat-consensus",
      projectId: "apollo",
      name: "Consensus lock contract",
      shortDescription: "Require signed rationale before implementation starts.",
      status: "Consensus Locked",
      owner: "Mina Park",
      priority: "High",
      bookmarked: false,
      commentCount: 7,
      updatedAt: "2026-04-11T07:58:00.000Z",
    },
    {
      id: "feat-verification",
      projectId: "apollo",
      name: "Verification dashboard card",
      shortDescription: "Expose requirement-to-delivery verification deltas.",
      status: "In Verification",
      owner: "Eli Watson",
      priority: "Medium",
      bookmarked: false,
      commentCount: 4,
      updatedAt: "2026-04-10T19:42:00.000Z",
    },
    {
      id: "feat-queue",
      projectId: "horizon",
      name: "Onboarding queue automation",
      shortDescription: "Route launch requests through role-based approvals.",
      status: "Blocked",
      owner: "Jordan Reeves",
      priority: "High",
      bookmarked: true,
      commentCount: 16,
      updatedAt: "2026-04-10T18:05:00.000Z",
    },
    {
      id: "feat-templates",
      projectId: "horizon",
      name: "Reusable launch templates",
      shortDescription: "Pre-built implementation templates for cross-team launches.",
      status: "Proposed",
      owner: "Ari Kim",
      priority: "Low",
      bookmarked: false,
      commentCount: 2,
      updatedAt: "2026-04-09T14:03:00.000Z",
    },
    {
      id: "feat-mobile-audit",
      projectId: "carepath",
      name: "Mobile release audit trail",
      shortDescription: "Generate release verification and compliance checkpoints.",
      status: "In Build",
      owner: "Sana Ali",
      priority: "High",
      bookmarked: true,
      commentCount: 6,
      updatedAt: "2026-04-11T09:08:00.000Z",
    },
    {
      id: "feat-agent-handoff",
      projectId: "carepath",
      name: "Agent handoff notes",
      shortDescription: "Persist triage context between support and engineering.",
      status: "Done",
      owner: "Dev Gupta",
      priority: "Medium",
      bookmarked: false,
      commentCount: 3,
      updatedAt: "2026-04-08T12:16:00.000Z",
    },
    {
      id: "feat-ops-alerts",
      projectId: "pulseops",
      name: "SLO drift alerting",
      shortDescription: "Detect and escalate drift against service-level objectives.",
      status: "In Discussion",
      owner: "Mina Park",
      priority: "Medium",
      bookmarked: false,
      commentCount: 5,
      updatedAt: "2026-04-09T10:45:00.000Z",
    },
  ] satisfies DashboardFeature[],
  myWork: {
    actionRequired: [
      {
        id: "mw-1",
        companyId: "acme",
        projectId: "apollo",
        featureId: "feat-briefing",
        title: "Confirm launch briefing dependencies",
        description: "Operations needs owner assignment before consensus lock.",
        href: "/projects/apollo/features/feat-briefing",
        updatedAt: "2026-04-11T08:20:00.000Z",
      },
      {
        id: "mw-2",
        companyId: "acme",
        projectId: "horizon",
        featureId: "feat-queue",
        title: "Unblock onboarding queue automation",
        description: "Compliance approval expired and needs renewal.",
        href: "/projects/horizon/features/feat-queue",
        updatedAt: "2026-04-10T18:09:00.000Z",
      },
    ],
    mentions: [
      {
        id: "mw-3",
        companyId: "acme",
        projectId: "apollo",
        featureId: "feat-consensus",
        title: "You were mentioned in consensus rationale",
        description: "Product asked for implementation edge-case validation.",
        href: "/inbox",
        updatedAt: "2026-04-11T07:59:00.000Z",
      },
    ],
    waitingOnMe: [
      {
        id: "mw-4",
        companyId: "acme",
        projectId: "apollo",
        featureId: "feat-verification",
        title: "Verification signoff requested",
        description: "QA needs your approval to close verification checklist.",
        href: "/projects/apollo",
        updatedAt: "2026-04-10T19:50:00.000Z",
      },
    ],
    recentlyUpdated: [
      {
        id: "mw-5",
        companyId: "acme",
        projectId: "apollo",
        featureId: "feat-consensus",
        title: "Consensus lock contract updated",
        description: "Added security review acceptance criteria.",
        href: "/projects/apollo/features/feat-consensus",
        updatedAt: "2026-04-11T08:03:00.000Z",
      },
      {
        id: "mw-6",
        companyId: "acme",
        projectId: "horizon",
        featureId: "feat-templates",
        title: "Launch templates received roadmap notes",
        description: "New implementation assumptions were attached.",
        href: "/projects/horizon/features/feat-templates",
        updatedAt: "2026-04-09T14:22:00.000Z",
      },
    ],
  } as Record<"actionRequired" | "mentions" | "waitingOnMe" | "recentlyUpdated", MyWorkItem[]>,
  inboxEvents: [
    {
      id: "inbox-1",
      threadId: "thread-1",
      companyId: "acme",
      projectId: "apollo",
      type: "mention",
      title: "@Jordan please verify launch constraints",
      threadPreview: "Can you validate these dependencies before we lock consensus?",
      unread: true,
      needsReply: true,
      href: "/projects/apollo/features/feat-briefing",
      timestamp: "2026-04-11T08:18:00.000Z",
    },
    {
      id: "inbox-2",
      threadId: "thread-2",
      companyId: "acme",
      projectId: "horizon",
      type: "assignment",
      title: "You were assigned as owner",
      threadPreview: "Onboarding queue automation is now assigned to you.",
      unread: true,
      needsReply: false,
      href: "/projects/horizon/features/feat-queue",
      timestamp: "2026-04-10T18:01:00.000Z",
    },
    {
      id: "inbox-3",
      threadId: "thread-3",
      companyId: "acme",
      projectId: "apollo",
      type: "comment",
      title: "New comment on consensus lock contract",
      threadPreview: "Added release rollback requirements and owner notes.",
      unread: false,
      needsReply: true,
      href: "/projects/apollo/features/feat-consensus",
      timestamp: "2026-04-11T07:56:00.000Z",
    },
    {
      id: "inbox-4",
      threadId: "thread-4",
      companyId: "northstar",
      projectId: "carepath",
      type: "status-change",
      title: "Feature moved to In Build",
      threadPreview: "Mobile release audit trail started implementation.",
      unread: true,
      needsReply: false,
      href: "/projects/carepath",
      timestamp: "2026-04-11T09:05:00.000Z",
    },
  ] satisfies InboxEvent[],
  inboxThreads: [
    {
      id: "thread-1",
      companyId: "acme",
      projectId: "apollo",
      subject: "Launch constraints",
      participants: ["Jordan", "Mina", "Ari"],
      lastMessage: "Can you validate these dependencies before we lock consensus?",
      unreadCount: 2,
      href: "/projects/apollo/features/feat-briefing",
    },
    {
      id: "thread-2",
      companyId: "acme",
      projectId: "horizon",
      subject: "Queue automation ownership",
      participants: ["Jordan", "Sana"],
      lastMessage: "Onboarding queue automation is now assigned to you.",
      unreadCount: 1,
      href: "/projects/horizon/features/feat-queue",
    },
    {
      id: "thread-3",
      companyId: "acme",
      projectId: "apollo",
      subject: "Consensus updates",
      participants: ["Jordan", "Eli"],
      lastMessage: "Added release rollback requirements and owner notes.",
      unreadCount: 0,
      href: "/projects/apollo/features/feat-consensus",
    },
  ] satisfies InboxThread[],
  notificationPreferences: {
    mentions: true,
    assignments: true,
    digestEmails: false,
  } satisfies NotificationPreferences,
  sessions: [
    {
      id: "session-1",
      label: "Warp on Windows",
      location: "New York, US",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "session-2",
      label: "Browser - Chrome",
      location: "New York, US",
      lastActive: "2 hours ago",
      current: false,
    },
  ] satisfies SessionEntry[],
  companyAdminSettings: [
    {
      companyId: "northstar",
      profile: {
        name: "Northstar Health",
        domain: "northstar.example",
        timezone: "America/New_York",
      },
      members: [
        { id: "member-1", name: "Jordan Reeves", email: "jordan@acme.example", role: "admin" },
        { id: "member-2", name: "Sana Ali", email: "sana@northstar.example", role: "manager" },
        { id: "member-3", name: "Dev Gupta", email: "dev@northstar.example", role: "member" },
      ],
      projectPolicies: [
        "Require consensus lock before moving to In Build.",
        "Verification checklist must include release rollback criteria.",
        "Blocked status requires owner + blocker rationale.",
      ],
    },
  ] satisfies CompanyAdminSettings[],
};

export function createEmptyStatusSummary(): FeatureStatusSummary {
  return FEATURE_STATUS_ORDER.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as FeatureStatusSummary,
  );
}

export function getRoleForCompany(companyId: string): DashboardRole {
  return dashboardMock.companyMemberships[companyId] ?? "member";
}

export function getProjectsForCompany(
  companyId: string,
  projects: DashboardProject[] = dashboardMock.projects,
): DashboardProject[] {
  return projects.filter((project) => project.companyId === companyId);
}

export function getDefaultProjectForCompany(
  companyId: string,
  projects: DashboardProject[] = dashboardMock.projects,
): DashboardProject | undefined {
  return getProjectsForCompany(companyId, projects)[0];
}

export function getFeaturesForProject(
  projectId: string,
  features: DashboardFeature[] = dashboardMock.features,
): DashboardFeature[] {
  return features.filter((feature) => feature.projectId === projectId);
}

export function groupFeaturesByStatus(
  features: DashboardFeature[],
): Record<DashboardFeatureStatus, DashboardFeature[]> {
  const grouped = FEATURE_STATUS_ORDER.reduce(
    (acc, status) => ({ ...acc, [status]: [] as DashboardFeature[] }),
    {} as Record<DashboardFeatureStatus, DashboardFeature[]>,
  );
  features.forEach((feature) => {
    grouped[feature.status].push(feature);
  });
  return grouped;
}

export function getProjectStatusSummary(
  projectId: string,
  features: DashboardFeature[] = dashboardMock.features,
): FeatureStatusSummary {
  return getFeaturesForProject(projectId, features).reduce((summary, feature) => {
    summary[feature.status] += 1;
    return summary;
  }, createEmptyStatusSummary());
}

export function projectNeedsAttention(
  projectId: string,
  features: DashboardFeature[] = dashboardMock.features,
): boolean {
  const summary = getProjectStatusSummary(projectId, features);
  return summary.Blocked > 0 || summary["In Verification"] > 0;
}

export function filterAndSortProjects(
  projects: DashboardProject[],
  features: DashboardFeature[],
  options: {
    search: string;
    filter: ExplorerFilter;
    sort: ExplorerSort;
  },
): DashboardProject[] {
  const normalizedSearch = options.search.trim().toLowerCase();
  let result = projects.filter((project) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      project.name.toLowerCase().includes(normalizedSearch) ||
      project.description.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    if (options.filter === "needs-attention") {
      return projectNeedsAttention(project.id, features);
    }

    if (options.filter === "recently-updated") {
      const updatedAt = new Date(project.updatedAt).getTime();
      const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 2;
      return updatedAt >= cutoff;
    }

    return true;
  });

  result = [...result].sort((left, right) => {
    if (options.sort === "name-asc") {
      return left.name.localeCompare(right.name);
    }
    if (options.sort === "name-desc") {
      return right.name.localeCompare(left.name);
    }
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });

  return result;
}

export function filterInboxEvents(events: InboxEvent[], filter: InboxFilter): InboxEvent[] {
  if (filter === "mentions") {
    return events.filter((event) => event.type === "mention");
  }
  if (filter === "needs-reply") {
    return events.filter((event) => event.needsReply);
  }
  return events;
}

export function getUnreadInboxCount(events: InboxEvent[]): number {
  return events.filter((event) => event.unread).length;
}

export function getCompanyAdminSettings(companyId: string): CompanyAdminSettings | undefined {
  return dashboardMock.companyAdminSettings.find((settings) => settings.companyId === companyId);
}

export function getMyWorkBuckets(companyId: string): Record<
  "actionRequired" | "mentions" | "waitingOnMe" | "recentlyUpdated",
  MyWorkItem[]
> {
  return {
    actionRequired: dashboardMock.myWork.actionRequired.filter((item) => item.companyId === companyId),
    mentions: dashboardMock.myWork.mentions.filter((item) => item.companyId === companyId),
    waitingOnMe: dashboardMock.myWork.waitingOnMe.filter((item) => item.companyId === companyId),
    recentlyUpdated: dashboardMock.myWork.recentlyUpdated.filter((item) => item.companyId === companyId),
  };
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  type DashboardCompany,
  type DashboardFeature,
  type DashboardProject,
  type DashboardRole,
  type InboxEvent,
  type InboxThread,
  type NotificationPreferences,
  dashboardMock,
  getDefaultProjectForCompany,
  getProjectsForCompany,
  getRoleForCompany,
} from "@/mocks/dashboard";

const STORAGE_COMPANY_KEY = "deftconsensus-dashboard-company";
const STORAGE_PROJECT_KEY = "deftconsensus-dashboard-project";

type CompanyWithRole = DashboardCompany & {
  membershipRole: DashboardRole;
};

type DashboardContextValue = {
  user: typeof dashboardMock.user;
  companies: CompanyWithRole[];
  selectedCompany: CompanyWithRole;
  selectedProject: DashboardProject | undefined;
  selectedCompanyId: string;
  selectedProjectId: string;
  availableProjects: DashboardProject[];
  features: DashboardFeature[];
  inboxEvents: InboxEvent[];
  inboxThreads: InboxThread[];
  notificationPreferences: NotificationPreferences;
  isCompanyAdmin: boolean;
  setSelectedCompanyId: (companyId: string) => void;
  setSelectedProjectId: (projectId: string) => void;
  updateFeature: (featureId: string, patch: Partial<DashboardFeature>) => void;
  markInboxEventRead: (eventId: string) => void;
  sendQuickReply: (threadId: string, message: string) => void;
  setNotificationPreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K],
  ) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const companies = useMemo<CompanyWithRole[]>(
    () =>
      dashboardMock.companies.map((company) => ({
        ...company,
        membershipRole: getRoleForCompany(company.id),
      })),
    [],
  );

  const [selectedCompanyId, setSelectedCompanyIdState] = useState(companies[0]?.id ?? "");
  const [selectedProjectId, setSelectedProjectIdState] = useState(
    getDefaultProjectForCompany(companies[0]?.id ?? "")?.id ?? "",
  );

  const [features, setFeatures] = useState<DashboardFeature[]>(dashboardMock.features);
  const [inboxEvents, setInboxEvents] = useState<InboxEvent[]>(dashboardMock.inboxEvents);
  const [inboxThreads, setInboxThreads] = useState<InboxThread[]>(dashboardMock.inboxThreads);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(
    dashboardMock.notificationPreferences,
  );

  useEffect(() => {
    const storedCompany = window.localStorage.getItem(STORAGE_COMPANY_KEY);
    const storedProject = window.localStorage.getItem(STORAGE_PROJECT_KEY);

    if (storedCompany && companies.some((company) => company.id === storedCompany)) {
      setSelectedCompanyIdState(storedCompany);
      const defaultProjectId = getDefaultProjectForCompany(storedCompany)?.id ?? "";
      setSelectedProjectIdState(defaultProjectId);
    }

    if (storedProject && dashboardMock.projects.some((project) => project.id === storedProject)) {
      setSelectedProjectIdState(storedProject);
    }
  }, [companies]);

  useEffect(() => {
    if (selectedCompanyId) {
      window.localStorage.setItem(STORAGE_COMPANY_KEY, selectedCompanyId);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedProjectId) {
      window.localStorage.setItem(STORAGE_PROJECT_KEY, selectedProjectId);
    }
  }, [selectedProjectId]);

  const selectedCompany = useMemo(() => {
    return companies.find((company) => company.id === selectedCompanyId) ?? companies[0];
  }, [companies, selectedCompanyId]);

  const availableProjects = useMemo(() => {
    return getProjectsForCompany(selectedCompany?.id ?? "");
  }, [selectedCompany]);

  const selectedProject = useMemo(() => {
    return availableProjects.find((project) => project.id === selectedProjectId) ?? availableProjects[0];
  }, [availableProjects, selectedProjectId]);

  useEffect(() => {
    if (!selectedProject && availableProjects[0]) {
      setSelectedProjectIdState(availableProjects[0].id);
      return;
    }
    if (selectedProject && selectedProject.companyId !== selectedCompany?.id && availableProjects[0]) {
      setSelectedProjectIdState(availableProjects[0].id);
    }
  }, [availableProjects, selectedCompany, selectedProject]);

  const setSelectedCompanyId = useCallback(
    (companyId: string) => {
      if (!companies.some((company) => company.id === companyId)) {
        return;
      }
      setSelectedCompanyIdState(companyId);
      const defaultProject = getDefaultProjectForCompany(companyId);
      setSelectedProjectIdState(defaultProject?.id ?? "");
    },
    [companies],
  );

  const setSelectedProjectId = useCallback(
    (projectId: string) => {
      if (!availableProjects.some((project) => project.id === projectId)) {
        return;
      }
      setSelectedProjectIdState(projectId);
    },
    [availableProjects],
  );

  const updateFeature = useCallback((featureId: string, patch: Partial<DashboardFeature>) => {
    setFeatures((current) => current.map((feature) => (feature.id === featureId ? { ...feature, ...patch } : feature)));
  }, []);

  const markInboxEventRead = useCallback((eventId: string) => {
    setInboxEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? {
              ...event,
              unread: false,
            }
          : event,
      ),
    );
  }, []);

  const sendQuickReply = useCallback((threadId: string, message: string) => {
    const sanitized = message.trim();
    if (!sanitized) {
      return;
    }

    setInboxThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              lastMessage: sanitized,
              unreadCount: 0,
            }
          : thread,
      ),
    );

    setInboxEvents((current) =>
      current.map((event) =>
        event.threadId === threadId
          ? {
              ...event,
              unread: false,
              needsReply: false,
              threadPreview: sanitized,
            }
          : event,
      ),
    );
  }, []);

  const setNotificationPreference = useCallback(
    <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
      setNotificationPreferences((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  if (!selectedCompany) {
    return null;
  }

  const value: DashboardContextValue = {
    user: dashboardMock.user,
    companies,
    selectedCompany,
    selectedProject,
    selectedCompanyId,
    selectedProjectId,
    availableProjects,
    features,
    inboxEvents,
    inboxThreads,
    notificationPreferences,
    isCompanyAdmin: selectedCompany.membershipRole === "admin",
    setSelectedCompanyId,
    setSelectedProjectId,
    updateFeature,
    markInboxEventRead,
    sendQuickReply,
    setNotificationPreference,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within DashboardProvider");
  }
  return context;
}

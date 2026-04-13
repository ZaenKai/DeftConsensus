"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type InboxFilter, filterInboxEvents } from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

const inboxFilterOptions: Array<{ value: InboxFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "mentions", label: "Mentions" },
  { value: "needs-reply", label: "Needs Reply" },
];

export function InboxPage() {
  const searchParams = useSearchParams();
  const uiState = searchParams.get("state");
  const isLoading = uiState === "loading";
  const isError = uiState === "error";
  const forceEmpty = uiState === "empty";

  const { selectedCompany, inboxEvents, inboxThreads, markInboxEventRead, sendQuickReply } = useDashboardContext();

  const [filter, setFilter] = useState<InboxFilter>("all");
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [draftReply, setDraftReply] = useState("");

  const scopedEvents = useMemo(() => {
    const source = forceEmpty ? [] : inboxEvents.filter((event) => event.companyId === selectedCompany.id);
    return filterInboxEvents(source, filter);
  }, [filter, forceEmpty, inboxEvents, selectedCompany.id]);

  const scopedThreads = useMemo(
    () => inboxThreads.filter((thread) => thread.companyId === selectedCompany.id),
    [inboxThreads, selectedCompany.id],
  );

  const recentComments = useMemo(
    () => scopedEvents.filter((event) => event.type === "comment" || event.type === "mention"),
    [scopedEvents],
  );

  useEffect(() => {
    if (!scopedThreads.some((thread) => thread.id === activeThreadId)) {
      setActiveThreadId(scopedThreads[0]?.id ?? "");
    }
  }, [activeThreadId, scopedThreads]);

  const activeThread = scopedThreads.find((thread) => thread.id === activeThreadId);

  const handleReply = () => {
    if (!activeThread || draftReply.trim().length === 0) {
      return;
    }
    sendQuickReply(activeThread.id, draftReply);
    setDraftReply("");
  };

  return (
    <div className="space-y-7">
      <section aria-labelledby="inbox-title">
        <span className="dashboard-chip">Inbox</span>
        <h2 id="inbox-title" className="mt-1 font-heading text-3xl font-bold tracking-tight">
          Global triage
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Clear notifications and recent comments without leaving dashboard context.
        </p>
      </section>

      {isError ? (
        <section className="dashboard-subcard border-danger/40 bg-danger/10 p-4">
          <h3 className="font-heading text-lg font-semibold text-danger">Inbox failed to load</h3>
          <p className="mt-1 text-sm text-muted">Retry this route or switch inbox filters.</p>
        </section>
      ) : null}

      <section aria-label="Inbox filters" className="surface-card p-4">
        <div className="flex flex-wrap gap-2">
          {inboxFilterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`dashboard-nav-link px-3 py-1.5 text-sm ${
                option.value === filter
                  ? "border-primary/45 bg-primary/12 font-semibold text-primary"
                  : "text-muted"
              }`}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-4 md:p-5" aria-labelledby="inbox-events-title">
          <h3 id="inbox-events-title" className="font-heading text-xl font-semibold">
            Notifications
          </h3>
          {isLoading ? (
            <p className="mt-3 text-sm text-muted">Loading notification stream…</p>
          ) : scopedEvents.length === 0 ? (
            <p className="dashboard-subcard mt-3 px-3 py-2 text-sm text-muted">No events for this filter.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {scopedEvents.map((event) => (
                <li key={event.id} className="dashboard-subcard p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link href={event.href} className="text-sm font-semibold text-text hover:text-primary">
                      {event.title}
                    </Link>
                    <span className="text-xs uppercase tracking-wide text-muted">
                      {event.unread ? "Unread" : "Seen"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{event.threadPreview}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.unread ? (
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary"
                        onClick={() => markInboxEventRead(event.id)}
                      >
                        Mark read
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <div className="space-y-4">
          <article className="surface-card p-4 md:p-5" aria-labelledby="inbox-quick-reply-title">
            <h3 id="inbox-quick-reply-title" className="font-heading text-xl font-semibold">
              Quick reply
            </h3>

            <label htmlFor="inbox-thread-selector" className="mt-3 block text-xs uppercase tracking-wide text-muted">
              Thread
            </label>
            <select
              id="inbox-thread-selector"
              className="dashboard-control mt-1 text-sm"
              value={activeThreadId}
              onChange={(event) => setActiveThreadId(event.target.value)}
            >
              {scopedThreads.map((thread) => (
                <option key={thread.id} value={thread.id}>
                  {thread.subject}
                </option>
              ))}
            </select>

            <label htmlFor="inbox-quick-reply-input" className="mt-3 block text-xs uppercase tracking-wide text-muted">
              Message
            </label>
            <textarea
              id="inbox-quick-reply-input"
              className="dashboard-control mt-1 min-h-24 text-sm"
              placeholder={activeThread ? `Reply in ${activeThread.subject}` : "No available thread"}
              value={draftReply}
              onChange={(event) => setDraftReply(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  handleReply();
                }
              }}
              disabled={!activeThread}
            />

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                className="gradient-button px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleReply}
                disabled={!activeThread || draftReply.trim().length === 0}
              >
                Send reply
              </button>
              <p className="text-xs text-muted">Use Ctrl/⌘ + Enter to send</p>
            </div>
          </article>

          <article className="surface-card p-4 md:p-5" aria-labelledby="inbox-comments-title">
            <h3 id="inbox-comments-title" className="font-heading text-xl font-semibold">
              Recent comments
            </h3>
            {recentComments.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No recent comment activity.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {recentComments.slice(0, 5).map((event) => (
                  <li key={event.id} className="dashboard-subcard p-3">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="mt-1 text-xs text-muted">{event.threadPreview}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}

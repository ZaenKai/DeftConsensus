"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  FormLabel,
  SegmentedControl,
  SegmentedControlItem,
  Textarea,
} from "@deftai/deft-components";
import { type InboxFilter, filterInboxEvents } from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

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
        <Badge variant="outline">Inbox</Badge>
        <h2 id="inbox-title" className="mt-1 text-3xl font-bold tracking-tight">
          Global triage
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Clear notifications and recent comments without leaving dashboard context.
        </p>
      </section>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Inbox failed to load</AlertTitle>
          <AlertDescription>Retry this route or switch inbox filters.</AlertDescription>
        </Alert>
      ) : null}

      <Card aria-label="Inbox filters">
        <CardContent className="p-4">
          <SegmentedControl
            value={filter}
            onValueChange={(value) => setFilter(value as InboxFilter)}
            size="sm"
            aria-label="Inbox filter"
          >
            {inboxFilterOptions.map((option) => (
              <SegmentedControlItem key={option.value} value={option.value}>
                {option.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card aria-labelledby="inbox-events-title">
          <CardHeader>
            <CardTitle id="inbox-events-title">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading notification stream…</p>
            ) : scopedEvents.length === 0 ? (
              <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                No events for this filter.
              </p>
            ) : (
              <ul className="space-y-2">
                {scopedEvents.map((event) => (
                  <li key={event.id} className="rounded-md border border-border bg-muted/30 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Link
                        href={event.href}
                        className="text-sm font-semibold text-foreground hover:text-accent"
                      >
                        {event.title}
                      </Link>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {event.unread ? "Unread" : "Seen"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{event.threadPreview}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.unread ? (
                        <button
                          type="button"
                          className="text-xs font-semibold text-accent"
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
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card aria-labelledby="inbox-quick-reply-title">
            <CardHeader>
              <CardTitle id="inbox-quick-reply-title">Quick reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField id="inbox-thread-selector" className="space-y-1">
                <FormLabel className="text-xs uppercase tracking-wide">Thread</FormLabel>
                <select
                  id="inbox-thread-selector"
                  className={selectClassName}
                  value={activeThreadId}
                  onChange={(event) => setActiveThreadId(event.target.value)}
                >
                  {scopedThreads.map((thread) => (
                    <option key={thread.id} value={thread.id}>
                      {thread.subject}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="inbox-quick-reply-input" className="space-y-1">
                <FormLabel className="text-xs uppercase tracking-wide">Message</FormLabel>
                <Textarea
                  id="inbox-quick-reply-input"
                  className="min-h-24"
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
              </FormField>

              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!activeThread || draftReply.trim().length === 0}
                >
                  Send reply
                </Button>
                <p className="text-xs text-muted-foreground">Use Ctrl/⌘ + Enter to send</p>
              </div>
            </CardContent>
          </Card>

          <Card aria-labelledby="inbox-comments-title">
            <CardHeader>
              <CardTitle id="inbox-comments-title">Recent comments</CardTitle>
            </CardHeader>
            <CardContent>
              {recentComments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent comment activity.</p>
              ) : (
                <ul className="space-y-2">
                  {recentComments.slice(0, 5).map((event) => (
                    <li key={event.id} className="rounded-md border border-border bg-muted/30 p-3">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{event.threadPreview}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

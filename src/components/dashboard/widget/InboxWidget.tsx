"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MessageIcon } from "@/components/landing/icons";
import { getUnreadInboxCount } from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

export function InboxWidget() {
  const pathname = usePathname() ?? "";
  const { selectedCompany, inboxEvents, inboxThreads, sendQuickReply } = useDashboardContext();
  const [isOpen, setOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [draftReply, setDraftReply] = useState("");

  const scopedThreads = useMemo(
    () => inboxThreads.filter((thread) => thread.companyId === selectedCompany.id),
    [inboxThreads, selectedCompany.id],
  );
  const scopedEvents = useMemo(
    () => inboxEvents.filter((event) => event.companyId === selectedCompany.id),
    [inboxEvents, selectedCompany.id],
  );
  const unreadCount = getUnreadInboxCount(scopedEvents);

  useEffect(() => {
    if (!scopedThreads.some((thread) => thread.id === activeThreadId)) {
      setActiveThreadId(scopedThreads[0]?.id ?? "");
    }
  }, [activeThreadId, scopedThreads]);

  const activeThread = scopedThreads.find((thread) => thread.id === activeThreadId);

  const handleSendReply = () => {
    if (!activeThread) {
      return;
    }
    sendQuickReply(activeThread.id, draftReply);
    setDraftReply("");
  };

  if (pathname.startsWith("/inbox")) {
    return null;
  }

  return (
    <div className={`fixed bottom-5 right-4 z-40 ${isOpen ? "w-[calc(100vw-2rem)] max-w-sm" : ""}`}>
      {!isOpen ? (
        <button
          type="button"
          className="gradient-button relative inline-flex h-12 w-12 items-center justify-center rounded-full shadow-neu"
          onClick={() => setOpen(true)}
          aria-label="Open inbox widget"
        >
          <MessageIcon className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border border-primary/25 bg-white px-1.5 text-[10px] font-semibold text-primary shadow-sm">
              {unreadCount}
            </span>
          ) : null}
        </button>
      ) : (
        <section className="dashboard-panel space-y-3 p-4" aria-label="Inbox quick triage widget">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold">Quick Inbox</h2>
            <button type="button" className="text-sm text-muted hover:text-text" onClick={() => setOpen(false)}>
              Minimize
            </button>
          </div>

          <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
            {scopedThreads.length === 0 ? (
              <p className="text-sm text-muted">No recent threads.</p>
            ) : (
              scopedThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  className={`dashboard-nav-link w-full px-3 py-2 text-left text-sm ${
                    thread.id === activeThreadId
                      ? "border-primary/45 bg-primary/12 text-text"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveThreadId(thread.id)}
                >
                  <p className="font-medium text-text">{thread.subject}</p>
                  <p className="line-clamp-1 text-xs text-muted">{thread.lastMessage}</p>
                </button>
              ))
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="widget-quick-reply" className="text-xs font-medium uppercase tracking-wide text-muted">
              Quick reply
            </label>
            <input
              id="widget-quick-reply"
              className="dashboard-control text-sm"
              placeholder={activeThread ? `Reply to ${activeThread.subject}` : "Select a thread"}
              value={draftReply}
              onChange={(event) => setDraftReply(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSendReply();
                }
              }}
              disabled={!activeThread}
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="gradient-button px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSendReply}
                disabled={!activeThread || draftReply.trim().length === 0}
              >
                Send
              </button>
              <Link href="/inbox" className="text-xs font-semibold text-primary">
                Open full inbox
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

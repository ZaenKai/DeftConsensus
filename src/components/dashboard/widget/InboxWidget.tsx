"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  FormField,
  FormLabel,
  Input,
  ScrollArea,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@deftai/deft-components";
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
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed bottom-5 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open inbox widget"
        >
          <MessageIcon className="h-5 w-5" />
          {unreadCount > 0 ? (
            <Badge
              variant="destructive"
              size="sm"
              className="absolute -right-1 -top-1 min-w-5 justify-center"
            >
              {unreadCount}
            </Badge>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm" aria-label="Inbox quick triage widget">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Quick Inbox</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="sm">
              Minimize
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea className="max-h-44 pr-1">
          <div className="space-y-2">
            {scopedThreads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent threads.</p>
            ) : (
              scopedThreads.map((thread) => {
                const active = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    className={[
                      "block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "border-accent bg-accent/20 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-accent/10",
                    ].join(" ")}
                    onClick={() => setActiveThreadId(thread.id)}
                  >
                    <p className="font-medium text-foreground">{thread.subject}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{thread.lastMessage}</p>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>

        <FormField id="widget-quick-reply" className="space-y-2">
          <FormLabel className="text-xs uppercase tracking-wide">Quick reply</FormLabel>
          <Input
            id="widget-quick-reply"
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
        </FormField>
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            onClick={handleSendReply}
            disabled={!activeThread || draftReply.trim().length === 0}
          >
            Send
          </Button>
          <Link href="/inbox" className="text-xs font-semibold text-accent">
            Open full inbox
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

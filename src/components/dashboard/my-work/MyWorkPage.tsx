"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@deftai/deft-components";
import { getMyWorkBuckets } from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

type SectionKey = "actionRequired" | "mentions" | "waitingOnMe" | "recentlyUpdated";

const sectionMeta: Record<SectionKey, { title: string; description: string }> = {
  actionRequired: {
    title: "Action Required",
    description: "Items that need immediate response.",
  },
  mentions: {
    title: "Mentions",
    description: "Conversation threads where you were called in.",
  },
  waitingOnMe: {
    title: "Waiting on Me",
    description: "Dependencies blocked on your confirmation.",
  },
  recentlyUpdated: {
    title: "Recently Updated",
    description: "Latest feature-level movement in your active company.",
  },
};

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MyWorkPage() {
  const searchParams = useSearchParams();
  const uiState = searchParams.get("state");
  const { selectedCompany } = useDashboardContext();

  const baseBuckets = getMyWorkBuckets(selectedCompany.id);
  const isLoading = uiState === "loading";
  const isError = uiState === "error";
  const useEmpty = uiState === "empty";

  const buckets: Record<SectionKey, typeof baseBuckets.actionRequired> = useEmpty
    ? {
        actionRequired: [],
        mentions: [],
        waitingOnMe: [],
        recentlyUpdated: [],
      }
    : baseBuckets;

  const summaryCards: Array<{ label: string; value: number }> = [
    { label: "Action Required", value: buckets.actionRequired.length },
    { label: "Mentions", value: buckets.mentions.length },
    { label: "Waiting on Me", value: buckets.waitingOnMe.length },
    { label: "Recently Updated", value: buckets.recentlyUpdated.length },
  ];

  return (
    <div className="space-y-7">
      <section aria-labelledby="my-work-title">
        <Badge variant="outline">My Work</Badge>
        <h2 id="my-work-title" className="mt-1 text-3xl font-bold tracking-tight">
          Action index for {selectedCompany.shortName}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Prioritized triage view for assignments, mentions, and status movement. Open project summary or feature detail
          pages for deeper workflows.
        </p>
      </section>

      {isError ? (
        <Alert variant="destructive" aria-live="polite">
          <AlertTitle>My Work failed to load</AlertTitle>
          <AlertDescription>Try refreshing or switch to a different company context.</AlertDescription>
        </Alert>
      ) : null}

      <section aria-label="My Work summary counts" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-accent">{isLoading ? "…" : card.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section aria-label="My Work sections" className="grid gap-4 lg:grid-cols-2">
        {(Object.keys(sectionMeta) as SectionKey[]).map((sectionKey) => (
          <Card key={sectionKey} aria-labelledby={`section-${sectionKey}-title`}>
            <CardHeader>
              <CardTitle id={`section-${sectionKey}-title`}>{sectionMeta[sectionKey].title}</CardTitle>
              <CardDescription>{sectionMeta[sectionKey].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading section…</p>
              ) : buckets[sectionKey].length === 0 ? (
                <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                  No items in this section.
                </p>
              ) : (
                <ul className="space-y-2">
                  {buckets[sectionKey].map((item) => (
                    <li key={item.id} className="rounded-md border border-border bg-muted/30 p-3">
                      <Link href={item.href} className="text-sm font-semibold text-foreground hover:text-accent">
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                        {formatTimestamp(item.updatedAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

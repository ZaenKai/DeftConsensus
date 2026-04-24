import { Suspense } from "react";
import { InboxPage } from "@/components/dashboard/inbox/InboxPage";

export default function InboxRoute() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading inbox…</div>}>
      <InboxPage />
    </Suspense>
  );
}

import { Suspense } from "react";
import { InboxPage } from "@/components/dashboard/inbox/InboxPage";

export default function InboxRoute() {
  return (
    <Suspense fallback={<div className="surface-card p-4 text-sm text-muted">Loading inbox…</div>}>
      <InboxPage />
    </Suspense>
  );
}

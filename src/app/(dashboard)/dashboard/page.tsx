import { Suspense } from "react";
import { MyWorkPage } from "@/components/dashboard/my-work/MyWorkPage";

export default function DashboardHomeRoute() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading dashboard…</div>}>
      <MyWorkPage />
    </Suspense>
  );
}

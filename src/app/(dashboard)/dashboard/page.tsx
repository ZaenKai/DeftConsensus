import { Suspense } from "react";
import { MyWorkPage } from "@/components/dashboard/my-work/MyWorkPage";

export default function DashboardHomeRoute() {
  return (
    <Suspense fallback={<div className="surface-card p-4 text-sm text-muted">Loading dashboard…</div>}>
      <MyWorkPage />
    </Suspense>
  );
}

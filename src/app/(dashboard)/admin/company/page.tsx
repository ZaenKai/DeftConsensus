import { Suspense } from "react";
import { CompanyAdminPage } from "@/components/dashboard/admin/CompanyAdminPage";

export default function CompanyAdminRoute() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading company admin…</div>}>
      <CompanyAdminPage />
    </Suspense>
  );
}

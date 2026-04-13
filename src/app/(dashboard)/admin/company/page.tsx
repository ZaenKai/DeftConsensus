import { Suspense } from "react";
import { CompanyAdminPage } from "@/components/dashboard/admin/CompanyAdminPage";

export default function CompanyAdminRoute() {
  return (
    <Suspense fallback={<div className="surface-card p-4 text-sm text-muted">Loading company admin…</div>}>
      <CompanyAdminPage />
    </Suspense>
  );
}

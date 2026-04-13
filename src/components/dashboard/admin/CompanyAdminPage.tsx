"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCompanyAdminSettings } from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

export function CompanyAdminPage() {
  const searchParams = useSearchParams();
  const uiState = searchParams.get("state");
  const isLoading = uiState === "loading";
  const isError = uiState === "error";
  const forceEmpty = uiState === "empty";

  const { selectedCompany, isCompanyAdmin } = useDashboardContext();
  const adminSettings = getCompanyAdminSettings(selectedCompany.id);

  if (!isCompanyAdmin) {
    return (
      <section className="dashboard-subcard border-danger/35 bg-danger/10 p-5">
        <h2 className="font-heading text-2xl font-bold text-danger">Unauthorized</h2>
        <p className="mt-2 text-sm text-muted">
          Admin settings are only available when your role in the selected company is admin.
        </p>
        <Link href="/projects" className="mt-3 inline-flex text-sm font-semibold text-primary">
          Back to projects
        </Link>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="dashboard-subcard border-danger/40 bg-danger/10 p-5">
        <h2 className="font-heading text-2xl font-bold text-danger">Admin settings failed to load</h2>
        <p className="mt-2 text-sm text-muted">Retry after refreshing this route.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="dashboard-subcard p-5 text-sm text-muted" aria-live="polite">
        Loading company admin settings…
      </section>
    );
  }

  if (forceEmpty || !adminSettings) {
    return (
      <section className="dashboard-subcard p-5 text-sm text-muted">
        No admin configuration is available for this company.
      </section>
    );
  }

  return (
    <div className="space-y-7">
      <section aria-labelledby="admin-company-title">
        <span className="dashboard-chip">Admin</span>
        <h2 id="admin-company-title" className="mt-1 font-heading text-3xl font-bold tracking-tight">
          {adminSettings.profile.name} Settings
        </h2>
      </section>

      <section className="surface-card p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold">Company profile</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Name</span>
            <input value={adminSettings.profile.name} readOnly className="dashboard-control" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Domain</span>
            <input value={adminSettings.profile.domain} readOnly className="dashboard-control" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Timezone</span>
            <input value={adminSettings.profile.timezone} readOnly className="dashboard-control" />
          </label>
        </div>
      </section>

      <section className="surface-card p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold">Members & roles</h3>
        <ul className="mt-3 space-y-2">
          {adminSettings.members.map((member) => (
            <li key={member.id} className="dashboard-subcard p-3">
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-muted">
                {member.email} · {member.role}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold">Project policy placeholders</h3>
        <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
          {adminSettings.projectPolicies.map((policy) => (
            <li key={policy}>{policy}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

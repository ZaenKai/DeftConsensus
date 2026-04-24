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
  CardHeader,
  CardTitle,
  Input,
} from "@deftai/deft-components";
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
      <Alert variant="destructive">
        <AlertTitle>Unauthorized</AlertTitle>
        <AlertDescription>
          Admin settings are only available when your role in the selected company is admin.{" "}
          <Link href="/projects" className="font-semibold text-accent">
            Back to projects
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Admin settings failed to load</AlertTitle>
        <AlertDescription>Retry after refreshing this route.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground" aria-live="polite">
          Loading company admin settings…
        </CardContent>
      </Card>
    );
  }

  if (forceEmpty || !adminSettings) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          No admin configuration is available for this company.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-7">
      <section aria-labelledby="admin-company-title">
        <Badge variant="outline">Admin</Badge>
        <h2 id="admin-company-title" className="mt-1 text-3xl font-bold tracking-tight">
          {adminSettings.profile.name} Settings
        </h2>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Company profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Name</span>
              <Input value={adminSettings.profile.name} readOnly />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Domain</span>
              <Input value={adminSettings.profile.domain} readOnly />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Timezone</span>
              <Input value={adminSettings.profile.timezone} readOnly />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members & roles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {adminSettings.members.map((member) => (
              <li key={member.id} className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">
                  {member.email} · {member.role}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project policy placeholders</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {adminSettings.projectPolicies.map((policy) => (
              <li key={policy}>{policy}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

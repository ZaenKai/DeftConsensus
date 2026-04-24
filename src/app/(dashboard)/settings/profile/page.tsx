import { Suspense } from "react";
import { ProfileSettingsPage } from "@/components/dashboard/settings/ProfileSettingsPage";

export default function ProfileSettingsRoute() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading settings…</div>}>
      <ProfileSettingsPage />
    </Suspense>
  );
}

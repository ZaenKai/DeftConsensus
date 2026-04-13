import { Suspense } from "react";
import { ProfileSettingsPage } from "@/components/dashboard/settings/ProfileSettingsPage";

export default function ProfileSettingsRoute() {
  return (
    <Suspense fallback={<div className="surface-card p-4 text-sm text-muted">Loading settings…</div>}>
      <ProfileSettingsPage />
    </Suspense>
  );
}

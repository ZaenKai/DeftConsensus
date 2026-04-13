"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { dashboardMock } from "@/mocks/dashboard";
import { useDashboardContext } from "../shell/DashboardContext";

export function ProfileSettingsPage() {
  const searchParams = useSearchParams();
  const uiState = searchParams.get("state");
  const isLoading = uiState === "loading";
  const isError = uiState === "error";
  const forceEmpty = uiState === "empty";

  const { user, notificationPreferences, setNotificationPreference } = useDashboardContext();
  const [savedMessage, setSavedMessage] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSavedMessage("Preferences saved (mock).");
  };

  if (isError) {
    return (
      <section className="dashboard-subcard border-danger/40 bg-danger/10 p-5">
        <h2 className="font-heading text-2xl font-bold text-danger">Profile settings unavailable</h2>
        <p className="mt-2 text-sm text-muted">Try again after refreshing this route.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="dashboard-subcard p-5 text-sm text-muted" aria-live="polite">
        Loading profile settings…
      </section>
    );
  }

  if (forceEmpty) {
    return (
      <section className="dashboard-subcard p-5 text-sm text-muted">
        No profile settings are available for the current user context.
      </section>
    );
  }

  return (
    <div className="space-y-7">
      <section aria-labelledby="profile-settings-title">
        <span className="dashboard-chip">Settings</span>
        <h2 id="profile-settings-title" className="mt-1 font-heading text-3xl font-bold tracking-tight">
          Profile & Preferences
        </h2>
      </section>
      <section className="surface-card p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold">Profile summary</h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Name</dt>
            <dd className="mt-1 text-sm font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Email</dt>
            <dd className="mt-1 text-sm font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Role</dt>
            <dd className="mt-1 text-sm font-medium">{user.title}</dd>
          </div>
        </dl>
      </section>

      <section className="surface-card p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold">Notification preferences</h3>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notificationPreferences.mentions}
              onChange={(event) => setNotificationPreference("mentions", event.target.checked)}
            />
            Mentions and direct comment pings
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notificationPreferences.assignments}
              onChange={(event) => setNotificationPreference("assignments", event.target.checked)}
            />
            Assignment and ownership changes
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notificationPreferences.digestEmails}
              onChange={(event) => setNotificationPreference("digestEmails", event.target.checked)}
            />
            Daily digest summary email
          </label>

          <button type="submit" className="gradient-button px-4 py-2 text-sm font-semibold">
            Save preferences
          </button>
          {savedMessage ? <p className="text-sm text-success">{savedMessage}</p> : null}
        </form>
      </section>

      <section className="surface-card p-5 md:p-6">
        <h3 className="font-heading text-xl font-semibold">Sessions & Security</h3>
        <ul className="mt-3 space-y-2">
          {dashboardMock.sessions.map((session) => (
            <li key={session.id} className="dashboard-subcard p-3">
              <p className="text-sm font-medium">{session.label}</p>
              <p className="text-xs text-muted">
                {session.location} · {session.lastActive} {session.current ? "· Current session" : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

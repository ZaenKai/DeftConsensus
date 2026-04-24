"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckboxField,
} from "@deftai/deft-components";
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
      <Alert variant="destructive">
        <AlertTitle>Profile settings unavailable</AlertTitle>
        <AlertDescription>Try again after refreshing this route.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground" aria-live="polite">
          Loading profile settings…
        </CardContent>
      </Card>
    );
  }

  if (forceEmpty) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          No profile settings are available for the current user context.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-7">
      <section aria-labelledby="profile-settings-title">
        <Badge variant="outline">Settings</Badge>
        <h2 id="profile-settings-title" className="mt-1 text-3xl font-bold tracking-tight">
          Profile & Preferences
        </h2>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Profile summary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
              <dd className="mt-1 text-sm font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
              <dd className="mt-1 text-sm font-medium">{user.title}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <CheckboxField
              id="notify-mentions"
              label="Mentions and direct comment pings"
              checked={notificationPreferences.mentions}
              onCheckedChange={(checked) =>
                setNotificationPreference("mentions", checked === true)
              }
            />
            <CheckboxField
              id="notify-assignments"
              label="Assignment and ownership changes"
              checked={notificationPreferences.assignments}
              onCheckedChange={(checked) =>
                setNotificationPreference("assignments", checked === true)
              }
            />
            <CheckboxField
              id="notify-digest"
              label="Daily digest summary email"
              checked={notificationPreferences.digestEmails}
              onCheckedChange={(checked) =>
                setNotificationPreference("digestEmails", checked === true)
              }
            />

            <Button type="submit">Save preferences</Button>
            {savedMessage ? <p className="text-sm text-success">{savedMessage}</p> : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions & Security</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {dashboardMock.sessions.map((session) => (
              <li key={session.id} className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-sm font-medium">{session.label}</p>
                <p className="text-xs text-muted-foreground">
                  {session.location} · {session.lastActive} {session.current ? "· Current session" : ""}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

import { DashboardProvider } from "@/components/dashboard/shell/DashboardContext";
import { DashboardShell } from "@/components/dashboard/shell/DashboardShell";

export default function AuthenticatedDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}

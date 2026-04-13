import { InboxWidget } from "../widget/InboxWidget";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-page min-h-screen text-text">
      <div className="mx-auto w-full max-w-[1760px] px-2 pb-6 pt-2 sm:px-4 lg:px-6 lg:pt-3">
        <div className="lg:grid lg:grid-cols-[18.5rem_minmax(0,1fr)] lg:gap-4">
          <DashboardSidebar />
          <div className="min-w-0 space-y-3 lg:space-y-4">
            <DashboardTopBar />
            <main className="w-full px-0.5 pb-3 sm:px-0">{children}</main>
          </div>
        </div>
      </div>
      <InboxWidget />
    </div>
  );
}

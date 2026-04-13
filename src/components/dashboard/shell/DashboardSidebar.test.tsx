import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardProvider } from "./DashboardContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";

describe("Dashboard shell context controls", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("updates sidebar admin visibility and project options when company context changes in top bar", async () => {
    const user = userEvent.setup();
    render(
      <DashboardProvider>
        <DashboardTopBar />
        <DashboardSidebar />
      </DashboardProvider>,
    );

    expect(screen.queryByRole("link", { name: /^admin$/i })).not.toBeInTheDocument();

    const companySelect = screen.getByLabelText(/^company$/i);
    await user.selectOptions(companySelect, "northstar");

    expect(screen.getByRole("link", { name: /^admin$/i })).toBeInTheDocument();

    const projectSelect = screen.getByLabelText(/^project$/i);
    const projectOptions = within(projectSelect).getAllByRole("option").map((option) => option.textContent ?? "");
    expect(projectOptions.some((label) => label.includes("CarePath Mobile"))).toBe(true);
    expect(projectOptions.some((label) => label.includes("PulseOps Analytics"))).toBe(true);
    expect(projectOptions.some((label) => label.includes("Apollo Workspace"))).toBe(false);
  });
});

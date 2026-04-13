import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardProvider } from "../shell/DashboardContext";
import { InboxWidget } from "./InboxWidget";

describe("InboxWidget", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("supports quick reply submission from keyboard", async () => {
    const user = userEvent.setup();
    render(
      <DashboardProvider>
        <InboxWidget />
      </DashboardProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open inbox widget/i }));

    const input = screen.getByLabelText(/quick reply/i);
    await user.type(input, "Follow up from widget{enter}");

    expect(input).toHaveValue("");
    expect(screen.getByText(/follow up from widget/i)).toBeInTheDocument();
  });

  it("can be minimized after opening", async () => {
    const user = userEvent.setup();
    render(
      <DashboardProvider>
        <InboxWidget />
      </DashboardProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open inbox widget/i }));
    expect(screen.getByRole("button", { name: /minimize/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /minimize/i }));
    expect(screen.getByRole("button", { name: /open inbox widget/i })).toBeInTheDocument();
  });
});

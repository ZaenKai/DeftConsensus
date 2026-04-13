import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";

describe("Landing page", () => {
  it("renders hero, value props, and how-it-works sections", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: /align every team before code gets written/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /why teams use deftconsensus/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /how it works/i })).toBeInTheDocument();
  });

  it("routes sign-in CTA to /login", () => {
    render(<HomePage />);
    const signInLink = screen.getByRole("link", { name: /sign in to dashboard/i });

    expect(signInLink).toHaveAttribute("href", "/login");
  });

  it("switches theme modes from the toggle", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: /switch theme to dark/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement).toHaveAttribute("data-theme-mode", "dark");

    await user.click(screen.getByRole("button", { name: /switch theme to light/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement).toHaveAttribute("data-theme-mode", "light");
  });

  it("opens modal from hero CTA and closes with escape", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const buttons = screen.getAllByRole("button", { name: /explore how it works/i });
    await user.click(buttons[0]);
    expect(screen.getByRole("heading", { name: /why teams choose deftconsensus/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: /why teams choose deftconsensus/i })).not.toBeInTheDocument(),
    );
  });

  it("opens modal from how-it-works section CTA", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const buttons = screen.getAllByRole("button", { name: /explore how it works/i });
    await user.click(buttons[1]);

    expect(screen.getByRole("heading", { name: /why teams choose deftconsensus/i })).toBeInTheDocument();
  });

  it("supports keyboard activation for CTA", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const heroCta = screen.getAllByRole("button", { name: /explore how it works/i })[0];
    heroCta.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("heading", { name: /why teams choose deftconsensus/i })).toBeInTheDocument();
  });
});

import { ThemeToggle } from "./ThemeToggle";
import { GridIcon, LogoMarkIcon, RouteIcon } from "./icons";

type ThemeMode = "system" | "light" | "dark";

type TopNavProps = {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenModal: () => void;
};

const navItems = [
  { label: "Why DeftConsensus", href: "#value-props", Icon: GridIcon },
  { label: "How it works", href: "#how-it-works", Icon: RouteIcon },
];

export function TopNav({ themeMode, onThemeChange, onOpenModal }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-surfaceEdge/70 bg-bg/80 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-16 items-center justify-between gap-4 py-2">
          <a href="#top" className="inline-flex items-center gap-2 rounded-full border border-surfaceEdge bg-surface/85 px-3 py-1.5 shadow-soft">
            <LogoMarkIcon className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">DeftConsensus</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
            {navItems.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-text"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle value={themeMode} onChange={onThemeChange} />
            <button
              type="button"
              className="gradient-button hidden px-4 py-2 text-xs font-semibold uppercase tracking-wide sm:inline-flex"
              onClick={onOpenModal}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

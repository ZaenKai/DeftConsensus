"use client";

type ThemeMode = "system" | "light" | "dark";

type ThemeToggleProps = {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const options: ThemeMode[] = ["system", "light", "dark"];

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Theme mode"
      className="inline-flex items-center gap-1 rounded-full border border-surfaceEdge bg-surface/90 p-1 text-xs shadow-soft backdrop-blur"
    >
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wide transition ${
              isActive
                ? "bg-primary font-semibold text-white shadow-soft"
                : "font-medium text-muted hover:text-text"
            }`}
            aria-label={`Switch theme to ${option}`}
            aria-pressed={isActive}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

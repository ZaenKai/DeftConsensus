"use client";

import { SegmentedControl, SegmentedControlItem } from "@deftai/deft-components";
import { useTheme, type ThemeMode } from "@/components/theme/ThemeProvider";

const options: ThemeMode[] = ["light", "dark"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl
      aria-label="Theme mode"
      value={theme}
      onValueChange={(value) => setTheme(value as ThemeMode)}
      size="sm"
    >
      {options.map((option) => (
        <SegmentedControlItem
          key={option}
          value={option}
          aria-label={`Switch theme to ${option}`}
        >
          {option}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}

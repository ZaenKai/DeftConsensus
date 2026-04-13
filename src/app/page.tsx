"use client";

import { useEffect, useState } from "react";
import { ExplainerModal } from "@/components/landing/ExplainerModal";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorksSection } from "@/components/landing/HowItWorks";
import { TopNav } from "@/components/landing/TopNav";
import { ValuePropsSection } from "@/components/landing/ValueProps";
import { landingMock } from "@/mocks/landing";

type ThemeMode = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const THEME_KEY = "deftconsensus-theme";
function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolvedTheme = mode === "system" ? resolveSystemTheme() : mode;
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.setAttribute("data-theme-mode", mode);
  document.documentElement.style.colorScheme = resolvedTheme;
}

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const initialMode: ThemeMode =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "light";
    setThemeMode(initialMode);
    applyTheme(initialMode);
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      const activeMode = (window.localStorage.getItem(THEME_KEY) as ThemeMode) ?? "light";
      if (activeMode === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleSystemThemeChange);
    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    window.localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
  };

  return (
    <main className="brand-page">
      <TopNav themeMode={themeMode} onThemeChange={handleThemeChange} onOpenModal={() => setModalOpen(true)} />
      <Hero
        headline={landingMock.hero.headline}
        subheadline={landingMock.hero.subheadline}
        primaryLabel={landingMock.ctas.primaryLabel}
        secondaryLabel={landingMock.ctas.secondaryLabel}
        secondaryHref={landingMock.ctas.secondaryHref}
        onOpenModal={() => setModalOpen(true)}
      />
      <ValuePropsSection items={landingMock.valueProps} />
      <HowItWorksSection
        steps={landingMock.howItWorks}
        ctaLabel={landingMock.ctas.primaryLabel}
        onOpenModal={() => setModalOpen(true)}
      />
      <Footer />
      <ExplainerModal open={isModalOpen} onOpenChange={setModalOpen} benefits={landingMock.modalBenefits} />
    </main>
  );
}

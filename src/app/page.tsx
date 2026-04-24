"use client";

import { useState } from "react";
import { ExplainerModal } from "@/components/landing/ExplainerModal";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorksSection } from "@/components/landing/HowItWorks";
import { TopNav } from "@/components/landing/TopNav";
import { ValuePropsSection } from "@/components/landing/ValueProps";
import { landingMock } from "@/mocks/landing";

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopNav onOpenModal={() => setModalOpen(true)} />
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

import type { HowItWorksStep } from "@/mocks/landing";
import { MessageIcon, ShieldCheckIcon, SparkIcon } from "./icons";

type HowItWorksSectionProps = {
  steps: HowItWorksStep[];
  ctaLabel: string;
  onOpenModal: () => void;
};
const stepIcons = [MessageIcon, SparkIcon, ShieldCheckIcon];

function StepIcon({ index }: { index: number }) {
  const Icon = stepIcons[index % stepIcons.length];
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-soft">
      <Icon className="h-5 w-5" />
      <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
        {index + 1}
      </span>
    </div>
  );
}

export function HowItWorksSection({ steps, ctaLabel, onOpenModal }: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="w-full border-b border-surfaceEdge/60 bg-transparent py-12"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <p className="gradient-kicker text-xs font-semibold uppercase tracking-[0.14em]">From intent to delivery</p>
        <h2 id="how-it-works-title" className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Discuss needs → Swarm synthesis → Verified implementation
        </p>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="surface-card relative p-5">
              <div className="mb-4 flex items-center gap-3">
                <StepIcon index={index} />
                {index < steps.length - 1 ? (
                  <div aria-hidden="true" className="hidden h-[2px] flex-1 bg-primary/35 md:block" />
                ) : null}
              </div>
              <h3 className="font-heading text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <button
            type="button"
            className="gradient-button px-6 py-3 text-sm font-semibold sm:text-base"
            onClick={onOpenModal}
          >
            {ctaLabel}
          </button>
          <p className="mt-3 text-xs text-muted">Kick off with a shared brief, then delegate verification to agents.</p>
        </div>
      </div>
    </section>
  );
}

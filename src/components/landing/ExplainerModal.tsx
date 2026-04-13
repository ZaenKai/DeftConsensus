"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ModalBenefit } from "@/mocks/landing";
import { ChartIcon, SparkIcon, UsersIcon } from "./icons";

type ExplainerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefits: ModalBenefit[];
};
const benefitIcons = [UsersIcon, SparkIcon, ChartIcon];

export function ExplainerModal({ open, onOpenChange, benefits }: ExplainerModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[#0a0f24]/70 backdrop-blur-sm" />
        <Dialog.Content
          className="neu-panel fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 p-6 sm:p-8"
          aria-describedby="explainer-description"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="gradient-kicker text-xs font-semibold uppercase tracking-[0.14em]">Expanded walkthrough</p>
              <Dialog.Title className="mt-2 font-heading text-2xl font-bold tracking-tight">
                Why teams choose DeftConsensus
              </Dialog.Title>
              <Dialog.Description id="explainer-description" className="mt-2 text-sm text-muted">
                Expanded detail on the core benefits of the platform.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="secondary-button px-3 py-1 text-sm text-muted hover:text-text"
              aria-label="Close modal"
            >
              Close
            </Dialog.Close>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return (
              <article key={benefit.title} className="rounded-neu border border-surfaceEdge bg-surface/85 p-4 shadow-soft">
                <div className="inline-flex rounded-full border border-primary/25 bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="accent-divider" aria-hidden="true" />
                <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted">{benefit.description}</p>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted">
                  {benefit.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

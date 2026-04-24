"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@deftai/deft-components";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" aria-describedby="explainer-description">
        <DialogHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Expanded walkthrough</p>
          <DialogTitle>Why teams choose DeftConsensus</DialogTitle>
          <DialogDescription id="explainer-description">
            Expanded detail on the core benefits of the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[index % benefitIcons.length];
            return (
              <article
                key={benefit.title}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 p-2 text-accent">
                  <Icon className="h-4 w-4" />
                </div>
                <div aria-hidden="true" className="mt-2 h-[3px] w-10 rounded-full bg-accent" />
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  {benefit.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

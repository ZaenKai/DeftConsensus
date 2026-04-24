import { Card, CardContent } from "@deftai/deft-components";
import type { ValueProp } from "@/mocks/landing";
import { ChartIcon, SparkIcon, UsersIcon } from "./icons";

type ValuePropsSectionProps = {
  items: ValueProp[];
};
const valuePropIcons = [UsersIcon, SparkIcon, ChartIcon];

export function ValuePropsSection({ items }: ValuePropsSectionProps) {
  return (
    <section
      id="value-props"
      aria-labelledby="value-props-title"
      className="w-full border-y border-border bg-card/30 py-12"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Built for aligned execution</p>
          <h2 id="value-props-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Why teams use DeftConsensus
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Replace fragmented planning with one shared system for intent, constraints, and delivery proof.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = valuePropIcons[index % valuePropIcons.length];
            return (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 p-2 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div aria-hidden="true" className="mt-3 h-[3px] w-14 rounded-full bg-accent" />
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

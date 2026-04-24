import Link from "next/link";
import { Badge, Button, Card, CardContent } from "@deftai/deft-components";
import { ChartIcon, GridIcon, MessageIcon, RouteIcon, SparkIcon, UsersIcon } from "./icons";

type HeroProps = {
  headline: string;
  subheadline: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  onOpenModal: () => void;
};
const featureChips = [
  { label: "Projects", Icon: GridIcon },
  { label: "Chat", Icon: MessageIcon },
  { label: "AI Agents", Icon: SparkIcon },
  { label: "Docs", Icon: UsersIcon },
  { label: "Roadmaps", Icon: RouteIcon },
  { label: "Automations", Icon: ChartIcon },
];
const previewRows = [
  { title: "Product launch brief", tag: "In review", Icon: MessageIcon },
  { title: "Engineering dependency map", tag: "Validated", Icon: RouteIcon },
  { title: "Go-to-market readiness", tag: "Aligned", Icon: ChartIcon },
];

export function Hero({
  headline,
  subheadline,
  primaryLabel,
  secondaryLabel,
  secondaryHref,
  onOpenModal,
}: HeroProps) {
  return (
    <section id="top" aria-labelledby="hero-title" className="w-full px-4 pt-8 sm:px-6 lg:px-10 lg:pt-10">
      <Card className="relative overflow-hidden">
        <CardContent className="p-7 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 bottom-6 h-32 w-32 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="grid items-start gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Consensus-as-Code</p>
              <h1
                id="hero-title"
                className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
              >
                {headline}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{subheadline}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={onOpenModal}>
                  {primaryLabel}
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {featureChips.map(({ label, Icon }) => (
                  <li key={label}>
                    <Badge variant="outline">
                      <Icon className="h-3.5 w-3.5 text-accent" />
                      {label}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                All humans, all agents, one workspace for aligned delivery
              </p>
            </div>
            <aside>
              <Card>
                <CardContent className="p-5 sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Live workspace preview
                  </p>
                  <div className="mt-4 space-y-3">
                    {previewRows.map((row) => (
                      <div
                        key={row.title}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <row.Icon className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">{row.title}</span>
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {row.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { value: "3x", label: "Faster briefs" },
                      { value: "24/7", label: "Agent coverage" },
                      { value: "100%", label: "Traceability" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-md border border-border bg-muted/30 px-2 py-2 text-center"
                      >
                        <p className="text-lg font-bold text-foreground">{stat.value}</p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">Free forever. No credit card.</p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

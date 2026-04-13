import Link from "next/link";
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
      <div className="neu-panel overflow-hidden p-7 sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/32 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 bottom-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="grid items-start gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="gradient-kicker mb-3 text-sm font-semibold uppercase tracking-[0.14em]">Consensus-as-Code</p>
            <h1 id="hero-title" className="font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {headline}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{subheadline}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="gradient-button px-6 py-3 text-sm font-semibold sm:text-base"
                onClick={onOpenModal}
              >
                {primaryLabel}
              </button>
              <Link
                href={secondaryHref}
                className="secondary-button px-6 py-3 text-center text-sm font-medium shadow-soft sm:text-base"
              >
                {secondaryLabel}
              </Link>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {featureChips.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-surfaceEdge bg-surface/80 px-3 py-1 text-xs font-medium text-muted shadow-soft"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted">
              All humans, all agents, one workspace for aligned delivery
            </p>
          </div>
          <aside className="hero-preview float-soft p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Live workspace preview</p>
            <div className="mt-4 space-y-3">
              {previewRows.map((row) => (
                <div key={row.title} className="hero-preview-row flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <row.Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-text">{row.title}</span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{row.tag}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="hero-preview-row px-2 py-2 text-center">
                <p className="text-lg font-bold text-text">3x</p>
                <p className="text-[10px] uppercase tracking-wide text-muted">Faster briefs</p>
              </div>
              <div className="hero-preview-row px-2 py-2 text-center">
                <p className="text-lg font-bold text-text">24/7</p>
                <p className="text-[10px] uppercase tracking-wide text-muted">Agent coverage</p>
              </div>
              <div className="hero-preview-row px-2 py-2 text-center">
                <p className="text-lg font-bold text-text">100%</p>
                <p className="text-[10px] uppercase tracking-wide text-muted">Traceability</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted">Free forever. No credit card.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

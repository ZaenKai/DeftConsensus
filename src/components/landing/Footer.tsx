import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-border bg-card/40">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              DeftConsensus
            </p>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Consensus-as-Code for teams that need shared intent before implementation.
            </p>
          </div>
          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            <a href="#top" className="transition hover:text-foreground">
              Top
            </a>
            <a href="#value-props" className="transition hover:text-foreground">
              Why DeftConsensus
            </a>
            <a href="#how-it-works" className="transition hover:text-foreground">
              How it works
            </a>
            <Link href="/login" className="transition hover:text-foreground">
              Dashboard login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

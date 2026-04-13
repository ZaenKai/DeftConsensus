import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-surfaceEdge/70 bg-surface/45">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">DeftConsensus</p>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Consensus-as-Code for teams that need shared intent before implementation.
            </p>
          </div>
          <nav aria-label="Footer links" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <a href="#top" className="transition hover:text-text">
              Top
            </a>
            <a href="#value-props" className="transition hover:text-text">
              Why DeftConsensus
            </a>
            <a href="#how-it-works" className="transition hover:text-text">
              How it works
            </a>
            <Link href="/login" className="transition hover:text-text">
              Dashboard login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

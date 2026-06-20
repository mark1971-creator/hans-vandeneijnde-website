import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone/50 bg-stone/20 dark:border-charcoal-light/40 dark:bg-charcoal-light/20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-sm text-charcoal/70 dark:text-ivory/70">
          &copy; {year} Hans van den Eijnde. All rights reserved.
        </p>

        <div className="flex flex-col items-center gap-1 text-sm sm:items-end">
          <Link
            href="mailto:hans.vandeneijnde@skynet.be"
            className="text-charcoal/80 transition-colors hover:text-terracotta dark:text-ivory/80 dark:hover:text-gold"
          >
            hans.vandeneijnde@skynet.be
          </Link>
          <p className="text-charcoal/60 dark:text-ivory/60">
            Oil paintings &amp; drawings
          </p>
        </div>
      </div>
    </footer>
  );
}

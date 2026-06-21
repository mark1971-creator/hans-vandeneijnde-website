import Image from "next/image";
import Link from "next/link";

const BFP_URL = "https://beingatfullpotential.com";

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

      <div className="border-t border-stone/30 dark:border-charcoal-light/25">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href={BFP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex cursor-pointer rounded-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta dark:focus-visible:outline-gold"
            aria-label="Being at Full Potential — visit beingatfullpotential.com"
          >
            <Image
              src="/images/bfp-logo-charcoal.png"
              alt="Being at Full Potential"
              width={168}
              height={36}
              className="h-7 w-auto opacity-70 transition-opacity group-hover:opacity-90 dark:hidden"
            />
            <Image
              src="/images/bfp-logo-ivory.png"
              alt="Being at Full Potential"
              width={168}
              height={36}
              className="hidden h-7 w-auto opacity-70 transition-opacity group-hover:opacity-90 dark:block"
            />
          </Link>
          <p className="text-[11px] tracking-[0.12em] text-charcoal/45 uppercase dark:text-ivory/40">
            Every Human, Being at Full Potential
          </p>
        </div>
      </div>
    </footer>
  );
}

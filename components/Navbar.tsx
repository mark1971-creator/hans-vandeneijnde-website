"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { HomeLink } from "./HomeLink";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/paintings", label: "Paintings" },
  { href: "/drawings", label: "Drawings" },
  { href: "/portraits", label: "Portraits" },
  { href: "/available-works", label: "Available Works" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-stone/50 bg-ivory/90 shadow-sm backdrop-blur-md dark:border-charcoal-light/40 dark:bg-charcoal/90"
          : "border-b border-transparent bg-ivory/70 backdrop-blur-sm dark:bg-charcoal/70"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <HomeLink
          href="/"
          className="font-display text-xl tracking-wide text-charcoal transition-colors hover:text-terracotta dark:text-ivory dark:hover:text-gold sm:text-2xl"
        >
          Hans van den Eijnde
        </HomeLink>

        <div className="hidden items-center gap-1 lg:flex xl:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return link.href === "/" ? (
              <HomeLink
                key={link.href}
                href="/"
                className={`relative px-3 py-2 text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-terracotta dark:text-gold"
                    : "text-charcoal/80 hover:text-terracotta dark:text-ivory/80 dark:hover:text-gold"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-terracotta dark:bg-gold"
                  />
                )}
              </HomeLink>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-terracotta dark:text-gold"
                    : "text-charcoal/80 hover:text-terracotta dark:text-ivory/80 dark:hover:text-gold"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-terracotta dark:bg-gold"
                  />
                )}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-stone/60 dark:border-charcoal-light/50">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone/60 text-charcoal transition-colors hover:border-terracotta/50 hover:text-terracotta dark:border-charcoal-light/50 dark:text-ivory dark:hover:border-gold/50 dark:hover:text-gold"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-stone/40 bg-ivory dark:border-charcoal-light/40 dark:bg-charcoal lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
              {navLinks.map((link, index) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {link.href === "/" ? (
                      <HomeLink
                        href="/"
                        className={`block border-b border-stone/30 py-3 text-base tracking-wide transition-colors last:border-b-0 dark:border-charcoal-light/30 ${
                          isActive
                            ? "text-terracotta dark:text-gold"
                            : "text-charcoal/90 hover:text-terracotta dark:text-ivory/90 dark:hover:text-gold"
                        }`}
                      >
                        {link.label}
                      </HomeLink>
                    ) : (
                      <Link
                        href={link.href}
                        className={`block border-b border-stone/30 py-3 text-base tracking-wide transition-colors last:border-b-0 dark:border-charcoal-light/30 ${
                          isActive
                            ? "text-terracotta dark:text-gold"
                            : "text-charcoal/90 hover:text-terracotta dark:text-ivory/90 dark:hover:text-gold"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

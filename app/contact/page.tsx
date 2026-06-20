import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { contactInfo } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact | Hans van den Eijnde",
  description:
    "Get in touch with Hans van den Eijnde about available works, commissions, or portrait enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <header className="page-header">
        <h1 className="heading-display">Contact</h1>
        <p>
          Questions about a painting or drawing, a commission, or an available
          work? Reach out by email or phone — Hans will reply as soon as
          possible.
        </p>
      </header>

      <section className="section-padding pt-0">
        <div className="container-narrow">
          <div className="rounded-sm border border-stone/50 bg-stone/15 p-8 dark:border-charcoal-light/40 dark:bg-charcoal-light/10 sm:p-10">
            <h2 className="text-center font-display text-2xl text-charcoal dark:text-ivory sm:text-3xl">
              Direct contact
            </h2>
            <div className="divider mx-auto my-6" />

            <ul className="mx-auto mt-8 max-w-md space-y-6">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex items-start gap-4 text-charcoal transition-colors hover:text-terracotta dark:text-ivory dark:hover:text-gold"
                >
                  <span className="mt-0.5 rounded-full border border-stone/60 p-2 dark:border-charcoal-light/50">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-[0.15em] text-muted">
                      Email
                    </span>
                    <span className="mt-1 block text-base sm:text-lg">
                      {contactInfo.email}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`tel:${contactInfo.phoneHref}`}
                  className="group flex items-start gap-4 text-charcoal transition-colors hover:text-terracotta dark:text-ivory dark:hover:text-gold"
                >
                  <span className="mt-0.5 rounded-full border border-stone/60 p-2 dark:border-charcoal-light/50">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-[0.15em] text-muted">
                      Phone
                    </span>
                    <span className="mt-1 block text-base sm:text-lg">
                      {contactInfo.phone}
                    </span>
                  </span>
                </a>
              </li>

              <li className="flex items-start gap-4 text-charcoal dark:text-ivory">
                <span className="mt-0.5 rounded-full border border-stone/60 p-2 dark:border-charcoal-light/50">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-[0.15em] text-muted">
                    Location
                  </span>
                  <span className="mt-1 block text-base sm:text-lg">
                    {contactInfo.location}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hans-vandeneijnde.be";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hans van den Eijnde | Painter",
  description:
    "Portfolio of Hans van den Eijnde — oil paintings, drawings, and portraits. A curated gallery of figurative and landscape work in warm, classical tradition.",
  keywords: [
    "Hans van den Eijnde",
    "painter",
    "oil paintings",
    "drawings",
    "portraits",
    "Belgian artist",
    "figurative art",
  ],
  authors: [{ name: "Hans van den Eijnde" }],
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "Hans van den Eijnde | Painter",
    description:
      "Oil paintings, drawings, and portraits by Hans van den Eijnde.",
    locale: "nl_BE",
    type: "website",
    siteName: "Hans van den Eijnde",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Jerez de la Frontera — painting by Hans van den Eijnde",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hans van den Eijnde | Painter",
    description:
      "Oil paintings, drawings, and portraits by Hans van den Eijnde.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${cormorant.variable} ${sourceSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

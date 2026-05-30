import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://prelli.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PreLLI — Precious Little Lives Initiative",
    template: "%s · PreLLI",
  },
  description:
    "Precious Little Lives Initiative (PreLLI) — a Nigerian non-profit bringing hope to orphans, widows, and the elderly through humanitarian relief, education, and empowerment since 2018.",
  keywords: [
    "PreLLI",
    "Precious Little Lives Initiative",
    "Nigeria non-profit",
    "orphans",
    "widows",
    "charity Abuja",
    "humanitarian",
  ],
  openGraph: {
    title: "PreLLI — Precious Little Lives Initiative",
    description:
      "Bringing hope to orphans, widows, and the elderly across Nigeria since 2018.",
    url: SITE_URL,
    siteName: "PreLLI",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@prelli" },
};

export const viewport: Viewport = {
  themeColor: "#7BBA3C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Precious Little Lives Initiative",
    alternateName: "PreLLI",
    url: SITE_URL,
    email: "prellicares@gmail.com",
    foundingDate: "2018",
    description:
      "A Nigerian non-profit supporting orphans, widows, and the elderly through humanitarian relief, education, and empowerment.",
    areaServed: "Nigeria",
    sameAs: [
      "https://instagram.com/prelli",
      "https://facebook.com/prelli",
      "https://twitter.com/prelli",
    ],
  };

  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

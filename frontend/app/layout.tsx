import type { Metadata } from "next";
import { bodyFont, headingFallbackFont, taglineFallbackFont } from "@/lib/fonts";
import "./globals.css";

const SITE_DESCRIPTION =
  "Enactus ENSI - Entrepreneurial action for a better world. Discover our team, projects, events and partners.";

export const metadata: Metadata = {
  title: {
    default: "Enactus ENSI",
    template: "%s | Enactus ENSI",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Enactus ENSI",
    title: "Enactus ENSI",
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/logo-enactus-ensi.png", width: 582, height: 313, alt: "Enactus ENSI" }],
  },
  twitter: {
    card: "summary",
    title: "Enactus ENSI",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFallbackFont.variable} ${taglineFallbackFont.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}

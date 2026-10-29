import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import SentryErrorBoundary from "@/components/observability/SentryErrorBoundary";
import PostHogProvider from "@/components/observability/PostHogProvider";
import CookieConsentBanner from "@/components/compliance/CookieConsentBanner";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoUGC — Creator Marketing Without the Operations",
  description:
    "AutoUGC runs your entire creator program end to end. You see everything in real time, your team only sets the direction.",
  metadataBase: new URL("https://autougc.ai"),
  alternates: {
    canonical: "https://autougc.ai",
  },
  openGraph: {
    title: "AutoUGC — Creator Marketing Without the Operations",
    description: "AutoUGC runs your entire creator program end to end. You see everything in real time, your team only sets the direction.",
    url: "https://autougc.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoUGC — Creator Marketing Without the Operations",
    description: "AutoUGC runs your entire creator program end to end.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${jakarta.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#f6f7f2" />
      </head>
      <body className="min-h-full bg-[var(--bg-app)] text-[var(--text-primary)] font-[family-name:var(--font-body)] selection:bg-[#2A482E] selection:text-white">
        {/* Skip to Main Content Link for Keyboard & Screen Reader Users (WCAG 2.4.1 Bypass Blocks) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#1F3824] focus:text-white focus:rounded-full focus:shadow-2xl focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 text-xs font-bold uppercase tracking-wider transition-all"
        >
          Skip to main content
        </a>
        <ClerkProvider>
          <SentryErrorBoundary>
            <Suspense fallback={null}>
              <PostHogProvider>
                {children}
                <CookieConsentBanner />
              </PostHogProvider>
            </Suspense>
          </SentryErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
}

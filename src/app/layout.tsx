import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "AutoUGC — Turn Any Product URL into Viral TikTok & Reels Ads in 15s",
  description:
    "Autonomous AI UGC video ads generator and social scheduler. High-converting 9:16 vertical ads tailored for e-commerce, SaaS, and modern digital brands.",
  metadataBase: new URL("https://autougc.ai"),
  alternates: {
    canonical: "https://autougc.ai",
  },
  openGraph: {
    title: "AutoUGC — High-Converting AI UGC Ads Generator",
    description: "Generate 10-20s viral video ads backed by proven hooks in 15 seconds.",
    url: "https://autougc.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoUGC — High-Converting AI UGC Ads Generator",
    description: "Turn Any Product URL into Viral TikTok & Reels Ads in 15s.",
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
      className={`${jakarta.variable} ${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#09090B" />
      </head>
      <body className="min-h-full bg-[var(--bg-app)] text-[var(--text-primary)] font-[family-name:var(--font-body)] selection:bg-[var(--accent-primary)] selection:text-black">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
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
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
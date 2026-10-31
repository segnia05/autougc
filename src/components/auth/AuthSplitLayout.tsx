"use client";

import React, { Suspense } from "react";
import { AuthMarketingCanvas } from "@/components/auth/AuthMarketingCanvas";
import { AuthForm } from "@/components/auth/AuthForm";

interface AuthSplitLayoutProps {
  mode: "sign-in" | "sign-up";
}

export function AuthSplitLayout({ mode }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5]">
      {/* Left Pane: Autonomous SaaS Ad Creator & Perspective Highway (50vw on Desktop) */}
      <section
        aria-label="Autonomous SaaS Acquisition Engine Visualization"
        className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen lg:sticky lg:top-0 h-auto lg:h-screen overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-neutral-900/10"
      >
        <AuthMarketingCanvas />
      </section>

      {/* Right Pane: Luxury Warm Ivory Authentication Card (50vw on Desktop) */}
      <section
        aria-label="Fastlane Account Authentication"
        className="relative w-full lg:w-1/2 min-h-screen flex flex-col bg-[#FAF8F5] overflow-y-auto"
      >
        <Suspense
          fallback={
            <div className="w-full min-h-screen flex items-center justify-center font-mono text-xs text-neutral-400">
              Initializing secure session...
            </div>
          }
        >
          <AuthForm mode={mode} />
        </Suspense>
      </section>
    </div>
  );
}

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignIn, SignUp } from "@clerk/nextjs";
import { FastlaneLogo } from "@/components/auth/FastlaneLogo";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
  const searchParams = useSearchParams();

  // Extract redirect_url parameter (e.g. /onboarding?url=https%3A%2F%2Flinear.app)
  const redirectQuery = searchParams.get("redirect_url");
  const targetRedirect = redirectQuery || "/onboarding";

  // Segmented toggle URLs preserving redirection
  const toggleSignInUrl = `/sign-in${
    redirectQuery ? `?redirect_url=${encodeURIComponent(redirectQuery)}` : ""
  }`;
  const toggleSignUpUrl = `/sign-up${
    redirectQuery ? `?redirect_url=${encodeURIComponent(redirectQuery)}` : ""
  }`;

  // Unified Fastlane Appearance Configuration for Clerk
  const fastlaneClerkAppearance = {
    layout: {
      socialButtonsVariant: "blockButton" as const,
      logoPlacement: "none" as const,
    },
    variables: {
      colorPrimary: "#18181B",
      colorText: "#18181B",
      colorBackground: "transparent",
      colorInputBackground: "#FFFFFF",
      colorInputText: "#18181B",
      borderRadius: "0.875rem",
      fontFamily: "inherit",
    },
    elements: {
      rootBox: "w-full",
      cardBox: "w-full shadow-none",
      card: "w-full shadow-none bg-transparent p-0 border-none",
      header: "items-start text-left p-0 mb-6",
      headerTitle: "text-3xl font-semibold tracking-tight text-neutral-950 font-sans text-left",
      headerSubtitle: "text-sm text-neutral-500 font-sans text-left mt-1",
      socialButtonsBlockButton:
        "w-full h-12 rounded-full border border-[#E2DFD8] bg-white hover:bg-neutral-50/80 text-neutral-800 text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer",
      socialButtonsBlockButtonText: "font-medium text-sm text-neutral-800",
      dividerRow: "my-6",
      dividerText: "text-xs text-neutral-400 font-mono uppercase tracking-widest bg-[#FAF8F5] px-3",
      dividerLine: "bg-[#E5E2DC]",
      formFieldLabel: "text-xs font-medium text-neutral-700 tracking-wide mb-1.5",
      formFieldInput:
        "h-11 w-full rounded-xl bg-white border border-[#E5E2DC] px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all",
      formButtonPrimary:
        "w-full h-12 rounded-full bg-gradient-to-b from-[#262629] to-[#121214] hover:from-[#323236] hover:to-[#1a1a1d] text-white text-sm font-medium tracking-wide shadow-md active:scale-[0.99] transition-all cursor-pointer",
      footer: "!hidden",
      footerAction: "!hidden",
      identityPreviewText: "text-sm font-medium text-neutral-900",
      identityPreviewEditButton:
        "text-xs font-mono text-[#D95D39] hover:underline cursor-pointer",
      formFieldErrorText: "text-xs text-red-600 mt-1 font-mono",
      alertText: "text-xs text-red-700 font-mono",
    },
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] flex flex-col justify-between p-6 sm:p-10 lg:p-12">
      {/* Top Bar: Brand Logo & Segmented Pill Toggle */}
      <header className="flex items-center justify-between w-full">
        <FastlaneLogo
          className="flex items-center gap-2.5"
          markClassName="h-4 w-7 text-neutral-900 fill-current"
          textClassName="text-base font-bold tracking-tight text-neutral-900 font-sans"
        />

        {/* Pill Segmented Control: [ Sign in | Create account ] */}
        <nav
          aria-label="Authentication mode"
          className="flex items-center bg-[#EFECE6] p-1 rounded-full border border-[#E5E2DC]"
        >
          <Link
            href={mode === "sign-in" ? "#" : toggleSignInUrl}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              mode === "sign-in"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Sign in
          </Link>
          <Link
            href={mode === "sign-up" ? "#" : toggleSignUpUrl}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              mode === "sign-up"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Create account
          </Link>
        </nav>
      </header>

      {/* Main Centered Form Container */}
      <main className="w-full max-w-[400px] mx-auto my-auto py-8">
        {mode === "sign-in" ? (
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl={toggleSignUpUrl}
            fallbackRedirectUrl={targetRedirect}
            forceRedirectUrl={redirectQuery ? targetRedirect : undefined}
            appearance={fastlaneClerkAppearance}
          />
        ) : (
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl={toggleSignInUrl}
            fallbackRedirectUrl={targetRedirect}
            forceRedirectUrl={redirectQuery ? targetRedirect : undefined}
            appearance={fastlaneClerkAppearance}
          />
        )}

        {/* Terms & Privacy Notice */}
        <p className="text-center text-xs text-neutral-500 leading-relaxed mt-6">
          By continuing you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
          >
            Privacy policy
          </Link>
          .
        </p>
      </main>

      {/* Footer Support Info */}
      <footer className="w-full flex items-center justify-between text-xs text-neutral-400 font-mono pt-4 border-t border-[#EFECE6]">
        <span>Fastlane Engine</span>
        <div className="flex items-center gap-2">
          <span>Need help?</span>
          <a
            href="mailto:support@usefastlane.ai"
            className="hover:text-neutral-800 transition-colors underline underline-offset-2"
          >
            support@usefastlane.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

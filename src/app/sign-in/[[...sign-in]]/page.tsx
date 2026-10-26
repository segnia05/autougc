import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)]">
      <Suspense fallback={<div className="text-xs text-[var(--text-muted)] font-mono">Loading sign in...</div>}>
        <SignIn />
      </Suspense>
    </div>
  );
}

import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)]">
      <Suspense fallback={<div className="text-xs text-[var(--text-muted)] font-mono">Loading sign up...</div>}>
        <SignUp />
      </Suspense>
    </div>
  );
}

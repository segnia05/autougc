import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F7F2] p-4 text-[#1B231B]">
      <Link href="/" className="flex items-center gap-2 mb-8 group focus:outline-none">
        <span className="text-[#1F3824] text-2xl font-bold leading-none select-none">✻</span>
        <span className="text-2xl font-semibold tracking-tight text-[#1B231B] font-sans">
          Auto<span className="font-normal">UGC</span>
        </span>
      </Link>
      <Suspense fallback={<div className="text-xs text-[#717E6C] font-mono">Loading sign in...</div>}>
        <SignIn />
      </Suspense>
    </div>
  );
}

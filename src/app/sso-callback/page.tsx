import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
          Authenticating with AutoUGC...
        </p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

interface CampaignAccountsCardProps {
  isMetaConnected?: boolean;
}

export default function CampaignAccountsCard({
  isMetaConnected = false,
}: CampaignAccountsCardProps) {
  const [connected, setConnected] = useState(isMetaConnected);

  return (
    <div className="fastlane-card p-6 bg-white space-y-4 flex flex-col justify-between select-none">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
          Accounts
        </div>

        {/* Meta Ads Row */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#EFECE6]">
          <div className="flex items-center gap-3">
            {/* Meta Infinity Logo SVG */}
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#0668E1] shadow-2xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7.3 4.5 3.5 7.9 3.5 12c0 2.4 1.3 4.6 3.3 5.9.3.2.4.6.2.9-.2.3-.6.4-.9.2-2.4-1.6-3.9-4.2-3.9-7C2.2 6.8 6.6 3 12 3s9.8 3.8 9.8 9c0 2.8-1.5 5.4-3.9 7-.3.2-.7.1-.9-.2-.2-.3-.1-.7.2-.9 2-1.3 3.3-3.5 3.3-5.9 0-4.1-3.8-7.5-8.5-7.5zm-2.7 6.3c-1.3 0-2.4 1-2.4 2.3 0 1.2 1.1 2.3 2.4 2.3 1 0 1.9-.6 2.2-1.5.1-.3.4-.5.7-.5s.6.2.7.5c.3.9 1.2 1.5 2.2 1.5 1.3 0 2.4-1 2.4-2.3 0-1.2-1.1-2.3-2.4-2.3-.9 0-1.7.5-2.1 1.3-.2.3-.5.5-.8.5s-.6-.2-.8-.5c-.4-.8-1.2-1.3-2.1-1.3z" />
              </svg>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#18181B]">Meta ads</div>
              <div className="text-[10px] text-[#8E8B85]">Needed for ads</div>
            </div>
          </div>

          {connected ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Check className="w-3 h-3" />
              <span>Connected</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConnected(true)}
              className="btn-fastlane-white text-xs px-3 py-1.5 h-8 shadow-2xs"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      <div className="pt-2 text-[11px] text-[#8E8B85] leading-relaxed border-t border-[#EFECE6]/70">
        Connecting your Meta ad account enables AutoUGC to publish and test paid ads directly from your business manager without manual export.
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { Globe, User, Share2, ArrowRight, Loader2 } from "lucide-react";

interface StepYouProps {
  onComplete: (data: {
    url: string;
    founderName: string;
    referralSource: string;
  }) => void;
  initialUrl?: string;
  initialName?: string;
}

export default function StepYou({
  onComplete,
  initialUrl = "",
  initialName = "",
}: StepYouProps) {
  const [url, setUrl] = useState(initialUrl);
  const [founderName, setFounderName] = useState(initialName);
  const [referralSource, setReferralSource] = useState("Twitter / X");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter your website URL.");
      return;
    }
    if (!founderName.trim()) {
      setError("Please enter your name so we can address you properly.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Format URL with https:// if omitted
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      onComplete({
        url: formattedUrl,
        founderName: founderName.trim(),
        referralSource,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
          Tell us about you and your brand
        </h1>
        <p className="text-xs text-[#52525B]">
          We analyze your live product, extract your software UI, and spy on
          competitor ads to build your growth engine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="fastlane-card p-6 md:p-8 space-y-5 bg-white">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Website URL Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Website URL</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. https://yourbrand.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] transition-all"
          />
          <p className="text-[11px] text-[#8E8B85]">
            Our engine captures high-res software mockups and value propositions automatically.
          </p>
        </div>

        {/* Founder Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Your First Name</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Segni"
            value={founderName}
            onChange={(e) => setFounderName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] transition-all"
          />
        </div>

        {/* Referral Source Discovery */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Where did you hear about us?</span>
          </label>
          <select
            value={referralSource}
            onChange={(e) => setReferralSource(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] transition-all"
          >
            <option value="Twitter / X">Twitter / X</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Friend / Founder Referral">Friend / Founder Referral</option>
            <option value="Google Search">Google Search</option>
            <option value="Product Hunt">Product Hunt</option>
          </select>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-fastlane-black py-3 text-xs justify-center font-semibold gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing website & extracting UI...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

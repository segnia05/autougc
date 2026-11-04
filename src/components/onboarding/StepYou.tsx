"use client";

import React, { useState, useEffect } from "react";
import { Globe, User, Share2, ArrowRight, Loader2 } from "lucide-react";

interface StepYouProps {
  onComplete: (data: {
    url: string;
    founderName: string;
    referralSource: string;
  }) => void | Promise<void>;
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

  // Sync if initialUrl is passed asynchronously or via router query
  useEffect(() => {
    if (initialUrl && !url) {
      setUrl(initialUrl);
    }
  }, [initialUrl, url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    const cleanName = founderName.trim();

    if (!cleanUrl) {
      setError("Please enter your website URL.");
      return;
    }
    if (!cleanUrl.includes(".") || cleanUrl.length < 4) {
      setError("Please enter a valid website domain (e.g. yourproduct.com or https://yourbrand.com).");
      return;
    }
    if (!cleanName) {
      setError("Please enter your first name so we can address you properly.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Format URL with https:// if omitted
      let formattedUrl = cleanUrl;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      await onComplete({
        url: formattedUrl,
        founderName: cleanName,
        referralSource,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to analyze website. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-200 w-full">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
          Tell us about you and your brand
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] max-w-md mx-auto">
          We analyze your live product, extract your software UI screenshot, and build your custom growth engine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="fastlane-card p-6 sm:p-8 space-y-5 bg-white shadow-sm border border-[#E5E0D8]">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Website URL Input */}
        <div className="space-y-1.5">
          <label htmlFor="website-url" className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Website URL</span>
          </label>
          <input
            id="website-url"
            type="text"
            required
            placeholder="e.g. https://yourbrand.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium transition-all"
          />
          <p className="text-[11px] text-[#8E8B85]">
            Our AI engine captures high-resolution software mockups and value propositions automatically.
          </p>
        </div>

        {/* Founder First Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="founder-name" className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Your First Name</span>
          </label>
          <input
            id="founder-name"
            type="text"
            required
            placeholder="e.g. Alex"
            value={founderName}
            onChange={(e) => {
              setFounderName(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium transition-all"
          />
        </div>

        {/* Referral Source Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="referral-source" className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Where did you hear about us?</span>
          </label>
          <select
            id="referral-source"
            value={referralSource}
            onChange={(e) => setReferralSource(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium transition-all cursor-pointer"
          >
            <option value="Twitter / X">Twitter / X</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Friend / Founder Referral">Friend / Founder Referral</option>
            <option value="Google Search">Google Search</option>
            <option value="Product Hunt">Product Hunt</option>
            <option value="YouTube">YouTube</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!url.trim() || !founderName.trim() || isLoading}
            className="w-full btn-fastlane-black py-3 text-xs justify-center font-semibold gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing website &amp; extracting UI...</span>
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
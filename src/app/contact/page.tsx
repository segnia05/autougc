"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import {
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Zap,
  Bot,
  AlertCircle,
} from "lucide-react";

type InquiryCategory =
  | "ad_strategy"
  | "custom_creator"
  | "enterprise_bulk"
  | "billing"
  | "feedback";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<InquiryCategory>("ad_strategy");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBrand = localStorage.getItem("autougc_brand_name");
      const storedFounder = localStorage.getItem("autougc_founder_name");
      if (storedBrand) setBrandName(storedBrand);
      if (storedFounder && storedFounder !== "Founder") setName(storedFounder);
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@autougc.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Founder",
          email: email.trim(),
          category,
          subject: subject.trim() || `Inquiry from ${brandName || "Founder"}`,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to send message. Please try again.");
        return;
      }

      setIsSuccess(true);
      setMessage("");
      setSubject("");
    } catch {
      setErrorMessage("Network error sending your message. Please reach us at support@autougc.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell brandName={brandName}>
      <div className="max-w-6xl mx-auto space-y-8 select-none pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
                Contact Founding Team
              </h1>
              <Badge variant="emerald" size="sm">
                Live Support
              </Badge>
            </div>
            <p className="text-xs text-[#52525B] max-w-xl leading-relaxed">
              Have questions about your UGC ad campaigns, custom creator actors, or scaling your video distribution? We answer every founder email personally.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-semibold text-[#18181B]">
            <Clock className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Guaranteed reply within 2 hours</span>
          </div>
        </div>

        {/* 2-Column Grid: Left Contact Form | Right Direct Channels & Concierge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (span 7): Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#18181B] tracking-tight">
                Send Us a Direct Message
              </h2>
              <p className="text-xs text-[#8E8B85] mt-0.5">
                Our founders and core engineers monitor this queue 7 days a week.
              </p>
            </div>

            {isSuccess ? (
              <div className="p-8 rounded-2xl bg-[#FFF2ED] border border-[#FCD4C7] text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-[#D95D39] text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#18181B]">
                  Message Received!
                </h3>
                <p className="text-xs text-[#52525B] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. We have received your inquiry and a member of our founding team will email you back shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-[#27272A] transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Category Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18181B]">
                    Inquiry Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "ad_strategy", label: "Ad Strategy" },
                      { id: "custom_creator", label: "Custom Creator" },
                      { id: "enterprise_bulk", label: "Enterprise Bulk" },
                      { id: "billing", label: "Billing" },
                      { id: "feedback", label: "Feedback" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as InquiryCategory)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                          category === cat.id
                            ? "bg-[#18181B] text-white border-[#18181B]"
                            : "bg-[#FAF8F5] text-[#52525B] border-[#E5E0D8] hover:border-[#D95D39]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Work Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#18181B]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#18181B]">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@yourbrand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18181B]">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of what you need..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#18181B]">
                      Message
                    </label>
                    <span className="text-[10px] text-[#8E8B85]">
                      {message.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us what you're trying to achieve or how we can assist..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim() || !email.trim()}
                    className="w-full py-3 px-5 rounded-2xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Direct Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column (span 5): Direct Concierge & Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Email Card */}
            <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#18181B] flex items-center justify-center text-white shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#18181B]">
                    Email Us Directly
                  </h3>
                  <p className="text-[11px] text-[#8E8B85]">
                    Direct inbox for all user and partner inquiries
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-[#18181B] select-all">
                  support@autougc.com
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#52525B] transition-colors"
                    title="Copy email"
                  >
                    {copiedEmail ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href="mailto:support@autougc.com"
                    className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#D95D39] transition-colors"
                    title="Open mail client"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-[#52525B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Enterprise SLA available on Scale Tier</span>
              </div>
            </div>

            {/* Custom AI Creator Actor Requests */}
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D95D39]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                  Custom Creator Avatars
                </h3>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Want a proprietary AI creator actor cloned specifically for your software with custom background studio sets? Our team can train and deploy custom creator stems in 48 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory("custom_creator");
                  setSubject("Custom AI Creator Actor Request");
                  setMessage("Hi AutoUGC team, I would like to request a custom creator actor trained for our software...");
                }}
                className="text-xs font-semibold text-[#D95D39] hover:underline inline-flex items-center gap-1"
              >
                <span>Request custom avatar training &rarr;</span>
              </button>
            </div>

            {/* Quick Answers / Help */}
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18181B]">
                <HelpCircle className="w-4 h-4 text-[#D95D39]" />
                <span>Frequently Asked</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-[#18181B]">
                    How do 1-hour pre-publish email approvals work?
                  </h4>
                  <p className="text-[11px] text-[#8E8B85] mt-0.5">
                    Before any video publishes to your TikTok or Instagram, we email you a 1-click approval button. If you don't approve or edit, it stays paused.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#18181B]">
                    Can I edit the generated video scripts and voices?
                  </h4>
                  <p className="text-[11px] text-[#8E8B85] mt-0.5">
                    Yes! Click "Launch Studio" anytime to edit hook angles, change creator voices, customize captions, or re-render video ads.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#18181B]">
                    Can I connect burner / satellite TikTok accounts?
                  </h4>
                  <p className="text-[11px] text-[#8E8B85] mt-0.5">
                    Yes. On Growth (up to 5 accounts) and Scale (up to 15 accounts), you can connect multiple satellite accounts to test different viral angles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}


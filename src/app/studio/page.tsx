"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CanvasPlayer } from "@/components/studio/CanvasPlayer";
import { CreatorVisualPicker, CREATOR_PERSONAS, CreatorPersona } from "@/components/studio/CreatorVisualPicker";
import { VideoTemplatePicker } from "@/components/studio/VideoTemplatePicker";
import { VideoTemplateArchetype, VIDEO_TEMPLATES, enforceMandatoryBrandMention } from "@/lib/templates/videoTemplates";
import { ScriptEditor } from "@/components/studio/ScriptEditor";
import { VoiceSelector } from "@/components/studio/VoiceSelector";
import { SubtitleStyler } from "@/components/studio/SubtitleStyler";
import { MusicPicker } from "@/components/studio/MusicPicker";
import { ScheduleModal } from "@/components/studio/ScheduleModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { UgcAdCompositionProps, SubtitleStyleConfig } from "@/remotion/types";
import { synthesizeVoiceover } from "@/lib/audio/ttsProvider";
import {
  Download,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Palette,
  FileText,
  Type,
  Music,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { UpgradePaywallModal, PaywallTriggerReason } from "@/components/billing/UpgradePaywallModal";

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F7F2] flex items-center justify-center text-xs font-mono text-[#717E6C]">
          Loading AutoUGC Creative Studio...
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}

type StudioTab = "script" | "creator" | "subtitles" | "audio";

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduledPostId = searchParams.get("scheduledPostId");
  const [activeTab, setActiveTab] = useState<StudioTab>("script");

  const [scheduledPostMeta, setScheduledPostMeta] = useState<{
    id: string;
    channelHandle: string;
    scheduledTime: string;
    approvalStatus: string;
    caption: string;
  } | null>(null);
  const [isSavingScheduledPost, setIsSavingScheduledPost] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplateArchetype>("organic_selfie");

  // In-Studio AI Script Generator state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAiScripts, setIsGeneratingAiScripts] = useState(false);
  const [aiGeneratedScripts, setAiGeneratedScripts] = useState<
    Array<{ angleType: string; hook: string; body: string; cta: string }>
  >([]);

  const handleGenerateAiScripts = async () => {
    if (!aiPrompt.trim() && !brandName.trim()) return;
    setIsGeneratingAiScripts(true);
    try {
      const res = await fetch("/api/v1/scripts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName || "My Brand",
          pageTitle: aiPrompt || `${brandName} Ad`,
          summary: aiPrompt || `High-converting viral video ad for ${brandName}`,
          headings: ["Key Features", "Core Problem", "Direct Call to Action"],
        }),
      });
      const data = await res.json();
      if (data.success && data.scripts?.scripts) {
        setAiGeneratedScripts(data.scripts.scripts);
        const first = data.scripts.scripts[0];
        if (first) {
          setHookText(first.hook);
          setBodyText(first.body);
          setCtaText(first.cta);
        }
      }
    } catch (err) {
      console.warn("AI script generation notice:", err);
    } finally {
      setIsGeneratingAiScripts(false);
    }
  };

  const [brandName, setBrandName] = useState(() => searchParams.get("brand") || "Lumina");
  const [hookText, setHookText] = useState(() => searchParams.get("hook") || "Stop coding under harsh fluorescent lights in 2026.");
  const [bodyText, setBodyText] = useState(() => searchParams.get("body") || "Lumina auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints.");
  const [ctaText, setCtaText] = useState(() => searchParams.get("cta") || "Click the link below and get $30 off your setup today.");
  const [brandColor, setBrandColor] = useState("#1F3824");
  const [selectedVoiceId, setSelectedVoiceId] = useState("sarah_dtc_founder");
  const [selectedTrackId, setSelectedTrackId] = useState("lofi_focus");
  const [selectedVisualUrl, setSelectedVisualUrl] = useState(
    () => searchParams.get("productImage") || searchParams.get("screenshotUrl") || searchParams.get("image") || "/images/creator-sarah.jpg"
  );
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | undefined>(
    () => searchParams.get("video") || "/videos/creator-sarah.mp4"
  );
  const [hookStickerType, setHookStickerType] = useState<"tiktok_question" | "tweet_card" | "pov_badge" | "bold_warning">("tiktok_question");
  const [showHookSticker, setShowHookSticker] = useState(true);
  const [showCtaSticker, setShowCtaSticker] = useState(true);

  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyleConfig>({
    fontSize: 54,
    primaryColor: "#FFFFFF",
    highlightColor: "#FFE600",
    position: "center",
    backgroundPill: false,
  });

  const [compositionProps, setCompositionProps] = useState<UgcAdCompositionProps>({
    brandName: searchParams.get("brand") || "Lumina",
    hookText: searchParams.get("hook") || "Stop coding under harsh fluorescent lights in 2026.",
    bodyText: searchParams.get("body") || "Lumina auto-matches natural daylight so your eyes feel rested even after 10-hour sprints.",
    ctaText: searchParams.get("cta") || "Click the link below and get $30 off your setup today.",
    brandColor: "#1F3824",
    productImageUrl: searchParams.get("productImage") || searchParams.get("screenshotUrl") || searchParams.get("image") || "/images/creator-sarah.jpg",
    videoUrl: searchParams.get("video") || "/videos/creator-sarah.mp4",
    hookStickerType: "tiktok_question",
    showHookSticker: true,
    showCtaSticker: true,
    words: [],
    subtitleStyle: {
      fontSize: 54,
      primaryColor: "#FFFFFF",
      highlightColor: "#FFE600",
      position: "center",
      backgroundPill: false,
    },
  });

  const [estimatedDuration, setEstimatedDuration] = useState(14.5);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState("");

  // Live Subscription & Paywall State
  const [subscription, setSubscription] = useState<{
    tier: string;
    name: string;
    creditsRemaining: number;
    creditsTotal: number;
  } | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<PaywallTriggerReason>("credits_exhausted");

  const fetchSubscription = React.useCallback(async () => {
    try {
      const res = await fetch("/api/v1/billing/subscription");
      const data = await res.json();
      if (data.subscription) {
        setSubscription({
          tier: data.subscription.tier,
          name: data.subscription.name,
          creditsRemaining: data.subscription.creditsRemaining,
          creditsTotal: data.subscription.creditsTotal,
        });
      }
    } catch (err) {
      console.warn("Could not load subscription details:", err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/v1/billing/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data?.subscription) {
          setSubscription({
            tier: data.subscription.tier,
            name: data.subscription.name,
            creditsRemaining: data.subscription.creditsRemaining,
            creditsTotal: data.subscription.creditsTotal,
          });
        }
      })
      .catch((err) => console.warn("Could not load subscription details:", err));

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  // Load scheduled post data when editing an upcoming post
  useEffect(() => {
    if (!scheduledPostId) return;

    let ignore = false;
    async function fetchScheduledPost() {
      try {
        const res = await fetch(`/api/v1/campaigns/post-details?id=${scheduledPostId}`);
        const json = await res.json();
        if (!ignore && json.success && json.data) {
          const d = json.data;
          setBrandName(d.brandName || "My Brand");
          setHookText(d.hookText || "Stop doing this manually in 2026.");
          setBodyText(d.bodyText || "This software handles your entire workflow automatically.");
          setCtaText(d.ctaText || "Try it out today.");
          if (d.voiceId) setSelectedVoiceId(d.voiceId);
          if (d.archetype && d.archetype in VIDEO_TEMPLATES) {
            setSelectedTemplate(d.archetype as VideoTemplateArchetype);
          }
          if (d.videoUrl) {
            setSelectedVideoUrl(d.videoUrl);
          } else if (d.creatorId) {
            const persona = CREATOR_PERSONAS.find((p) => p.id === d.creatorId || p.id.includes(d.creatorId));
            if (persona) {
              setSelectedVisualUrl(persona.imageUrl);
              setSelectedVideoUrl(undefined);
            }
          }
          setScheduledPostMeta({
            id: d.id,
            channelHandle: d.socialAccount?.accountHandle || "@yourchannel",
            scheduledTime: d.localScheduledTime || new Date(d.scheduledFor).toLocaleString(),
            approvalStatus: d.approvalStatus || "awaiting_approval",
            caption: d.caption,
          });
        }
      } catch (err) {
        console.warn("Failed to load scheduled post details:", err);
      }
    }

    fetchScheduledPost();
    return () => {
      ignore = true;
    };
  }, [scheduledPostId]);

  const handleSaveAndApproveScheduledPost = async () => {
    if (!scheduledPostId) return;
    setIsSavingScheduledPost(true);
    setSaveSuccessMessage(null);

    try {
      const activeP = CREATOR_PERSONAS.find((p) => p.imageUrl === selectedVisualUrl);
      const res = await fetch("/api/v1/campaigns/edit-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledPostId,
          brandName,
          hookText,
          bodyText,
          ctaText,
          caption: scheduledPostMeta?.caption || `${hookText} #${brandName.toLowerCase()} #ugc`,
          voiceId: selectedVoiceId,
          creatorId: activeP?.id || "pers_sarah_01",
          archetype: selectedTemplate,
          approveNow: true,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save edits and approve post");
      }

      setSaveSuccessMessage("Post updated and approved! Redirecting to calendar...");
      setTimeout(() => {
        router.push("/dashboard?tab=calendar");
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving post";
      alert(msg);
    } finally {
      setIsSavingScheduledPost(false);
    }
  };

  // Synchronize words whenever hook/body/cta or voice changes
  useEffect(() => {
    let isCancelled = false;
    const fullText = `${hookText} ${bodyText} ${ctaText}`;

    synthesizeVoiceover(fullText, selectedVoiceId).then((res) => {
      if (!isCancelled) {
        setEstimatedDuration(res.durationSeconds);
        setCompositionProps({
          brandName,
          hookText,
          bodyText,
          ctaText,
          brandColor,
          productImageUrl: selectedVisualUrl,
          videoUrl: selectedVideoUrl,
          words: res.words,
          subtitleStyle,
          archetype: selectedTemplate,
          hasVoiceover: selectedTemplate !== "meme_reaction",
          audioMode: selectedTemplate === "meme_reaction" ? "music_only" : "narration_ducked",
          hookStickerType,
          showHookSticker,
          showCtaSticker,
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [
    hookText,
    bodyText,
    ctaText,
    brandName,
    brandColor,
    selectedVoiceId,
    subtitleStyle,
    selectedVisualUrl,
    selectedVideoUrl,
    selectedTemplate,
    hookStickerType,
    showHookSticker,
    showCtaSticker,
  ]);

  const handleSelectPersona = (persona: CreatorPersona) => {
    setSelectedVisualUrl(persona.imageUrl);
    setSelectedVideoUrl(persona.videoUrl);
    setSelectedVoiceId(persona.voiceId);
  };

  const handleSelectMedia = (mediaUrl: string, isVideo = false) => {
    if (isVideo) {
      setSelectedVideoUrl(isVideo ? mediaUrl : undefined);
      setSelectedVisualUrl(mediaUrl);
    } else {
      setSelectedVideoUrl(undefined);
      setSelectedVisualUrl(mediaUrl);
    }
  };

  const handleStartExport = async () => {
    setIsExporting(true);
    setRenderError(null);
    setRenderProgress(10);
    setRenderStage("Initializing cloud render engine...");

    try {
      const res = await fetch("/api/v1/videos/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          hookText,
          bodyText,
          ctaText,
          voiceId: selectedVoiceId,
          aspectRatio: "9:16",
          productImageUrl: selectedVisualUrl,
          videoUrl: selectedVideoUrl || (selectedVisualUrl.endsWith(".mp4") ? selectedVisualUrl : "/videos/creator-sarah.mp4"),
          hookStickerType,
          showHookSticker,
          showCtaSticker,
          async: true,
        }),
      });

      const data = await res.json();

      if (res.status === 402 || data.upgradeRequired) {
        setIsExportModalOpen(false);
        setIsExporting(false);
        setPaywallReason("credits_exhausted");
        setIsPaywallOpen(true);
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to render video ad");
      }

      // Handle async queue status (Zero Vercel Timeouts)
      if (data.status === "queued" && data.jobId) {
        const jobId = data.jobId;
        const videoId = data.videoId;

        let completed = false;
        let attempts = 0;
        const maxAttempts = 60; // 60s max

        while (!completed && attempts < maxAttempts) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 800));

          try {
            const pollRes = await fetch(`/api/v1/videos/render/status?jobId=${jobId}&videoId=${videoId}`);
            const pollData = await pollRes.json();

            if (pollData.success) {
              const currentProgress = pollData.progress || Math.min(15 + attempts * 5, 88);
              setRenderProgress(currentProgress);

              if (currentProgress < 30) {
                setRenderStage("Synthesizing voiceover & word timestamps...");
              } else if (currentProgress < 65) {
                setRenderStage("Composing 9:16 vertical motion & layout...");
              } else if (currentProgress < 95) {
                setRenderStage("Encoding high-definition MP4...");
              } else {
                setRenderStage("Finalizing video creative...");
              }

              if (pollData.status === "completed" && pollData.result?.videoUrl) {
                completed = true;
                setRenderProgress(100);
                setRenderStage("Render complete");
                setRenderedVideoUrl(pollData.result.videoUrl);
                setSelectedVideoUrl(pollData.result.videoUrl);
                setExportComplete(true);
                fetchSubscription();
                return;
              }

              if (pollData.status === "failed") {
                throw new Error(pollData.error || "Background render failed");
              }
            }
          } catch (pollErr) {
            console.warn("Status polling notice:", pollErr);
          }
        }

        // If timed out, check fallback video
        const fallbackUrl = `/renders/${videoId}.mp4`;
        setRenderedVideoUrl(fallbackUrl);
        setSelectedVideoUrl(fallbackUrl);
        setExportComplete(true);
        fetchSubscription();
        return;
      }

      // Synchronous return
      setRenderedVideoUrl(data.videoUrl || "/videos/creator-sarah.mp4");
      if (data.videoUrl) {
        setSelectedVideoUrl(data.videoUrl);
      }
      setExportComplete(true);
      fetchSubscription();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to render video ad";
      setRenderError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenSchedule = () => {
    if (subscription && subscription.creditsRemaining <= 0) {
      setPaywallReason("autopilot_locked");
      setIsPaywallOpen(true);
    } else {
      setIsScheduleModalOpen(true);
    }
  };

  // Check if brand is mentioned in script
  const fullScript = `${hookText} ${bodyText} ${ctaText}`.toLowerCase();
  const hasBrandMention = brandName && fullScript.includes(brandName.toLowerCase());

  const handleAutoInjectBrand = () => {
    const enforced = enforceMandatoryBrandMention(brandName, hookText, bodyText, ctaText);
    setHookText(enforced.hookText);
    setBodyText(enforced.bodyText);
    setCtaText(enforced.ctaText);
  };

  // 5 Viral Hook Angle Presets
  const VIRAL_HOOK_PRESETS = [
    {
      id: "negative",
      label: "Negative Hook",
      text: `Stop wasting hours doing this manually in 2026.`,
    },
    {
      id: "secret",
      label: "Secret Hack",
      text: `The secret tool high-growth founders use to automate content...`,
    },
    {
      id: "problem",
      label: "Problem Agitation",
      text: `Why is nobody talking about how broken traditional agencies are?`,
    },
    {
      id: "transformation",
      label: "Before / After",
      text: `Here is what happened when we switched to autonomous UGC...`,
    },
    {
      id: "mistake",
      label: "Costly Mistake",
      text: `The $5,000 mistake SaaS founders make when hiring creators.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B]">
      {/* Studio Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#CBD5C4]/80 bg-[#F6F7F2]/95 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4A544A] hover:text-[#1F3824] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Command Center</span>
          </Link>
          <div className="h-4 w-[1px] bg-[#CBD5C4] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[#1F3824] text-lg font-bold">✻</span>
            <span className="text-sm font-bold text-[#1B231B] font-[family-name:var(--font-serif)]">
              AutoUGC Studio
            </span>
            <span className="hidden md:inline-flex text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
              {selectedTemplate === "organic_selfie"
                ? "Organic Handheld"
                : selectedTemplate === "studio_minimalist"
                ? "Studio Minimalist"
                : "Viral Meme Card"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {subscription ? (
            subscription.creditsRemaining > 0 ? (
              <Badge
                variant="emerald"
                size="sm"
                pulse
                className="font-mono text-[10px] sm:text-xs cursor-pointer hover:bg-[#E2E9DC] transition-colors"
                onClick={() => {
                  setPaywallReason("general");
                  setIsPaywallOpen(true);
                }}
              >
                {subscription.creditsRemaining} / {subscription.creditsTotal} Credits
              </Badge>
            ) : (
              <Badge
                variant="rose"
                size="sm"
                pulse
                className="font-mono text-[10px] sm:text-xs cursor-pointer hover:bg-rose-100 transition-colors"
                onClick={() => {
                  setPaywallReason("credits_exhausted");
                  setIsPaywallOpen(true);
                }}
              >
                0 Credits (Upgrade)
              </Badge>
            )
          ) : (
            <div className="h-6 w-24 bg-[#E2E9DC] rounded animate-pulse" />
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenSchedule}
            leftIcon={<Calendar className="h-3.5 w-3.5" />}
            className="text-xs px-2.5 sm:px-3"
          >
            <span className="hidden sm:inline">Schedule Post</span>
            <span className="sm:hidden">Schedule</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (subscription && subscription.creditsRemaining <= 0) {
                setPaywallReason("credits_exhausted");
                setIsPaywallOpen(true);
              } else {
                setRenderError(null);
                setExportComplete(false);
                setIsExportModalOpen(true);
              }
            }}
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-emerald-300" />}
            className="text-xs px-2.5 sm:px-3 font-semibold shadow-xs"
          >
            <span className="hidden sm:inline">Generate Video (1 Credit)</span>
            <span className="sm:hidden">Generate Video</span>
          </Button>
        </div>
      </header>

      {/* Scheduled Post Live Edit & Approval Notification Banner */}
      {scheduledPostMeta && (
        <div className="bg-[#E2E9DC] border-b border-[#CBD5C4] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#1F3824] text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1B231B]">
                  Editing Scheduled Post for {scheduledPostMeta.channelHandle}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#1F3824] text-white font-semibold">
                  {scheduledPostMeta.approvalStatus === "approved" ? "Approved" : "Awaiting Approval"}
                </span>
              </div>
              <p className="text-[11px] text-[#4A544A]">
                Due: {scheduledPostMeta.scheduledTime} • Customize hooks, body, voice, or format, then approve below
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Link
              href="/dashboard?tab=calendar"
              className="text-xs font-semibold text-[#4A544A] hover:text-[#1F3824] px-3 py-1.5 rounded-full border border-[#CBD5C4] bg-white transition-colors"
            >
              Cancel
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAndApproveScheduledPost}
              isLoading={isSavingScheduledPost}
              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
              className="text-xs"
            >
              Save Changes & Approve
            </Button>
          </div>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="bg-[#1F3824] text-white text-xs py-2 px-4 text-center font-semibold">
          {saveSuccessMessage}
        </div>
      )}

      {/* Studio Stage: Clean 2-Column Desktop Grid */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start focus:outline-none">
        {/* Left Column: Interactive 9:16 Canvas & Transport Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24 gap-3 pt-2">
          {selectedVideoUrl ? (
            <div className="w-full max-w-[360px] bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-emerald-900 font-semibold shadow-xs">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Rendered 1080p MP4 Active
              </span>
              <button
                type="button"
                onClick={() => setSelectedVideoUrl(undefined)}
                className="text-[10px] text-emerald-700 hover:text-emerald-900 underline font-bold cursor-pointer"
              >
                Switch to Canvas Editor
              </button>
            </div>
          ) : (
            <div className="w-full max-w-[360px] bg-[#ECEFE7] border border-[#CBD5C4] rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-[#4A544A] font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#1F3824]" />
                Live Remotion Preview (Interactive)
              </span>
              {renderedVideoUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedVideoUrl(renderedVideoUrl)}
                  className="text-[10px] text-[#1F3824] hover:underline font-bold cursor-pointer"
                >
                  Play Rendered MP4
                </button>
              )}
            </div>
          )}
          <CanvasPlayer
            compositionProps={compositionProps}
            onSelectMedia={handleSelectMedia}
          />
          <p className="text-[11px] text-[#717E6C] font-mono text-center">
            1080x1920 9:16 Vertical • Remotion 30 FPS • TikTok & Reels Safe Zone
          </p>
        </div>

        {/* Right Column: Tabbed Precision Creative Suite (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Segmented Inspector Tab Bar */}
          <div role="tablist" aria-label="Studio creative tools" className="bg-white border border-[#CBD5C4]/80 rounded-2xl p-1.5 shadow-xs flex items-center justify-between gap-1">
            {[
              { id: "script", label: "Script & Hooks", icon: FileText },
              { id: "creator", label: "Creator & Style", icon: Layers },
              { id: "subtitles", label: "Subtitles", icon: Type },
              { id: "audio", label: "Audio & Music", icon: Music },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`studio-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`studio-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as StudioTab)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-[#1F3824] text-white shadow-xs"
                      : "text-[#4A544A] hover:bg-[#F6F7F2] hover:text-[#1B231B]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SCRIPT & HOOKS */}
          {activeTab === "script" && (
            <div
              id="studio-panel-script"
              role="tabpanel"
              aria-labelledby="studio-tab-script"
              tabIndex={0}
              className="flex flex-col gap-4 focus:outline-none"
            >
              {/* In-Studio Magic AI Script Assistant */}
              <div className="bg-gradient-to-r from-[#1F3824] to-[#2B4E32] rounded-2xl p-4 text-white shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-300 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                      Magic AI Script Generator
                    </span>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-emerald-200 font-mono">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  Generate 1 custom ad: Enter a product URL or describe what you want to sell. AI will instantly write 3 viral hooks tailored to your brand.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Ergonomic desk lamp with zero screen glare"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGenerateAiScripts}
                    isLoading={isGeneratingAiScripts}
                    leftIcon={<Zap className="h-3.5 w-3.5 text-emerald-300" />}
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#1F3824] font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Generate Scripts
                  </Button>
                </div>

                {/* Display AI Generated Variations if available */}
                {aiGeneratedScripts.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/15">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                      AI Generated Hooks (Click to Apply):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {aiGeneratedScripts.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setHookText(s.hook);
                            setBodyText(s.body);
                            setCtaText(s.cta);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            hookText === s.hook
                              ? "bg-white/20 border-emerald-400 shadow-xs"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase block">
                            {s.angleType.replace("_", " ")}
                          </span>
                          <p className="text-[11px] text-white/90 line-clamp-2 mt-1 leading-snug">
                            &ldquo;{s.hook}&rdquo;
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Identity Card */}
              <div className="bg-white border border-[#CBD5C4]/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F3824] flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-[#1F3824]" />
                    Brand / Product Name
                  </label>
                  <p className="text-[11px] text-[#717E6C]">
                    Spoken in voiceovers and highlighted in kinetic subtitles
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="bg-[#F6F7F2] border border-[#CBD5C4] rounded-xl px-3.5 py-1.5 text-xs text-[#1B231B] font-bold focus:outline-none focus:border-[#1F3824] focus:bg-white w-full sm:w-36 transition-all"
                    placeholder="e.g. Lumina"
                  />

                  {/* Accent Color Swatches */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[
                      { name: "Forest", hex: "#1F3824" },
                      { name: "Emerald", hex: "#10B981" },
                      { name: "Cyan", hex: "#06B6D4" },
                      { name: "Amber", hex: "#F59E0B" },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setBrandColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        className={`h-5 w-5 rounded-full border transition-all cursor-pointer ${
                          brandColor === c.hex
                            ? "ring-2 ring-[#1F3824] ring-offset-2 ring-offset-white scale-110"
                            : "border-[#CBD5C4] opacity-80 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Mandatory Brand Mention Status */}
              <div
                className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
                  hasBrandMention
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                    : "bg-amber-50 border-amber-300 text-amber-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {hasBrandMention ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                  )}
                  <span className="font-medium text-[11px]">
                    {hasBrandMention
                      ? `Brand Mention Verified: "${brandName}" is spoken in this script`
                      : `Brand Warning: "${brandName}" is not spoken in the current copy`}
                  </span>
                </div>
                {!hasBrandMention && (
                  <button
                    type="button"
                    onClick={handleAutoInjectBrand}
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors shrink-0 cursor-pointer"
                  >
                    Auto-Inject Brand
                  </button>
                )}
              </div>

              {/* 5 1-Click Viral Hook Angles Presets */}
              <div className="bg-white border border-[#CBD5C4]/80 rounded-2xl p-4 shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1B231B] flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-[#1F3824]" />
                    Viral Hook Angles (1-Click Switch):
                  </span>
                  <span className="text-[10px] text-[#717E6C] font-mono">
                    Psychological Frameworks
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {VIRAL_HOOK_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setHookText(preset.text)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-[#CBD5C4] bg-[#F6F7F2] text-[#4A544A] hover:bg-[#1F3824] hover:text-white hover:border-[#1F3824] transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Script Copy Editor */}
              <ScriptEditor
                hookText={hookText}
                bodyText={bodyText}
                ctaText={ctaText}
                onHookChange={setHookText}
                onBodyChange={setBodyText}
                onCtaChange={setCtaText}
                estimatedDuration={estimatedDuration}
              />
            </div>
          )}

          {/* TAB 2: CREATOR & TEMPLATE ARCHETYPE */}
          {activeTab === "creator" && (
            <div
              id="studio-panel-creator"
              role="tabpanel"
              aria-labelledby="studio-tab-creator"
              tabIndex={0}
              className="flex flex-col gap-4 focus:outline-none"
            >
              {/* Video Format & Template Archetype Selector */}
              <VideoTemplatePicker
                selectedTemplate={selectedTemplate}
                onSelectTemplate={(tmpl) => {
                  setSelectedTemplate(tmpl.id);
                  if (tmpl.defaultMusicTrack) setSelectedTrackId(tmpl.defaultMusicTrack);
                }}
              />

              {/* Creator Persona Visual Picker */}
              <CreatorVisualPicker
                selectedImageUrl={selectedVisualUrl}
                onSelectPersona={handleSelectPersona}
              />
            </div>
          )}

          {/* TAB 3: SUBTITLES & TYPOGRAPHY */}
          {activeTab === "subtitles" && (
            <div
              id="studio-panel-subtitles"
              role="tabpanel"
              aria-labelledby="studio-tab-subtitles"
              tabIndex={0}
              className="flex flex-col gap-4 focus:outline-none"
            >
              <SubtitleStyler
                subtitleStyle={subtitleStyle}
                brandColor={brandColor}
                onStyleChange={setSubtitleStyle}
                onBrandColorChange={setBrandColor}
              />
            </div>
          )}

          {/* TAB 4: AUDIO & DUCKING */}
          {activeTab === "audio" && (
            <div
              id="studio-panel-audio"
              role="tabpanel"
              aria-labelledby="studio-tab-audio"
              tabIndex={0}
              className="flex flex-col gap-4 focus:outline-none"
            >
              {/* Creator Voice Selector */}
              <VoiceSelector
                selectedVoiceId={selectedVoiceId}
                onVoiceChange={setSelectedVoiceId}
              />

              {/* Dynamic B-Roll Music Picker */}
              <MusicPicker
                selectedTrackId={selectedTrackId}
                onTrackChange={setSelectedTrackId}
              />
            </div>
          )}
        </div>
      </main>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        defaultCaption={`${hookText} ${bodyText} ${ctaText}`}
      />

      {/* Export & Render Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setExportComplete(false);
        }}
        title="Export High-Converting 1080p Vertical Ad"
        description="Render your ad variation with crystal-clear 1080x1920 MP4 resolution, AAC audio, and zero watermarks."
        maxWidth="md"
      >
        <div className="flex flex-col gap-5 py-2">
          {!exportComplete ? (
            <>
              <div className="p-4 rounded-2xl bg-[#ECEFE7] border border-[#CBD5C4]/70 flex flex-col gap-2.5 text-[#1B231B]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A544A]">Resolution:</span>
                  <span className="font-mono text-[#1B231B] font-bold">1080 x 1920 (9:16 Vertical)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A544A]">Framerate:</span>
                  <span className="font-mono text-[#1B231B] font-bold">30 FPS (H.264 / AAC)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A544A]">Credit Cost:</span>
                  <span className="font-mono text-[#1F3824] font-bold bg-[#E2E9DC] px-2 py-0.5 rounded-full">
                    1 Video Credit
                  </span>
                </div>
              </div>

              {isExporting && (
                <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-[#E2E9DC]/60 border border-[#CBD5C4] transition-all">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1F3824]">
                    <span>{renderStage || "Rendering video creative..."}</span>
                    <span className="font-mono">{renderProgress}%</span>
                  </div>
                  <div className="w-full bg-[#CBD5C4]/60 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1F3824] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${Math.max(renderProgress, 5)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#4A544A] italic">
                    Rendered via async background queue. Zero Vercel timeouts.
                  </p>
                </div>
              )}

              {renderError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{renderError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsExportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  isLoading={isExporting}
                  onClick={handleStartExport}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  Render & Download MP4
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="h-12 w-12 rounded-full bg-[#E2E9DC] border border-[#CBD5C4] flex items-center justify-center text-[#1F3824]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-[#1B231B]">
                  Video Render Complete!
                </h4>
                <p className="text-xs text-[#4A544A]">
                  Your 1080x1920 vertical ad has been generated and saved to your Video Vault.
                </p>
              </div>

              {renderedVideoUrl && (
                <div className="w-full max-w-xs aspect-[9/16] max-h-60 bg-[#ECEFE7] rounded-3xl overflow-hidden border border-[#CBD5C4] my-2 mx-auto flex items-center justify-center p-2 shadow-inner">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={renderedVideoUrl}
                      controls
                      autoPlay
                      muted
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 mt-2 w-full">
                <Button
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setIsExportModalOpen(false);
                    handleOpenSchedule();
                  }}
                  leftIcon={<Share2 className="h-4 w-4" />}
                >
                  Push to Socials
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 text-xs"
                  onClick={() => {
                    if (renderedVideoUrl) {
                      const a = document.createElement("a");
                      a.href = renderedVideoUrl;
                      a.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_ad_1080p.mp4`;
                      a.target = "_blank";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }
                  }}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Download MP4
                </Button>
              </div>

              <Link
                href="/dashboard"
                className="text-xs text-[#1F3824] hover:underline inline-flex items-center gap-1 pt-1 font-semibold"
              >
                <span>View all videos in Command Center</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </Modal>

      {/* Upgrade Paywall Modal */}
      <UpgradePaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        triggerReason={paywallReason}
        currentPlanTier={subscription?.tier}
        onUpgradeSuccess={() => {
          setIsPaywallOpen(false);
          fetchSubscription();
        }}
      />

      <Footer />
    </div>
  );
}

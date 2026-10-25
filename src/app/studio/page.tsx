"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CanvasPlayer } from "@/components/studio/CanvasPlayer";
import { ScriptEditor } from "@/components/studio/ScriptEditor";
import { VoiceSelector } from "@/components/studio/VoiceSelector";
import { SubtitleStyler } from "@/components/studio/SubtitleStyler";
import { MusicPicker } from "@/components/studio/MusicPicker";
import { ScheduleModal } from "@/components/studio/ScheduleModal";
import { PublishingCalendar } from "@/components/dashboard/PublishingCalendar";
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
} from "lucide-react";
import Link from "next/link";

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-xs font-mono text-[var(--text-muted)]">
          Loading AutoUGC Studio...
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}

function StudioContent() {
  const searchParams = useSearchParams();
  const [brandName, setBrandName] = useState(() => searchParams.get("brand") || "Lumina");
  const [hookText, setHookText] = useState(() => searchParams.get("hook") || "Stop coding under harsh fluorescent lights in 2026.");
  const [bodyText, setBodyText] = useState(() => searchParams.get("body") || "Lumina auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints.");
  const [ctaText, setCtaText] = useState(() => searchParams.get("cta") || "Click the link below and get $30 off your setup today.");
  const [brandColor, setBrandColor] = useState("#F59E0B");
  const [selectedVoiceId, setSelectedVoiceId] = useState("alex_casual_dtc");
  const [selectedTrackId, setSelectedTrackId] = useState("lofi_focus");
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyleConfig>({
    fontSize: 52,
    primaryColor: "#FFFFFF",
    highlightColor: "#F59E0B",
  });

  const [compositionProps, setCompositionProps] =
    useState<UgcAdCompositionProps>({
      brandName: "Lumina",
      hookText: "Stop coding under harsh fluorescent lights in 2026.",
      bodyText:
        "Lumina auto-matches natural daylight so your eyes feel rested even after 10-hour sprints.",
      ctaText: "Click the link below and get $30 off your setup today.",
      brandColor: "#F59E0B",
      words: [],
      subtitleStyle: {
        fontSize: 52,
        primaryColor: "#FFFFFF",
        highlightColor: "#F59E0B",
      },
    });

  const [estimatedDuration, setEstimatedDuration] = useState(14.5);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

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
          words: res.words,
          subtitleStyle,
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [hookText, bodyText, ctaText, brandName, brandColor, selectedVoiceId, subtitleStyle]);

  const handleStartExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 border-b border-subtle bg-[var(--bg-app)]/85 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-[family-name:var(--font-display)]">
              AutoUGC Studio
            </span>
            <Badge variant="amber" size="sm">
              Creative Editor
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="emerald" size="sm" pulse>
            24 / 25 Credits
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsScheduleModalOpen(true)}
            leftIcon={<Calendar className="h-4 w-4" />}
          >
            Schedule Post
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export 1080p Ad
          </Button>
        </div>
      </header>

      {/* Main Studio Canvas Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Pane: Interactive 9:16 Canvas Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
          <CanvasPlayer compositionProps={compositionProps} />
          <p className="text-xs text-[var(--text-muted)] mt-4 font-mono text-center">
            Preview is rendered client-side at 30 FPS • Native 1080x1920 9:16 vertical layout
          </p>
        </div>

        {/* Right Pane: Precision Editing Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[var(--bg-surface)] border border-subtle rounded-xl p-4 flex items-center justify-between gap-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Brand / Product Name:
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="bg-[var(--bg-app)] border border-subtle rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)] max-w-xs"
              placeholder="e.g. Lumina"
            />
          </div>

          <ScriptEditor
            hookText={hookText}
            bodyText={bodyText}
            ctaText={ctaText}
            onHookChange={setHookText}
            onBodyChange={setBodyText}
            onCtaChange={setCtaText}
            estimatedDuration={estimatedDuration}
          />

          <VoiceSelector
            selectedVoiceId={selectedVoiceId}
            onVoiceChange={setSelectedVoiceId}
          />

          <SubtitleStyler
            subtitleStyle={subtitleStyle}
            brandColor={brandColor}
            onStyleChange={setSubtitleStyle}
            onBrandColorChange={setBrandColor}
          />

          <MusicPicker
            selectedTrackId={selectedTrackId}
            onTrackChange={setSelectedTrackId}
          />
        </div>
      </div>

      {/* Automated Publishing Calendar Section */}
      <div className="max-w-7xl mx-auto w-full px-6 pb-16">
        <PublishingCalendar />
      </div>

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
              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Resolution:</span>
                  <span className="font-mono text-[var(--text-primary)]">1080 x 1920 (9:16 Vertical)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Framerate:</span>
                  <span className="font-mono text-[var(--text-primary)]">30 FPS (H.264 / AAC)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Credit Cost:</span>
                  <span className="font-mono text-[var(--accent-emerald)] font-semibold">1 Credit</span>
                </div>
              </div>

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
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[var(--accent-emerald)]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-[var(--text-primary)]">
                  Video Render Complete!
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your vertical ad is ready. You can download the MP4 now or schedule directly to your social feeds.
                </p>
              </div>
              <div className="flex gap-3 mt-2 w-full">
                <Button
                  variant="secondary"
                  className="flex-1"
                  leftIcon={<Share2 className="h-4 w-4" />}
                >
                  Push to Socials
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Download MP4
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Layers,
  Activity,
  Play,
  Volume2,
  TrendingUp,
  Radio,
  Share2,
  Cpu,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

interface CreativeSlide {
  badge: string;
  headline: string;
  subheadline: string;
  hookType: string;
  metricLabel: string;
  metricValue: string;
  tagColor: string;
}

const CREATIVE_SLIDES: CreativeSlide[] = [
  {
    badge: "HOOK ARCHETYPE: PROBLEM AGITATION",
    headline: "Why 84% of B2B SaaS video ads burn cash with 0 demos.",
    subheadline: "Remixing top competitor ad scripts into high-converting UGC.",
    hookType: "Viral Pain-Point Angle",
    metricLabel: "HOOK RETENTION",
    metricValue: "92.4%",
    tagColor: "border-[#D95D39]/40 text-[#FF8B5E] bg-[#D95D39]/10",
  },
  {
    badge: "HOOK ARCHETYPE: RIVAL DISRUPTION",
    headline: "Stop paying $12,000/mo to agencies for 4 slow videos.",
    subheadline: "Autonomous creative generation with zero operational overhead.",
    hookType: "Competitor Counter-Hook",
    metricLabel: "RETURN ON AD SPEND",
    metricValue: "4.8x ROAS",
    tagColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  },
  {
    badge: "HOOK ARCHETYPE: PRODUCT DEMO SHOWCASE",
    headline: "Enter your domain. 30 tested ad creatives ready in minutes.",
    subheadline: "Auto-distributed across Meta, TikTok, YouTube Shorts & LinkedIn.",
    hookType: "High-Intent Demo Angle",
    metricLabel: "CTR BENCHMARK",
    metricValue: "5.1% CTR",
    tagColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  },
];

export function AuthMarketingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic state for rotating SaaS ad creative
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Rotate ad creatives every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % CREATIVE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Track mouse coordinates for subtle 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Highway / Perspective Grid Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offsetZ = 0;

    // Resize handler with High-DPI support
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || window.innerWidth / 2;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle streaks for speed effect
    const particles = Array.from({ length: 48 }, () => ({
      x: (Math.random() - 0.5) * 2,
      z: Math.random(),
      speed: 0.004 + Math.random() * 0.008,
      size: 1 + Math.random() * 2,
    }));

    // Animation loop
    const render = () => {
      const width = canvas.parentElement?.clientWidth || 600;
      const height = canvas.parentElement?.clientHeight || 800;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Obsidian Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#08080A");
      bgGrad.addColorStop(0.5, "#0E0E12");
      bgGrad.addColorStop(1, "#08080A");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const horizonY = height * 0.52;
      const vanishingX = width * 0.5;

      // 2. Horizon Radiant Warmth (Terracotta / Amber Glow)
      const horizonGlow = ctx.createRadialGradient(
        vanishingX,
        horizonY,
        0,
        vanishingX,
        horizonY,
        width * 0.55
      );
      horizonGlow.addColorStop(0, "rgba(217, 93, 57, 0.42)");
      horizonGlow.addColorStop(0.2, "rgba(217, 93, 57, 0.22)");
      horizonGlow.addColorStop(0.45, "rgba(255, 122, 80, 0.06)");
      horizonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Perspective Grid Lines (Receding Highway)
      offsetZ = (offsetZ + 0.005) % 1;

      // Horizontal scanlines moving towards camera
      const numHorizLines = 16;
      for (let i = 0; i < numHorizLines; i++) {
        const lineZ = (i / numHorizLines + offsetZ) % 1;
        // Non-linear perspective spacing
        const y = horizonY + (height - horizonY) * Math.pow(lineZ, 2.2);
        const opacity = Math.min(1, Math.pow(lineZ, 1.4) * 0.4);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(217, 93, 57, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Longitudinal perspective rays fanning out from vanishing point
      const numRays = 18;
      for (let i = -numRays / 2; i <= numRays / 2; i++) {
        const spread = (i / (numRays / 2)) * (width * 0.7);
        const endX = vanishingX + spread * 2.2;

        ctx.beginPath();
        const isCenterLane = Math.abs(i) <= 1;
        ctx.strokeStyle = isCenterLane
          ? "rgba(217, 93, 57, 0.45)"
          : "rgba(255, 255, 255, 0.07)";
        ctx.lineWidth = isCenterLane ? 1.5 : 1;
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }

      // 4. Center Dashed Highway Line
      const numDashes = 10;
      for (let i = 0; i < numDashes; i++) {
        const dashZ = (i / numDashes + offsetZ) % 1;
        const yStart = horizonY + (height - horizonY) * Math.pow(dashZ, 2.2);
        const yEnd =
          horizonY +
          (height - horizonY) * Math.pow(Math.min(1, dashZ + 0.04), 2.2);
        const opacity = Math.min(1, Math.pow(dashZ, 1.2));

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 139, 94, ${opacity * 0.8})`;
        ctx.lineWidth = 2.5 * dashZ + 1;
        ctx.moveTo(vanishingX, yStart);
        ctx.lineTo(vanishingX, yEnd);
        ctx.stroke();
      }

      // 5. Streaming Speed Particles / Data Packets
      particles.forEach((p) => {
        p.z += p.speed;
        if (p.z > 1) {
          p.z = 0;
          p.x = (Math.random() - 0.5) * 2;
        }

        const screenZ = Math.pow(p.z, 2.4);
        const px = vanishingX + p.x * width * 0.45 * screenZ;
        const py = horizonY + (height - horizonY) * screenZ;
        const size = p.size * screenZ * 2 + 0.8;
        const alpha = Math.min(1, screenZ * 1.5);

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 175, 130, ${alpha})`;
        ctx.fill();
      });

      // 6. Horizon line separator with subtle glow
      ctx.beginPath();
      ctx.strokeStyle = "rgba(217, 93, 57, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const safeSlideIndex = activeSlideIndex % CREATIVE_SLIDES.length;
  const currentSlide: CreativeSlide = CREATIVE_SLIDES[safeSlideIndex]!;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[500px] lg:min-h-screen bg-[#08080A] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Background Animated Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Dot Matrix Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D95D39] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D95D39]" />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-neutral-300 uppercase">
            AUTONOMOUS AD ENGINE // LIVE
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-400">
          <Cpu className="w-3.5 h-3.5 text-[#D95D39]" />
          <span>SENNA v2.4 // 4K PIPELINE</span>
        </div>
      </div>

      {/* Center Stage: The 9:16 Generative Ad Frame & Orbiting Telemetry HUD */}
      <div className="relative z-10 my-auto py-6 flex items-center justify-center">
        {/* Parallax Container reacting to mouse movements */}
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`,
          }}
        >
          {/* Main 9:16 Mobile Ad Generator Card */}
          <div className="relative w-[285px] h-[450px] rounded-[28px] p-4 bg-[#0A0A0E]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_0_50px_rgba(217,93,57,0.22)] flex flex-col justify-between overflow-hidden">
            {/* Ambient Neon Rim Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D95D39]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Ad Frame Top Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-semibold tracking-wider text-neutral-300 uppercase">
                  9:16 CREATIVE
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
                META & TIKTOK
              </span>
            </div>

            {/* Creative Stage Content */}
            <div className="relative z-10 my-auto flex flex-col gap-3">
              {/* Dynamic Archetype Tag */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold tracking-wide border self-start ${currentSlide.tagColor} transition-all duration-300`}
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Bold Viral Hook Headline */}
              <h3 className="text-sm font-semibold tracking-tight text-white leading-snug min-h-[44px]">
                {currentSlide.headline}
              </h3>

              {/* Mock Creative Infographic Display */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    {currentSlide.metricLabel}
                  </span>
                  <span className="font-semibold text-emerald-400">
                    {currentSlide.metricValue}
                  </span>
                </div>

                {/* Simulated Audio Spectrum Visualizer */}
                <div className="h-8 flex items-end justify-between gap-1 pt-1">
                  {[40, 75, 55, 90, 60, 85, 45, 100, 70, 80, 50, 95, 65, 85].map(
                    (height, idx) => (
                      <div
                        key={idx}
                        className="w-full rounded-full bg-gradient-to-t from-[#D95D39] to-[#FF8B5E]"
                        style={{
                          height: `${(height * (idx % 2 === 0 ? 1 : 0.7))}%`,
                          opacity: 0.85,
                          animation: `pulse 1.${(idx % 4) + 2}s infinite alternate`,
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Creator Demo Voiceover Badge */}
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-1">
                <span className="flex items-center gap-1 text-neutral-300">
                  <Volume2 className="w-3 h-3 text-[#D95D39]" />
                  AI Voice: Natural B2B Tech
                </span>
                <span className="text-emerald-400 font-semibold">Ready</span>
              </div>
            </div>

            {/* Ad Frame Bottom Action Pill */}
            <div className="relative z-10 pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400">
                Auto-remixed from niche
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-[#FF8B5E]">
                <span>Campaign #01</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Floating Orbiting Satellite HUD #1: Multi-Channel Dispatch (Top-Left) */}
          <div className="hidden sm:flex absolute -top-8 -left-36 items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#0F0F14]/90 border border-white/10 backdrop-blur-xl shadow-xl">
            <Share2 className="w-4 h-4 text-[#D95D39] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                Multi-Channel Dispatch
              </span>
              <span className="text-xs font-semibold text-white">
                Meta • TikTok • Shorts
              </span>
            </div>
          </div>

          {/* Floating Orbiting Satellite HUD #2: Rival Ad Radar (Top-Right) */}
          <div className="hidden sm:flex absolute -top-6 -right-36 items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#0F0F14]/90 border border-white/10 backdrop-blur-xl shadow-xl">
            <Radio className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                Niche Competitor Radar
              </span>
              <span className="text-xs font-semibold text-white">
                45+ Ads Scanned
              </span>
            </div>
          </div>

          {/* Floating Orbiting Satellite HUD #3: Autonomous Pacing (Bottom-Right) */}
          <div className="hidden sm:flex absolute -bottom-6 -right-36 items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#0F0F14]/90 border border-white/10 backdrop-blur-xl shadow-xl">
            <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                ROAS Optimizer
              </span>
              <span className="text-xs font-semibold text-white">
                Budget Auto-Pacing
              </span>
            </div>
          </div>

          {/* Floating Orbiting Satellite HUD #4: Continuous Cadence (Bottom-Left) */}
          <div className="hidden sm:flex absolute -bottom-8 -left-36 items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#0F0F14]/90 border border-white/10 backdrop-blur-xl shadow-xl">
            <Activity className="w-4 h-4 text-[#D95D39] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                Ad Cadence Pacing
              </span>
              <span className="text-xs font-semibold text-white">
                4x New Creatives / Wk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="relative z-10 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>FASTLANE HIGHWAY v2.4</span>
          <span>•</span>
          <span>AUTONOMOUS SAAS ACQUISITION</span>
        </div>
        <div className="text-neutral-400">
          ZERO AGENCY OVERHEAD // 100% OPERATIONAL INDEPENDENCE
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import CampaignAdViewer, { CampaignPost } from "@/components/campaigns/CampaignAdViewer";
import CampaignCreditLedgerCard from "@/components/campaigns/CampaignCreditLedgerCard";
import CampaignAccountsCard from "@/components/campaigns/CampaignAccountsCard";
import CampaignGoalCard from "@/components/campaigns/CampaignGoalCard";

const SEED_POSTS: CampaignPost[] = [
  {
    id: "post_01",
    index: 1,
    totalPosts: 30,
    title: "How life feels after finding this AI humanizing tool",
    hook: "The reason professors flag your writing even when you didn't use AI...",
    videoUrl: "/videos/creator-sarah.mp4",
    thumbnailUrl: "/images/creator-sarah.jpg",
    status: "rendered",
    format: "video",
  },
  {
    id: "post_02",
    index: 2,
    totalPosts: 30,
    title: "Interactive Live Demo Showcase",
    hook: "Watch this tool rewrite 1,000 words in 3 seconds flat.",
    videoUrl: "/videos/creator-alex.mp4",
    thumbnailUrl: "/images/creator-alex.jpg",
    status: "rendered",
    format: "video",
  },
  {
    id: "post_03",
    index: 3,
    totalPosts: 30,
    title: "Split-Screen Problem / Solution Comparison",
    hook: "Stop copying and pasting into 5 different rewrite tools...",
    videoUrl: "/videos/creator-sarah.mp4",
    thumbnailUrl: "/images/creator-sarah.jpg",
    status: "rendered",
    format: "video",
  },
  {
    id: "post_04",
    index: 4,
    totalPosts: 30,
    title: "Competitor Angle Remix: Walter Writes AI",
    hook: "If you're still paying $40/month for clunky essay rewrite credits...",
    videoUrl: "/videos/creator-alex.mp4",
    thumbnailUrl: "/images/creator-alex.jpg",
    status: "draft",
    format: "video",
  },
];

export default function CampaignsPage() {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [posts, setPosts] = useState<CampaignPost[]>(SEED_POSTS);
  const [credits, setCredits] = useState(50);
  const [isRendering, setIsRendering] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBrand = localStorage.getItem("autougc_brand_name");
      const storedGoal = localStorage.getItem("autougc_brand_goal");
      const storedCredits = localStorage.getItem("autougc_credits");

      if (storedBrand) setBrandName(storedBrand);
      if (storedGoal) setGoal(storedGoal);
      if (storedCredits) setCredits(parseInt(storedCredits, 10));
    }
  }, []);

  const currentPost: CampaignPost = posts[currentPostIndex] || SEED_POSTS[0]!;

  const handleNext = () => {
    setCurrentPostIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setCurrentPostIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const handleSwap = () => {
    // Swap creator between Sarah and Alex
    setPosts((prev) =>
      prev.map((p, idx) => {
        if (idx === currentPostIndex) {
          const isSarah = p.videoUrl?.includes("sarah");
          return {
            ...p,
            videoUrl: isSarah ? "/videos/creator-alex.mp4" : "/videos/creator-sarah.mp4",
            thumbnailUrl: isSarah ? "/images/creator-alex.jpg" : "/images/creator-sarah.jpg",
          };
        }
        return p;
      })
    );
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleEdit = () => {
    // In future phase: opens modal editor
    alert(`Editing creative #${currentPost.index}: "${currentPost.title}"`);
  };

  const handleMake = async () => {
    if (credits < 5) {
      alert("Insufficient credits. Please cover your campaign posts or upgrade your plan.");
      return;
    }

    setIsRendering(true);
    try {
      // Simulate Remotion render call or trigger async endpoint
      await new Promise((r) => setTimeout(r, 2000));
      setCredits((prev) => {
        const next = prev - 5;
        if (typeof window !== "undefined") {
          localStorage.setItem("autougc_credits", String(next));
        }
        return next;
      });

      setPosts((prev) =>
        prev.map((p, idx) => (idx === currentPostIndex ? { ...p, status: "rendered" } : p))
      );
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <AppShell brandName={brandName} title="Campaigns">
      <div className="space-y-8 select-none">
        {/* Top Creative Review Deck (Screenshot 4 Match) */}
        <section className="flex flex-col items-center">
          <CampaignAdViewer
            currentPost={currentPost}
            onNext={handleNext}
            onPrev={handlePrev}
            onSwap={handleSwap}
            onSkip={handleSkip}
            onEdit={handleEdit}
            onMake={handleMake}
            isRendering={isRendering}
          />
        </section>

        {/* Bottom 3 Executive Cards (Screenshot 4 Match) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Your Credits & Batch Coverage */}
          <CampaignCreditLedgerCard
            currentCredits={credits}
            completedPosts={3}
            totalPosts={30}
            postsStillToMake={27}
            creditsToCoverAll={1232}
            shortfallCredits={1182}
          />

          {/* Card 2: Ad Network Accounts */}
          <CampaignAccountsCard isMetaConnected={false} />

          {/* Card 3: The Brand Mission & Campaign Goal */}
          <CampaignGoalCard
            goalTitle={goal}
            goalDescription="Help their essays sound natural while keeping their original ideas and citations intact."
          />
        </section>
      </div>
    </AppShell>
  );
}

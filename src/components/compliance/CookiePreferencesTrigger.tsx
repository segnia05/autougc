"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { Sliders } from "lucide-react";

export default function CookiePreferencesTrigger() {
  const handleOpenPreferences = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open_cookie_preferences"));
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleOpenPreferences}
      className="text-xs flex items-center gap-1.5 shrink-0 bg-white"
    >
      <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
      Customize Preferences
    </Button>
  );
}

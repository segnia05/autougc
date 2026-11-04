"use client";

import React from "react";

export function CookiePreferencesFooterButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("open_cookie_preferences"));
        }
      }}
      className="hover:text-[#D95D39] font-medium transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm"
    >
      Cookie Preferences
    </button>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Plus, Settings } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  plan: string;
  credits: number;
}

interface WorkspaceSelectorProps {
  currentBrand?: string;
  onSelectBrand?: (name: string) => void;
}

export default function WorkspaceSelector({
  currentBrand = "HumanifyLab",
  onSelectBrand,
}: WorkspaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces] = useState<Workspace[]>([
    { id: "1", name: currentBrand, plan: "Growth Plan", credits: 50 },
    { id: "2", name: "AutoUGC Alpha", plan: "Starter", credits: 15 },
  ]);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Fastlane Slanted Speed-Mark Brand Icon */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#18181B] text-white shadow-xs">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            {/* Dual slanted aerodynamic speed blades */}
            <path
              d="M4 15L14 4H10L2 15H4Z"
              fill="currentColor"
            />
            <path
              d="M10 20L20 9H16L8 20H10Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Brand Selector Pill */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E0D8] bg-white hover:bg-[#FAF9F6] text-xs font-semibold text-[#18181B] shadow-2xs transition-all"
        >
          <span className="truncate max-w-[120px]">{currentBrand}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8E8B85]" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-11 left-0 z-50 w-60 rounded-2xl bg-white border border-[#EFECE6] p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Workspaces
            </div>

            <div className="space-y-1 mt-1">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    if (onSelectBrand) onSelectBrand(ws.name);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                    ws.name === currentBrand
                      ? "bg-[#FAF8F5] text-[#18181B] font-semibold"
                      : "text-[#52525B] hover:bg-[#FAF8F5] hover:text-[#18181B]"
                  }`}
                >
                  <div>
                    <div className="font-medium text-[#18181B]">{ws.name}</div>
                    <div className="text-[10px] text-[#8E8B85]">
                      {ws.plan} · {ws.credits} credits
                    </div>
                  </div>
                  {ws.name === currentBrand && (
                    <Check className="w-3.5 h-3.5 text-[#D95D39]" />
                  )}
                </button>
              ))}
            </div>

            <div className="h-px bg-[#EFECE6] my-1.5" />

            <div className="space-y-0.5">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-[#52525B] hover:bg-[#FAF8F5] hover:text-[#18181B] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#8E8B85]" />
                <span>Add new brand</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-[#52525B] hover:bg-[#FAF8F5] hover:text-[#18181B] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#8E8B85]" />
                <span>Brand settings</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

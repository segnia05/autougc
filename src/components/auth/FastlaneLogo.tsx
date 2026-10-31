import React from "react";
import Link from "next/link";

interface FastlaneLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  href?: string;
}

export function FastlaneLogo({
  className = "flex items-center gap-3",
  markClassName = "h-4 w-7 text-neutral-900 fill-current",
  textClassName = "text-base font-bold tracking-tight text-neutral-900 font-sans",
  href = "/",
}: FastlaneLogoProps) {
  const content = (
    <div className={className}>
      {/* Fastlane Speed Mark: Two forward-slanted aerodynamic parallel chevrons */}
      <svg
        className={markClassName}
        viewBox="0 0 28 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6.5 13L11.5 1H8L3 13H6.5Z"
          fill="currentColor"
        />
        <path
          d="M14.5 13L19.5 1H16L11 13H14.5Z"
          fill="currentColor"
        />
        <path
          d="M22.5 13L27.5 1H24L19 13H22.5Z"
          fill="currentColor"
        />
      </svg>
      <span className={textClassName}>FASTLANE</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}

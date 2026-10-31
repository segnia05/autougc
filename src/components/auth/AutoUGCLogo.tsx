import React from "react";
import Link from "next/link";

interface AutoUGCLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  href?: string;
}

export function AutoUGCLogo({
  className = "flex items-center gap-2.5",
  iconClassName = "text-xl font-light text-neutral-900 group-hover:rotate-45 transition-transform duration-300 select-none",
  textClassName = "text-xl font-medium tracking-tight text-neutral-900 font-serif",
  href = "/",
}: AutoUGCLogoProps) {
  const content = (
    <div className={className}>
      <span className={iconClassName} aria-hidden="true">
        ✻
      </span>
      <span className={textClassName}>AutoUGC</span>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-lg inline-flex items-center"
        aria-label="AutoUGC Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

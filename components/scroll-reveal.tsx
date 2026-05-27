"use client";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "scale";
};

/**
 * Lightweight wrapper that applies CSS scroll-driven reveal animations.
 * Uses `animation-timeline: view()` — pure CSS, zero JS animation logic.
 * In browsers that don't support animation-timeline, elements render normally
 * (progressive enhancement).
 */
export function ScrollReveal({
  children,
  className = "",
  variant = "up",
}: ScrollRevealProps) {
  const animClass = variant === "scale" ? "reveal-scale" : "reveal-up";

  return <div className={`${animClass} ${className}`}>{children}</div>;
}

"use client";

import { useCallback, type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  productSlug?: string;
  label?: string;
};

export function OutboundLink({
  href,
  children,
  className,
  productSlug,
  label,
}: Props) {
  const onClick = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const payload = JSON.stringify({ href, slug: productSlug, label });
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon?.("/api/click", blob);
    } catch {
      // swallow — click tracking must never block the navigation
    }
  }, [href, productSlug, label]);

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={onClick}
      className={className}
      data-affiliate="true"
    >
      {children}
    </a>
  );
}

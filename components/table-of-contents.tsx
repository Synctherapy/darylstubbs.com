"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/toc";

type Props = {
  headings: Heading[];
  className?: string;
};

export function TableOfContents({ headings, className = "" }: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost entry that is currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
          return;
        }

        // Otherwise, find the last heading above the viewport
        const above = entries
          .filter((e) => !e.isIntersecting && e.boundingClientRect.top < 0)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

        if (above.length > 0 && above[0].target.id) {
          setActiveId(above[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={className} aria-label="Table of contents">
      <div className="editorial-kicker mb-4 text-ink">On this page</div>
      <ul className="flex flex-col gap-0.5 border-l border-rule">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          const indent = h.level === 3 ? "pl-8" : "pl-5";
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block py-2 pr-2 -ml-px border-l-2 text-sm leading-snug transition-colors ${indent} ${
                  isActive
                    ? "border-accent text-accent-deep font-semibold"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

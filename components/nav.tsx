import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border-muted">
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 h-20">
        <Link
          href="/"
          className="editorial-head text-xl tracking-tight text-ink"
        >
          {siteConfig.name}
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-semibold text-ink-muted hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] hover:bg-accent-deep hover:-translate-y-0.5 transition-all"
        >
          Read articles
          <span aria-hidden>→</span>
        </Link>
      </nav>
    </header>
  );
}

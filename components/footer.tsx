import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-muted bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-display text-xl font-extrabold mb-3">
            {siteConfig.name}
          </div>
          <p className="text-sm text-foreground-muted max-w-sm">
            {siteConfig.description}
          </p>
          <div className="flex gap-4 mt-6 text-sm font-semibold">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              Instagram
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              YouTube
            </a>
            <a
              href={siteConfig.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              X
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-bold mb-4">
            Explore
          </div>
          <ul className="flex flex-col gap-2 text-sm text-foreground-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest font-bold mb-4">
            Topics
          </div>
          <ul className="flex flex-col gap-2 text-sm text-foreground-muted">
            {siteConfig.categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/blog?category=${c.slug}`}
                  className="hover:text-accent"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border-muted py-6">
        <p className="max-w-6xl mx-auto px-6 text-xs text-foreground-muted text-center">
          © {year} {siteConfig.author.name}. As an Amazon Associate and partner
          to other retailers, I earn from qualifying purchases. Content is for
          informational purposes only and is not medical advice.
        </p>
      </div>
    </footer>
  );
}

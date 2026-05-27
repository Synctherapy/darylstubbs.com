import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/articles";
import { CategoryChip } from "./category-chip";
import { formatDate } from "@/lib/format";

type Props = {
  heading?: string;
  articles: Article[];
  className?: string;
};

export function PopularPosts({
  heading = "Popular articles",
  articles,
  className = "",
}: Props) {
  if (articles.length === 0) return null;

  return (
    <aside className={className} aria-label={heading}>
      <h3 className="editorial-head text-xl mb-5 text-ink">{heading}</h3>
      <ul className="flex flex-col gap-5">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/blog/${a.slug}`}
              className="group flex gap-4 items-start"
            >
              {a.frontmatter.coverImage && (
                <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-paper-deep">
                  <Image
                    src={a.frontmatter.coverImage}
                    alt={a.frontmatter.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="mb-1.5">
                  <CategoryChip
                    category={a.frontmatter.category}
                    size="xs"
                  />
                </div>
                <h4 className="text-sm font-bold leading-snug text-ink group-hover:text-accent-deep transition-colors line-clamp-3">
                  {a.frontmatter.title}
                </h4>
                <p className="text-xs text-ink-muted mt-1">
                  {formatDate(a.frontmatter.date)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { CategoryChip } from "./category-chip";

type Props = {
  article: Article;
  size?: "default" | "compact";
};

export function ArticleCard({ article, size = "default" }: Props) {
  const { slug, frontmatter, readingTime } = article;

  return (
    <Link href={`/blog/${slug}`} className="group flex flex-col">
      {frontmatter.coverImage && (
        <div
          className={`relative overflow-hidden rounded-3xl bg-paper-deep mb-5 shadow-sm group-hover:shadow-lg transition-shadow ${
            size === "compact" ? "aspect-[16/10]" : "aspect-[16/11]"
          }`}
        >
          <Image
            src={frontmatter.coverImage}
            alt={frontmatter.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col px-1">
        <div className="mb-3">
          <CategoryChip category={frontmatter.category} size="sm" />
        </div>
        <h3
          className={`editorial-head text-ink group-hover:text-accent-deep transition-colors mb-3 ${
            size === "compact" ? "text-lg" : "text-xl md:text-2xl"
          }`}
        >
          {frontmatter.title}
        </h3>
        {size === "default" && (
          <p className="text-base text-ink-muted leading-relaxed mb-5 flex-1 line-clamp-3">
            {frontmatter.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-ink-muted font-medium">
          <span>{formatDate(frontmatter.date)}</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </Link>
  );
}

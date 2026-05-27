import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleCard } from "@/components/article-card";
import { CategoryChip } from "@/components/category-chip";
import { PopularPosts } from "@/components/popular-posts";
import { SubscribeCard } from "@/components/subscribe-card";
import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Honest, research-backed guides on red light therapy, hydrogen water, probiotics and the things I use to feel better.",
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const featured = articles[0];
  const rest = articles.slice(1);
  const popular = articles.slice(0, 5);

  const categoryCounts = siteConfig.categories.map((cat) => ({
    ...cat,
    count: articles.filter((a) =>
      (cat.relatedSlugs as readonly string[]).includes(a.frontmatter.category),
    ).length,
  }));

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-tint-peach">
        <div className="max-w-6xl mx-auto px-6 pt-14 md:pt-20 pb-14 md:pb-20">
          <span className="editorial-kicker block mb-5">All articles</span>
          <h1 className="editorial-display text-[clamp(2.75rem,7vw,5.5rem)] text-ink mb-6 leading-[1.05]">
            Research-backed{" "}
            <span className="editorial-display-italic text-accent-deep">
              articles.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl mb-8">
            Deep dives, comparisons, and protocol notes. Updated as new
            research lands.
          </p>
          <div className="flex flex-wrap gap-2">
            {siteConfig.categories.map((cat) => (
              <CategoryChip
                key={cat.slug}
                category={cat.slug}
                size="md"
                asLink
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURED — most recent article, full-width banner card
          ════════════════════════════════════════════════════════════ */}
      {featured && (
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-8 md:gap-10 items-center bg-paper rounded-3xl overflow-hidden border border-rule hover:shadow-xl transition-shadow"
            >
              {featured.frontmatter.coverImage && (
                <div className="relative aspect-[16/10] md:aspect-auto md:h-full md:min-h-[360px] overflow-hidden">
                  <Image
                    src={featured.frontmatter.coverImage}
                    alt={featured.frontmatter.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
              )}
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <CategoryChip
                    category={featured.frontmatter.category}
                    size="sm"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-deep">
                    Latest
                  </span>
                </div>
                <h2 className="editorial-head text-2xl md:text-3xl text-ink leading-tight mb-4 group-hover:text-accent-deep transition-colors">
                  {featured.frontmatter.title}
                </h2>
                <p className="text-base text-ink-muted leading-relaxed mb-6 line-clamp-3">
                  {featured.frontmatter.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep group-hover:gap-2 transition-all">
                  Read article
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          GRID + SIDEBAR
          ════════════════════════════════════════════════════════════ */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14">
            {/* Main grid */}
            <div className="lg:col-span-8">
              {articles.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-rule p-12 text-center text-ink-muted">
                  No articles yet. Add MDX files to{" "}
                  <code className="bg-paper-deep px-2 py-1 rounded font-mono">
                    /content/articles
                  </code>
                  .
                </div>
              ) : (
                <>
                  <h2 className="editorial-head text-3xl md:text-4xl text-ink mb-8">
                    All articles.
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
                    {rest.map((a) => (
                      <ArticleCard key={a.slug} article={a} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 flex flex-col gap-10">
              {/* Categories */}
              <div>
                <h3 className="editorial-head text-xl text-ink mb-4">
                  Categories
                </h3>
                <ul className="flex flex-col gap-2">
                  {categoryCounts.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/blog?category=${cat.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-2xl bg-paper-deep hover:bg-chip-peach px-5 py-3.5 transition-colors"
                      >
                        <span className="text-sm font-semibold text-ink">
                          {cat.label}
                        </span>
                        <span className="text-xs font-bold text-ink-muted group-hover:text-chip-peach-ink">
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscribe card */}
              <SubscribeCard />

              {/* Popular posts */}
              <PopularPosts heading="Recent posts" articles={popular} />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { ArticleCard } from "@/components/article-card";
import { CategoryChip } from "@/components/category-chip";
import { PopularPosts } from "@/components/popular-posts";
import { ProductCard } from "@/components/product-card";
import { AffiliateDisclosure } from "@/components/affiliate-disclosure";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SubscribeCard } from "@/components/subscribe-card";
import { getAllArticles } from "@/lib/articles";
import { getAllProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

function hasAuthorAvatar(): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", siteConfig.author.avatar),
    );
  } catch {
    return false;
  }
}

function countArticlesForCategory(
  relatedSlugs: readonly string[],
  articleCategories: string[],
): number {
  return articleCategories.filter((c) => relatedSlugs.includes(c)).length;
}

export default function HomePage() {
  const allArticles = getAllArticles();
  const articles = allArticles.slice(1, 7); // skip the featured one
  const recentForSidebar = allArticles.slice(0, 5);
  const products = getAllProducts().slice(0, 3);
  const featuredArticle = allArticles[0];
  const articleCategories = allArticles.map((a) => a.frontmatter.category);
  const showAvatar = hasAuthorAvatar();

  const categoryCounts = siteConfig.categories.map((cat) => ({
    ...cat,
    count: articleCategories.filter((c) =>
      (cat.relatedSlugs as readonly string[]).includes(c),
    ).length,
  }));

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 pt-16 md:pt-24 lg:pt-28 pb-20 lg:pb-28">
            <div className="lg:col-span-8">
              <h1 className="editorial-display text-[clamp(3.25rem,8.5vw,7.5rem)] text-ink mb-10">
                Field notes on what{" "}
                <span className="editorial-display-italic text-accent-deep">
                  actually
                </span>{" "}
                works.
              </h1>

              <div className="max-w-2xl">
                <p className="text-xl md:text-2xl text-ink-muted leading-[1.55] mb-12">
                  Honest, hands-on reviews of red light therapy, hydrogen water,
                  and gut-health tools — written by a clinician with{" "}
                  <span className="text-ink font-semibold">
                    {siteConfig.author.yearsClinical}+ years in sports medicine
                  </span>
                  . No fluff, no pay-to-play rankings, no rented credibility.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/blog" className="btn-primary">
                    Read the articles
                    <span aria-hidden>→</span>
                  </Link>
                  <Link href="/about" className="btn-secondary">
                    About the writer
                  </Link>
                </div>
              </div>
            </div>

            {/* Author card */}
            <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
              <div className="flex items-start gap-5 mb-8">
                <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden bg-paper-deep ring-2 ring-rule flex items-center justify-center">
                  {showAvatar ? (
                    <Image
                      src={siteConfig.author.avatar}
                      alt={siteConfig.author.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="editorial-display text-3xl text-ink-muted"
                    >
                      DS
                    </span>
                  )}
                </div>
                <div>
                  <div className="editorial-head text-xl mb-1">
                    {siteConfig.author.name}
                  </div>
                  <div className="text-base text-ink-muted leading-snug">
                    {siteConfig.author.credentialsShort.join(" · ")}
                  </div>
                </div>
              </div>

              <div className="editorial-rule mb-7" />

              <dl className="space-y-6">
                {[
                  {
                    label: "Articles published",
                    value: `${allArticles.length}`,
                    accent: "ink",
                  },
                  {
                    label: "Products tested",
                    value: "30+",
                    detail: "minimum 30 days each",
                    accent: "accent",
                  },
                  {
                    label: "Years clinical",
                    value: `${siteConfig.author.yearsClinical}+`,
                    detail: "sports medicine & nutrition",
                    accent: "trust",
                  },
                ].map((stat) => {
                  const numeralColor =
                    stat.accent === "accent"
                      ? "text-accent-deep"
                      : stat.accent === "trust"
                        ? "text-trust-deep"
                        : "text-ink";
                  return (
                    <div
                      key={stat.label}
                      className="flex items-baseline gap-5"
                    >
                      <dd
                        className={`editorial-numeral text-5xl shrink-0 w-20 ${numeralColor}`}
                      >
                        {stat.value}
                      </dd>
                      <dt className="flex-1">
                        <div className="text-base font-semibold text-ink">
                          {stat.label}
                        </div>
                        {stat.detail && (
                          <div className="text-sm text-ink-muted">
                            {stat.detail}
                          </div>
                        )}
                      </dt>
                    </div>
                  );
                })}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TOPICS
          ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-rule py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-14">
              <h2 className="editorial-head text-4xl md:text-5xl text-ink max-w-xl">
                What I cover.
              </h2>
              <p className="text-lg md:text-xl text-ink-muted mt-4 max-w-xl">
                Three subjects I won't stop reading about.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
            {siteConfig.categories.map((cat, i) => {
              const count = countArticlesForCategory(
                cat.relatedSlugs,
                articleCategories,
              );
              return (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className="group relative bg-paper rounded-3xl p-8 md:p-10 border border-rule hover:border-accent-deep hover:shadow-lg transition-all"
                >
                  <div className="flex items-baseline justify-between mb-8">
                    <span className="editorial-numeral text-6xl text-accent-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-ink-muted">
                      {count > 0
                        ? `${count} article${count === 1 ? "" : "s"}`
                        : "Coming soon"}
                    </span>
                  </div>

                  <h3 className="editorial-head text-2xl md:text-3xl text-ink mb-3 group-hover:text-accent-deep transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-base text-ink-muted leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep group-hover:gap-2 transition-all">
                    Read articles
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURED ARTICLE
          ════════════════════════════════════════════════════════════ */}
      {featuredArticle && (
        <section className="bg-paper-deep py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <h2 className="editorial-head text-4xl md:text-5xl text-ink mb-12 max-w-2xl">
                Latest article.
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="group block"
              >
                <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
                  {featuredArticle.frontmatter.coverImage && (
                    <div className="md:col-span-7 relative aspect-[5/4] overflow-hidden rounded-3xl bg-paper-tint shadow-lg">
                      <Image
                        src={featuredArticle.frontmatter.coverImage}
                        alt={featuredArticle.frontmatter.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
                        priority
                      />
                    </div>
                  )}
                  <div className="md:col-span-5">
                    <div className="mb-5">
                      <CategoryChip
                        category={featuredArticle.frontmatter.category}
                        size="md"
                      />
                    </div>
                    <h3 className="editorial-display text-[clamp(2.25rem,5vw,4rem)] text-ink mb-6 group-hover:text-accent-deep transition-colors">
                      {featuredArticle.frontmatter.title}
                    </h3>
                    <p className="text-xl text-ink-muted leading-relaxed mb-8">
                      {featuredArticle.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-ink-muted font-medium mb-10">
                      <span>By {siteConfig.author.name}</span>
                      <span className="w-1 h-1 rounded-full bg-ink-soft" />
                      <span>{featuredArticle.readingTime}</span>
                    </div>
                    <span className="btn-primary">
                      Read the article
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          GEAR — products
          ════════════════════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div>
                  <h2 className="editorial-head text-4xl md:text-5xl text-ink max-w-2xl">
                    Gear I actually trust.
                  </h2>
                  <p className="text-lg md:text-xl text-ink-muted mt-4 max-w-xl">
                    The tools currently earning their keep in my routine.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep hover:gap-2 transition-all"
                >
                  See all products
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <AffiliateDisclosure className="mb-10" />
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 reveal-stagger">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          ARTICLES GRID + SIDEBAR
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-paper-deep py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <h2 className="editorial-head text-4xl md:text-5xl text-ink max-w-2xl">
                  More to read.
                </h2>
                <p className="text-lg md:text-xl text-ink-muted mt-4 max-w-xl">
                  Recent articles from the blog.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep hover:gap-2 transition-all"
              >
                See all articles
                <span aria-hidden>→</span>
              </Link>
            </div>
          </ScrollReveal>

          {articles.length === 0 ? (
            <div className="border border-dashed border-rule p-12 text-center text-ink-muted">
              No articles yet. Drop an{" "}
              <code className="bg-paper-tint px-2 py-1 rounded font-mono">
                .mdx
              </code>{" "}
              file into{" "}
              <code className="bg-paper-tint px-2 py-1 rounded font-mono">
                /content/articles
              </code>{" "}
              and refresh.
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
              {/* Main article grid */}
              <div className="lg:col-span-8">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12 reveal-stagger">
                  {articles.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 flex flex-col gap-10">
                <div>
                  <h3 className="editorial-head text-xl text-ink mb-4">
                    Categories
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {categoryCounts.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/blog?category=${cat.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-2xl bg-paper hover:bg-chip-peach px-5 py-3.5 transition-colors"
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

                <SubscribeCard />

                <PopularPosts
                  heading="Recent posts"
                  articles={recentForSidebar}
                />
              </aside>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOLLOW ALONG
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-rule">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="editorial-display text-5xl md:text-6xl text-ink mb-8">
              Follow along.
            </h2>
            <p className="text-xl md:text-2xl text-ink-muted leading-relaxed max-w-2xl mx-auto mb-12">
              New product tests, protocol updates, and short clinical notes —
              posted on socials first. No spam, just what I'd tell a friend.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Instagram", href: siteConfig.social.instagram },
                { label: "YouTube", href: siteConfig.social.youtube },
                { label: "Pinterest", href: siteConfig.social.pinterest },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

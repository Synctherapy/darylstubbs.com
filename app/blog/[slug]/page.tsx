import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { AffiliateDisclosure } from "@/components/affiliate-disclosure";
import { ArticleJsonLd } from "@/components/json-ld";
import { CategoryChip } from "@/components/category-chip";
import { mdxComponents } from "@/components/mdx-components";
import { PopularPosts } from "@/components/popular-posts";
import { ShareButtons } from "@/components/share-buttons";
import { SubscribeCard } from "@/components/subscribe-card";
import { TableOfContents } from "@/components/table-of-contents";
import { getArticle, getAllArticles } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { extractHeadings } from "@/lib/toc";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const { title, description, coverImage, date } = article.frontmatter;
  const url = `${siteConfig.url}/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: date,
      authors: [siteConfig.author.name],
      images: coverImage ? [{ url: coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const includeDrafts = process.env.NODE_ENV !== "production";
  if (!includeDrafts) {
    if (article.frontmatter.draft) notFound();
    const publishDate = new Date(article.frontmatter.date);
    if (publishDate > new Date()) notFound();
  }

  const { frontmatter, content, readingTime } = article;
  const allArticles = getAllArticles();
  const related = allArticles
    .filter(
      (a) => a.slug !== slug && a.frontmatter.category === frontmatter.category,
    )
    .slice(0, 3);
  const popular = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 4);
  const headings = extractHeadings(content);
  const articleUrl = `${siteConfig.url}/blog/${slug}`;

  return (
    <>
      <ArticleJsonLd article={article} />

      {/* ════════════════════════════════════════════════════════════
          HERO — peach tinted header with breadcrumb, chip, title, meta
          ════════════════════════════════════════════════════════════ */}
      <header className="bg-tint-peach">
        <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-12 md:pb-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-ink-muted mb-8"
          >
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span aria-hidden>›</span>
            <Link href="/blog" className="hover:text-ink transition-colors">
              Articles
            </Link>
            <span aria-hidden>›</span>
            <span
              className="text-ink truncate max-w-[50vw]"
              aria-current="page"
            >
              {frontmatter.title}
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-5">
              <CategoryChip
                category={frontmatter.category}
                size="md"
                asLink
              />
            </div>
            <h1 className="editorial-display text-[clamp(2.25rem,5vw,3.75rem)] text-ink mb-8 leading-[1.05]">
              {frontmatter.title}
            </h1>
            <p className="text-lg md:text-xl text-ink-muted leading-relaxed mb-8 max-w-2xl">
              {frontmatter.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted font-medium">
              <span className="inline-flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-ink text-background inline-flex items-center justify-center text-[10px] font-bold">
                  DS
                </span>
                <span className="text-ink">
                  {frontmatter.author ?? siteConfig.author.name}
                </span>
              </span>
              <span aria-hidden className="w-1 h-1 rounded-full bg-ink-soft" />
              <span>{formatDate(frontmatter.date)}</span>
              <span aria-hidden className="w-1 h-1 rounded-full bg-ink-soft" />
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════
          BODY — 3-column layout: TOC | content | subscribe + popular
          ════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left sidebar — TOC + share */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 flex flex-col gap-10">
              <TableOfContents headings={headings} />
              <ShareButtons url={articleUrl} title={frontmatter.title} />
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-6 min-w-0">
            {frontmatter.coverImage && (
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-md mb-10">
                <Image
                  src={frontmatter.coverImage}
                  alt={frontmatter.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
            )}

            <AffiliateDisclosure className="mb-10" />

            <div className="prose-article">
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "wrap",
                          properties: { className: ["heading-anchor"] },
                        },
                      ],
                    ],
                  },
                }}
              />
            </div>

            {/* Mobile share buttons (desktop ones live in left sidebar) */}
            <div className="lg:hidden mt-12 pt-8 border-t border-rule">
              <ShareButtons url={articleUrl} title={frontmatter.title} />
            </div>
          </article>

          {/* Right sidebar — subscribe + popular posts */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 flex flex-col gap-10">
              <SubscribeCard />
              <PopularPosts heading="Popular articles" articles={popular} />
            </div>
          </aside>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          RELATED — keep reading
          ════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="bg-paper-deep py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
              <h2 className="editorial-head text-3xl md:text-4xl text-ink">
                Keep reading.
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep hover:gap-2 transition-all"
              >
                See all articles
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex flex-col bg-paper rounded-3xl overflow-hidden border border-rule hover:shadow-lg transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                >
                  {a.frontmatter.coverImage && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={a.frontmatter.coverImage}
                        alt={a.frontmatter.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <CategoryChip
                        category={a.frontmatter.category}
                        size="sm"
                      />
                    </div>
                    <h3 className="editorial-head text-lg text-ink leading-snug mb-3 group-hover:text-accent-deep transition-colors">
                      {a.frontmatter.title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                      {a.frontmatter.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

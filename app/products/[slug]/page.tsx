import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { AffiliateDisclosure } from "@/components/affiliate-disclosure";
import { OutboundLink } from "@/components/outbound-link";
import { ProductJsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import {
  getAllProductSlugs,
  getProduct,
} from "@/lib/products";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const { title, brand, description, coverImage } = product.frontmatter;
  const url = `${siteConfig.url}/products/${slug}`;
  const seoTitle = `${title} Review (${brand})`;

  return {
    title: seoTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: seoTitle,
      description,
      url,
      images: [{ url: coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [coverImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const { frontmatter, content } = product;

  return (
    <>
      <ProductJsonLd product={product} />

      <article className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="relative aspect-square rounded-card overflow-hidden bg-surface-muted">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 512px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-pill text-xs font-bold uppercase tracking-widest w-fit mb-4">
              {frontmatter.brand}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {frontmatter.title}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <Stars rating={frontmatter.rating} />
              <span className="font-bold">{frontmatter.rating.toFixed(1)}</span>
              <span className="text-foreground-muted">
                · Reviewed by {siteConfig.author.name}
              </span>
            </div>

            <p className="text-lg text-foreground-muted mb-8">
              {frontmatter.description}
            </p>

            {frontmatter.bestFor && (
              <div className="bg-surface-muted border border-border/40 rounded-card p-5 mb-6">
                <div className="text-xs uppercase tracking-widest font-bold text-foreground-muted mb-1">
                  Best for
                </div>
                <div className="font-medium">{frontmatter.bestFor}</div>
              </div>
            )}

            {(frontmatter.pros?.length || frontmatter.cons?.length) ? (
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {frontmatter.pros && (
                  <div className="rounded-card border border-border/40 p-5">
                    <div className="text-xs uppercase tracking-widest font-bold text-foreground-muted mb-3">
                      Pros
                    </div>
                    <ul className="space-y-2 text-sm">
                      {frontmatter.pros.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-accent">+</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {frontmatter.cons && (
                  <div className="rounded-card border border-border/40 p-5">
                    <div className="text-xs uppercase tracking-widest font-bold text-foreground-muted mb-3">
                      Cons
                    </div>
                    <ul className="space-y-2 text-sm">
                      {frontmatter.cons.map((c, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-foreground-muted">−</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <OutboundLink
              href={frontmatter.affiliateUrl}
              productSlug={product.slug}
              className="bg-accent text-white px-8 py-4 rounded-lg font-bold text-center shadow-lg shadow-accent/25 hover:-translate-y-0.5 transition-transform inline-block"
            >
              {frontmatter.affiliateLabel ?? "Check current price"}
              {frontmatter.price ? ` — ${frontmatter.price}` : ""}
            </OutboundLink>

            <p className="text-xs text-foreground-muted mt-3">
              Last updated {formatDate(frontmatter.updated)}
            </p>
          </div>
        </div>

        <AffiliateDisclosure className="mb-10" />

        <div className="prose-article max-w-3xl mx-auto">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </article>
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex gap-0.5 text-accent" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

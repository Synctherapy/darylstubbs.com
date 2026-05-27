import type { Article } from "@/lib/articles";
import type { Product } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/format";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({ article }: { article: Article }) {
  const { slug, frontmatter } = article;
  const url = `${siteConfig.url}/blog/${slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.coverImage
      ? [absoluteUrl(frontmatter.coverImage, siteConfig.url)]
      : undefined,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: frontmatter.author ?? siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  };

  return <JsonLd data={data} />;
}

export function ProductJsonLd({ product }: { product: Product }) {
  const { slug, frontmatter } = product;
  const url = `${siteConfig.url}/products/${slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: frontmatter.title,
    image: [absoluteUrl(frontmatter.coverImage, siteConfig.url)],
    description: frontmatter.description,
    brand: { "@type": "Brand", name: frontmatter.brand },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: frontmatter.rating,
        bestRating: 5,
      },
      author: { "@type": "Person", name: siteConfig.author.name },
      datePublished: frontmatter.updated,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: frontmatter.rating,
      reviewCount: 1,
      bestRating: 5,
    },
    url,
  };

  return <JsonLd data={data} />;
}

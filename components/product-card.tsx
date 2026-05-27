import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { slug, frontmatter } = product;

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col rounded-card overflow-hidden border border-border/30 bg-surface shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        <Image
          src={frontmatter.coverImage}
          alt={frontmatter.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-foreground-muted text-xs uppercase tracking-widest font-bold">
          {frontmatter.brand}
        </span>
        <h3 className="font-display font-extrabold text-lg mt-2 mb-2 leading-tight group-hover:text-accent transition-colors">
          {frontmatter.title}
        </h3>
        <p className="text-sm text-foreground-muted mb-4 flex-1">
          {frontmatter.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm">
            <span className="text-accent">★</span>
            <span className="font-bold">{frontmatter.rating.toFixed(1)}</span>
          </span>
          {frontmatter.price && (
            <span className="text-sm font-semibold">{frontmatter.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

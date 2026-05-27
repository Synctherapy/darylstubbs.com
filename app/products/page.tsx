import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { AffiliateDisclosure } from "@/components/affiliate-disclosure";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products I Use",
  description:
    "The red light panels, hydrogen water generators, and probiotics I actually use — with honest pros, cons, and what each is best for.",
};

export default function ProductsIndexPage() {
  const products = getAllProducts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <header className="mb-12 max-w-3xl">
        <h1 className="font-display text-5xl font-extrabold tracking-tight mb-4">
          Products I actually use
        </h1>
        <p className="text-lg text-foreground-muted">
          No paid placements. If something stops working, I take it off the list.
        </p>
      </header>

      <AffiliateDisclosure className="mb-12" />

      {products.length === 0 ? (
        <div className="rounded-card border border-dashed border-border p-12 text-center text-foreground-muted">
          No products yet. Add MDX files to{" "}
          <code className="bg-surface-muted px-2 py-1 rounded">
            /content/products
          </code>
          .
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

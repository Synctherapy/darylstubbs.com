import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PRODUCTS_DIR = path.join(process.cwd(), "content/products");

export type ProductFrontmatter = {
  title: string;
  brand: string;
  description: string;
  category: string;
  coverImage: string;
  rating: number;
  price?: string;
  affiliateUrl: string;
  affiliateLabel?: string;
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  updated: string;
  draft?: boolean;
};

export type Product = {
  slug: string;
  frontmatter: ProductFrontmatter;
  content: string;
};

function readProductFile(slug: string): Product | null {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as ProductFrontmatter,
    content,
  };
}

export function getAllProductSlugs(): string[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getProduct(slug: string): Product | null {
  return readProductFile(slug);
}

export function getAllProducts(): Product[] {
  const includeDrafts = process.env.NODE_ENV !== "production";
  return getAllProductSlugs()
    .map((slug) => readProductFile(slug))
    .filter((p): p is Product => p !== null)
    .filter((p) => includeDrafts || !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.updated).getTime() -
        new Date(a.frontmatter.updated).getTime(),
    );
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.frontmatter.category === category);
}

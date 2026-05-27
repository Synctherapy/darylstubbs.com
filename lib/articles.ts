import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export type ArticleFrontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  draft?: boolean;
};

export type Article = {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: string;
};

function readArticleFile(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    content,
    readingTime: readingTime(content).text,
  };
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticle(slug: string): Article | null {
  return readArticleFile(slug);
}

export function getAllArticles(): Article[] {
  const includeDrafts = process.env.NODE_ENV !== "production";
  const now = new Date();
  return getAllArticleSlugs()
    .map((slug) => readArticleFile(slug))
    .filter((a): a is Article => a !== null)
    .filter((a) => {
      if (includeDrafts) return true;
      const publishDate = new Date(a.frontmatter.date);
      return !a.frontmatter.draft && publishDate <= now;
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.category === category);
}

import GithubSlugger from "github-slugger";

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * Extract h2/h3 headings from MDX source so we can render a table of contents.
 * Uses github-slugger to match the slugs rehype-slug generates during render.
 */
export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const lines = content.split("\n");

  let inFenced = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("```")) {
      inFenced = !inFenced;
      continue;
    }
    if (inFenced) continue;

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = cleanInline(match[2]);
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}

function cleanInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

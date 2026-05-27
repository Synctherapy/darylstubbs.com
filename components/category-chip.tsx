import Link from "next/link";

type ChipTheme = {
  bg: string;
  text: string;
  label: string;
  href?: string;
};

const CHIP_THEMES: Record<string, ChipTheme> = {
  "red-light-therapy": {
    bg: "bg-chip-peach",
    text: "text-chip-peach-ink",
    label: "Red Light",
    href: "/blog?category=red-light-therapy",
  },
  "red-light-recovery": {
    bg: "bg-chip-peach",
    text: "text-chip-peach-ink",
    label: "Red Light",
    href: "/blog?category=red-light-therapy",
  },
  "hydrogen-water": {
    bg: "bg-chip-blue",
    text: "text-chip-blue-ink",
    label: "Hydrogen Water",
    href: "/blog?category=hydrogen-water",
  },
  wellness: {
    bg: "bg-chip-blue",
    text: "text-chip-blue-ink",
    label: "Wellness",
    href: "/blog",
  },
  probiotics: {
    bg: "bg-chip-green",
    text: "text-chip-green-ink",
    label: "Gut Health",
    href: "/blog?category=probiotics",
  },
  "gut-health-nutrition": {
    bg: "bg-chip-green",
    text: "text-chip-green-ink",
    label: "Gut Health",
    href: "/blog?category=probiotics",
  },
};

function themeFor(category: string): ChipTheme {
  return (
    CHIP_THEMES[category] ?? {
      bg: "bg-chip-neutral",
      text: "text-chip-neutral-ink",
      label: category
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    }
  );
}

type Props = {
  category: string;
  size?: "xs" | "sm" | "md";
  asLink?: boolean;
  className?: string;
};

export function CategoryChip({
  category,
  size = "sm",
  asLink = false,
  className = "",
}: Props) {
  const theme = themeFor(category);
  const sizeClass =
    size === "xs"
      ? "text-[11px] px-2.5 py-0.5"
      : size === "md"
        ? "text-sm px-3.5 py-1.5"
        : "text-xs px-3 py-1";

  const base = `inline-flex items-center font-semibold rounded-full whitespace-nowrap transition-opacity ${sizeClass} ${theme.bg} ${theme.text} ${className}`;

  if (asLink && theme.href) {
    return (
      <Link href={theme.href} className={`${base} hover:opacity-80`}>
        {theme.label}
      </Link>
    );
  }
  return <span className={base}>{theme.label}</span>;
}

export function categoryLabel(category: string): string {
  return themeFor(category).label;
}

type Props = {
  className?: string;
  variant?: "inline" | "banner";
};

export function AffiliateDisclosure({ className = "", variant = "banner" }: Props) {
  if (variant === "inline") {
    return (
      <p className={`text-xs text-foreground-muted italic ${className}`}>
        Some links on this page are affiliate links. If you buy through them, I
        may earn a small commission at no extra cost to you.
      </p>
    );
  }

  return (
    <aside
      className={`rounded-card border border-border/40 bg-surface-muted px-5 py-3 text-xs text-foreground-muted flex gap-3 items-start ${className}`}
      aria-label="Affiliate disclosure"
    >
      <span aria-hidden className="text-accent font-bold">
        ⓘ
      </span>
      <span>
        <strong className="text-foreground">Affiliate disclosure:</strong> Some
        links below are affiliate links. If you buy through them I may earn a
        small commission — it costs you nothing extra and helps keep this site
        independent. I only recommend products I personally use.
      </span>
    </aside>
  );
}

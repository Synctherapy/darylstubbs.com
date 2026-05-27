import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { OutboundLink } from "./outbound-link";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export const mdxComponents: MDXComponents = {
  a: ({ href, children, ...rest }) => {
    if (!href) return <a {...rest}>{children}</a>;
    if (isExternal(href)) {
      return (
        <OutboundLink href={href} className="text-accent font-semibold underline">
          {children}
        </OutboundLink>
      );
    }
    return (
      <Link href={href} className="text-accent font-semibold underline">
        {children}
      </Link>
    );
  },
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <span className="block relative w-full aspect-[16/9] my-8">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover rounded-card"
        />
      </span>
    );
  },
  Callout: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <aside className="bg-accent-soft/30 border-l-4 border-accent rounded-card p-5 my-6">
      {title && <div className="font-bold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </aside>
  ),
  AffiliateButton: ({
    href,
    children,
    slug,
  }: {
    href: string;
    children: React.ReactNode;
    slug?: string;
  }) => (
    <OutboundLink
      href={href}
      productSlug={slug}
      className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-bold no-underline my-4 shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-transform"
    >
      {children}
    </OutboundLink>
  ),
};

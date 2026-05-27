import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="text-accent font-bold uppercase tracking-widest text-sm mb-4">
        404
      </p>
      <h1 className="font-display text-5xl font-extrabold tracking-tight mb-4">
        Page not found
      </h1>
      <p className="text-foreground-muted mb-8">
        That link is broken or the page has moved.
      </p>
      <Link
        href="/"
        className="bg-accent text-white px-6 py-3 rounded-lg font-bold inline-block"
      >
        Back home
      </Link>
    </div>
  );
}

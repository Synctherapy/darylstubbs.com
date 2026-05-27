type Props = {
  variant?: "peach" | "ink";
  heading?: string;
  body?: string;
  className?: string;
};

export function SubscribeCard({
  variant = "peach",
  heading = "Get the latest research notes",
  body = "Curated guides, product tests, and protocol updates — straight to your inbox. No spam.",
  className = "",
}: Props) {
  const isInk = variant === "ink";

  const surface = isInk
    ? "bg-ink text-background"
    : "bg-chip-peach text-ink";

  const inputClasses = isInk
    ? "w-full bg-background/10 text-background placeholder:text-background/60 border border-background/20 focus:border-accent"
    : "w-full bg-paper text-ink placeholder:text-ink-muted border border-rule focus:border-accent-deep";

  const buttonClasses = isInk
    ? "w-full bg-accent text-white hover:bg-accent-deep"
    : "w-full bg-ink text-background hover:bg-accent-deep";

  return (
    <aside
      className={`rounded-3xl p-7 md:p-8 ${surface} ${className}`}
      aria-label="Subscribe to the newsletter"
    >
      <h3 className="editorial-head text-2xl mb-3 leading-tight">{heading}</h3>
      <p
        className={`text-sm leading-relaxed mb-6 ${
          isInk ? "text-background/75" : "text-ink-muted"
        }`}
      >
        {body}
      </p>
      {/* TODO: wire this <form action> to your email provider (ConvertKit, Beehiiv, Mailchimp, etc.) */}
      <form action="#" method="post" className="flex flex-col gap-3">
        <label htmlFor="subscribe-email" className="sr-only">
          Your email
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className={`rounded-full px-5 py-3 text-sm font-medium outline-none transition-colors ${inputClasses}`}
        />
        <button
          type="submit"
          className={`rounded-full px-5 py-3 text-sm font-bold transition-colors ${buttonClasses}`}
        >
          Subscribe
        </button>
      </form>
    </aside>
  );
}

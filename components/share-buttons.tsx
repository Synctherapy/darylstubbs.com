type Props = {
  url: string;
  title: string;
  className?: string;
};

export function ShareButtons({ url, title, className = "" }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M13.5 21v-8.25H16l.5-3.5H13.5V7.05c0-1 .28-1.68 1.71-1.68h1.82v-3.2c-.31-.04-1.4-.13-2.66-.13-2.64 0-4.45 1.6-4.45 4.55v2.66H7.5v3.5h2.42V21h3.58z" />
        </svg>
      ),
    },
    {
      label: "Share on X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M17.53 3h2.99l-6.53 7.46L22 21h-6.02l-4.72-6.18L5.84 21H2.85l6.98-7.98L2 3h6.17l4.27 5.66L17.53 3zm-1.05 16.13h1.66L7.56 4.77H5.78l10.7 14.36z" />
        </svg>
      ),
    },
    {
      label: "Share on Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.08 2.45 7.59 5.95 9.13-.08-.78-.16-1.97.03-2.82.18-.77 1.15-4.87 1.15-4.87s-.29-.59-.29-1.46c0-1.37.79-2.39 1.78-2.39.84 0 1.25.63 1.25 1.39 0 .84-.54 2.1-.82 3.27-.23.98.49 1.78 1.45 1.78 1.74 0 3.08-1.84 3.08-4.49 0-2.35-1.69-3.99-4.1-3.99-2.79 0-4.43 2.09-4.43 4.26 0 .84.32 1.74.73 2.23.08.1.09.18.07.28-.07.32-.25.98-.28 1.12-.04.18-.15.22-.34.13-1.24-.58-2.02-2.39-2.02-3.85 0-3.13 2.27-6.01 6.55-6.01 3.44 0 6.11 2.45 6.11 5.73 0 3.42-2.16 6.18-5.16 6.18-1 0-1.95-.52-2.27-1.14l-.62 2.36c-.22.86-.83 1.93-1.24 2.59.94.29 1.93.45 2.95.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={className}>
      <div className="editorial-kicker mb-3">Share</div>
      <ul className="flex gap-2">
        {targets.map((t) => (
          <li key={t.label}>
            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.label}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-paper border border-rule text-ink hover:bg-accent hover:text-white hover:border-accent transition-colors"
            >
              {t.icon}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

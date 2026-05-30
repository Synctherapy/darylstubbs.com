import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { siteConfig } from "@/lib/site-config";

function hasAuthorAvatar(): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", siteConfig.author.avatar),
    );
  } catch {
    return false;
  }
}

export const metadata: Metadata = {
  title: "About the writer",
  description: `About ${siteConfig.author.name} — a clinician writing field-tested reviews of red light therapy, hydrogen water, and gut-health tools.`,
};

const METHODOLOGY = [
  {
    num: "01",
    title: "Live with it for 30+ days",
    body: "Nothing earns a spot in a guide unless I've used it daily for at least a month. First-impressions reviews lie. Long enough is when the novelty wears off and the routine reveals what's real.",
  },
  {
    num: "02",
    title: "Cross-check the research",
    body: "Every claim that touches biology gets traced back to peer-reviewed work — PubMed, clinical trials, mechanistic studies. If the literature is thin or contradictory, I say so out loud instead of pretending otherwise.",
  },
  {
    num: "03",
    title: "Compare against what I trust",
    body: "Every new tool gets benchmarked against the gear I already trust and the protocols I already use with clients. If it can't beat the incumbent, it doesn't replace it on the recommendation list.",
  },
  {
    num: "04",
    title: "Write only when I'd recommend it",
    body: "If a product disappoints, it doesn't get a hit piece — it gets quietly left off. If it earns its place, the review goes deep on the why, the trade-offs, and who it isn't for.",
  },
];

const STANDARDS = [
  {
    head: "No pay-to-play rankings.",
    body: "Brands cannot purchase placement, position, or favorable wording. Ever. Money never decides the verdict.",
  },
  {
    head: "Free samples, yes. Paid articles, never.",
    body: "Brands sometimes send me free products to test — that's standard in this industry and I'd rather say it openly than pretend otherwise. I'm never paid to write the article, and a free unit never changes the verdict. If a sample disappoints, it doesn't get a guide.",
  },
  {
    head: "Affiliate links are flagged.",
    body: "Some product links earn a small commission at no cost to you. The link follows the recommendation, not the other way around.",
  },
  {
    head: "I update old reviews.",
    body: "When something I recommended stops working for me, I remove it. Reviews are dated and revisited; nothing here is fire-and-forget.",
  },
  {
    head: "Not medical advice.",
    body: "I'm a clinician writing in public, not your clinician. Anything here is informational. Talk to someone who knows you before changing protocols.",
  },
];

export default function AboutPage() {
  const showAvatar = hasAuthorAvatar();

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO — about Daryl
          ════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 pt-16 md:pt-24 lg:pt-28 pb-16 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <h1 className="editorial-display text-[clamp(3rem,7vw,6rem)] text-ink mb-10 leading-[0.95]">
                Daryl{" "}
                <span className="editorial-display-italic text-accent-deep">
                  Stubbs.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-ink-muted leading-[1.55] max-w-2xl">
                Sports medicine practitioner turned writer. I cover the three
                corners of recovery I keep coming back to —{" "}
                <span className="text-ink font-semibold">
                  red light therapy
                </span>
                ,{" "}
                <span className="text-ink font-semibold">hydrogen water</span>,
                and <span className="text-ink font-semibold">probiotics</span> —
                and the gear that actually earns its place in a daily routine.
              </p>
            </div>

            <aside className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-paper-deep ring-2 ring-rule overflow-hidden flex items-center justify-center shadow-[0_20px_60px_-20px_rgba(22,17,13,0.25)]">
                {showAvatar ? (
                  <Image
                    src={siteConfig.author.avatar}
                    alt={siteConfig.author.name}
                    fill
                    sizes="(max-width: 768px) 256px, 320px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="editorial-display text-[8rem] text-ink-soft leading-none select-none"
                  >
                    DS
                  </span>
                )}
              </div>
            </aside>
          </div>

          {/* Credentials chips */}
          <div className="flex flex-wrap gap-3 pb-16">
            {siteConfig.author.credentials.map((c) => (
              <span
                key={c}
                className="inline-flex items-center px-4 py-2 rounded-full bg-paper-deep border border-rule text-sm font-semibold text-ink"
              >
                {c}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-trust text-white text-sm font-semibold">
              <span
                aria-hidden
                className="w-1.5 h-1.5 rounded-full bg-accent"
              />
              {siteConfig.author.yearsClinical}+ years clinical
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STORY — why this site exists
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 border-t border-rule">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="editorial-head text-4xl md:text-5xl text-ink mb-12">
              I got tired of watching good people waste money on bad protocols.
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="text-xl leading-[1.7] text-ink space-y-7">
              <p className="editorial-dropcap">
                I spent the last decade inside a clinic, working with patients
                trying to figure out what would move the needle on their energy,
                sleep, and recovery — and what was just well-marketed noise. The
                pattern, after enough years, was hard to miss. People weren't
                short on information. They were drowning in it. The signal was
                buried under affiliate spam, brand-funded "research," and
                rankings written by someone who had never touched the product.
              </p>

              <p>
                This site is the antidote to that — at least, the version of it
                I can write. I review the tools I actually use. I cite the
                research I actually read. I drop products that stop earning
                their place. The goal isn't to be the biggest health site on
                the internet. It's to be the one a friend would recommend if
                you said,{" "}
                <em className="editorial-display-italic">
                  "who do I trust on this?"
                </em>
              </p>

              <p>
                Three topics get the deep treatment here:{" "}
                <span className="font-medium">red light therapy</span>,{" "}
                <span className="font-medium">hydrogen water</span>, and{" "}
                <span className="font-medium">probiotics and gut health</span>.
                They're the three tools I keep coming back to in my own life,
                and the ones I get asked about most often. Everything else, for
                now, lives in the margins.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          METHODOLOGY — how I review products
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-paper-deep py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-16 max-w-2xl">
              <h2 className="editorial-head text-4xl md:text-5xl text-ink">
                How I review products.
              </h2>
              <p className="text-lg md:text-xl text-ink-muted mt-4">
                The bar a product has to clear before it gets a write-up.
              </p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col reveal-stagger">
            {METHODOLOGY.map((step) => (
              <div key={step.num} className="grid md:grid-cols-12 gap-6 py-10 border-b border-rule first:border-t-2 first:border-t-ink last:border-b-2 last:border-b-ink">
                <div className="md:col-span-5 flex items-baseline gap-6">
                  <span className="editorial-numeral text-5xl text-accent-deep shrink-0 leading-none">
                    {step.num}
                  </span>
                  <h3 className="editorial-head text-2xl text-ink">
                    {step.title}
                  </h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-lg text-ink-muted leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHAT I COVER — three topics
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-14 max-w-2xl">
              <h2 className="editorial-head text-4xl md:text-5xl text-ink">
                What I cover.
              </h2>
              <p className="text-lg md:text-xl text-ink-muted mt-4">
                Three subjects I keep returning to.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
            {siteConfig.categories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="group bg-paper rounded-3xl p-8 md:p-10 border border-rule hover:border-accent-deep hover:shadow-lg transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
              >
                <span className="editorial-numeral text-5xl text-accent-deep block mb-7">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="editorial-head text-2xl md:text-3xl text-ink mb-3 group-hover:text-accent-deep transition-colors">
                  {cat.label}
                </h3>
                <p className="text-base text-ink-muted leading-relaxed mb-6">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep group-hover:gap-2 transition-all">
                  Read articles
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          EDITORIAL STANDARDS — what I don't do
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-paper-deep py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="editorial-head text-4xl md:text-5xl text-ink mb-4">
              What you can count on.
            </h2>
            <p className="text-lg md:text-xl text-ink-muted mb-14 max-w-2xl">
              The rules that don't bend, no matter who's asking.
            </p>
          </ScrollReveal>

          <div className="space-y-12 reveal-stagger">
            {STANDARDS.map((s) => (
              <div
                key={s.head}
                className="grid md:grid-cols-12 gap-6 pb-12 border-b border-rule last:border-0"
              >
                <div className="md:col-span-5 flex gap-4">
                  <span
                    aria-hidden
                    className="mt-2 w-2 h-2 rounded-full bg-trust shrink-0"
                  />
                  <h3 className="editorial-head text-2xl text-trust-deep">
                    {s.head}
                  </h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-lg text-ink-muted leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          GET IN TOUCH
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-rule">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="editorial-display text-5xl md:text-6xl text-ink mb-8">
              Get in touch.
            </h2>
            <p className="text-xl md:text-2xl text-ink-muted leading-relaxed max-w-2xl mx-auto mb-12">
              Questions, corrections, or just want to say hi? I read every
              message. If you spot an error in an article, that's especially
              welcome.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Instagram", href: siteConfig.social.instagram },
                { label: "YouTube", href: siteConfig.social.youtube },
                { label: "Pinterest", href: siteConfig.social.pinterest },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

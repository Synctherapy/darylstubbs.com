import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Clinical Calculators & Interactive Biohacking Tools — Daryl Stubbs",
  description:
    "Calibrated clinical tools to optimize your biohacking protocols. Calculate red light therapy dosages, convert hydrogen water PPM to milligrams, and find clinical probiotic strains.",
};

export default function ToolsPage() {
  const tools = [
    {
      title: "Red Light Therapy Dose & Time Calculator",
      description:
        "Calculate the exact exposure time needed to hit target clinical energy densities (Joules/cm²) based on your panel's distance and verified power output.",
      href: "/tools/red-light-dose-calculator",
      category: "Red Light Therapy",
      colorClass: "bg-red-500/10 text-red-600 border-red-500/20 hover:border-red-500/40",
      accentColor: "from-red-500 to-rose-600",
      badge: "Highly Popular",
    },
    {
      title: "Hydrogen Water Intake & mg Converter",
      description:
        "Translate generator PPM/PPB and bottle volumes into actual milligrams of active molecular hydrogen (H₂). Calculate your personalized daily therapeutic target.",
      href: "/tools/hydrogen-water-calculator",
      category: "Hydrogen Water",
      colorClass: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:border-cyan-500/40",
      accentColor: "from-cyan-500 to-blue-600",
      badge: "Technical",
    },
    {
      title: "Clinical Probiotic Strain Finder Quiz",
      description:
        "An algorithm matching digestive symptoms (IBS, bloating, gas) and goals to peer-reviewed, specific bacterial strains rather than generic brand formulations.",
      href: "/tools/probiotic-strain-finder",
      category: "Gut Health",
      colorClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/40",
      accentColor: "from-emerald-500 to-teal-600",
      badge: "Clinical Quiz",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      {/* Header Section */}
      <div className="max-w-2xl mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">
          Interactive Utilities
        </span>
        <h1 className="editorial-head text-4xl md:text-5xl text-ink mb-6">
          Clinical Tools & Calculators
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed">
          Biohacking shouldn't rely on guesswork. These interactive tools translate clinical research and physical formulas into actionable dosing parameters for your daily routine.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col justify-between p-8 bg-background border border-border-muted rounded-2xl shadow-sm hover:shadow-xl hover:border-ink/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-6">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${tool.colorClass}`}
                >
                  {tool.category}
                </span>
                {tool.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-ink mb-3 group-hover:text-accent transition-colors">
                {tool.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-ink-muted leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* CTA Arrow */}
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-accent group-hover:translate-x-1.5 transition-transform">
              Launch tool <span aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Educational Note */}
      <div className="mt-20 p-8 bg-neutral-50 dark:bg-neutral-900 border border-border-muted rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h3 className="text-base font-bold text-ink mb-2">Are these tools clinically validated?</h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            Yes. The calculations are based on standard physical formulas for light energy propagation and chemical conversions of molecular gases in liquids, adhering to guidelines from the International Hydrogen Standards Association (IHSA) and peer-reviewed photobiomodulation research.
          </p>
        </div>
        <Link
          href="/blog"
          className="text-sm font-bold text-ink hover:text-accent border-b border-ink hover:border-accent transition-all shrink-0 py-0.5"
        >
          Read the articles behind the math
        </Link>
      </div>
    </div>
  );
}

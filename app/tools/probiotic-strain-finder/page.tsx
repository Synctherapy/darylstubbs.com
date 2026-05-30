import type { Metadata } from "next";
import { ProbioticQuiz } from "./quiz";

export const metadata: Metadata = {
  title: "Clinical Probiotic Quiz: Personalized Probiotic Strain Finder",
  description: "Take our evidence-based probiotic selector quiz. Find the best probiotic strains for bloating, gas, IBS, and constipation based on clinical trials.",
  alternates: {
    canonical: "https://darylstubbs.com/tools/probiotic-strain-finder",
  },
};

export default function Page() {
  return (
    <>
      <ProbioticQuiz />

      {/* SEO Optimized Educational Copy Block */}
      <section className="bg-paper-deep py-20 border-t border-rule mt-12 animate-reveal-up">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <article className="prose-article space-y-6">
            <h2 className="editorial-head text-3xl text-ink">
              Probiotics 101: A Beginner's Guide to Choosing the Right Supplement
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              If you have ever stood in the supplement aisle asking yourself, <strong>"What probiotic should I take?"</strong>, you are not alone. The options are overwhelming, and the packaging is filled with confusing marketing terms like "billions of live cultures" and "multi-strain defense." 
            </p>
            <p className="text-base text-ink-muted leading-relaxed">
              Most people buy probiotics hoping for general gut health support, only to notice zero improvement. The reason is simple: <strong>your gut does not need a generic probiotic; it needs a specific clinical strain.</strong>
            </p>

            <h3 className="editorial-head text-2xl text-ink mt-8">
              The Car Analogy: Species vs. Strains Explained
            </h3>
            <p className="text-base text-ink-muted leading-relaxed">
              To understand how to choose a probiotic, think of bacteria names like cars:
            </p>
            <div className="border border-rule-soft bg-paper p-5 rounded-2xl space-y-3 shadow-sm">
              <p className="text-sm text-ink font-semibold">
                🏎️ <strong>Genus (e.g. Lactobacillus):</strong> Like saying "Ford"—a general manufacturer category.
              </p>
              <p className="text-sm text-ink font-semibold">
                🚗 <strong>Species (e.g. rhamnosus):</strong> Like saying "F-150"—tells you the type of car.
              </p>
              <p className="text-sm text-ink font-semibold">
                ⚡ <strong>Strain (e.g. GG):</strong> Like saying "Lightning Electric"—tells you the exact engine, battery, and capabilities. 
              </p>
            </div>
            <p className="text-base text-ink-muted leading-relaxed">
              Writing <em>Lactobacillus rhamnosus</em> on a bottle does not guarantee it will help you. You must look for the exact alphanumeric strain code (like <strong>LGG</strong> or <strong>35624</strong>). Strains are what have been tested in laboratories and clinical trials to ensure they can survive stomach acid transit and adhere to your intestinal walls.
            </p>

            <h2 className="editorial-head text-3xl text-ink mt-12">
              How a Probiotic Quiz Matches You to the Best Probiotic Strains
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              Different probiotic strains have completely different biological jobs. Using an evidence-based <strong>gut health assessment quiz</strong> helps you isolate your symptoms to find the exact matches:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base text-ink-muted">
              <li>
                <strong>Best Probiotic for Bloating & Visceral Cramping:</strong> Human trials show that the strain <em>Bifidobacterium longum</em> 35624 helps downregulate visceral sensory nerves, acting like a volume knob to reduce abdominal pressure sensations.
              </li>
              <li>
                <strong>Best Probiotic for Gas & Distension:</strong> If fiber or beans make you balloon, <em>Lactobacillus plantarum</em> 299v helps colonic bacteria ferment foods cleaner, producing less hydrogen and methane gas.
              </li>
              <li>
                <strong>Best Probiotic for Constipation & Motility:</strong> To speed up sluggish bowels, the strain <em>Bifidobacterium lactis</em> HN019 is clinically proven to encourage the wave-like muscle contractions (peristalsis) in the colon walls.
              </li>
              <li>
                <strong>Best Probiotic for Post-Antibiotic Recovery:</strong> Taking broad-spectrum antibiotics is like a wildfire in your gut. Pioneers like <em>Lactobacillus rhamnosus</em> GG (LGG) help secure the borders and prevent opportunistic yeast or pathogen overgrowth.
              </li>
            </ul>

            <h3 className="editorial-head text-2xl text-ink mt-12">
              Do I Need a Probiotic (Or Prebiotics)?
            </h3>
            <p className="text-base text-ink-muted leading-relaxed">
              Probiotics are the active, live beneficial bacteria. <strong>Prebiotics</strong> are the non-digestible plant fibers that act as fuel for those bacteria. If you take probiotics without feeding them prebiotic fiber (from foods like chicory, oats, asparagus, and garlic), the beneficial bacteria will starve and pass right through you. 
            </p>
            <p className="text-base text-ink-muted leading-relaxed">
              This is why eating a diverse range of plant foods (aiming for 30+ varieties per week) is critical. Our quiz evaluates your plant food count and provides a tailored food-to-bacteria blueprint so you can feed your recommended strains naturally.
            </p>

            <h3 className="editorial-head text-2xl text-ink mt-8">
              What About CFU Counts? Is Higher Always Better?
            </h3>
            <p className="text-base text-ink-muted leading-relaxed">
              CFU stands for <strong>Colony Forming Units</strong>—the number of live bacteria in a serving. While brands advertise 100 Billion CFUs to make their product seem stronger, studies show that many strains are effective at 1 Billion to 10 Billion CFUs. What matters is the survivability of the strain and whether it matches your symptoms, not just the sheer number of bacteria.
            </p>
          </article>

          {/* FAQ Schema Accordion */}
          <div className="border border-rule bg-paper p-8 rounded-3xl space-y-6">
            <h3 className="editorial-head text-2xl text-ink">
              Frequently Asked Questions (FAQ)
            </h3>
            <div className="divide-y divide-rule-soft">
              <div className="py-4 space-y-2">
                <h4 className="text-base font-bold text-ink">
                  How does a probiotic recommendation quiz work?
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  A clinical probiotic selector maps your daily bowel habits, symptoms (like gas, bloating, or loose stools), medication history (such as antibiotics or PPIs), and dietary sensitivities to specific bacterial strains that have proven efficacy in peer-reviewed clinical literature.
                </p>
              </div>
              <div className="py-4 space-y-2">
                <h4 className="text-base font-bold text-ink">
                  Are spore-based probiotics safer for SIBO?
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Yes, spore-forming soil organisms (like <em>Bacillus coagulans</em> and <em>Bacillus subtilis</em>) remain in a dormant state until they reach the large intestine. Because they do not colonize the small intestine, they are generally considered SIBO-safe and highly resilient to stomach acid.
                </p>
              </div>
              <div className="py-4 space-y-2">
                <h4 className="text-base font-bold text-ink">
                  Can I take a probiotic daily?
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  For most people, taking a daily probiotic is safe and helpful for maintaining gut barrier integrity. However, it is best to take strains that target your specific needs rather than a high-dose multi-strain supplement that may create imbalances.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

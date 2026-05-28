"use client";

import { useState } from "react";
import Link from "next/link";

interface Symptoms {
  bloating: boolean;
  gas: boolean;
  constipation: boolean;
  diarrhea: boolean;
  antibiotics: boolean;
  travel: boolean;
  athletic: boolean;
}

export default function ProbioticQuiz() {
  const [step, setStep] = useState<number>(0);
  
  // Quiz State
  const [symptoms, setSymptoms] = useState<Symptoms>({
    bloating: false,
    gas: false,
    constipation: false,
    diarrhea: false,
    antibiotics: false,
    travel: false,
    athletic: false,
  });

  const [dietDiversity, setDietDiversity] = useState<number>(12); // default estimated count of plants/week

  // Strain recommendations mapping
  const strainDatabase = {
    lgg: {
      name: "Lactobacillus rhamnosus GG (LGG)",
      reason: "Excellent for rebuilding the gut barrier, reducing acute diarrhea, and recovery after antibiotic courses.",
      clinicalProof: "Highly studied strain with 200+ human clinical trials.",
    },
    b35624: {
      name: "Bifidobacterium longum 35624",
      reason: "The gold-standard strain for bloating, abdominal pain, and managing visceral hypersensitivity associated with IBS.",
      clinicalProof: "Proven in double-blind, placebo-controlled clinical trials.",
    },
    boulardii: {
      name: "Saccharomyces boulardii",
      reason: "A transient beneficial yeast. Highly effective at preventing traveler's diarrhea and immune support during broad-spectrum antibiotic therapy.",
      clinicalProof: "Acid-resistant yeast that naturally survives stomach transit.",
    },
    coagulans: {
      name: "Bacillus coagulans MTCC 5856",
      reason: "Spore-forming probiotic that enhances amino acid/protein absorption and speeds up post-exercise muscle recovery.",
      clinicalProof: "Excellent survivability, ideal for athletic and active individuals.",
    },
  };

  const handleSymptomToggle = (key: keyof Symptoms) => {
    setSymptoms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const restartQuiz = () => {
    setSymptoms({
      bloating: false,
      gas: false,
      constipation: false,
      diarrhea: false,
      antibiotics: false,
      travel: false,
      athletic: false,
    });
    setDietDiversity(12);
    setStep(0);
  };

  // Generate Recommendations based on selections
  const getRecommendations = () => {
    const recs = [];
    let cfu = "10 - 20 Billion CFUs";
    
    if (symptoms.bloating || symptoms.gas) {
      recs.push(strainDatabase.b35624);
    }
    if (symptoms.antibiotics) {
      recs.push(strainDatabase.lgg);
      cfu = "50 Billion CFUs (Therapeutic Level)";
    }
    if (symptoms.travel || symptoms.diarrhea) {
      recs.push(strainDatabase.boulardii);
    }
    if (symptoms.athletic) {
      recs.push(strainDatabase.coagulans);
    }

    // Default general recommendation if no symptoms selected
    if (recs.length === 0) {
      recs.push(strainDatabase.lgg);
      recs.push(strainDatabase.coagulans);
    }

    return { recs, cfu };
  };

  const { recs, cfu } = getRecommendations();

  // Get Diet Diversity Rating
  const getDietRating = () => {
    if (dietDiversity >= 30) return { rating: "Optimal Diversity", color: "text-emerald-600 border-emerald-500/20 bg-emerald-50" };
    if (dietDiversity >= 20) return { rating: "Good Diversity", color: "text-green-600 border-green-500/20 bg-green-50" };
    if (dietDiversity >= 10) return { rating: "Sub-Optimal Diversity", color: "text-amber-600 border-amber-500/20 bg-amber-50" };
    return { rating: "Low Diversity", color: "text-red-600 border-red-500/20 bg-red-50" };
  };

  const dietRating = getDietRating();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      {/* Back Button */}
      <Link href="/tools" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-accent mb-8 transition-colors">
        ← Back to Tools
      </Link>

      <div className="bg-background border border-border-muted p-8 md:p-12 rounded-2xl shadow-sm min-h-[450px] flex flex-col justify-between">
        
        {/* STEP 0: INTRODUCTION */}
        {step === 0 && (
          <div className="space-y-8 max-w-2xl mx-auto text-center py-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">
                Niche Quiz
              </span>
              <h1 className="editorial-head text-3xl md:text-4xl text-ink mb-4">
                Clinical Probiotic Strain Finder Quiz
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                Most probiotics fail because they are packed with generic strains that lack human trials. This 3-step quiz maps your digestive profile and goals to clinically studied bacterial strains.
              </p>
            </div>
            
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-4 bg-accent text-white font-bold rounded-xl text-sm shadow-[0_6px_20px_-4px_rgba(255,100,66,0.4)] hover:bg-accent-deep hover:-translate-y-0.5 transition-all"
            >
              Start Gut Assessment
            </button>
          </div>
        )}

        {/* STEP 1: DIGESTIVE SYMPTOMS */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                Step 1 of 3
              </span>
              <h2 className="text-2xl font-bold text-ink mb-2">
                What are your primary digestive symptoms?
              </h2>
              <p className="text-xs text-ink-muted">
                Select all that apply to match specific symptoms to researched bacterial strains.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "bloating", label: "Visceral Bloating & Distension" },
                { key: "gas", label: "Excess Gas or Indigestion" },
                { key: "constipation", label: "Sluggish motility / Constipation" },
                { key: "diarrhea", label: "Loose stools / Frequent distress" },
                { key: "athletic", label: "Athletic recovery / Muscle soreness" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSymptomToggle(item.key as keyof Symptoms)}
                  className={`p-4 border rounded-xl text-left text-sm font-semibold transition-all ${
                    symptoms[item.key as keyof Symptoms]
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-background border-border-muted hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                      symptoms[item.key as keyof Symptoms] ? "border-accent bg-accent text-white" : "border-border-muted bg-neutral-50"
                    }`}>
                      {symptoms[item.key as keyof Symptoms] && "✓"}
                    </span>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-border-muted pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-border-muted rounded-xl text-xs font-bold text-ink-muted hover:text-ink transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow transition-all"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: HISTORICAL FACTORS */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                Step 2 of 3
              </span>
              <h2 className="text-2xl font-bold text-ink mb-2">
                Have any of these factors impacted your gut recently?
              </h2>
              <p className="text-xs text-ink-muted">
                These factors heavily disrupt gut lining integrity and call for protective probiotic dosing.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { key: "antibiotics", label: "I have taken antibiotics in the last 6 months", desc: "Antibiotics wipe out beneficial flora, mandating targeted strain replenishment." },
                { key: "travel", label: "I travel internationally or frequently change environments", desc: "Shifting water and food profiles increases exposure to foreign gut pathogens." },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSymptomToggle(item.key as keyof Symptoms)}
                  className={`w-full p-5 border rounded-xl text-left transition-all ${
                    symptoms[item.key as keyof Symptoms]
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-background border-border-muted hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center text-xs mt-0.5 shrink-0 ${
                      symptoms[item.key as keyof Symptoms] ? "border-accent bg-accent text-white" : "border-border-muted bg-neutral-50"
                    }`}>
                      {symptoms[item.key as keyof Symptoms] && "✓"}
                    </span>
                    <div>
                      <span className="text-sm font-bold block mb-1 text-ink">{item.label}</span>
                      <span className={`text-xs ${symptoms[item.key as keyof Symptoms] ? "text-accent/80" : "text-ink-muted"}`}>
                        {item.desc}
                      </span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-border-muted pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-border-muted rounded-xl text-xs font-bold text-ink-muted hover:text-ink transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow transition-all"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DIET DIVERSITY */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                Step 3 of 3
              </span>
              <h2 className="text-2xl font-bold text-ink mb-2">
                How many different plant foods do you eat weekly?
              </h2>
              <p className="text-xs text-ink-muted">
                Dietary diversity feeds different bacterial families. Aim for the research-backed target of 30+ plants/week.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 dark:bg-neutral-900 border border-border-muted rounded-2xl text-center space-y-6">
              <div className="text-5xl font-extrabold text-ink">
                {dietDiversity} <span className="text-sm text-ink-muted font-normal">varieties/week</span>
              </div>

              {/* Slider */}
              <div className="max-w-md mx-auto">
                <label htmlFor="diet-range" className="sr-only">Weekly Plant Varieties</label>
                <input
                  id="diet-range"
                  type="range"
                  min="2"
                  max="45"
                  value={dietDiversity}
                  onChange={(e) => setDietDiversity(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] font-bold text-ink-muted mt-2">
                  <span>Very Low (under 5)</span>
                  <span>Goal: 30+ Varieties</span>
                  <span>Exceptional (40+)</span>
                </div>
              </div>

              {/* Rating Chip */}
              <div className="inline-block">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${dietRating.color}`}>
                  {dietRating.rating}
                </span>
              </div>
            </div>

            <div className="flex justify-between border-t border-border-muted pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-border-muted rounded-xl text-xs font-bold text-ink-muted hover:text-ink transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent text-white font-bold rounded-xl text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.4)] hover:bg-accent-deep transition-all animate-pulse"
              >
                View Recommendations
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RESULTS */}
        {step === 4 && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Result */}
            <div className="border-b border-border-muted pb-6 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
                Gut Profile Results
              </span>
              <h2 className="editorial-head text-2xl sm:text-3xl text-ink">
                Your Custom Strain Blueprint
              </h2>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-border-muted p-5 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Daily Target Dosage (CFU)
                </span>
                <span className="text-xl font-bold text-ink">{cfu}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink mb-4 border-b border-border-muted pb-1">
                  Recommended Clinically-Studied Strains
                </h3>
                <div className="space-y-4">
                  {recs.map((rec) => (
                    <div key={rec.name} className="border border-border-muted p-5 rounded-xl bg-background">
                      <h4 className="text-sm font-bold text-accent mb-1.5">{rec.name}</h4>
                      <p className="text-xs text-ink-muted leading-relaxed mb-3">{rec.reason}</p>
                      <span className="text-[10px] font-semibold text-ink bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        Clinical Evidence: {rec.clinicalProof}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diet diversity tips */}
              <div className="border border-border-muted p-5 rounded-xl">
                <h4 className="text-xs font-bold text-ink mb-1.5">Weekly Plant Diversity: {dietDiversity} Varieties</h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {dietDiversity >= 30
                    ? "Fantastic! You are hitting the threshold shown in clinical research to maximize microbiome diversity and optimize short-chain fatty acid production. Keep it up."
                    : "To build a robust gut lining, aim to feed your microbiome more diverse fibers. Try checking off new varieties of seeds, nuts, whole grains, and leafy greens. Aim for 30+ varieties weekly."}
                </p>
              </div>
            </div>

            <div className="flex gap-4 border-t border-border-muted pt-6">
              <button
                type="button"
                onClick={restartQuiz}
                className="flex-1 py-4 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow transition-all text-center"
              >
                Restart Quiz
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Showcase Section */}
      {step === 4 && (
        <div className="mt-16 border-t border-border-muted pt-16 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="editorial-head text-2xl text-ink mb-2">
              Recommended Daily Probiotic
            </h2>
            <p className="text-xs text-ink-muted">
              Rather than buying multiple single-strain bottles, I recommend a clinically validated multi-strain formulation.
            </p>
          </div>

          <div className="bg-background border border-border-muted p-8 rounded-2xl relative shadow-sm text-center">
            <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              RMT Top Pick
            </span>
            <h3 className="text-xl font-bold text-ink mb-4 mt-2">Seed DS-01 Daily Synbiotic</h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              Features 24 clinically studied probiotic strains (including target strains for bloating, gut-barrier integrity, and dermatological health). Formulated with a nested capsule design to guarantee survivability past stomach acid.
            </p>
            <a
              href="https://seed.com"
              target="_blank"
              rel="nofollow noopener"
              className="inline-block px-8 py-3.5 bg-accent hover:bg-accent-deep text-white font-bold rounded-xl text-xs shadow-md hover:-translate-y-0.5 transition-all"
            >
              Shop Seed Synbiotic
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

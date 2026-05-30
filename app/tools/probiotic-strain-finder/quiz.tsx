"use client";

import { useState } from "react";
import Link from "next/link";

interface UpperGISymptoms {
  acidReflux: boolean;
  nauseaIndigestion: boolean;
  bloatingPostMeal: boolean;
}

interface LowerGISymptoms {
  trappedGas: boolean;
  cramping: boolean;
  flatulence: boolean;
}

interface MedicationHistory {
  antibiotics: boolean;
  nsaids: boolean;
  ppis: boolean;
}

interface LifestyleFactors {
  highStress: boolean;
  sleepDeprived: boolean;
  frequentTravel: boolean;
}

interface DietarySensitivities {
  dairy: boolean;
  gluten: boolean;
  histamine: boolean;
}

interface CommercialProduct {
  name: string;
  brand: string;
  url: string;
}

interface Strain {
  id: string;
  name: string;
  scientificName: string;
  friendlyRole: string;
  reason: string;
  mechanism: string;
  prebiotic: string;
  targetFoods: string[];
  clinicalProof: string;
  pubmedId: string;
  pubmedUrl: string;
  topProducts: CommercialProduct[];
  suitability: {
    dairyFree: boolean;
    glutenFree: boolean;
    lowHistamine: boolean;
  };
}

const STRAIN_DATABASE: Record<string, Strain> = {
  lgg: {
    id: "lgg",
    name: "Lactobacillus rhamnosus GG (LGG)",
    scientificName: "Lactobacillus rhamnosus GG",
    friendlyRole: "The Microbiome Rebuilder (Post-Antibiotic & Flora Recovery)",
    reason: "The world's most researched probiotic. Clinically proven to adhere to the intestinal lining, strengthen gut-barrier integrity, and rebuild the microbiome after antibiotic disruption.",
    mechanism: "Competitively blocks pathogen adhesion to epithelial cells; secretes biosurfactants and stimulates mucosal IgA antibody production.",
    prebiotic: "Inulin & Acacia fiber",
    targetFoods: ["Chicory root", "Jerusalem artichoke", "Garlic", "Onions", "Leeks", "Asparagus"],
    clinicalProof: "Proven across 200+ human clinical trials for gut flora restoration and immune regulation.",
    pubmedId: "PMID: 16827601",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/16827601/",
    topProducts: [
      { name: "DS-01® Daily Synbiotic", brand: "Seed", url: "https://seedhealthinc.pxf.io/1rNjng" },
      { name: "Digestive Daily", brand: "Culturelle", url: "https://amzn.to/49s5kpv" },
      { name: "Synbiotic+", brand: "Ritual", url: "https://ritual.com" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  b35624: {
    id: "b35624",
    name: "Bifidobacterium longum 35624",
    scientificName: "Bifidobacterium longum 35624",
    friendlyRole: "The IBS & Bloating Specialist",
    reason: "The gold-standard strain for bloating, visceral hypersensitivity, and abdominal pain associated with Irritable Bowel Syndrome (IBS).",
    mechanism: "Modulates localized inflammatory cytokines (reduces IL-8, increases IL-10) and desensitizes visceral sensory nerves to decrease abdominal pressure sensations.",
    prebiotic: "Oat beta-glucan & Psyllium husk",
    targetFoods: ["Oats", "Barley", "Mushrooms", "Psyllium husks"],
    clinicalProof: "Validated in multiple double-blind, placebo-controlled clinical trials for IBS symptom relief.",
    pubmedId: "PMID: 15610214",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/15610214/",
    topProducts: [
      { name: "Align Probiotic", brand: "Align", url: "https://amzn.to/4dEjy9m" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  lp299v: {
    id: "lp299v",
    name: "Lactobacillus plantarum 299v (Lp299v)",
    scientificName: "Lactobacillus plantarum 299v",
    friendlyRole: "The Lower-Gut Gas Reducer",
    reason: "Highly specialized for managing excess gas production, flatulence, and abdominal swelling. It excels at fermenting dietary fibers and calming lower-gut irritation.",
    mechanism: "Accelerates starch fermentation, lowers colonic pH to suppress gas-producing pathogens, and increases butyrate production.",
    prebiotic: "Flaxseed lignans & Resistant starch",
    targetFoods: ["Flaxseeds", "Green (unripe) bananas", "Raw potato starch"],
    clinicalProof: "Human clinical trials show over 90% of IBS patients reported a significant reduction in flatulence and bloating.",
    pubmedId: "PMID: 12184915",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/12184915/",
    topProducts: [
      { name: "Ideal Bowel Support", brand: "Jarrow Formulas", url: "https://amzn.to/43yuMpU" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  hn019: {
    id: "hn019",
    name: "Bifidobacterium lactis HN019",
    scientificName: "Bifidobacterium lactis HN019",
    friendlyRole: "The Motility Speed-Up (Constipation Relief)",
    reason: "Clinically shown to accelerate sluggish gut transit time, relieve constipation, and support healthy bowel motility.",
    mechanism: "Stimulates peristaltic muscle contractions in the colon walls, significantly speeding up transit time.",
    prebiotic: "GOS & Apple pectin",
    targetFoods: ["Lentils", "Chickpeas", "Apples", "Pears", "Plums", "Green peas"],
    clinicalProof: "Randomized controlled trials confirm a significant reduction in whole-gut transit time and associated functional GI symptoms.",
    pubmedId: "PMID: 21663486",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/21663486/",
    topProducts: [
      { name: "FloraMend Prime Probiotic", brand: "Thorne", url: "https://amzn.to/4ecm3zL" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  boulardii: {
    id: "boulardii",
    name: "Saccharomyces boulardii",
    scientificName: "Saccharomyces boulardii",
    friendlyRole: "The Antibiotic Shield (Traveler's Diarrhea Guard)",
    reason: "A transient, acid-resistant beneficial yeast. Highly resilient to stomach transit and broad-spectrum antibiotics, making it the premier choice to combat traveler's diarrhea and opportunistic pathogens.",
    mechanism: "Secretes a 54-kDa protease that neutralizes Clostridioides difficile toxins A and B; directly outcompetes foreign pathogens in the digestive tract.",
    prebiotic: "MOS (Mannan-oligosaccharides)",
    targetFoods: ["Nutritional yeast", "Garlic", "Leeks"],
    clinicalProof: "Meta-analyses of clinical trials show S. boulardii reduces traveler's diarrhea risk by over 50%.",
    pubmedId: "PMID: 20458757",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/20458757/",
    topProducts: [
      { name: "Saccharomyces Boulardii (Dairy-Free)", brand: "Pure Therapro Rx", url: "https://amzn.to/4afBkxi" },
      { name: "Florastor", brand: "Florastor", url: "https://amzn.to/4uakHdH" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  coagulans: {
    id: "coagulans",
    name: "Spore-Forming Bacillus Strains",
    scientificName: "B. coagulans SC-208, B. subtilis HU58, B. indicus HU36 & B. clausii SC-109",
    friendlyRole: "The SIBO-Safe Nutrient Absorber",
    reason: "A blend of highly resilient, spore-forming soil organisms. They form a natural endospore protective shield to survive stomach acid and reach the large intestine intact, making them ideal for SIBO recovery and general flora modulation.",
    mechanism: "Forms a protective endospore shield to survive stomach acid; manufactures digestive enzymes (amylase, protease) and carotenoid antioxidants to support metabolic recovery.",
    prebiotic: "Larch arabinogalactan & XOS",
    targetFoods: ["Asparagus", "Carrots", "Radishes", "Coconut meat", "Chicory root"],
    clinicalProof: "Clinical studies demonstrate that daily intake significantly improves protein absorption, reduces post-workout muscle soreness, and supports gut-barrier integrity.",
    pubmedId: "PMID: 32014167",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/32014167/",
    topProducts: [
      { name: "Spore Probiotic", brand: "Just Thrive", url: "http://justthrivehealth.com/synctherapy" },
      { name: "Digestive Advantage", brand: "Schiff", url: "https://amzn.to/3PLEX7o" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  psychobiotic: {
    id: "psychobiotic",
    name: "L. helveticus R0052 & B. longum R0175",
    scientificName: "Lactobacillus helveticus R0052 & Bifidobacterium longum R0175",
    friendlyRole: "The Gut-Brain Calmer (Stress & Butterfly Reliever)",
    reason: "A clinically studied psychobiotic blend targeting the gut-brain axis. It modulates cortisol levels and mitigates stress-induced gastrointestinal symptoms (nausea, cramping, and butterflies).",
    mechanism: "Down-regulates hypothalamic-pituitary-adrenal (HPA) axis activity, lowering systemic cortisol levels and calming stress-induced gut wall spasms.",
    prebiotic: "Pine bark & Cocoa polyphenols",
    targetFoods: ["Dark chocolate", "Green tea", "Blueberries", "Blackberries"],
    clinicalProof: "Human clinical trials show a 49% reduction in stress-induced abdominal pain and significant improvements in anxiety scores.",
    pubmedId: "PMID: 20974015",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/20974015/",
    topProducts: [
      { name: "Mood Probiotic", brand: "InnovixLabs", url: "https://amzn.to/3PLF2bc" }
    ],
    suitability: { dairyFree: false, glutenFree: true, lowHistamine: true }
  },
  ncfm: {
    id: "ncfm",
    name: "Lactobacillus acidophilus NCFM",
    scientificName: "Lactobacillus acidophilus NCFM",
    friendlyRole: "The Cramp & Pain Quietener",
    reason: "Extensively researched strain for relieving general abdominal pain, cramping, bloating, and gas discomfort.",
    mechanism: "Upregulates expression of cannabinoid (CB2) and mu-opioid receptors in the gut wall, mimicking pain-relief pathways.",
    prebiotic: "Polydextrose & Lactitol",
    targetFoods: ["Legumes", "Lima beans", "Kidney beans", "Tempeh"],
    clinicalProof: "Proven in clinical trials to reduce abdominal discomfort scores by over 30% in IBS sufferers.",
    pubmedId: "PMID: 17298284",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/17298284/",
    topProducts: [
      { name: "DS-01® Daily Synbiotic", brand: "Seed", url: "https://seedhealthinc.pxf.io/1rNjng" },
      { name: "UltraFlora Spectrum", brand: "Metagenics", url: "https://amzn.to/49vZTpA" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  dsm17938: {
    id: "dsm17938",
    name: "Lactobacillus reuteri DSM 17938",
    scientificName: "Lactobacillus reuteri DSM 17938 (Protectis)",
    friendlyRole: "The Chronic Motility Optimizer",
    reason: "A core strain for resolving stubborn chronic constipation, improving bowel motility, and soothing colic symptoms.",
    mechanism: "Produces reuterin to inhibit pathogen growth and directly decreases calcium-dependent potassium currents in enteric nerves to normalize gut spasms.",
    prebiotic: "GOS & FOS",
    targetFoods: ["Jerusalem artichokes", "Garlic", "Onions", "Red kidney beans"],
    clinicalProof: "Clinical studies show a significant increase in bowel frequency and stool consistency in constipated patients.",
    pubmedId: "PMID: 25164805",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/25164805/",
    topProducts: [
      { name: "Protectis", brand: "BioGaia", url: "https://amzn.to/4fbfSNq" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  akkermansia: {
    id: "akkermansia",
    name: "Akkermansia muciniphila",
    scientificName: "Akkermansia muciniphila",
    friendlyRole: "The Mucus Lining Repairer",
    reason: "The supreme mucin-building strain that repairs a thin or leaking gut mucous lining and improves metabolic function.",
    mechanism: "Feeds on the outer mucin layer, which paradoxically stimulates Goblet cells to produce a thicker, stronger gut barrier lining.",
    prebiotic: "Ellagitannins & Pomegranate polyphenols",
    targetFoods: ["Pomegranates", "Cranberries", "Red grapes", "Walnuts", "Green tea"],
    clinicalProof: "Validated in clinical trials for restoring gut barrier integrity, reducing LPS leakage, and improving metabolic biomarkers.",
    pubmedId: "PMID: 32360810",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/32360810/",
    topProducts: [
      { name: "Akkermansia", brand: "Pendulum", url: "https://pendulumtherapeutics.sjv.io/QY4OEA" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  bb12: {
    id: "bb12",
    name: "Bifidobacterium animalis subsp. lactis BB-12",
    scientificName: "Bifidobacterium animalis subsp. lactis BB-12",
    friendlyRole: "The Flora Shield & Daily Regularity Supporter",
    reason: "One of the most documented Bifidobacteria strains, supporting general immune function and accelerating colonic transit.",
    mechanism: "Strengthens epithelial cell tight junctions, stimulates secretory IgA, and produces high amounts of acetate to support colonic peristalsis.",
    prebiotic: "FOS (Fructooligosaccharides)",
    targetFoods: ["Bananas", "Onions", "Garlic", "Asparagus", "Wheat bran"],
    clinicalProof: "Backed by over 300 clinical trials proving immune defense against winter respiratory infections and stool consistency regulation.",
    pubmedId: "PMID: 24268677",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24268677/",
    topProducts: [
      { name: "Synbiotic+", brand: "Ritual", url: "https://ritual.com" },
      { name: "Advanced Multi-Billion Dophilus", brand: "Solgar", url: "https://www.solgar.com" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  urogenital: {
    id: "urogenital",
    name: "Lactobacillus reuteri RC-14 & L. rhamnosus GR-1",
    scientificName: "Lactobacillus reuteri RC-14 & Lactobacillus rhamnosus GR-1",
    friendlyRole: "The Urogenital Barrier Protector",
    reason: "The gold-standard strains for urogenital microbiome health, preventing vaginal dysbiosis, yeast infections, and UTIs.",
    mechanism: "Ascends from the rectum to colonize the vagina, producing biosurfactants and lactic acid to suppress Candida and bacterial vaginosis pathogens.",
    prebiotic: "Inulin & Lactulose",
    targetFoods: ["Wheat bran", "Garlic", "Chicory root", "Prebiotic-enriched yogurt"],
    clinicalProof: "Double-blind human trials show an 80%+ cure or restoration rate when combined with standard vaginal therapy.",
    pubmedId: "PMID: 11116086",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/11116086/",
    topProducts: [
      { name: "Jarro-Dophilus Vaginal", brand: "Jarrow Formulas", url: "https://www.jarrow.com" }
    ],
    suitability: { dairyFree: true, glutenFree: true, lowHistamine: true }
  },
  desimone: {
    id: "desimone",
    name: "Streptococcus thermophilus DSM 24731 / De Simone Formulation",
    scientificName: "Streptococcus thermophilus DSM 24731 (De Simone Formulation)",
    friendlyRole: "The Inflammatory Biological Shield",
    reason: "A high-dose, multi-strain medical probiotic designed for severe inflammatory bowel issues (Ulcerative Colitis, Pouchitis, severe IBS).",
    mechanism: "Delivers an ultra-high concentration of active strains to create a dense biological shield, reducing mucosal inflammation and stabilizing epithelial barriers.",
    prebiotic: "Resistant starch & FOS",
    targetFoods: ["Raw oats", "Cooked-and-cooled potatoes", "Legumes"],
    clinicalProof: "Clinically proven to induce and maintain remission in patients with mild-to-moderate active ulcerative colitis.",
    pubmedId: "PMID: 20224489",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/20224489/",
    topProducts: [
      { name: "Visbiome", brand: "Visbiome", url: "https://vsl3.pxf.io/rEa65d" }
    ],
    suitability: { dairyFree: false, glutenFree: true, lowHistamine: true }
  },
  shirota: {
    id: "shirota",
    name: "Lactobacillus casei Shirota",
    scientificName: "Lactobacillus casei Shirota",
    friendlyRole: "The Transit Accelerator",
    reason: "Extensively researched strain for intestinal motility, transit regulation, and general immune response.",
    mechanism: "Survives stomach acid to lower colonic pH, promoting peristalsis and boosting Natural Killer (NK) immune cell activity.",
    prebiotic: "Galactinol & GOS",
    targetFoods: ["Fermented dairy", "Chicory root", "Garlic", "Lentils"],
    clinicalProof: "Numerous studies show relief from chronic constipation and lower rates of upper respiratory infections.",
    pubmedId: "PMID: 15153245",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/15153245/",
    topProducts: [
      { name: "Yakult", brand: "Yakult", url: "https://www.yakultusa.com" }
    ],
    suitability: { dairyFree: false, glutenFree: true, lowHistamine: false }
  }
};

export function ProbioticQuiz() {
  const [step, setStep] = useState<number>(0);
  const [expandedStrain, setExpandedStrain] = useState<string | null>(null);

  // Lead magnet email states
  const [email, setEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setEmailSending(true);
    setEmailError(null);

    try {
      const { strains: resultsStrains, cfu: resultsCfu } = getResults();
      const resultsArchetype = getGutArchetype();
      const resultsTimeline = getTimelineEvents().map((ev) => ({
        time: ev.time,
        instructions: ev.instructions,
        strains: ev.strains.map((s) => s.name),
      }));

      const res = await fetch("/api/send-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          archetype: resultsArchetype,
          cfu: resultsCfu,
          strains: resultsStrains.map((s) => ({
            name: s.name,
            scientificName: s.scientificName,
            friendlyRole: s.friendlyRole,
            reason: s.reason,
            mechanism: s.mechanism,
            prebiotic: s.prebiotic,
            targetFoods: s.targetFoods,
            topProducts: s.topProducts,
            whyRecommended: getWhyRecommended(s.id),
          })),
          timeline: resultsTimeline,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to dispatch email");
      }

      setEmailSubmitted(true);
    } catch (err: any) {
      console.error("Email send error:", err);
      setEmailError(err?.message || "There was an issue sending your blueprint. Please double-check your email and try again.");
    } finally {
      setEmailSending(false);
    }
  };

  // State mapping for 8 Questions
  const [primaryGoal, setPrimaryGoal] = useState<string>("maintenance");
  const [motility, setMotility] = useState<string>("regular");
  const [upperGI, setUpperGI] = useState<UpperGISymptoms>({
    acidReflux: false,
    nauseaIndigestion: false,
    bloatingPostMeal: false,
  });
  const [lowerGI, setLowerGI] = useState<LowerGISymptoms>({
    trappedGas: false,
    cramping: false,
    flatulence: false,
  });
  const [medications, setMedications] = useState<MedicationHistory>({
    antibiotics: false,
    nsaids: false,
    ppis: false,
  });
  const [lifestyle, setLifestyle] = useState<LifestyleFactors>({
    highStress: false,
    sleepDeprived: false,
    frequentTravel: false,
  });
  const [dietDiversity, setDietDiversity] = useState<number>(15);
  const [sensitivities, setSensitivities] = useState<DietarySensitivities>({
    dairy: false,
    gluten: false,
    histamine: false,
  });

  const handleUpperGIToggle = (key: keyof UpperGISymptoms) => {
    setUpperGI((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLowerGIToggle = (key: keyof LowerGISymptoms) => {
    setLowerGI((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMedicationToggle = (key: keyof MedicationHistory) => {
    setMedications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLifestyleToggle = (key: keyof LifestyleFactors) => {
    setLifestyle((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSensitivityToggle = (key: keyof DietarySensitivities) => {
    setSensitivities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleStrainExpand = (id: string) => {
    setExpandedStrain((prev) => (prev === id ? null : id));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  
  const restartQuiz = () => {
    setPrimaryGoal("maintenance");
    setMotility("regular");
    setUpperGI({
      acidReflux: false,
      nauseaIndigestion: false,
      bloatingPostMeal: false,
    });
    setLowerGI({
      trappedGas: false,
      cramping: false,
      flatulence: false,
    });
    setMedications({
      antibiotics: false,
      nsaids: false,
      ppis: false,
    });
    setLifestyle({
      highStress: false,
      sleepDeprived: false,
      frequentTravel: false,
    });
    setDietDiversity(15);
    setSensitivities({
      dairy: false,
      gluten: false,
      histamine: false,
    });
    setEmail("");
    setEmailSubmitted(false);
    setEmailSending(false);
    setEmailError(null);
    setExpandedStrain(null);
    setStep(0);
  };

  // Logic calculation for Strains Recommendation
  const getResults = () => {
    const recommendedStrains: Strain[] = [];
    let recommendedCFU = "10 - 20 Billion CFUs";

    // 1. CFU dosage adjustment
    if (medications.antibiotics || medications.ppis || motility === "loose" || motility === "sluggish") {
      recommendedCFU = "50 Billion CFUs (Therapeutic Level)";
    }

    // 2. Goal-based mapping
    if (primaryGoal === "bloating") {
      recommendedStrains.push(STRAIN_DATABASE.b35624);
      recommendedStrains.push(STRAIN_DATABASE.ncfm);
    } else if (primaryGoal === "flora") {
      recommendedStrains.push(STRAIN_DATABASE.lgg);
      recommendedStrains.push(STRAIN_DATABASE.bb12);
    } else if (primaryGoal === "stress") {
      recommendedStrains.push(STRAIN_DATABASE.psychobiotic);
    } else if (primaryGoal === "athletic") {
      recommendedStrains.push(STRAIN_DATABASE.coagulans);
    } else if (primaryGoal === "vaginal") {
      recommendedStrains.push(STRAIN_DATABASE.urogenital);
    } else if (primaryGoal === "metabolic") {
      recommendedStrains.push(STRAIN_DATABASE.akkermansia);
    }

    // 3. Bowel motility mapping
    if (motility === "sluggish") {
      recommendedStrains.push(STRAIN_DATABASE.hn019);
      if (!recommendedStrains.includes(STRAIN_DATABASE.dsm17938)) {
        recommendedStrains.push(STRAIN_DATABASE.dsm17938);
      }
    } else if (motility === "loose") {
      recommendedStrains.push(STRAIN_DATABASE.boulardii);
      if (!recommendedStrains.includes(STRAIN_DATABASE.shirota)) {
        recommendedStrains.push(STRAIN_DATABASE.shirota);
      }
    } else if (motility === "alternating") {
      recommendedStrains.push(STRAIN_DATABASE.b35624);
      recommendedStrains.push(STRAIN_DATABASE.lp299v);
    }

    // 4. Upper GI comfort mapping
    if (upperGI.acidReflux || upperGI.nauseaIndigestion) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.dsm17938)) {
        recommendedStrains.push(STRAIN_DATABASE.dsm17938);
      }
    }
    if (upperGI.bloatingPostMeal) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.coagulans)) {
        recommendedStrains.push(STRAIN_DATABASE.coagulans);
      }
    }

    // 5. Lower GI comfort mapping
    if (lowerGI.trappedGas || lowerGI.flatulence) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.lp299v)) {
        recommendedStrains.push(STRAIN_DATABASE.lp299v);
      }
    }
    if (lowerGI.cramping) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.b35624)) {
        recommendedStrains.push(STRAIN_DATABASE.b35624);
      }
      if (!recommendedStrains.includes(STRAIN_DATABASE.ncfm)) {
        recommendedStrains.push(STRAIN_DATABASE.ncfm);
      }
    }

    // 6. Medication mapping
    if (medications.antibiotics) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.lgg)) {
        recommendedStrains.push(STRAIN_DATABASE.lgg);
      }
      if (!recommendedStrains.includes(STRAIN_DATABASE.boulardii)) {
        recommendedStrains.push(STRAIN_DATABASE.boulardii);
      }
    }
    if (medications.nsaids) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.akkermansia)) {
        recommendedStrains.push(STRAIN_DATABASE.akkermansia);
      }
    }
    if (medications.ppis) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.lgg)) {
        recommendedStrains.push(STRAIN_DATABASE.lgg);
      }
    }

    // 7. Lifestyle mapping
    if (lifestyle.highStress) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.psychobiotic)) {
        recommendedStrains.push(STRAIN_DATABASE.psychobiotic);
      }
    }
    if (lifestyle.frequentTravel) {
      if (!recommendedStrains.includes(STRAIN_DATABASE.boulardii)) {
        recommendedStrains.push(STRAIN_DATABASE.boulardii);
      }
    }

    // Fallback defaults
    if (recommendedStrains.length === 0) {
      recommendedStrains.push(STRAIN_DATABASE.lgg);
      recommendedStrains.push(STRAIN_DATABASE.b35624);
    }

    // Slice to maximum 3 most relevant strains to prevent consumer fatigue
    const uniqueStrains = Array.from(new Set(recommendedStrains)).slice(0, 3);

    return { strains: uniqueStrains, cfu: recommendedCFU };
  };

  const { strains, cfu } = getResults();

  const getWhyRecommended = (strainId: string): string[] => {
    const reasons: string[] = [];
    if (strainId === "lgg") {
      if (primaryGoal === "flora") reasons.push("You selected 'Restore Microbiome Diversity' as your primary goal.");
      if (medications.antibiotics) reasons.push("You indicated recent antibiotic use (rebuilds gut wall flora).");
      if (medications.ppis) reasons.push("You indicated acid-blocker (PPI) use (rebuilds depleted upper gut flora).");
      if (reasons.length === 0) reasons.push("Recommended as a foundational gut-barrier rebuilder.");
    }
    if (strainId === "b35624") {
      if (primaryGoal === "bloating") reasons.push("You selected 'IBS & Bloating Relief' as your primary goal.");
      if (motility === "alternating") reasons.push("You indicated alternating bowel motility.");
      if (lowerGI.cramping) reasons.push("You indicated lower gut cramping and abdominal pressure.");
      if (reasons.length === 0) reasons.push("Recommended for soothing hyper-sensitive gut lining nerves.");
    }
    if (strainId === "lp299v") {
      if (motility === "alternating") reasons.push("You indicated alternating bowel motility.");
      if (lowerGI.trappedGas || lowerGI.flatulence) reasons.push("You indicated trapped gas or chronic flatulence.");
      if (reasons.length === 0) reasons.push("Recommended for preventing hydrogen and methane gas production.");
    }
    if (strainId === "hn019") {
      if (motility === "sluggish") reasons.push("You indicated sluggish bowel motility or constipation.");
      if (reasons.length === 0) reasons.push("Recommended for speeding up whole-gut waste transit time.");
    }
    if (strainId === "boulardii") {
      if (motility === "loose") reasons.push("You indicated loose bowel motility.");
      if (medications.antibiotics) reasons.push("You indicated recent antibiotic use (prevents opportunistic pathogen overgrowth).");
      if (lifestyle.frequentTravel) reasons.push("You indicated frequent travel (protects against traveler's diarrhea).");
      if (reasons.length === 0) reasons.push("Recommended as an antibiotic-resistant pathogen shield.");
    }
    if (strainId === "coagulans") {
      if (primaryGoal === "athletic") reasons.push("You selected 'Nutrient Uptake & Recovery' as your primary goal.");
      if (upperGI.bloatingPostMeal) reasons.push("You indicated upper GI bloating directly after meals.");
      if (reasons.length === 0) reasons.push("Recommended for spore-based survivability and protein digestion.");
    }
    if (strainId === "psychobiotic") {
      if (primaryGoal === "stress") reasons.push("You selected 'Brain-Gut Axis & Stress' as your primary goal.");
      if (lifestyle.highStress) reasons.push("You indicated high daily stress or sleep tension.");
      if (reasons.length === 0) reasons.push("Recommended for regulating cortisol along the gut-brain axis.");
    }
    if (strainId === "ncfm") {
      if (primaryGoal === "bloating") reasons.push("You selected 'IBS & Bloating Relief' as your primary goal.");
      if (lowerGI.cramping) reasons.push("You indicated gut cramping or lower abdomen discomfort.");
      if (reasons.length === 0) reasons.push("Recommended for targeting pain-relief pathways in the gut.");
    }
    if (strainId === "dsm17938") {
      if (motility === "sluggish") reasons.push("You indicated sluggish bowel motility or constipation.");
      if (upperGI.acidReflux || upperGI.nauseaIndigestion) reasons.push("You indicated acid reflux, indigestion, or nausea.");
      if (reasons.length === 0) reasons.push("Recommended for chronic motility acceleration and colic calming.");
    }
    if (strainId === "akkermansia") {
      if (primaryGoal === "metabolic") reasons.push("You selected 'Metabolic Support & Barrier Strength' as your primary goal.");
      if (medications.nsaids) reasons.push("You indicated frequent NSAID pain-reliever usage (damages mucus barrier).");
      if (reasons.length === 0) reasons.push("Recommended for stimulating goblet cells to produce a thicker mucosal lining.");
    }
    if (strainId === "bb12") {
      if (primaryGoal === "flora") reasons.push("You selected 'Restore Microbiome Diversity' as your primary goal.");
      if (reasons.length === 0) reasons.push("Recommended for supporting general colonic immune defenses.");
    }
    if (strainId === "desimone") {
      if (primaryGoal === "bloating" && motility === "loose") reasons.push("High-potency clinical formulation for severe gut comfort needs.");
      if (reasons.length === 0) reasons.push("Recommended as an intensive multi-strain biological barrier.");
    }
    if (strainId === "shirota") {
      if (motility === "loose") reasons.push("You indicated loose bowel motility.");
      if (reasons.length === 0) reasons.push("Recommended for lowering colon pH and normalizing transit.");
    }
    if (strainId === "urogenital") {
      if (primaryGoal === "vaginal") reasons.push("You selected 'Urogenital / Vaginal Microbiome' as your primary goal.");
      if (reasons.length === 0) reasons.push("Recommended for maintaining a healthy, acidic vaginal pH.");
    }
    return reasons;
  };

  // Metrics calculators (0 to 100%)
  const floraScore = dietDiversity >= 30 ? 100 : dietDiversity >= 20 ? 75 : dietDiversity >= 10 ? 50 : 25;

  const getBarrierResilience = () => {
    let activeDisruptors = 0;
    if (medications.antibiotics) activeDisruptors++;
    if (medications.nsaids) activeDisruptors++;
    if (medications.ppis) activeDisruptors++;
    if (lifestyle.highStress) activeDisruptors++;
    if (lifestyle.sleepDeprived) activeDisruptors++;
    if (lifestyle.frequentTravel) activeDisruptors++;
    if (dietDiversity < 15) activeDisruptors++;

    if (activeDisruptors === 0) return 95;
    if (activeDisruptors <= 2) return 70;
    if (activeDisruptors <= 4) return 45;
    return 20;
  };

  const getComfortScore = () => {
    let activeSymptoms = 0;
    if (upperGI.acidReflux) activeSymptoms++;
    if (upperGI.nauseaIndigestion) activeSymptoms++;
    if (upperGI.bloatingPostMeal) activeSymptoms++;
    if (lowerGI.trappedGas) activeSymptoms++;
    if (lowerGI.cramping) activeSymptoms++;
    if (lowerGI.flatulence) activeSymptoms++;

    if (activeSymptoms === 0) return 95;
    if (activeSymptoms <= 2) return 70;
    if (activeSymptoms <= 4) return 45;
    return 20;
  };

  const barrierScore = getBarrierResilience();
  const comfortScore = getComfortScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bar: "bg-emerald-500", text: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (score >= 50) return { bar: "bg-amber-500", text: "text-amber-600 bg-amber-50 border-amber-100" };
    return { bar: "bg-red-500", text: "text-red-600 bg-red-50 border-red-100" };
  };

  const getDietRating = () => {
    if (dietDiversity >= 30) return { rating: "Optimal Diversity", color: "text-emerald-700 bg-emerald-500/10 border-emerald-500/20" };
    if (dietDiversity >= 20) return { rating: "Good Diversity", color: "text-green-700 bg-green-500/10 border-green-500/20" };
    if (dietDiversity >= 10) return { rating: "Sub-Optimal", color: "text-amber-700 bg-amber-500/10 border-amber-500/20" };
    return { rating: "Severely Low", color: "text-red-700 bg-red-500/10 border-red-500/20" };
  };

  const dietRating = getDietRating();

  const getGutArchetype = () => {
    if (medications.antibiotics) {
      return {
        name: "The Post-Antibiotic Rebuilder",
        desc: "Your gut barrier has recently been exposed to disruptive antibiotics. Your priority is to recolonize empty mucosal niches and prevent opportunistic bacteria from taking root.",
        tagColor: "bg-indigo-500/5 text-indigo-700 border-indigo-500/10"
      };
    }
    if (motility === "sluggish") {
      return {
        name: "The Slow Mover",
        desc: "Intestinal transit speed is sluggish, which can cause excess gas fermentation in the colon. Focus on dietary kinetics, hydration, and accelerating transit speed.",
        tagColor: "bg-amber-500/5 text-amber-700 border-amber-500/10"
      };
    }
    if (upperGI.bloatingPostMeal || lowerGI.cramping || lowerGI.trappedGas) {
      return {
        name: "The Sensitive Shield",
        desc: "Visceral sensory nerves are highly responsive, and gas fermentation triggers abdominal distension. Focus on desensitizing sensory receptors and calming wall spasms.",
        tagColor: "bg-purple-500/5 text-purple-700 border-purple-500/10"
      };
    }
    return {
      name: "The Resilient Flora Profile",
      desc: "Your gut barrier is strong, plant variety is high, and symptoms are minimal. Focus on maintaining mucosal lining integrity and long-term species diversity.",
      tagColor: "bg-emerald-500/5 text-emerald-700 border-emerald-500/10"
    };
  };

  const archetype = getGutArchetype();

  // Helper to check sensitivity conflicts for recommended strains
  const checkStrainWarning = (strain: Strain) => {
    const alerts: string[] = [];
    if (sensitivities.dairy && !strain.suitability.dairyFree) {
      alerts.push("Dairy Warning: This strain/brand may contain or be fermented on dairy mediums.");
    }
    if (sensitivities.gluten && !strain.suitability.glutenFree) {
      alerts.push("Gluten Warning: Contains trace gluten or wheat fermentation derivatives.");
    }
    if (sensitivities.histamine && !strain.suitability.lowHistamine) {
      alerts.push("Histamine Warning: Some strains of this species can synthesize biogenic amines that irritate histamine intolerance.");
    }
    return alerts;
  };

  // Construct Daily Timeline based on recommended strains
  const getTimelineEvents = () => {
    const events = [];

    // Morning Fasting Strains
    const morningStrains = strains.filter(s => 
      s.id === "boulardii" || s.id === "lgg" || s.id === "psychobiotic" || s.id === "urogenital"
    );
    if (morningStrains.length > 0) {
      events.push({
        time: "Morning (Fasting / 30m before breakfast)",
        strains: morningStrains,
        instructions: "Take with water. These strains survive stomach transit best when gastric acid is at its baseline level.",
        icon: (
          <svg className="w-5 h-5 text-accent-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        )
      });
    }

    // Midday Mealtime Strains
    const middayStrains = strains.filter(s => 
      s.id === "b35624" || s.id === "lp299v" || s.id === "hn019" || s.id === "ncfm" || s.id === "dsm17938" || s.id === "bb12" || s.id === "desimone" || s.id === "akkermansia"
    );
    if (middayStrains.length > 0) {
      events.push({
        time: "Lunchtime (With your first high-fiber meal)",
        strains: middayStrains,
        instructions: "Take alongside food. Prebiotic fibers and fats in your meal help fuel these strains and stimulate transit peristalsis.",
        icon: (
          <svg className="w-5 h-5 text-trust" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      });
    }

    // Evening / Post-Workout Strains
    const eveningStrains = strains.filter(s => s.id === "coagulans" || s.id === "shirota");
    if (eveningStrains.length > 0) {
      events.push({
        time: "Evening / Post-Workout (Nighttime repair)",
        strains: eveningStrains,
        instructions: "Perfect for active days. Spore-based coagulans and motility strains help process evening dietary proteins and mitigate muscle soreness during sleep.",
        icon: (
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )
      });
    }

    return events;
  };

  const timelineEvents = getTimelineEvents();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      {/* Back Button */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-accent-deep mb-8 transition-[color,transform] duration-150 active:scale-[0.98]"
      >
        ← Back to Tools
      </Link>

      <div className="bg-paper border border-rule p-8 md:p-12 rounded-3xl shadow-sm min-h-[520px] flex flex-col justify-between transition-all duration-300">
        
        {/* STEP 0: INTRO */}
        {step === 0 && (
          <div className="space-y-8 max-w-2xl mx-auto text-center py-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rule-soft bg-paper-deep text-xs font-bold text-accent-deep">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                GUT HEALTH ASSESSMENT
              </div>
              <h1 className="editorial-display text-[clamp(2.25rem,6vw,4rem)] text-ink leading-tight">
                Clinical Probiotic Strain Finder
              </h1>
              <p className="text-base text-ink-muted leading-relaxed">
                Most probiotics fail because they use generic species that can't survive stomach acid or target your specific symptoms. This 3-minute quiz maps your digestive issues, diet, and lifestyle directly to the research-backed probiotic strains you actually need. **No scientific knowledge required.**
              </p>
            </div>
            
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-4 bg-accent text-white font-bold rounded-full text-sm shadow-[0_10px_30px_-8px_rgba(255,100,66,0.5)] hover:bg-accent-deep hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-[transform,background-color,box-shadow] duration-150 ease-out inline-flex items-center gap-2 cursor-pointer"
            >
              Find My Probiotic Match
              <span aria-hidden>→</span>
            </button>
          </div>
        )}

        {/* STEP 1: PRIMARY GOAL */}
        {step === 1 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 1 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  What is your primary gut health goal?
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">12.5% Complete</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[12.5%] transition-all duration-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "bloating", label: "IBS & Bloating Relief", desc: "Reduce visceral cramping, distension, and bowel hypersensitivity.", icon: "💨" },
                { key: "flora", label: "Restore Microbiome Diversity", desc: "Replenish healthy flora colonies after illness, antibiotics, or food poison.", icon: "🌱" },
                { key: "stress", label: "Brain-Gut Axis & Stress", desc: "Settle stress-induced cramping, butterflies, and stress-related GI issues.", icon: "🧠" },
                { key: "athletic", label: "Nutrient Uptake & Recovery", desc: "Enhance amino acid absorption and lower systemic physical fatigue.", icon: "⚡" },
                { key: "vaginal", label: "Urogenital / Vaginal Microbiome", desc: "Support vaginal flora stability, prevent yeast overgrowth, and maintain acidic pH.", icon: "🛡️" },
                { key: "metabolic", label: "Metabolic Support & Barrier Strength", desc: "Strengthen mucin layers, support gut-lining thickness, and manage metabolic health.", icon: "🧬" },
                { key: "maintenance", label: "General Daily Maintenance", desc: "Support daily immunological health, solid barrier defense, and wellness.", icon: "🔒" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPrimaryGoal(item.key)}
                  className={`p-5 border rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer ${
                    primaryGoal === item.key
                      ? "bg-accent/5 border-accent text-ink"
                      : "bg-paper border-rule hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5 shrink-0 select-none">{item.icon}</span>
                    <div>
                      <span className="text-sm font-bold block mb-1 text-ink">{item.label}</span>
                      <span className="text-xs leading-relaxed block text-ink-muted">{item.desc}</span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MOTILITY */}
        {step === 2 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 2 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  Describe your bowel motility and transit patterns.
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">25% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[25%] transition-all duration-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "sluggish", label: "Sluggish / Constipated", desc: "Bowel movements occur once every 2+ days. Hard or dry stools.", icon: "🐢" },
                { key: "loose", label: "Loose / Hyperactive", desc: "Frequent loose stools, urgency shortly after meals, or chronic diarrhea.", icon: "🏃‍♂️" },
                { key: "alternating", label: "Alternating Motility Patterns", desc: "Cycles back and forth between sluggish transit and loose distress.", icon: "🔄" },
                { key: "regular", label: "Regular & Normal Transit", desc: "Consistent daily bowel movements, well-formed (Bristol Stool Chart 3-4).", icon: "✅" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMotility(item.key)}
                  className={`p-5 border rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer ${
                    motility === item.key
                      ? "bg-accent/5 border-accent text-ink"
                      : "bg-paper border-rule hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5 shrink-0 select-none">{item.icon}</span>
                    <div>
                      <span className="text-sm font-bold block mb-1 text-ink">{item.label}</span>
                      <span className="text-xs leading-relaxed block text-ink-muted">{item.desc}</span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: UPPER GI COMFORT */}
        {step === 3 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 3 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  Identify any Upper GI or Stomach symptoms.
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">37.5% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[37.5%] transition-all duration-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "acidReflux", label: "Heartburn / Acid Reflux", desc: "Acidic backflow, burning chest discomfort, or throat irritation.", icon: "🔥" },
                { key: "nauseaIndigestion", label: "Nausea & Indigestion", desc: "Sour stomach, slow digestion, or mild nausea shortly after meals.", icon: "🤢" },
                { key: "bloatingPostMeal", label: "Bloating Immediately Post-Meal", desc: "Feeling tightly swollen in the upper stomach within 30 minutes of eating (associated with SIBO).", icon: "🎈" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleUpperGIToggle(item.key as keyof UpperGISymptoms)}
                  className={`p-5 border rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer ${
                    upperGI[item.key as keyof UpperGISymptoms]
                      ? "bg-accent/5 border-accent text-ink"
                      : "bg-paper border-rule hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 ${
                      upperGI[item.key as keyof UpperGISymptoms] ? "border-accent bg-accent text-white" : "border-rule bg-background"
                    }`}>
                      {upperGI[item.key as keyof UpperGISymptoms] && "✓"}
                    </span>
                    <span className="text-xl shrink-0 select-none">{item.icon}</span>
                    <div>
                      <span className="text-sm font-bold block mb-1 text-ink">{item.label}</span>
                      <span className="text-xs leading-relaxed block text-ink-muted">{item.desc}</span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LOWER GI COMFORT */}
        {step === 4 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 4 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  Identify any Lower GI or Bowel discomforts.
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">50% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[50%] transition-all duration-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "trappedGas", label: "Trapped Gas Pressure", desc: "Painful localized air pockets, abdominal fullness, or loud gut gurgling.", icon: "🔊" },
                { key: "cramping", label: "Lower Cramping & Spasms", desc: "Sharp intestinal contractions, urgency-related cramping, or visceral pain.", icon: "⚡" },
                { key: "flatulence", label: "Excess Flatulence", desc: "Frequent gaseous release, fermentation overload in the lower colon.", icon: "💨" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleLowerGIToggle(item.key as keyof LowerGISymptoms)}
                  className={`p-5 border rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer ${
                    lowerGI[item.key as keyof LowerGISymptoms]
                      ? "bg-accent/5 border-accent text-ink"
                      : "bg-paper border-rule hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 ${
                      lowerGI[item.key as keyof LowerGISymptoms] ? "border-accent bg-accent text-white" : "border-rule bg-background"
                    }`}>
                      {lowerGI[item.key as keyof LowerGISymptoms] && "✓"}
                    </span>
                    <span className="text-xl shrink-0 select-none">{item.icon}</span>
                    <div>
                      <span className="text-sm font-bold block mb-1 text-ink">{item.label}</span>
                      <span className="text-xs leading-relaxed block text-ink-muted">{item.desc}</span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: MEDICATIONS */}
        {step === 5 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 5 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  Have you used any of these gut disruptors?
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">62.5% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[62.5%] transition-all duration-300" />
            </div>

            <div className="space-y-3">
              {[
                { key: "antibiotics", label: "Antibiotics (Past 6 Months)", desc: "Broad-spectrum drugs decimate native bacterial populations, leaving open niches for pathogens.", icon: "💊" },
                { key: "nsaids", label: "Frequent NSAIDs (Ibuprofen / Aspirin)", desc: "Directly damages mucosal tissues, leading to micro-permeability and intestinal leakage.", icon: "⚠️" },
                { key: "ppis", label: "PPIs or Acid Blockers (Omeprazole, Nexium)", desc: "Suppresses gastric acid, raising stomach pH and allowing undigested pathogens to enter the intestines.", icon: "🧪" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleMedicationToggle(item.key as keyof MedicationHistory)}
                  className={`w-full p-4 border rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer ${
                    medications[item.key as keyof MedicationHistory]
                      ? "bg-accent/5 border-accent text-ink"
                      : "bg-paper border-rule hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 ${
                      medications[item.key as keyof MedicationHistory] ? "border-accent bg-accent text-white" : "border-rule bg-background"
                    }`}>
                      {medications[item.key as keyof MedicationHistory] && "✓"}
                    </span>
                    <span className="text-xl shrink-0 select-none">{item.icon}</span>
                    <div>
                      <span className="text-sm font-bold block mb-0.5 text-ink">{item.label}</span>
                      <span className="text-xs leading-relaxed block text-ink-muted">{item.desc}</span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: LIFESTYLE & STRESS */}
        {step === 6 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 6 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  Select any daily stress or sleep factors that apply to you.
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">75% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[75%] transition-all duration-300" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { key: "highStress", label: "Chronic Stress or Tension", desc: "Sustained pressure or anxiety triggers physical gut wall spasms and slows digestion.", icon: "🧠" },
                { key: "sleepDeprived", label: "Poor Sleep Quality / Insufficient Rest", desc: "Disrupts circadian cycles of beneficial gut bacteria, leading to localized digestive irritability.", icon: "🛌" },
                { key: "frequentTravel", label: "Frequent Travel or Jetlag", desc: "Disrupts your biological clock and exposes your tract to changing local food/water microbiomes.", icon: "✈️" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleLifestyleToggle(item.key as keyof LifestyleFactors)}
                  className={`p-5 border rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer ${
                    lifestyle[item.key as keyof LifestyleFactors]
                      ? "bg-accent/5 border-accent text-ink"
                      : "bg-paper border-rule hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 ${
                      lifestyle[item.key as keyof LifestyleFactors] ? "border-accent bg-accent text-white" : "border-rule bg-background"
                    }`}>
                      {lifestyle[item.key as keyof LifestyleFactors] && "✓"}
                    </span>
                    <span className="text-xl shrink-0 select-none">{item.icon}</span>
                    <div>
                      <span className="text-sm font-bold block mb-1 text-ink">{item.label}</span>
                      <span className="text-xs leading-relaxed block text-ink-muted">{item.desc}</span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: DIET DIVERSITY */}
        {step === 7 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 7 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  Estimate your weekly plant food variety.
                </h2>
                <p className="text-xs text-ink-muted leading-relaxed mt-1">
                  Include all vegetables, fruits, grains, nuts, seeds, herbs, and beans you eat in a typical week.
                </p>
              </div>
              <span className="text-sm font-semibold text-ink-muted">87.5% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[87.5%] transition-all duration-300" />
            </div>

            <div className="p-8 bg-paper-deep border border-rule rounded-3xl text-center space-y-6">
              <div className="editorial-numeral text-6xl text-ink">
                {dietDiversity} <span className="text-lg text-ink-muted font-semibold">varieties / week</span>
              </div>

              {/* Slider */}
              <div className="max-w-md mx-auto">
                <label htmlFor="diet-range-slider" className="sr-only">Weekly Plant Food Diversity</label>
                <input
                  id="diet-range-slider"
                  type="range"
                  min="2"
                  max="45"
                  value={dietDiversity}
                  onChange={(e) => setDietDiversity(Number(e.target.value))}
                  className="w-full h-2 bg-rule-soft rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] font-bold text-ink-muted mt-3">
                  <span>LOW VARIETY (&lt;10)</span>
                  <span>CLINICAL BENCHMARK (30)</span>
                  <span>EXCELLENT (45+)</span>
                </div>
              </div>

              {/* Rating */}
              <div className="inline-block">
                <span className={`text-xs font-bold px-4 py-2 rounded-full border ${dietRating.color}`}>
                  {dietRating.rating}
                </span>
              </div>
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: SENSITIVITIES & EXCLUSIONS */}
        {step === 8 && (
          <div className="space-y-8 animate-reveal-scale">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 block">
                  Question 8 of 8
                </span>
                <h2 className="editorial-head text-3xl text-ink mb-2">
                  Do you have any food sensitivities or allergies?
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">97% Complete</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-rule-soft h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[97%] transition-all duration-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "dairy", label: "Lactose & Dairy Sensitive", desc: "Cannot tolerate milk. Strains typically fermented on dairy bases will be flagged.", icon: "🥛" },
                { key: "gluten", label: "Gluten & Wheat Sensitive", desc: "Require gluten-free culturing (crucial for celiac or gluten intolerance).", icon: "🌾" },
                { key: "histamine", label: "Fermented Food / Red Wine Flushing", desc: "Experience stuffy nose, hives, headaches, or flushing after aged cheese, wine, soy sauce, or vinegar.", icon: "🍷" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSensitivityToggle(item.key as keyof DietarySensitivities)}
                  className={`p-5 border rounded-2xl text-left transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer ${
                    sensitivities[item.key as keyof DietarySensitivities]
                      ? "bg-accent/5 border-accent text-ink"
                      : "bg-paper border-rule hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 ${
                      sensitivities[item.key as keyof DietarySensitivities] ? "border-accent bg-accent text-white" : "border-rule bg-background"
                    }`}>
                      {sensitivities[item.key as keyof DietarySensitivities] && "✓"}
                    </span>
                    <div>
                      <span className="text-sm font-bold block mb-1 text-ink">
                        {item.icon} {item.label}
                      </span>
                      <span className="text-xs leading-relaxed block text-ink-muted">{item.desc}</span>
                    </div>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between border-t border-rule pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-ink rounded-full text-xs font-bold text-ink hover:bg-ink hover:text-background transition-[background-color,color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-[0_6px_20px_-4px_rgba(255,100,66,0.45)] transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer"
              >
                Calculate Recommendations
              </button>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {step === 9 && (
          <div className="space-y-12 animate-reveal-scale">
            {/* Header Result */}
            <div className="border-b border-rule pb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-deep mb-2 block">
                  Gut Profile Assessment Complete
                </span>
                <h2 className="editorial-display text-4xl text-ink leading-tight">
                  Your Custom Strain Blueprint
                </h2>
              </div>
              <button
                type="button"
                onClick={restartQuiz}
                className="px-5 py-2.5 bg-paper border border-rule hover:bg-paper-deep text-ink font-bold rounded-full text-xs transition-[background-color,transform] duration-150 active:scale-[0.97] cursor-pointer shrink-0"
              >
                Restart Test
              </button>
            </div>

            {/* Visual Gut Archetype Card */}
            <div className={`p-6 border rounded-2xl ${archetype.tagColor} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block">Personalized Gut Profile Match</span>
                <h3 className="text-xl font-bold text-ink">{archetype.name}</h3>
                <p className="text-xs leading-relaxed max-w-2xl text-ink-muted font-medium">{archetype.desc}</p>
              </div>
              <div className="text-4xl select-none hidden md:block shrink-0">
                {archetype.name.includes("Rebuilder") ? "💊" : archetype.name.includes("Slow") ? "🐢" : archetype.name.includes("Sensitive") ? "🛡️" : "🌱"}
              </div>
            </div>

            {/* Score Indicators Dashboard (Interactive wow visual scoreboards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Microbiome Diversity", score: floraScore, desc: `${dietDiversity} weekly plant sources` },
                { label: "Barrier Resilience", score: barrierScore, desc: `${Object.values(medications).filter(Boolean).length + Object.values(lifestyle).filter(Boolean).length} disruptors detected` },
                { label: "Visceral Comfort Index", score: comfortScore, desc: `${Object.values(upperGI).filter(Boolean).length + Object.values(lowerGI).filter(Boolean).length} active GI symptoms` },
              ].map((gauge) => {
                const colors = getScoreColor(gauge.score);
                return (
                  <div key={gauge.label} className="border border-rule p-6 rounded-2xl bg-paper-deep space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft block">
                      {gauge.label}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="editorial-numeral text-4xl text-ink font-bold">{gauge.score}%</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${colors.text}`}>
                        {gauge.score >= 80 ? "Healthy" : gauge.score >= 50 ? "Moderate" : "At Risk"}
                      </span>
                    </div>
                    {/* Progress indicator bar */}
                    <div className="w-full bg-rule-soft h-2.5 rounded-full overflow-hidden border border-rule-soft">
                      <div className={`h-full ${colors.bar} transition-all duration-[1000ms]`} style={{ width: `${gauge.score}%` }} />
                    </div>
                    <span className="text-xs text-ink-muted leading-relaxed block">{gauge.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* CFU Output */}
            <div className="border border-rule p-6 rounded-2xl bg-paper flex items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block mb-1">
                  Target Daily Colony Dosage
                </span>
                <span className="editorial-head text-2xl text-ink font-bold">{cfu}</span>
              </div>
              <span className="text-xs text-ink-muted max-w-sm text-right leading-relaxed hidden sm:block">
                Dosage targets are adjusted upward when antibiotic exposure, acid-blocker use, loose transit, or high mucosal stress pressure is present.
              </span>
            </div>

            {/* Recommended Strains list with accordion (Click-to-Expand mechanisms) */}
            <div className="space-y-4">
              <h3 className="editorial-head text-2xl text-ink border-b border-rule pb-2">
                Your Target Probiotic Strains
              </h3>
              <p className="text-sm text-ink-muted mt-2 mb-6">
                Click any strain block below to expand its cellular mechanism of action, prebiotic fuel pairings, suitability guidelines, and clinical trial references.
              </p>

              <div className="grid gap-4">
                {strains.map((strain) => {
                  const isExpanded = expandedStrain === strain.id;
                  const warnings = checkStrainWarning(strain);
                  return (
                    <div
                      key={strain.id}
                      className={`border rounded-2xl bg-paper transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-md ${
                        isExpanded ? "border-accent animate-reveal-up" : "border-rule hover:border-ink/20"
                      }`}
                      onClick={() => toggleStrainExpand(strain.id)}
                    >
                      {/* Summary line */}
                      <div className="p-6 flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col mb-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="editorial-head text-lg text-accent-deep">
                                {strain.name}
                              </h4>
                              {warnings.length > 0 && (
                                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                  ⚠️ Tolerance Alert
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-trust-deep mt-0.5 block uppercase tracking-wider">
                              ★ {strain.friendlyRole}
                            </span>
                          </div>
                          <p className="text-sm text-ink leading-relaxed">
                            {strain.reason}
                          </p>
                        </div>
                        <span className="text-ink-soft shrink-0">
                          {isExpanded ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </span>
                      </div>

                      {/* Collapsible Details */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-rule-soft bg-paper-deep space-y-4 animate-reveal-up" onClick={(e) => e.stopPropagation()}>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">
                                Why Recommended
                              </span>
                              <ul className="space-y-1.5">
                                {getWhyRecommended(strain.id).map((reason, idx) => (
                                  <li key={idx} className="text-xs text-ink font-semibold flex items-start gap-1.5">
                                    <span className="text-emerald-600 shrink-0 select-none">✓</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">
                                Cellular Mechanism
                              </span>
                              <p className="text-xs text-ink-muted leading-relaxed font-medium">
                                {strain.mechanism}
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">
                                Prebiotic Fuel Pairings
                              </span>
                              <p className="text-xs text-ink-muted leading-relaxed font-medium">
                                Fuel source: <strong>{strain.prebiotic}</strong>. Consuming foods containing this prebiotic selectively increases this strain's density in your colon.
                              </p>
                            </div>
                          </div>

                          {warnings.length > 0 && (
                            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                                Sensitivity Warning
                              </span>
                              {warnings.map((w, idx) => (
                                <p key={idx} className="text-xs text-ink-muted font-medium">
                                  {w}
                                </p>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-rule border-dashed">
                            <span className="text-xs font-semibold text-ink-muted">
                              🔬 Evidence: {strain.clinicalProof}
                            </span>
                            <a
                              href={strain.pubmedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-deep hover:underline"
                            >
                              View on PubMed ({strain.pubmedId})
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NEW Prebiotic Food Map Card (Explicit Food-to-Bacteria Links) */}
            <div className="border border-rule bg-paper p-6 rounded-2xl space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-trust-deep block">
                  Interactive Prebiotic Food Map
                </span>
                <h3 className="editorial-head text-2xl text-ink">
                  How to Selectively Increase Your Target Bacteria Strains
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Probiotic bacteria are living organisms. Without their matching prebiotic fuel, they cannot replicate or colonize. Incorporating these prebiotic foods directly feeds and increases your target strains:
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {strains.map((strain) => (
                  <div key={strain.id} className="border border-rule-soft p-4 rounded-xl bg-paper-deep space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-accent-deep uppercase tracking-wider block">
                        {strain.scientificName}
                      </span>
                      <span className="text-[10px] font-bold bg-trust/10 text-trust-deep px-2 py-0.5 rounded border border-trust/15">
                        {strain.prebiotic}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">
                        Target Foods to Eat:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {strain.targetFoods.map((food, idx) => (
                          <span key={idx} className="bg-paper border border-rule-soft px-2.5 py-1 rounded-full text-xs font-semibold text-ink">
                            🥦 {food}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-[11px] leading-relaxed text-ink-muted font-medium">
                      Mechanism: Consuming these foods introduces {strain.prebiotic}, which selectively bypasses upper digestion to ferment in the colon, raising the count of {strain.scientificName}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Protocol Timeline */}
            <div className="space-y-6 border-t border-rule pt-10">
              <h3 className="editorial-head text-2xl text-ink">
                Your Custom Daily Gut Protocol Timeline
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Microbiome survival and colonization efficiency increases when strains are paired with specific biological timings. Follow this structured daily routine.
              </p>

              <div className="relative border-l border-rule ml-3 pl-8 py-2 space-y-8">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet marker */}
                    <div className="absolute -left-[45px] top-0 bg-paper border border-rule rounded-full p-2.5 shadow-sm">
                      {event.icon}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-bold text-ink leading-none">
                        {event.time}
                      </h4>
                      <p className="text-xs text-ink-muted font-medium max-w-2xl leading-relaxed">
                        {event.instructions}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        {event.strains.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center px-3 py-1.5 rounded-full border border-rule bg-paper text-xs font-semibold text-ink"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diet Action Plan */}
            <div className="border border-rule bg-paper p-6 rounded-2xl space-y-3">
              <h4 className="editorial-head text-xl text-ink">Weekly Diet Diversity Action Plan</h4>
              <p className="text-base text-ink-muted leading-relaxed">
                {dietDiversity >= 30
                  ? "Outstanding diet diversity. Eating 30+ unique plant varieties per week feeds different beneficial bacteria colonies and maximizes short-chain fatty acids (SCFAs like butyrate). Continue feeding your strains this diversity."
                  : `Your plant variety intake (${dietDiversity} varieties/week) is below the threshold shown to support diverse flora. Probiotic bacteria require fuel to colonize. Try adding 3-5 new plant sources (nuts, seeds, whole grains, root vegetables) to your grocery list to build toward the 30+ varieties target.`}
              </p>
            </div>

            {/* NEW Product Showcase & Commercial Supplement Product Mappings Shelf */}
            {(() => {
              const selectedProducts: { strain: Strain; product: CommercialProduct }[] = [];
              const usedBrands = new Set<string>();

              for (const strain of strains) {
                // Find a product from this strain that hasn't had its brand recommended yet
                let foundProduct = strain.topProducts.find(p => !usedBrands.has(p.brand));
                if (!foundProduct) {
                  // Fallback to the first product if we can't find a unique brand
                  foundProduct = strain.topProducts[0];
                }
                if (foundProduct) {
                  selectedProducts.push({ strain, product: foundProduct });
                  usedBrands.add(foundProduct.brand);
                }
              }

              return (
                <div className="border-t border-rule pt-10 space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-trust-deep block">
                      Your Personalized Supplement Shelf
                    </span>
                    <h3 className="editorial-head text-3xl text-ink">
                      Recommended Probiotic Products
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      Based on your gut assessment, these 3 targeted supplements contain the exact clinical strains recommended to resolve your symptoms and support your gut profile.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedProducts.map(({ strain, product }, index) => {
                      const warnings = checkStrainWarning(strain);
                      
                      let badge = "";
                      let badgeClass = "bg-trust/10 text-trust-deep border-trust/20";
                      
                      if (product.brand === "Seed") {
                        badge = "Up to 25% Off";
                        badgeClass = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
                      } else if (product.brand === "Just Thrive") {
                        badge = "15% Off";
                        badgeClass = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
                      } else if (product.brand === "Pendulum") {
                        badge = "Clinical Strength";
                        badgeClass = "bg-trust/10 text-trust-deep border-trust/20";
                      } else if (product.brand === "Ritual") {
                        badge = "3-in-1 Design";
                        badgeClass = "bg-amber-500/10 text-amber-700 border-amber-500/20";
                      }

                      return (
                        <div 
                          key={strain.id} 
                          className="bg-paper border border-rule p-6 rounded-2xl relative flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
                        >
                          {badge && (
                            <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${badgeClass}`}>
                              {badge}
                            </span>
                          )}
                          
                          <div className="space-y-3">
                            <span className="text-[10px] text-accent-deep font-bold uppercase tracking-widest block">
                              Recommendation 0{index + 1}
                            </span>
                            
                            <div className="space-y-1">
                              <h4 className="text-xl font-bold text-ink">
                                {product.brand} {product.name}
                              </h4>
                              <span className="text-xs font-bold text-trust-deep uppercase tracking-wider block">
                                ★ {strain.friendlyRole}
                              </span>
                            </div>
                            
                            <p className="text-xs text-ink-muted leading-relaxed">
                              Matches your needs for <strong>{strain.scientificName}</strong>. {strain.reason}
                            </p>

                            <div className="space-y-1 pt-1">
                              <span className="text-[9px] uppercase font-bold text-ink-soft block">Clinically Targeting:</span>
                              <span className="text-[11px] font-semibold text-ink-muted block">{strain.scientificName}</span>
                            </div>

                            {sensitivities.dairy && !strain.suitability.dairyFree && (
                              <div className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-lg leading-relaxed">
                                ⚠️ Note: You indicated dairy sensitivity. {product.brand} {product.name} may contain trace dairy from the growth culture.
                              </div>
                            )}
                          </div>
                          
                          <a
                            href={product.url || "https://pubmed.ncbi.nlm.nih.gov/"}
                            target="_blank"
                            rel="nofollow noopener"
                            className="inline-block text-center px-6 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-md active:scale-[0.97] transition-all cursor-pointer w-full"
                          >
                            Shop {product.brand}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Lead Magnet Email Capture Form */}
            <div className="border border-rule bg-paper p-8 rounded-3xl space-y-6 relative overflow-hidden mt-12">
              {/* Background Accent Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="max-w-2xl space-y-2">
                <span className="text-[10px] font-bold text-accent-deep uppercase tracking-widest block">PDF Blueprint Download</span>
                <h3 className="editorial-head text-2xl text-ink">Email My Personalized Gut Blueprint PDF</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Get a clean, printable PDF copy of your custom strain timeline, prebiotic food map, and commercial brand checklist sent directly to your inbox.
                </p>
              </div>

              {!emailSubmitted ? (
                <div className="space-y-3">
                  <form onSubmit={handleEmailSubmit} className="space-y-3 md:space-y-0 md:flex items-center gap-3 max-w-md">
                    <div className="flex-1">
                      <label htmlFor="lead-email-input" className="sr-only">Email Address</label>
                      <input
                        id="lead-email-input"
                        type="email"
                        required
                        disabled={emailSending}
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-rule hover:border-ink/20 focus:border-accent rounded-full text-xs text-ink placeholder:text-ink-soft focus:outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={emailSending}
                      className="w-full md:w-auto px-6 py-3 bg-accent hover:bg-accent-deep text-white font-bold rounded-full text-xs shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all cursor-pointer shrink-0 disabled:opacity-75 disabled:pointer-events-none"
                    >
                      {emailSending ? "Sending..." : "Get My Blueprint"}
                    </button>
                  </form>
                  {emailError && (
                    <p className="text-xs font-semibold text-red-600 animate-reveal-up">
                      ⚠️ {emailError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-2xl flex items-center gap-3 animate-reveal-scale">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-xs font-bold block">Blueprint Dispatched!</span>
                    <span className="text-[11px] leading-relaxed block text-emerald-600/90">
                      Check your inbox in 2 minutes. We've sent a PDF copy of your <strong>{archetype.name}</strong> blueprint to <strong>{email}</strong>.
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

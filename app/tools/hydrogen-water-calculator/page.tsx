"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ActivityLevel = "sedentary" | "moderate" | "active";
type UnitType = "ml" | "oz" | "l";

export default function HydrogenWaterCalculator() {
  // User Inputs
  const [weight, setWeight] = useState<number>(150);
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [concentration, setConcentration] = useState<number>(3.0); // in PPM
  const [concUnit, setConcUnit] = useState<"ppm" | "ppb">("ppm");
  const [bottleVolume, setBottleVolume] = useState<number>(12); // Bottle size
  const [volumeUnit, setVolumeUnit] = useState<UnitType>("oz");

  // Calculated Outputs
  const [dailyTargetMg, setDailyTargetMg] = useState<number>(0);
  const [mgPerCycle, setMgPerCycle] = useState<number>(0);
  const [requiredCycles, setRequiredCycles] = useState<number>(0);
  const [requiredLiters, setRequiredLiters] = useState<number>(0);

  // Conversion calculations
  useEffect(() => {
    // 1. Calculate weight in kg
    const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

    // 2. Base H2 target logic: 1.5mg to 3.0mg per day
    // Roughly 0.02 mg per kg of body weight, with a baseline minimum of 1.5mg
    let target = 1.5 + (weightInKg * 0.015);
    
    // Adjust for activity level
    if (activity === "moderate") target += 0.3;
    if (activity === "active") target += 0.8;
    
    // Cap target reasonably between 1.5mg and 4.5mg
    const finalTarget = Math.max(1.5, Math.min(4.5, target));
    setDailyTargetMg(Number(finalTarget.toFixed(2)));

    // 3. Convert bottle volume to Liters
    let volumeInLiters = 0;
    if (volumeUnit === "ml") {
      volumeInLiters = bottleVolume / 1000;
    } else if (volumeUnit === "oz") {
      volumeInLiters = bottleVolume * 0.0295735;
    } else {
      volumeInLiters = bottleVolume;
    }
    setRequiredLiters(Number((volumeInLiters * requiredCycles).toFixed(2)));

    // 4. Calculate mg of H2 per cycle
    // PPM = mg/L, so mg = PPM * Volume in Liters
    const ppmValue = concUnit === "ppb" ? concentration / 1000 : concentration;
    const mg = ppmValue * volumeInLiters;
    setMgPerCycle(Number(mg.toFixed(3)));

    // 5. Calculate required cycles to hit daily target
    const cycles = finalTarget / (mg || 0.1);
    setRequiredCycles(Number(cycles.toFixed(1)));

  }, [weight, weightUnit, activity, concentration, concUnit, bottleVolume, volumeUnit, requiredCycles]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      {/* Back Button */}
      <Link href="/tools" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-accent mb-8 transition-colors">
        ← Back to Tools
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Intake & Device Inputs */}
        <div className="lg:col-span-7 bg-background border border-border-muted p-8 rounded-2xl shadow-sm space-y-8">
          <div>
            <h1 className="editorial-head text-3xl text-ink mb-2">
              Hydrogen Water Daily Target Calculator
            </h1>
            <p className="text-sm text-ink-muted leading-relaxed">
              Find out your daily therapeutic molecular hydrogen ($H_2$) requirements in milligrams and calculate exactly how many bottles you need to drink.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-ink border-b border-border-muted pb-2">
              1. Your Personal Profile
            </h3>
            
            {/* Weight Input */}
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <label htmlFor="weight-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Body Weight
                </label>
                <input
                  id="weight-input"
                  type="number"
                  min="30"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="weight-unit-select" className="sr-only">Weight Unit</label>
                <select
                  id="weight-unit-select"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as "lbs" | "kg")}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent h-[50px] font-bold"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            {/* Activity Level Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                Daily Physical Activity
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "sedentary", label: "Sedentary", desc: "Desk job / light walking" },
                  { id: "moderate", label: "Moderate", desc: "Workout 3-4x / week" },
                  { id: "active", label: "Highly Active", desc: "Heavy training / RMT athletes" },
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setActivity(level.id as ActivityLevel)}
                    className={`p-3 border rounded-xl text-left transition-all flex flex-col justify-between h-20 ${
                      activity === level.id
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-background border-border-muted hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="text-xs font-bold block">{level.label}</span>
                    <span className={`text-[9px] leading-normal ${activity === level.id ? "text-white/80" : "text-ink-muted"}`}>
                      {level.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-sm font-bold text-ink border-b border-border-muted pb-2 pt-4">
              2. Your Hydrogen Device Specs
            </h3>

            {/* Device Concentration Output (PPM/PPB) */}
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <label htmlFor="concentration-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Hydrogen Output (PPM or PPB)
                </label>
                <input
                  id="concentration-input"
                  type="number"
                  min="0.1"
                  max="15"
                  step="0.1"
                  value={concentration}
                  onChange={(e) => setConcentration(Number(e.target.value))}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="concentration-unit-select" className="sr-only">Concentration Unit</label>
                <select
                  id="concentration-unit-select"
                  value={concUnit}
                  onChange={(e) => setConcUnit(e.target.value as "ppm" | "ppb")}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent h-[50px] font-bold"
                >
                  <option value="ppm">PPM (mg/L)</option>
                  <option value="ppb">PPB (µg/L)</option>
                </select>
              </div>
            </div>

            {/* Bottle Volume size */}
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <label htmlFor="bottle-volume-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Bottle / Container Volume
                </label>
                <input
                  id="bottle-volume-input"
                  type="number"
                  min="1"
                  max="2000"
                  value={bottleVolume}
                  onChange={(e) => setBottleVolume(Number(e.target.value))}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="bottle-volume-unit-select" className="sr-only">Volume Unit</label>
                <select
                  id="bottle-volume-unit-select"
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value as UnitType)}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent h-[50px] font-bold"
                >
                  <option value="oz">Ounces (oz)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (L)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Outputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Results Card */}
          <div className="bg-background border border-border-muted p-8 rounded-2xl shadow-sm text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-6 block">
              Your Dosing Summary
            </span>

            {/* Circular highlight */}
            <div className="w-40 h-40 rounded-full bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900 mx-auto flex flex-col items-center justify-center mb-6">
              <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
                {requiredCycles}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mt-1">
                cycles daily
              </span>
            </div>

            {/* Data Table */}
            <div className="text-left space-y-4 border-t border-border-muted pt-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink-muted font-medium">Daily Target H₂ Dosing:</span>
                <span className="font-bold text-ink">{dailyTargetMg} mg</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink-muted font-medium">Output Per Bottle Cycle:</span>
                <span className="font-bold text-ink">{mgPerCycle} mg</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink-muted font-medium">Required Daily Fluid Volume:</span>
                <span className="font-bold text-ink">
                  {Math.round(requiredLiters * 33.814)} oz (~{requiredLiters} L)
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Insights */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-border-muted p-6 rounded-2xl text-xs leading-relaxed text-ink-muted space-y-3">
            <h4 className="font-bold text-ink">Clinical Science:</h4>
            <p>
              The International Hydrogen Standards Association (IHSA) establishes that to receive clinical systemic benefits, the human body needs a minimum of **1.6 mg to 3.0 mg** of molecular hydrogen daily.
            </p>
            <p>
              Because hydrogen is a small molecule, it quickly diffuses into the air. **Drink the water within 15–30 minutes of running a cycle** to prevent the gas from evaporating.
            </p>
          </div>
        </div>
      </div>

      {/* Device Recommendations */}
      <div className="mt-20 border-t border-border-muted pt-16">
        <div className="max-w-2xl mb-10">
          <h2 className="editorial-head text-2xl md:text-3xl text-ink mb-3">
            Clinically Tested Hydrogen Water Devices
          </h2>
          <p className="text-sm text-ink-muted">
            These models are verified to produce high PPM outputs that help you hit your daily milligram targets easily without drinking excessive water volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Echo Flask */}
          <div className="bg-background border border-border-muted p-8 rounded-2xl flex flex-col justify-between relative shadow-sm hover:shadow-lg transition-shadow">
            <div>
              <span className="absolute top-4 right-4 bg-cyan-500/10 text-cyan-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Best Overall Portable
              </span>
              <h3 className="text-xl font-bold text-ink mb-4 mt-2">Echo Flask (8.0 PPM)</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Produces a massive 8.0 PPM concentration (8.0 mg/L) in a single 20-minute cycle. Features a shatterproof pressure cap designed to keep hydrogen dissolved for over 10 hours.
              </p>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Exclusive Clinical Discount Code (10% Off)
                </span>
                <span className="text-lg font-mono font-extrabold text-accent">ESAVE10</span>
              </div>
            </div>
            <a
              href="https://echowater.com/discount/esave10/?redirect=&_ef_transaction_id=&utm_source=everflow&utm_medium=affiliate&utm_campaign=&utm_content=6&oid=6&affid=408"
              target="_blank"
              rel="nofollow noopener"
              className="w-full text-center py-3 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent-deep transition-all shadow-[0_4px_14px_rgba(255,100,66,0.3)]"
            >
              Get Echo Flask Best Price
            </a>
          </div>

          {/* Ocemida Omni */}
          <div className="bg-background border border-border-muted p-8 rounded-2xl flex flex-col justify-between relative shadow-sm hover:shadow-lg transition-shadow">
            <div>
              <span className="absolute top-4 right-4 bg-cyan-500/10 text-cyan-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Best Value / Canada
              </span>
              <h3 className="text-xl font-bold text-ink mb-4 mt-2">Ocemida Omni (5.0 PPM)</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Produces up to 5.0 PPM of dissolved molecular hydrogen. Solid construction, high battery life, and excellent localized Canadian shipping support with local duties included.
              </p>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Exclusive Clinical Discount Code (10% Off)
                </span>
                <span className="text-lg font-mono font-extrabold text-accent">Synctherapy</span>
              </div>
            </div>
            <a
              href="https://ocemida.com/discount/Synctherapy?ref=nlldqmqo"
              target="_blank"
              rel="nofollow noopener"
              className="w-full text-center py-3 bg-neutral-50 dark:bg-neutral-900 border border-border-muted rounded-xl text-xs font-bold text-ink hover:bg-neutral-100 hover:border-ink/20 transition-all"
            >
              Get Ocemida Best Price
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

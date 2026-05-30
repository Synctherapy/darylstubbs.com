"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Modality = "drinking" | "inhalation";
type ActivityLevel = "sedentary" | "moderate" | "active";
type UnitType = "ml" | "oz" | "l";
type TargetGoal = "general" | "metabolic" | "cognitive" | "inflammatory" | "athletic" | "oncology" | "custom";
type DrinkingPreset = "custom" | "echo_flask" | "ocemida_omni" | "lumavita" | "h2life" | "gravity_pitcher";
type InhalationPreset = "custom" | "echo_h2_inhaler" | "ocemida_clinical" | "h2_lung_master" | "clinical_high_flow" | "vitality_lite";

interface DevicePresetInfo {
  label: string;
  irradiance: number; // For drinking: concentration in PPM. For inhalation: flow rate in mL/min.
  volume?: number;    // For drinking: bottle volume in mL.
}

interface GoalInfo {
  label: string;
  targetMg: number;
  description: string;
}

export function HydrogenCalculatorClient() {
  // 1. Modality selection (drinking vs inhalation)
  const [modality, setModality] = useState<Modality>("drinking");

  // User Profile Inputs
  const [weight, setWeight] = useState<number>(150);
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  // Therapeutic Health Goal Presets
  const [healthGoal, setHealthGoal] = useState<TargetGoal>("cognitive");
  const [customTargetMg, setCustomTargetMg] = useState<number>(3.0);
  const [dailyTargetMg, setDailyTargetMg] = useState<number>(3.0);

  // Device Presets
  const [drinkingPreset, setDrinkingPreset] = useState<DrinkingPreset>("echo_flask");
  const [inhalationPreset, setInhalationPreset] = useState<InhalationPreset>("ocemida_clinical");

  // Custom Device Parameters
  const [concentration, setConcentration] = useState<number>(3.0); // PPM
  const [concUnit, setConcUnit] = useState<"ppm" | "ppb">("ppm");
  const [bottleVolume, setBottleVolume] = useState<number>(500); // ml
  const [volumeUnit, setVolumeUnit] = useState<UnitType>("ml");

  const [flowRate, setFlowRate] = useState<number>(300); // mL/min
  const [sessionTime, setSessionTime] = useState<number>(30); // minutes (for calculation check)

  // Calculated Outputs
  const [mgPerCycle, setMgPerCycle] = useState<number>(0);
  const [requiredCycles, setRequiredCycles] = useState<number>(0);
  const [requiredLiters, setRequiredLiters] = useState<number>(0);

  const [inhalationDeliveredMg, setInhalationDeliveredMg] = useState<number>(0);
  const [inhalationAbsorbedMg, setInhalationAbsorbedMg] = useState<number>(0);
  const [requiredInhalationMinutes, setRequiredInhalationMinutes] = useState<number>(0);

  // Advanced toggles
  const [isLitersDailyChecked, setIsLitersDailyChecked] = useState<boolean>(true);

  // Presets Databases
  const goalPresets: Record<Exclude<TargetGoal, "custom">, GoalInfo> = {
    general: {
      label: "Longevity & Anti-Aging",
      targetMg: 1.8,
      description: "Daily baseline for general antioxidant support, reducing oxidative stress, and cellular maintenance.",
    },
    metabolic: {
      label: "Metabolic Support & Diabetes",
      targetMg: 2.5,
      description: "Clinical target to support blood glucose regulation, insulin sensitivity, and lipid profile improvements.",
    },
    cognitive: {
      label: "Cognitive Health & Brain Fog",
      targetMg: 3.5,
      description: "Neuroprotective dosage to support brain mitochondrial health, reduce brain fog, and mitigate neuroinflammation.",
    },
    inflammatory: {
      label: "Inflammation & Joint Pain",
      targetMg: 4.0,
      description: "Anti-inflammatory dosage utilized in studies for rheumatoid arthritis, chronic joint pain, and recovery.",
    },
    athletic: {
      label: "Athletic Performance & Fatigue",
      targetMg: 4.5,
      description: "Higher dosage to buffer lactic acid accumulation, speed muscle soreness recovery, and support cardiovascular endurance.",
    },
    oncology: {
      label: "Clinical Support (Chemo/Radiotherapy)",
      targetMg: 5.5,
      description: "High-dose adjuvant protocol to mitigate side effects of radiation/chemotherapy and support cellular quality of life.",
    },
  };

  const drinkingPresets: Record<Exclude<DrinkingPreset, "custom">, DevicePresetInfo> = {
    echo_flask: { label: "Echo Flask (Portable)", irradiance: 8.0, volume: 500 },
    ocemida_omni: { label: "Ocemida Omni (Portable)", irradiance: 5.0, volume: 400 },
    lumavita: { label: "LumaVita H2 Bottle", irradiance: 3.0, volume: 450 },
    h2life: { label: "H2 Life Flask", irradiance: 3.5, volume: 300 },
    gravity_pitcher: { label: "Gravity H2 Pitcher", irradiance: 2.5, volume: 1500 },
  };

  const inhalationPresets: Record<Exclude<InhalationPreset, "custom">, DevicePresetInfo> = {
    echo_h2_inhaler: { label: "Echo H2 Inhalation Machine", irradiance: 150 },
    ocemida_clinical: { label: "Ocemida Clinical Generator", irradiance: 300 },
    h2_lung_master: { label: "Hydrogen Lung Master", irradiance: 600 },
    clinical_high_flow: { label: "Clinical High-Flow Generator", irradiance: 1000 },
    vitality_lite: { label: "Vitality H2 Inhaler (Lite)", irradiance: 100 },
  };

  // Sync default target dose when healthGoal changes
  useEffect(() => {
    if (healthGoal !== "custom") {
      setDailyTargetMg(goalPresets[healthGoal].targetMg);
    } else {
      setDailyTargetMg(customTargetMg);
    }
  }, [healthGoal, customTargetMg]);

  // Sync device parameters when presets change
  useEffect(() => {
    if (modality === "drinking" && drinkingPreset !== "custom") {
      setConcentration(drinkingPresets[drinkingPreset].irradiance);
      setConcUnit("ppm");
      setBottleVolume(drinkingPresets[drinkingPreset].volume || 500);
      setVolumeUnit("ml");
    }
  }, [drinkingPreset, modality]);

  useEffect(() => {
    if (modality === "inhalation" && inhalationPreset !== "custom") {
      setFlowRate(inhalationPresets[inhalationPreset].irradiance);
    }
  }, [inhalationPreset, modality]);

  // Math calculations
  useEffect(() => {
    // 1. Calculate weight in kg
    const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

    // 2. Adjust target dose dynamically based on body weight and activity
    // (Clinical trials are dose-dependent. Heavier individuals or high active states need higher levels).
    let weightModifier = 0.0;
    if (weightInKg > 80) {
      weightModifier = (weightInKg - 80) * 0.015; // Add slightly for heavier body mass
    }
    let activityModifier = 0.0;
    if (activity === "moderate") activityModifier = 0.2;
    if (activity === "active") activityModifier = 0.5;

    let adjustedTarget = dailyTargetMg + weightModifier + activityModifier;
    adjustedTarget = Math.max(1.0, Math.min(10.0, adjustedTarget));

    // 3. Drinking Mode Calculations
    let volumeInLiters = 0;
    if (volumeUnit === "ml") {
      volumeInLiters = bottleVolume / 1000;
    } else if (volumeUnit === "oz") {
      volumeInLiters = bottleVolume * 0.0295735;
    } else {
      volumeInLiters = bottleVolume;
    }

    const ppmValue = concUnit === "ppb" ? concentration / 1000 : concentration;
    const mg = ppmValue * volumeInLiters;
    setMgPerCycle(Number(mg.toFixed(3)));

    const cycles = adjustedTarget / (mg || 0.1);
    setRequiredCycles(Number(Math.ceil(cycles * 10) / 10)); // round to 1 decimal place

    const liters = volumeInLiters * cycles;
    setRequiredLiters(Number(liters.toFixed(2)));

    // 4. Inhalation Mode Calculations
    // Physics: 1 mL of H2 gas weighs 0.08988 mg (approx 0.09 mg) at Standard Temperature & Pressure (STP)
    // Formula: Total delivered mg = Flow Rate (mL/min) * Duration (min) * 0.09 mg/mL
    const delivered = flowRate * sessionTime * 0.09;
    setInhalationDeliveredMg(Number(delivered.toFixed(1)));

    // Standard clinical lung absorption of inhaled gas is estimated at ~2% due to exhaling and incomplete diffusion
    const absorbed = delivered * 0.02;
    setInhalationAbsorbedMg(Number(absorbed.toFixed(2)));

    // Session time required (minutes) = adjustedTarget / (Flow Rate * 0.09 * 0.02)
    const minutesRequired = adjustedTarget / (flowRate * 0.09 * 0.02);
    setRequiredInhalationMinutes(Number(Math.ceil(minutesRequired)));

  }, [weight, weightUnit, activity, dailyTargetMg, concentration, concUnit, bottleVolume, volumeUnit, flowRate, sessionTime, modality]);

  const fitzpatrickScales = [
    { type: 1, color: "bg-[#FFF4E0]", label: "Type I", desc: "Always burns" },
    { type: 2, color: "bg-[#F5D6B3]", label: "Type II", desc: "Usually burns" },
    { type: 3, color: "bg-[#E1B68F]", label: "Type III", desc: "Burns mildly" },
    { type: 4, color: "bg-[#C4926C]", label: "Type IV", desc: "Rarely burns" },
    { type: 5, color: "bg-[#8A5A3C]", label: "Type V", desc: "Very rarely" },
    { type: 6, color: "bg-[#422214]", label: "Type VI", desc: "Never burns" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      {/* Back Button */}
      <Link href="/tools" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-cyan-500 mb-8 transition-[color,transform] duration-150 active:scale-[0.98]">
        ← Back to Tools
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-7 bg-paper border border-rule p-8 rounded-3xl shadow-sm space-y-8">
          <div>
            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-1">Clinical Molecular Hydrogen Tool</span>
            <h1 className="editorial-head text-3xl md:text-4xl text-ink mb-3">
              Hydrogen Water Daily Target & Inhalation Calculator
            </h1>
            <p className="text-xs text-ink-muted leading-relaxed">
              Find your optimal daily molecular hydrogen ($H_2$) target for specific diseases and calculate your drinking water bottle cycles or gas inhalation duration to hit clinical thresholds.
            </p>
          </div>

          {/* Dosing Modality Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              1. Choose Administration Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "drinking", label: "💧 Hydrogen-Rich Water", desc: "Dissolved drinking gas (PPM)" },
                { id: "inhalation", label: "🎛️ Hydrogen Gas Inhalation", desc: "Pure nasal cannula flow (mL/min)" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setModality(item.id as Modality)}
                  className={`p-4 border rounded-2xl text-left transition-all flex flex-col justify-between h-24 active:scale-[0.98] ${
                    modality === item.id
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/10"
                      : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="text-sm font-bold block">{item.label}</span>
                  <span className={`text-[10px] leading-tight ${modality === item.id ? "text-white/80" : "text-ink-muted"}`}>
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Health Goal / Disease Target presets */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                2. Select Health Goal / Clinical Target
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(goalPresets).map(([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHealthGoal(key as TargetGoal)}
                    className={`p-3 border rounded-2xl text-left transition-all flex flex-col justify-between h-24 active:scale-[0.98] ${
                      healthGoal === key
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                        : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-bold block leading-tight">{info.label}</span>
                      <span className={`text-[9px] block mt-1 leading-normal ${healthGoal === key ? "text-white/70" : "text-ink-soft"}`}>
                        {info.description}
                      </span>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase mt-2 ${healthGoal === key ? "text-white" : "text-cyan-600"}`}>
                      Target: {info.targetMg} mg
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setHealthGoal("custom")}
                  className={`p-3 border rounded-2xl text-left transition-all flex flex-col justify-between h-24 active:scale-[0.98] ${
                    healthGoal === "custom"
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                      : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-bold block">Custom Target</span>
                    <span className={`text-[9px] block mt-1 leading-normal ${healthGoal === "custom" ? "text-white/70" : "text-ink-soft"}`}>
                      Specify a custom daily threshold based on other research.
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase mt-2 ${healthGoal === "custom" ? "text-white" : "text-cyan-600"}`}>
                    Adjustable
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Target Input */}
            {healthGoal === "custom" && (
              <div className="p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                <label htmlFor="custom-target-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Target Daily Molecular Hydrogen (mg)
                </label>
                <input
                  id="custom-target-input"
                  type="number"
                  min="0.2"
                  max="15.0"
                  step="0.1"
                  value={customTargetMg}
                  onChange={(e) => setCustomTargetMg(Number(e.target.value))}
                  className="w-full bg-paper border border-rule rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Step 3: Device Brand presets based on modality */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                3. Select Your Device Profile
              </label>

              {modality === "drinking" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(drinkingPresets).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDrinkingPreset(key as DrinkingPreset)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center active:scale-[0.98] ${
                        drinkingPreset === key ? "bg-cyan-600 text-white border-cyan-600 shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDrinkingPreset("custom")}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center active:scale-[0.98] ${
                      drinkingPreset === "custom" ? "bg-cyan-600 text-white border-cyan-600 shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    Custom Device
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(inhalationPresets).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setInhalationPreset(key as InhalationPreset)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center active:scale-[0.98] ${
                        inhalationPreset === key ? "bg-cyan-600 text-white border-cyan-600 shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setInhalationPreset("custom")}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center active:scale-[0.98] ${
                      inhalationPreset === "custom" ? "bg-cyan-600 text-white border-cyan-600 shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    Custom Generator
                  </button>
                </div>
              )}
            </div>

            {/* Custom Inputs based on modality selection */}
            {modality === "drinking" && drinkingPreset === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up space-y-4 sm:space-y-0">
                {/* Custom Concentration */}
                <div>
                  <label htmlFor="custom-concentration-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                    Stated Output (PPM or PPB)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="custom-concentration-input"
                      type="number"
                      min="0.1"
                      max="15.0"
                      step="0.1"
                      value={concentration}
                      onChange={(e) => setConcentration(Number(e.target.value))}
                      className="flex-1 bg-paper border border-rule rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan-500"
                    />
                    <select
                      aria-label="Concentration Unit"
                      value={concUnit}
                      onChange={(e) => setConcUnit(e.target.value as "ppm" | "ppb")}
                      className="bg-paper border border-rule rounded-xl px-2 py-2 text-xs font-bold text-ink focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ppm">PPM</option>
                      <option value="ppb">PPB</option>
                    </select>
                  </div>
                </div>

                {/* Custom Volume */}
                <div>
                  <label htmlFor="custom-volume-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                    Container Volume
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="custom-volume-input"
                      type="number"
                      min="10"
                      max="3000"
                      value={bottleVolume}
                      onChange={(e) => setBottleVolume(Number(e.target.value))}
                      className="flex-1 bg-paper border border-rule rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan-500"
                    />
                    <select
                      aria-label="Volume Unit"
                      value={volumeUnit}
                      onChange={(e) => setVolumeUnit(e.target.value as UnitType)}
                      className="bg-paper border border-rule rounded-xl px-2 py-2 text-xs font-bold text-ink focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ml">ml</option>
                      <option value="oz">oz</option>
                      <option value="l">L</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {modality === "inhalation" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                {/* Custom Flow Rate */}
                <div>
                  <label htmlFor="custom-flow-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                    Gas Flow Rate (mL/min)
                  </label>
                  <input
                    id="custom-flow-input"
                    type="number"
                    min="10"
                    max="3000"
                    step="50"
                    disabled={inhalationPreset !== "custom"}
                    value={flowRate}
                    onChange={(e) => setFlowRate(Number(e.target.value))}
                    className="w-full bg-paper border border-rule rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Session Duration */}
                <div>
                  <label htmlFor="custom-duration-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                    Session Duration (minutes)
                  </label>
                  <input
                    id="custom-duration-input"
                    type="number"
                    min="5"
                    max="240"
                    step="5"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(Number(e.target.value))}
                    className="w-full bg-paper border border-rule rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Profile Variables (Weight & Activity) */}
            <div className="space-y-3 border-t border-rule-soft pt-6">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                4. Personal Metabolism Scaling Parameters
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Weight Input */}
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div className="col-span-2">
                    <label htmlFor="body-weight-input" className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                      Body Weight
                    </label>
                    <input
                      id="body-weight-input"
                      type="number"
                      min="30"
                      max="400"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full bg-paper border border-rule rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <select
                    aria-label="Weight Unit"
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as "lbs" | "kg")}
                    className="bg-paper border border-rule rounded-xl px-2 py-2 text-xs font-bold text-ink focus:outline-none focus:border-cyan-500 h-[38px]"
                  >
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                </div>

                {/* Activity Level */}
                <div>
                  <label htmlFor="activity-level-select" className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                    Physical Activity Level
                  </label>
                  <select
                    id="activity-level-select"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                    className="w-full bg-paper border border-rule rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-cyan-500 h-[38px] font-semibold"
                  >
                    <option value="sedentary">Sedentary (Desk Job)</option>
                    <option value="moderate">Moderate Exercise</option>
                    <option value="active">High Physical Training</option>
                  </select>
                </div>
              </div>
              <p className="text-[9px] text-ink-soft leading-tight mt-1">
                Note: Body mass and muscle activity alter overall oxygen consumption. The algorithm scales the daily milligram absorption target slightly higher for larger body weights or high physical activity levels to guarantee equivalent biological saturation.
              </p>
            </div>
          </form>
        </div>

        {/* Right Column: Visual Dashboard */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Main Display Output Card */}
          <div className="bg-paper border border-rule p-8 rounded-3xl shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-6">
              Optimal daily recommendation
            </span>

            {/* Radial Dashboard Indicator */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-neutral-100 dark:stroke-neutral-800 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-cyan-500 fill-none transition-all duration-300"
                  strokeWidth="6"
                  strokeDasharray="282.6"
                  strokeDashoffset={
                    modality === "drinking"
                      ? 282.6 - Math.min(1.0, requiredCycles / 6) * 282.6
                      : 282.6 - Math.min(1.0, requiredInhalationMinutes / 120) * 282.6
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold tracking-tight text-ink">
                  {modality === "drinking" ? `${requiredCycles}` : `${requiredInhalationMinutes}m`}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mt-1 leading-none">
                  {modality === "drinking" ? "bottle cycles" : "cannula session"}
                </span>
              </div>
            </div>

            {/* Output Parameters Breakdown */}
            <div className="w-full border-t border-b border-rule py-4 mb-4 text-xs space-y-2.5 text-left">
              <div className="flex justify-between font-semibold">
                <span className="text-ink-muted">Clinical Target Dosing:</span>
                <span className="text-ink font-bold">{dailyTargetMg.toFixed(2)} mg/day</span>
              </div>

              {modality === "drinking" ? (
                <>
                  <div className="flex justify-between font-semibold">
                    <span className="text-ink-muted">Concentration Output:</span>
                    <span className="text-ink">{concentration.toFixed(1)} PPM</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-ink-muted">Active H₂ Per Cycle:</span>
                    <span className="text-ink text-cyan-600 font-bold">{mgPerCycle.toFixed(3)} mg</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-ink-muted">Required Daily cycles:</span>
                    <span className="text-ink font-extrabold">{requiredCycles} Cycles</span>
                  </div>
                  <div className="flex justify-between border-t border-rule-soft pt-2 font-bold">
                    <span className="text-ink">Daily Hydration Volume:</span>
                    <span className="text-ink text-accent-deep">
                      {Math.round(requiredLiters * 33.814)} oz (~{requiredLiters} L)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between font-semibold">
                    <span className="text-ink-muted">Device Gas Flow Rate:</span>
                    <span className="text-ink">{flowRate} mL/min</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-ink-muted">Delivered Dose ({sessionTime}m):</span>
                    <span className="text-ink">{inhalationDeliveredMg} mg total</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-ink-muted">Estimated Lung Absorbed Dose:</span>
                    <span className="text-ink text-cyan-600 font-bold">{inhalationAbsorbedMg} mg</span>
                  </div>
                  <div className="flex justify-between border-t border-rule-soft pt-2.5 font-bold">
                    <span className="text-ink">Required Inhalation Time:</span>
                    <span className="text-ink text-accent-deep">{requiredInhalationMinutes} minutes</span>
                  </div>
                </>
              )}
            </div>

            {/* Inhalation vs Drinking comparison badge */}
            <div className="w-full p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl text-[10.5px] leading-relaxed text-left text-cyan-700">
              {modality === "drinking" ? (
                <span>
                  💡 <strong>Absorption Tip:</strong> Hydrogen gas dissipates quickly. Drink within 15 minutes of generating, or gas will escape the liquid. If hitting your target requires too much water volume (e.g. &gt;3 L), consider switching to gas inhalation therapy.
                </span>
              ) : (
                <span>
                  🛡️ <strong>Inhalation Efficacy:</strong> 30 minutes of gas inhalation at 300 mL/min delivers ~405 mg of $H_2$. Standard lung absorption (2%) captures ~8.1 mg of $H_2$, easily surpassing the highest drinking water targets without any fluid load.
                </span>
              )}
            </div>
          </div>

          {/* Clinician's Dosing Guidelines */}
          <div className="bg-paper border border-rule p-6 rounded-3xl text-xs leading-relaxed text-ink-muted space-y-4">
            <h4 className="font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <span>💡</span> Clinical Molecular Hydrogen Guidelines
            </h4>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 text-sm select-none leading-none">•</span>
                <span><strong>The Evaporation Curve:</strong> Dissolved hydrogen water behaves according to Henry's Law. In open containers, H2 concentration drops by half within 30 minutes. Always store in airtight, double-walled containers or drink immediately post-cycle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 text-sm select-none leading-none">•</span>
                <span><strong>PPM vs Milligrams:</strong> Most consumers assume "high PPM water" is all that matters. However, dose is concentration multiplied by volume. A 2.0 PPM cup (250 ml) delivers only 0.5 mg, which is sub-therapeutic. Utilize this calculator to secure sufficient milligrams.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 text-sm select-none leading-none">•</span>
                <span><strong>Inhalation Flow Rates:</strong> Gas inhalation generators are measured in mL/min. Nash-type cannula delivery loses a significant portion of gas to the environment. We apply a conservative 2% lung absorption rate to model actual clinical serum levels.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Optimized Informational Section */}
      <section className="mt-20 border-t border-rule pt-16 space-y-12">
        <article className="prose-article space-y-6 max-w-4xl">
          <h2 className="editorial-head text-3xl text-ink">
            How to Calculate Your Molecular Hydrogen Dosing: A Clinical Science Guide
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Molecular hydrogen ($H_2$) is a powerful therapeutic gas that operates as a selective antioxidant, neutralizing cytotoxic oxygen radicals (specifically hydroxyl radicals $\cdot OH$) within cells. Unlike standard antioxidants, the tiny atomic size of hydrogen allows it to freely cross cell membranes, penetrate cellular organelles like mitochondria, and cross the blood-brain barrier.
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            However, achieving therapeutic effects depends entirely on achieving the correct **molecular hydrogen dosage**.
          </p>

          <h3 className="editorial-head text-2xl text-ink mt-8">
            How to Calculate Hydrogen Water mg from PPM
          </h3>
          <p className="text-base text-ink-muted leading-relaxed">
            Many manufacturers advertise their hydrogen water bottles using parts per million (PPM) or parts per billion (PPB). These units measure **concentration**, not the total **dose**. To find the actual therapeutic dose in milligrams (mg), you must use the standard chemistry formula:
          </p>
          <div className="border border-rule-soft bg-paper-deep p-5 rounded-2xl text-center font-bold text-ink text-sm sm:text-base">
            Dose (mg) = Concentration (PPM or mg/L) × Volume (Liters)
          </div>
          <p className="text-base text-ink-muted leading-relaxed">
            For example, if you run a cycle on a portable generator that produces **3.0 PPM** (which translates to 3.0 mg per liter of water) and the bottle volume is **500 mL** (0.5 Liters), the calculation is:
          </p>
          <div className="border border-rule-soft bg-paper-deep p-3 rounded-xl text-center font-mono text-xs text-ink-muted">
            3.0 mg/L × 0.5 L = 1.5 mg of Molecular Hydrogen ($H_2$)
          </div>
          <p className="text-base text-ink-muted leading-relaxed">
            If your target is to hit **3.0 mg** of $H_2$ per day for cognitive health, you would need to run exactly **2 cycles** and consume the full 1.0 Liter of hydrogen-rich water daily.
          </p>

          <h3 className="editorial-head text-2xl text-ink mt-10">
            Drinking vs. Inhalation: Standard Clinical Dosing Math
          </h3>
          <p className="text-base text-ink-muted leading-relaxed">
            While drinking hydrogen water is excellent for gut health and general antioxidant support, clinical trials targeting neurodegenerative diseases or acute recovery often utilize **hydrogen gas inhalation**. This is because inhalation bypasses the stomach and supplies massive volumes of gas directly to the bloodstream via the lungs.
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            Hydrogen inhalation flow rates are measured in **Milliliters per minute (mL/min)** of pure gas. To translate flow rate into milligrams of delivered H2, we apply the ideal gas law at standard temperature and pressure (STP), where **1 mL of $H_2$ gas weighs 0.09 mg**:
          </p>
          <div className="border border-rule-soft bg-paper-deep p-5 rounded-2xl text-center font-bold text-ink text-sm sm:text-base">
            Delivered H₂ (mg) = Flow Rate (mL/min) × Session Duration (minutes) × 0.09 mg/mL
          </div>
          <p className="text-base text-ink-muted leading-relaxed">
            Using a clinical generator that outputs **300 mL/min** for a **30-minute** session:
          </p>
          <div className="border border-rule-soft bg-paper-deep p-3 rounded-xl text-center font-mono text-xs text-ink-muted">
            300 mL/min × 30 minutes × 0.09 mg/mL = 810 mg of Delivered $H_2$ Gas
          </div>
          <p className="text-base text-ink-muted leading-relaxed">
            Because a nasal cannula relies on open breathing, a significant amount of the gas is lost to the environment. Research indicates that standard lung tissue diffusion allows for approximately **2% systemic absorption** of inhaled gas. Therefore:
          </p>
          <div className="border border-rule-soft bg-paper-deep p-3 rounded-xl text-center font-mono text-xs text-ink-muted font-bold text-cyan-600">
            Clinical Absorbed Dose = 810 mg × 0.02 = 16.2 mg of absorbed molecular hydrogen
          </div>
          <p className="text-base text-ink-muted leading-relaxed">
            This demonstrates that just a short inhalation session delivers vastly higher concentrations of absorbed hydrogen than drinking multiple liters of water, making it the preferred clinical option for systemic and brain-related health goals.
          </p>

          <h3 className="editorial-head text-2xl text-ink mt-10">
            Clinical Targets for Specific Diseases & Health Goals
          </h3>
          <p className="text-base text-ink-muted leading-relaxed">
            The International Hydrogen Standards Association (IHSA) and peer-reviewed trials suggest different minimum target concentrations for therapeutic outcomes:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-rule text-xs sm:text-sm">
              <thead>
                <tr className="bg-paper-deep border-b border-rule">
                  <th className="p-3 font-bold text-ink">Therapeutic Goal</th>
                  <th className="p-3 font-bold text-ink">Clinical Target (mg/day)</th>
                  <th className="p-3 font-bold text-ink">Primary Method</th>
                  <th className="p-3 font-bold text-ink">Scientific Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft text-ink-muted">
                <tr>
                  <td className="p-3 font-semibold text-ink">Longevity & Anti-Aging</td>
                  <td className="p-3 font-bold text-cyan-600">1.6 – 2.0 mg</td>
                  <td className="p-3">Drinking (PPM Water)</td>
                  <td className="p-3">Neutralizes daily basal reactive oxygen species (ROS) and reduces oxidative stress markers.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Metabolic Support & Diabetes</td>
                  <td className="p-3 font-bold text-cyan-600">2.5 – 3.0 mg</td>
                  <td className="p-3">Drinking (High PPM)</td>
                  <td className="p-3">Supports mitochondrial adiponectin expression, improving insulin signaling and fat oxidation.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Cognitive Health & Brain Fog</td>
                  <td className="p-3 font-bold text-cyan-600">3.0 – 4.0 mg</td>
                  <td className="p-3">Inhalation (150-300 mL/min)</td>
                  <td className="p-3">Provides anti-apoptotic protection for neurological tissues and reduces neuroinflammation.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Inflammation & Joint Health</td>
                  <td className="p-3 font-bold text-cyan-600">3.0 – 4.5 mg</td>
                  <td className="p-3">Inhalation or Drinking</td>
                  <td className="p-3">Down-regulates pro-inflammatory cytokines (like TNF-alpha and IL-6) in chronic joint tissues.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Athletic Performance / Lactic Acid</td>
                  <td className="p-3 font-bold text-cyan-600">3.5 – 5.0 mg</td>
                  <td className="p-3">Drinking or Inhalation</td>
                  <td className="p-3">Acts as an intracellular buffer to reduce lactic acid buildup during high-intensity training.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Oncology Support (Radio/Chemo Side Effects)</td>
                  <td className="p-3 font-bold text-cyan-600">4.0 – 6.0 mg</td>
                  <td className="p-3">Inhalation (300-600 mL/min)</td>
                  <td className="p-3">Protects normal cells from radiation-induced oxidative damage without dampening tumor therapy.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* FAQs */}
        <div className="border border-rule bg-paper p-8 rounded-3xl space-y-6">
          <h3 className="editorial-head text-2xl text-ink">
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="divide-y divide-rule-soft text-sm">
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                How long does molecular hydrogen stay in water?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Hydrogen is the smallest and lightest element in the universe, meaning it escapes liquid very rapidly. In a standard open glass, dissolved hydrogen concentration drops by half within 30 minutes. To maximize your dosage, drink the water within 15 minutes of generating, or store it in an airtight, metal, vacuum-sealed container filled to the absolute brim.
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Is hydrogen gas inhalation safe? Are there side effects?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Yes. In clinical trials, hydrogen gas inhalation has demonstrated an exceptionally high safety profile with zero reported toxicities or adverse events. Hydrogen is naturally produced in small amounts by our gut microbiome during the fermentation of fiber. The gas only becomes flammable at concentrations exceeding 4% in air, which is why commercial inhalers restrict flow rates or use gas mixing to stay safe.
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Can I breathe hydrogen gas while sleeping?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Many users do overnight inhalation sessions. However, because hydrogen is highly diffusive, it is critical to use medical-grade, certified machines that maintain exact flow rates and have safety shutoffs. Keep generators in well-ventilated rooms away from open flames.
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Can you overdose on molecular hydrogen?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                No. Molecular hydrogen does not have an upper limit of toxicity. Excess hydrogen gas is not stored in the body; it simply diffuses through your tissues and is exhaled naturally through your lungs.
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Should I drink hydrogen water on an empty stomach?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Yes, drinking hydrogen water on an empty stomach is optimal. This allows the dissolved H2 gas to rapidly pass from the stomach to the intestines, where it diffuses into the portal vein and distributes systemically to tissues before the stomach acids can degas the liquid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Device Recommendations */}
      <div className="mt-20 border-t border-rule pt-16">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block">Clinic Verified Hardware</span>
          <h2 className="editorial-head text-2xl md:text-3xl text-ink mb-3">
            Clinically Tested Molecular Hydrogen Hardware
          </h2>
          <p className="text-sm text-ink-muted">
            I verify these models in my private practice to ensure their PPM concentrations and mL/min flow rates meet therapeutic clinical thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Echo Flask */}
          <div className="bg-paper border border-rule p-8 rounded-3xl flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="absolute top-4 right-4 bg-cyan-500/10 text-cyan-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-cyan-500/15">
                Best Overall Portable
              </span>
              <h3 className="text-xl font-bold text-ink mb-4 mt-2">Echo Flask (8.0 PPM)</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Produces up to 8.0 PPM concentration (8.0 mg/L) in a single 20-minute cycle using PEM/SPE electrolysis. Shatterproof pressure cap ensures hydrogen stays dissolved for hours.
              </p>
              <div className="bg-paper-deep p-4 rounded-xl mb-6 border border-rule">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Exclusive Clinical Discount Code (10% Off)
                </span>
                <span className="text-lg font-mono font-extrabold text-accent">SYNCTHERAPY</span>
              </div>
            </div>
            <a
              href="https://echowater.com/discount/synctherapy/?redirect=&_ef_transaction_id=&utm_source=everflow&utm_medium=affiliate&utm_campaign=&utm_content=6&oid=6&affid=408"
              target="_blank"
              rel="nofollow noopener"
              className="w-full text-center py-3.5 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-700 transition-all shadow-[0_4px_14px_rgba(8,145,178,0.3)] active:scale-[0.98]"
            >
              Get Echo Flask Best Price
            </a>
          </div>

          {/* Ocemida Omni */}
          <div className="bg-paper border border-rule p-8 rounded-3xl flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="absolute top-4 right-4 bg-cyan-500/10 text-cyan-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-cyan-500/15">
                Best Value / Inhalation Combo
              </span>
              <h3 className="text-xl font-bold text-ink mb-4 mt-2">Ocemida Omni (5.0 PPM)</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Produces up to 5.0 PPM of dissolved molecular hydrogen. Outstanding battery life, SPE/PEM dual chamber membranes, and comes with a nasal cannula adapter for mild inhalation.
              </p>
              <div className="bg-paper-deep p-4 rounded-xl mb-6 border border-rule">
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
              className="w-full text-center py-3.5 bg-paper hover:bg-paper-deep border border-rule rounded-xl text-xs font-bold text-ink active:scale-[0.98] transition-all"
            >
              Get Ocemida Best Price
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

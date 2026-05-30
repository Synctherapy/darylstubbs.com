"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type DeviceType = "panel" | "mask" | "belt" | "cap" | "wand";
type PanelPreset = "custom" | "mitopro750" | "rougetabletop" | "kalapro" | "infrarediflex" | "biomax900" | "hoogahg300" | "joovvsolo" | "blockbluelight";
type MaskPreset = "custom" | "omnilux" | "currentbody" | "ddg" | "qure" | "higherdose";
type BeltPreset = "custom" | "mitobelt" | "infrarediwrap" | "nushape" | "dnavibe";
type CapPreset = "custom" | "irestore" | "irestoreessential" | "capillus" | "theradome";
type WandPreset = "custom" | "solawave" | "mitospot" | "lumawand" | "joovvgo";
type TargetPreset = "skin" | "muscle" | "joint" | "scalp" | "custom";

interface PresetInfo {
  label: string;
  irradiance: number; // Stated base irradiance at test distance (6" for panels, contact for others)
}

export function RedLightCalculatorClient() {
  // 1. Device Type & Selection
  const [deviceType, setDeviceType] = useState<DeviceType>("panel");

  // Presets based on device type
  const [panelModel, setPanelModel] = useState<PanelPreset>("mitopro750");
  const [maskModel, setMaskModel] = useState<MaskPreset>("omnilux");
  const [beltModel, setBeltModel] = useState<BeltPreset>("mitobelt");
  const [capModel, setCapModel] = useState<CapPreset>("irestore");
  const [wandModel, setWandModel] = useState<WandPreset>("solawave");

  // Custom irradiance inputs
  const [customPanelIrr, setCustomPanelIrr] = useState<number>(100);
  const [customMaskIrr, setCustomMaskIrr] = useState<number>(30);
  const [customBeltIrr, setCustomBeltIrr] = useState<number>(50);
  const [customCapIrr, setCustomCapIrr] = useState<number>(15);
  const [customWandIrr, setCustomWandIrr] = useState<number>(15);

  // Active base irradiance (derived from selection)
  const [baseIrradiance, setBaseIrradiance] = useState<number>(100);

  // Wavelength Selection (Both, Red Only, NIR Only)
  const [wavelengthMode, setWavelengthMode] = useState<"both" | "red" | "nir">("both");

  // 2. Target Dose and Treatment Presets
  const [targetPreset, setTargetPreset] = useState<TargetPreset>("muscle");
  const [targetDose, setTargetDose] = useState<number>(20);

  // 3. Distance (Panels and Wands only)
  const [distance, setDistance] = useState<number>(6); 

  // 4. Advanced Inputs
  const [skinType, setSkinType] = useState<number>(2); // Fitzpatrick I to VI
  const [isMarketingClaims, setIsMarketingClaims] = useState<boolean>(true);
  const [isReflectionCompensation, setIsReflectionCompensation] = useState<boolean>(true);

  // Timer State
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [timerComplete, setTimerComplete] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Presets Databases
  const panelPresets: Record<Exclude<PanelPreset, "custom">, PresetInfo> = {
    mitopro750: { label: "Mito Pro X 750", irradiance: 100 },
    rougetabletop: { label: "Rouge G4 Tabletop", irradiance: 120 },
    kalapro: { label: "Kala Therapy Pro", irradiance: 85 },
    infrarediflex: { label: "Infraredi Flex", irradiance: 110 },
    biomax900: { label: "PlatinumLED BioMax 900", irradiance: 100 },
    hoogahg300: { label: "Hooga HG300", irradiance: 80 },
    joovvsolo: { label: "Joovv Solo G3", irradiance: 100 },
    blockbluelight: { label: "BlockBlueLight PowerPanel", irradiance: 100 },
  };

  const maskPresets: Record<Exclude<MaskPreset, "custom">, PresetInfo> = {
    omnilux: { label: "Omnilux Contour Face", irradiance: 30 },
    currentbody: { label: "CurrentBody Skin Mask", irradiance: 30 },
    ddg: { label: "Dr. Dennis Gross Spectralite", irradiance: 35 },
    qure: { label: "Qure LED Mask", irradiance: 40 },
    higherdose: { label: "HigherDOSE Face Mask", irradiance: 30 },
  };

  const beltPresets: Record<Exclude<BeltPreset, "custom">, PresetInfo> = {
    mitobelt: { label: "Mito Red Light Belt", irradiance: 50 },
    infrarediwrap: { label: "Infraredi Body Wrap", irradiance: 55 },
    nushape: { label: "Nushape Lipo Wrap", irradiance: 37 },
    dnavibe: { label: "DNA Vibe Jazz Band", irradiance: 30 },
  };

  const capPresets: Record<Exclude<CapPreset, "custom">, PresetInfo> = {
    irestore: { label: "iRestore Professional", irradiance: 15 },
    irestoreessential: { label: "iRestore Essential", irradiance: 10 },
    capillus: { label: "CapillusPro Laser Cap", irradiance: 20 },
    theradome: { label: "Theradome LH80 PRO", irradiance: 18 },
  };

  const wandPresets: Record<Exclude<WandPreset, "custom">, PresetInfo> = {
    solawave: { label: "Solawave Radiant Wand", irradiance: 12 },
    mitospot: { label: "Mito Red Light Spot", irradiance: 80 },
    lumawand: { label: "Luma Wand", irradiance: 15 },
    joovvgo: { label: "Joovv Go 2.0", irradiance: 50 },
  };

  const dosePresets: Record<Exclude<TargetPreset, "custom">, number> = {
    skin: 6,      // Superficial skin treatments (anti-aging, wrinkles, acne): 3-10 J/cm²
    scalp: 8,     // Scalp stimulation / hair growth: 6-12 J/cm²
    muscle: 20,    // Muscle recovery & performance: 15-25 J/cm²
    joint: 30,     // Deep joint inflammation & pain: 25-45 J/cm²
  };

  // Sync default target dose and distance when device type changes
  useEffect(() => {
    if (deviceType === "panel") {
      setTargetPreset("muscle");
      setDistance(6);
      setWavelengthMode("both");
    } else if (deviceType === "mask") {
      setTargetPreset("skin");
      setDistance(0);
      setWavelengthMode("both");
    } else if (deviceType === "belt") {
      setTargetPreset("joint");
      setDistance(0);
      setWavelengthMode("both");
    } else if (deviceType === "cap") {
      setTargetPreset("scalp");
      setDistance(0);
      setWavelengthMode("red"); // Caps are usually Red only (650nm)
    } else if (deviceType === "wand") {
      setTargetPreset("skin");
      setDistance(0);
      setWavelengthMode("red"); // Wands are mostly Red only
    }
    setTimerRunning(false);
  }, [deviceType]);

  // Sync base irradiance when device type, presets, or custom inputs change
  useEffect(() => {
    if (deviceType === "panel") {
      if (panelModel !== "custom") {
        setBaseIrradiance(panelPresets[panelModel].irradiance);
      } else {
        setBaseIrradiance(customPanelIrr);
      }
    } else if (deviceType === "mask") {
      if (maskModel !== "custom") {
        setBaseIrradiance(maskPresets[maskModel].irradiance);
      } else {
        setBaseIrradiance(customMaskIrr);
      }
    } else if (deviceType === "belt") {
      if (beltModel !== "custom") {
        setBaseIrradiance(beltPresets[beltModel].irradiance);
      } else {
        setBaseIrradiance(customBeltIrr);
      }
    } else if (deviceType === "cap") {
      if (capModel !== "custom") {
        setBaseIrradiance(capPresets[capModel].irradiance);
      } else {
        setBaseIrradiance(customCapIrr);
      }
    } else if (deviceType === "wand") {
      if (wandModel !== "custom") {
        setBaseIrradiance(wandPresets[wandModel].irradiance);
      } else {
        setBaseIrradiance(customWandIrr);
      }
    }
  }, [deviceType, panelModel, maskModel, beltModel, capModel, wandModel, customPanelIrr, customMaskIrr, customBeltIrr, customCapIrr, customWandIrr]);

  // Sync target dose when preset changes
  useEffect(() => {
    if (targetPreset !== "custom") {
      setTargetDose(dosePresets[targetPreset]);
    }
  }, [targetPreset]);

  // Calculations
  // 1. Distance drop-off scaling
  let distanceFactor = 1.0;
  if (deviceType === "panel") {
    if (distance === 0) {
      distanceFactor = 1.5; // Highly concentrated irradiance on contact
    } else if (distance <= 6) {
      distanceFactor = 1.5 - (0.5 * (distance / 6));
    } else {
      distanceFactor = 6 / distance;
    }
  } else if (deviceType === "wand") {
    if (distance === 0) {
      distanceFactor = 1.2;
    } else if (distance <= 3) {
      distanceFactor = 1.2 - (0.2 * (distance / 3));
    } else {
      distanceFactor = 3 / distance;
    }
  } else {
    distanceFactor = 1.0; // Locked to contact-based calibration
  }

  // 2. Wavelength active channels scaling
  const wavelengthFactor = (wavelengthMode === "red" || wavelengthMode === "nir") ? 0.5 : 1.0;

  const rawIrradianceAtDistance = baseIrradiance * distanceFactor * wavelengthFactor;

  // 3. Marketing power calibration correction
  const correctionFactor = isMarketingClaims ? 0.4 : 1.0;
  const actualIrradiance = Math.round(rawIrradianceAtDistance * correctionFactor * 10) / 10;

  // 4. Fitzpatrick skin type scaling for deep penetration
  const isDeepTreatment = targetPreset === "muscle" || targetPreset === "joint" || (targetPreset === "custom" && targetDose >= 15);
  let skinTypeFactor = 1.0;
  if (isDeepTreatment) {
    if (skinType === 3 || skinType === 4) {
      skinTypeFactor = 1.1; // +10% duration for moderate melanin absorption
    } else if (skinType === 5 || skinType === 6) {
      skinTypeFactor = 1.2; // +20% duration for high melanin absorption barrier
    }
  }

  // 5. Skin reflection factor
  // Non-contact devices (panels/wands at >0" distance) experience ~40-50% reflection loss
  const reflectionFactor = (isReflectionCompensation && (deviceType === "panel" || deviceType === "wand") && distance > 0) ? 1.5 : 1.0;

  // 6. Session duration calculations
  // Raw exposure time (ignoring biological barriers/skin reflections)
  const rawSeconds = Math.max(
    1,
    Math.round((targetDose * 1000) / (actualIrradiance || 1))
  );

  // Absorbed clinical time (fully adjusted for reflections and melanin barriers)
  const clinicalSeconds = Math.max(
    1,
    Math.round(((targetDose * 1000) / (actualIrradiance || 1)) * skinTypeFactor * reflectionFactor)
  );

  // Sync timer duration based on clinical (absorbed) calculation
  useEffect(() => {
    if (!timerRunning) {
      setTimeLeft(clinicalSeconds);
      setTotalDuration(clinicalSeconds);
      setTimerComplete(false);
    }
  }, [clinicalSeconds, timerRunning]);

  // Timer Hook
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerComplete(true);
            playAlertSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timeLeft]);

  // Web Audio alert chime
  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("Could not play sound:", e);
    }
  };

  const handleStartStop = () => {
    if (timerRunning) {
      setTimerRunning(false);
    } else {
      if (timeLeft <= 0) {
        setTimeLeft(clinicalSeconds);
      }
      setTimerComplete(false);
      setTimerRunning(true);
    }
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimeLeft(clinicalSeconds);
    setTimerComplete(false);
  };

  // Timer formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress circle mapping
  const strokeDashoffset = totalDuration > 0 
    ? 282.6 - (timeLeft / totalDuration) * 282.6 
    : 0;

  // Safety & Biphasic warnings
  const getBiphasicWarning = () => {
    if (targetPreset === "skin" && targetDose > 12) {
      return "⚠️ Biphasic Alert: Skin cells reach saturation quickly. Doses above 12 J/cm² are shown to cause a biphasic response (reducing collagen synthesis benefits). Consider reducing your target to 4–8 J/cm².";
    }
    if (targetPreset === "scalp" && targetDose > 15) {
      return "⚠️ Biphasic Alert: Hair follicle cells are sensitive to light saturation. Doses exceeding 15 J/cm² may trigger follicular fatigue and hinder hair growth stimulation. Consider 6–10 J/cm².";
    }
    if (isDeepTreatment && targetDose > 50) {
      return "⚠️ Biphasic Alert: Deep muscle/joint doses above 50 J/cm² trigger an inhibitory biological curve (Arndt-Schulz curve), diminishing recovery gains. Keep dosage below 45 J/cm².";
    }
    if (actualIrradiance < 5) {
      return "⚠️ Low Irradiance Alert: Stated intensity at this distance has dropped below the threshold needed for deep cellular penetration. Move closer or increase panel power.";
    }
    return null;
  };

  const biphasicWarning = getBiphasicWarning();

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
      <Link href="/tools" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-red-500 mb-8 transition-[color,transform] duration-150 active:scale-[0.98]">
        ← Back to Tools
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form & Inputs */}
        <div className="lg:col-span-7 bg-paper border border-rule p-8 rounded-3xl shadow-sm space-y-8">
          <div>
            <span className="text-[10px] font-bold text-accent-deep uppercase tracking-widest block mb-1">Clinical Photobiomodulation Tool</span>
            <h1 className="editorial-head text-3xl md:text-4xl text-ink mb-3">
              Clinical Red Light Therapy Dose & Time Calculator
            </h1>
            <p className="text-xs text-ink-muted leading-relaxed">
              Calculate your exact session time, Joules, and irradiance distance adjustments for your red light therapy panel, face mask, wrap, hair cap, or targeted wand. Avoid the biphasic dose response with clinician-approved RLT protocols.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Step 1: Device Form Factor Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                1. Select Device Form Factor
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: "panel", label: "🖥️ LED Panel", desc: "Adjustable distance" },
                  { id: "mask", label: "🎭 LED Face Mask", desc: "Contact only" },
                  { id: "belt", label: "Belt / Wrap", desc: "Contact only" },
                  { id: "cap", label: "🧢 Hair Cap", desc: "Contact only" },
                  { id: "wand", label: "🪄 Wand / Spot", desc: "0-3\" distance" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDeviceType(item.id as DeviceType)}
                    className={`p-3 border rounded-2xl text-left transition-all flex flex-col justify-between h-20 ${
                      deviceType === item.id
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className={`text-[9px] ${deviceType === item.id ? "text-white/80" : "text-ink-muted"}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Device Brand Presets */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                2. Select Your Device Profile
              </label>
              
              {deviceType === "panel" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(panelPresets).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPanelModel(key as PanelPreset)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                        panelModel === key ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPanelModel("custom")}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                      panelModel === "custom" ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    Custom Panel
                  </button>
                </div>
              )}

              {deviceType === "mask" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(maskPresets).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMaskModel(key as MaskPreset)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                        maskModel === key ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMaskModel("custom")}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                      maskModel === "custom" ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    Custom Mask
                  </button>
                </div>
              )}

              {deviceType === "belt" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(beltPresets).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBeltModel(key as BeltPreset)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                        beltModel === key ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBeltModel("custom")}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                      beltModel === "custom" ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    Custom Wrap / Belt
                  </button>
                </div>
              )}

              {deviceType === "cap" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(capPresets).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCapModel(key as CapPreset)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                        capModel === key ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCapModel("custom")}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                      capModel === "custom" ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    Custom Cap
                  </button>
                </div>
              )}

              {deviceType === "wand" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(wandPresets).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setWandModel(key as WandPreset)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                        wandModel === key ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWandModel("custom")}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                      wandModel === "custom" ? "bg-accent text-white border-accent shadow-sm" : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    Custom Wand / Spot
                  </button>
                </div>
              )}
            </div>

            {/* Custom Irradiance Inputs */}
            {deviceType === "panel" && panelModel === "custom" && (
              <div className="p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                <label htmlFor="custom-panel-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Stated Panel Irradiance at 6 Inches (mW/cm²)
                </label>
                <input
                  id="custom-panel-input"
                  type="number"
                  min="10"
                  max="300"
                  value={customPanelIrr}
                  onChange={(e) => setCustomPanelIrr(Number(e.target.value))}
                  className="w-full bg-paper border border-rule rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {deviceType === "mask" && maskModel === "custom" && (
              <div className="p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                <label htmlFor="custom-mask-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Stated Mask Irradiance at Contact (mW/cm²)
                </label>
                <input
                  id="custom-mask-input"
                  type="number"
                  min="5"
                  max="150"
                  value={customMaskIrr}
                  onChange={(e) => setCustomMaskIrr(Number(e.target.value))}
                  className="w-full bg-paper border border-rule rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {deviceType === "belt" && beltModel === "custom" && (
              <div className="p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                <label htmlFor="custom-belt-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Stated Belt Irradiance at Contact (mW/cm²)
                </label>
                <input
                  id="custom-belt-input"
                  type="number"
                  min="10"
                  max="200"
                  value={customBeltIrr}
                  onChange={(e) => setCustomBeltIrr(Number(e.target.value))}
                  className="w-full bg-paper border border-rule rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {deviceType === "cap" && capModel === "custom" && (
              <div className="p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                <label htmlFor="custom-cap-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Stated Cap Irradiance at Contact (mW/cm²)
                </label>
                <input
                  id="custom-cap-input"
                  type="number"
                  min="2"
                  max="100"
                  value={customCapIrr}
                  onChange={(e) => setCustomCapIrr(Number(e.target.value))}
                  className="w-full bg-paper border border-rule rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {deviceType === "wand" && wandModel === "custom" && (
              <div className="p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                <label htmlFor="custom-wand-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Stated Wand Irradiance at Contact (mW/cm²)
                </label>
                <input
                  id="custom-wand-input"
                  type="number"
                  min="2"
                  max="150"
                  value={customWandIrr}
                  onChange={(e) => setCustomWandIrr(Number(e.target.value))}
                  className="w-full bg-paper border border-rule rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {/* Wavelength Mode Switcher */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                3. Active Light Spectrum / Channels
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "both", label: "Red + NIR", desc: "Full Power (Both Channels)" },
                  { id: "red", label: "Red Only (660nm)", desc: "Half Power (Red Switch)" },
                  { id: "nir", label: "NIR Only (850nm)", desc: "Half Power (NIR Switch)" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setWavelengthMode(mode.id as "both" | "red" | "nir")}
                    className={`p-3 border rounded-xl text-left transition-all flex flex-col justify-between h-20 ${
                      wavelengthMode === mode.id
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="text-xs font-bold block">{mode.label}</span>
                    <span className={`text-[8px] leading-tight ${wavelengthMode === mode.id ? "text-white/80" : "text-ink-muted"}`}>
                      {mode.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Slider (Conditional for panels and wands) */}
            {(deviceType === "panel" || deviceType === "wand") ? (
              <div className="space-y-3 animate-reveal-up">
                <div className="flex justify-between items-baseline">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    4. Treatment Distance
                  </label>
                  <span className="text-xs font-bold text-accent-deep">
                    {distance === 0 ? "Contact (0\")" : `${distance} inches`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={deviceType === "panel" ? "24" : "6"}
                  step="1"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-2 bg-rule-soft rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[9px] text-ink-muted font-semibold">
                  <span>0" (Contact)</span>
                  {deviceType === "panel" ? (
                    <>
                      <span>6" (Standard)</span>
                      <span>12" (Medium)</span>
                      <span>18" (Wide)</span>
                      <span>24" (Distanced)</span>
                    </>
                  ) : (
                    <>
                      <span>2" (Near-proximity)</span>
                      <span>4" (Glow-area)</span>
                      <span>6" (Max)</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-paper-deep border border-rule border-dashed rounded-2xl text-xs text-ink-muted">
                ℹ️ <strong>Distance Locked to Contact (0"):</strong> Contact-based wearable devices (masks, wraps, caps) are designed to be worn directly on the skin. Scaled distance formulas are bypassed.
              </div>
            )}

            {/* Advanced Physics / Calibration Adjustments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Marketing Claims Toggle */}
              <div className="bg-paper-deep border border-rule p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Irradiance Calibrator
                    </label>
                    <span className="text-[10px] text-ink-muted block mt-0.5">
                      Compensate for solar meter inflating claims.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMarketingClaims((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isMarketingClaims ? "bg-accent" : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isMarketingClaims ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                {isMarketingClaims ? (
                  <div className="text-[10px] leading-relaxed text-amber-700 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl">
                    ⚠️ Solar meters inflate LED outputs. Applying a 60% reduction (`0.4x` multiplier) to estimate laboratory spectrometer irradiance.
                  </div>
                ) : (
                  <div className="text-[10px] leading-relaxed text-emerald-700 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
                    ✓ Using raw manufacturer specs. Only select if tested with a laboratory spectrometer.
                  </div>
                )}
              </div>

              {/* Skin Reflection Toggle */}
              <div className="bg-paper-deep border border-rule p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Skin Reflection Compensation
                    </label>
                    <span className="text-[10px] text-ink-muted block mt-0.5">
                      Compensate for light bounced off skin.
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={deviceType !== "panel" && deviceType !== "wand" || distance === 0}
                    onClick={() => setIsReflectionCompensation((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      (deviceType !== "panel" && deviceType !== "wand" || distance === 0) ? "opacity-50 cursor-not-allowed bg-neutral-200" :
                      isReflectionCompensation ? "bg-accent" : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isReflectionCompensation && (deviceType === "panel" || deviceType === "wand") && distance > 0 ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                {(deviceType === "panel" || deviceType === "wand") && distance > 0 ? (
                  isReflectionCompensation ? (
                    <div className="text-[10px] leading-relaxed text-amber-700 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl">
                      ⚡ <strong>Reflection loss active:</strong> Non-contact beams bounce off skin by ~40-50%. Adding a `1.5x` duration modifier to ensure equivalent **absorbed energy**.
                    </div>
                  ) : (
                    <div className="text-[10px] leading-relaxed text-neutral-600 bg-neutral-500/5 border border-neutral-500/10 p-2.5 rounded-xl">
                      ✓ Calculating purely for **delivered dose** leaving the device, neglecting reflection barriers.
                    </div>
                  )
                ) : (
                  <div className="text-[10px] leading-relaxed text-neutral-500 bg-neutral-500/5 border border-neutral-500/10 p-2.5 rounded-xl">
                    ✓ Direct Contact: Wearables/zero-distance locks light in. Reflection is negligible.
                  </div>
                )}
              </div>
            </div>

            {/* Step 5: Treatment Target Fluence */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                5. Select Treatment Goal / Target Area
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: "skin", label: "Skin Rejuvenation", desc: "6 J/cm²" },
                  { id: "scalp", label: "Scalp / Hair", desc: "8 J/cm²" },
                  { id: "muscle", label: "Muscle Recovery", desc: "20 J/cm²" },
                  { id: "joint", label: "Deep Joints", desc: "30 J/cm²" },
                  { id: "custom", label: "Custom", desc: "Manual" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetPreset(item.id as TargetPreset)}
                    className={`p-2.5 border rounded-2xl text-left transition-all flex flex-col justify-between h-20 ${
                      targetPreset === item.id
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-paper border-rule-soft hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{item.label}</span>
                    <span className={`text-[9px] ${targetPreset === item.id ? "text-white/80" : "text-ink-muted"}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dose Input */}
            {targetPreset === "custom" && (
              <div className="p-5 bg-paper-deep border border-rule rounded-2xl animate-reveal-up">
                <label htmlFor="custom-dose-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Target Energy Density (Joules/cm²)
                </label>
                <input
                  id="custom-dose-input"
                  type="number"
                  min="0.5"
                  max="120"
                  step="0.5"
                  value={targetDose}
                  onChange={(e) => setTargetDose(Number(e.target.value))}
                  className="w-full bg-paper border border-rule rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {/* Step 6: Fitzpatrick Scale */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                6. Fitzpatrick Skin Phototype (Melanin Correction)
              </label>
              <p className="text-[10px] text-ink-muted leading-relaxed">
                Melanin absorbs photons before they reach deep tissue. For muscle and joint goals, the clinical algorithm increases exposure duration for darker skin types to guarantee equal target energy density delivery.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {fitzpatrickScales.map((scale) => (
                  <button
                    key={scale.type}
                    type="button"
                    onClick={() => setSkinType(scale.type)}
                    className={`p-2.5 border rounded-xl text-center flex flex-col items-center gap-1.5 transition-all ${
                      skinType === scale.type
                        ? "border-accent ring-2 ring-accent/25"
                        : "border-rule-soft hover:border-ink/20"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${scale.color} border border-black/10`} />
                    <div>
                      <span className="text-[10px] font-bold block text-ink">{scale.label}</span>
                      <span className="text-[8px] text-ink-muted block scale-90 whitespace-nowrap">{scale.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Calculations & Interactive Timer */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Output Card */}
          <div className="bg-paper border border-rule p-8 rounded-3xl shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
            {timerComplete && (
              <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center p-6 text-white z-10 animate-reveal-scale">
                <span className="text-5xl mb-3">✓</span>
                <h3 className="text-2xl font-bold mb-2">Session Complete!</h3>
                <p className="text-xs text-white/90 mb-6 max-w-xs leading-relaxed">
                  You have successfully delivered {targetDose} J/cm² of therapeutic light energy.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-white text-emerald-700 font-bold rounded-full text-xs shadow hover:scale-105 transition-transform"
                >
                  Reset Calculator
                </button>
              </div>
            )}

            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-6">
              Optimal Treatment Duration
            </span>

            {/* Radial Clock Visualization */}
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
                  className="stroke-accent fill-none transition-all duration-300"
                  strokeWidth="6"
                  strokeDasharray="282.6"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold tracking-tight text-ink">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mt-1">
                  remaining
                </span>
              </div>
            </div>

            {/* Dual Time Layout */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6 border-b border-rule-soft pb-5">
              <div className="text-center p-3 bg-paper-deep rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-ink-muted block mb-1">Standard Exposure</span>
                <span className="text-lg font-bold text-ink">{formatTime(rawSeconds)}</span>
                <span className="text-[8px] text-ink-muted block mt-0.5">(Pure irradiance math)</span>
              </div>
              <div className="text-center p-3 bg-accent/5 border border-accent/15 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-accent-deep block mb-1">Clinical Absorbed</span>
                <span className="text-lg font-bold text-accent-deep">{formatTime(clinicalSeconds)}</span>
                <span className="text-[8px] text-accent-deep/80 block mt-0.5">(Corrected for absorption)</span>
              </div>
            </div>

            {/* Calculations Table */}
            <div className="w-full border-t border-rule pt-4 mb-6 text-xs space-y-2.5 text-left">
              <div className="flex justify-between font-semibold">
                <span className="text-ink-muted">Device Baseline Intensity:</span>
                <span className="text-ink">{baseIrradiance} mW/cm²</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-ink-muted">Distance Scaling Factor:</span>
                <span className="text-ink">x{distanceFactor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-ink-muted">Wavelength Channel Factor:</span>
                <span className="text-ink">x{wavelengthFactor.toFixed(1)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-ink-muted">Calibrated Irradiance:</span>
                <span className="text-ink text-accent-deep font-bold">{actualIrradiance} mW/cm²</span>
              </div>
              {isDeepTreatment && skinTypeFactor > 1 && (
                <div className="flex justify-between font-semibold animate-reveal-up">
                  <span className="text-ink-muted">Melanin Barrier Correction:</span>
                  <span className="text-ink">+{Math.round((skinTypeFactor - 1) * 100)}% Time</span>
                </div>
              )}
              {reflectionFactor > 1 && (
                <div className="flex justify-between font-semibold animate-reveal-up">
                  <span className="text-ink-muted">Skin Reflection Compensation:</span>
                  <span className="text-ink">+{Math.round((reflectionFactor - 1) * 100)}% Time</span>
                </div>
              )}
              <div className="flex justify-between border-t border-rule-soft pt-2.5 font-bold">
                <span className="text-ink">Target Energy Density:</span>
                <span className="text-ink">{targetDose} J/cm²</span>
              </div>
            </div>

            {/* Biphasic Warnings */}
            {biphasicWarning && (
              <div className="w-full p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[10.5px] leading-relaxed text-amber-700 text-left mb-6 animate-reveal-up">
                {biphasicWarning}
              </div>
            )}

            {/* Timer Actions */}
            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={handleStartStop}
                className={`flex-1 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] ${
                  timerRunning
                    ? "bg-neutral-800 hover:bg-neutral-900 text-white"
                    : "bg-accent hover:bg-accent-deep text-white shadow-[0_6px_20px_-4px_rgba(255,100,66,0.4)]"
                }`}
              >
                {timerRunning ? "Pause Session" : "Start Session Timer"}
              </button>
              {(timerRunning || timeLeft !== clinicalSeconds) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3.5 px-5 border border-rule-soft rounded-xl font-bold text-xs text-ink-muted hover:text-ink hover:border-ink/20 active:scale-[0.98] transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Clinician's Dosing Tips */}
          <div className="bg-paper border border-rule p-6 rounded-3xl text-xs leading-relaxed text-ink-muted space-y-4">
            <h4 className="font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <span>💡</span> Clinician's Photobiomodulation Guidelines
            </h4>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-accent text-sm select-none leading-none">•</span>
                <span><strong>The Inverse Distance Scale:</strong> LED light spreads outwards. Backing away from a panel expands the beam coverage area, but cuts cellular intensity. If you double your distance, make sure to adjust the slider to recalculate your dosing time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent text-sm select-none leading-none">•</span>
                <span><strong>Arndt-Schulz Response:</strong> In clinical photobiology, more is not better. Pushing energy density past 50 J/cm² triggers an inhibitory curve (biphasic response), shutting down beneficial ATP production. More frequent, moderate sessions are superior to long, high-dose sessions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent text-sm select-none leading-none">•</span>
                <span><strong>Fitzpatrick Absorption:</strong> Melanin acts as a physical shield. Darker skin phototypes (V-VI) block red light wavelengths more than fair skin. For deep tissues, we increase time slightly to ensure sufficient photons pass the epidermis. For surface skin treatments, start with standard times and monitor for skin warmth.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Optimized Copy Guide Section */}
      <section className="mt-20 border-t border-rule pt-16 space-y-12">
        <article className="prose-article space-y-6 max-w-4xl">
          <h2 className="editorial-head text-3xl text-ink">
            How Long Should I Do Red Light Therapy? The Clinical Science of RLT Dosage
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            Determining your optimal red light therapy session time is not a matter of guesswork. In scientific literature, red light therapy (also known as <strong>photobiomodulation</strong> or <strong>low-level laser therapy</strong>) relies on delivering a specific volume of light particles (photons) to target cells. This volume of energy is referred to as **fluence** or **energy density**, and is measured in **Joules per square centimeter (J/cm²)**.
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            The core formula governing red light exposure times is:
          </p>
          <div className="border border-rule-soft bg-paper-deep p-5 rounded-2xl text-center font-bold text-ink text-sm sm:text-base">
            Time (seconds) = (Target Dose [J/cm²] × 1000) ÷ Calibrated Irradiance [mW/cm²]
          </div>
          <p className="text-base text-ink-muted leading-relaxed">
            To get the correct exposure time, you must align three crucial variables: your target tissue depth, your device's raw power output (irradiance), and your distance from the light source.
          </p>

          <h3 className="editorial-head text-2xl text-ink mt-8">
            Wavelengths & Target Treatment Doses (J/cm²)
          </h3>
          <p className="text-base text-ink-muted leading-relaxed">
            Different biological tissues require different amounts of energy to stimulate healing. Standard clinical protocols suggest the following ranges:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-rule text-xs sm:text-sm">
              <thead>
                <tr className="bg-paper-deep border-b border-rule">
                  <th className="p-3 font-bold text-ink">Treatment Goal</th>
                  <th className="p-3 font-bold text-ink">Recommended Wavelengths</th>
                  <th className="p-3 font-bold text-ink">Target Dose (J/cm²)</th>
                  <th className="p-3 font-bold text-ink">Biological Depth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft">
                <tr>
                  <td className="p-3 font-semibold text-ink">Skin Rejuvenation & Acne</td>
                  <td className="p-3 text-ink-muted">Red (630nm – 660nm)</td>
                  <td className="p-3 font-semibold text-accent-deep">3 – 10 J/cm²</td>
                  <td className="p-3 text-ink-muted">Epidermal & Dermal (Shallow)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Scalp Stimulation & Hair Growth</td>
                  <td className="p-3 text-ink-muted">Red (650nm – 680nm)</td>
                  <td className="p-3 font-semibold text-accent-deep">6 – 12 J/cm²</td>
                  <td className="p-3 text-ink-muted">Hair Follicles (Shallow)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Muscle Recovery & Sports Performance</td>
                  <td className="p-3 text-ink-muted">Near-Infrared (810nm – 850nm)</td>
                  <td className="p-3 font-semibold text-accent-deep">15 – 30 J/cm²</td>
                  <td className="p-3 text-ink-muted">Myofascial Tissue (Deep)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-ink">Deep Joint Pain & Inflammation</td>
                  <td className="p-3 text-ink-muted">Near-Infrared (830nm – 850nm)</td>
                  <td className="p-3 font-semibold text-accent-deep">25 – 45 J/cm²</td>
                  <td className="p-3 text-ink-muted">Tendons, Ligaments & Cartilage (Deepest)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="editorial-head text-2xl text-ink mt-10">
            Why Red Light Therapy Distance Matters (LED Beam Spread)
          </h3>
          <p className="text-base text-ink-muted leading-relaxed">
            Light intensity drops off exponentially as you move away from the source. With large red light panels, individual LED beams intersect. Standing very close to the panel (e.g. 0 to 3 inches) concentrates the energy in a tighter footprint, giving you a high irradiance rating. Moving back (e.g., to 12 or 18 inches) allows the beam angles to diverge, widening your treatment footprint but cutting the power density in half.
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            If you stand at 12 inches rather than 6 inches, your treatment time must double to receive the same dose of Joules. This calculator automates this math using the inverse scaling properties of standard LED panel arrays.
          </p>

          <h3 className="editorial-head text-2xl text-ink mt-8">
            What is the Biphasic Dose Response (Arndt-Schulz Law)?
          </h3>
          <p className="text-base text-ink-muted leading-relaxed">
            In photobiomodulation, the relationship between dosage and biological response follows a U-shaped curve known as the **biphasic dose response**. A low dose of light is highly beneficial (upregulating mitochondrial function and producing ATP). However, exceeding the optimal dosage window results in an inhibitory effect, where excessive light energy triggers cellular fatigue and actually shuts down cellular repair pathways. 
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            This is why using a time calculator is critical. Keeping skin sessions under 10 J/cm² and muscle sessions under 45 J/cm² prevents you from hitting this inhibitory threshold, ensuring you always get positive biological results.
          </p>

          <h3 className="editorial-head text-2xl text-ink mt-8">
            The Truth About Power Specifications: Marketing vs. Real Irradiance
          </h3>
          <p className="text-base text-ink-muted leading-relaxed">
            The vast majority of cheap red light therapy devices on Amazon advertise extremely high irradiances (e.g., "150 mW/cm² at 6 inches"). These claims are almost always measured using cheap solar power meters, which are calibrated for sunlight, not monochrome LEDs, causing them to over-report power by 2x to 3x. 
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            True spectrometer laboratory testing usually reveals actual irradiance ranges from 30 to 60 mW/cm² at 6 inches for standard home panels. Our built-in **Irradiance Calibrator** applies a 60% reduction to marketing claims to approximate true laboratory spectrometer numbers, ensuring you do not severely under-dose your sessions.
          </p>
        </article>

        {/* FAQs */}
        <div className="border border-rule bg-paper p-8 rounded-3xl space-y-6">
          <h3 className="editorial-head text-2xl text-ink">
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="divide-y divide-rule-soft text-sm">
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Can I do red light therapy every day?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Yes, daily red light therapy is generally safe and highly effective. However, because of the biphasic dose response, it is better to perform one consistent, calculated session per day rather than multiple long sessions, which can lead to light saturation.
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Do I need to wear goggles during red light therapy?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                While red light (660nm) is generally safe for eyes, Near-Infrared (850nm) is invisible and highly penetrating. Always wear blackout safety goggles if you are exposing your face directly to a high-powered panel. Do not look directly into the LEDs.
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Does red light therapy penetrate through clothing?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                No. Wavelengths of red and near-infrared light are physically blocked by clothing fibers. For photobiomodulation to occur, the light must have direct contact with bare, clean skin.
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                What is the best time of day for red light therapy?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Any time of day is suitable. Many users prefer morning sessions to boost cellular energy (ATP) and alertness, while athletes often use it post-workout to accelerate muscle recovery and reduce delayed-onset muscle soreness (DOMS).
              </p>
            </div>
            <div className="py-4 space-y-2">
              <h4 className="text-base font-bold text-ink">
                Can I get a tan from red light therapy?
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                No, red light therapy does not tan your skin. Tanning is caused by ultraviolet (UV) radiation (specifically UVA and UVB) triggering melanin production in response to skin cell damage. Red light therapy uses longer, non-damaging wavelengths in the red and near-infrared spectrum which do not cause cellular damage or tanning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Showcase Section */}
      <div className="mt-20 border-t border-rule pt-16 space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-deep block">Clinic Verified Hardware</span>
          <h2 className="editorial-head text-2xl md:text-3xl text-ink">
            Recommended Clinical Red Light Panels (Tested & Calibrated)
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            I verify these models in my private practice using a calibrated spectrometer to ensure their raw power output meets therapeutic thresholds. All of these panels match our built-in calculation profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Mito Pro X 750",
              badge: "Value & Power Pick",
              desc: "My default recommendation for daily home use. Excellent irradiance-to-price ratio, 5 key therapeutic wavelengths, and robust modular setup.",
              specs: ["Irradiance: 100 mW/cm² @ 6\"", "Wavelengths: 5 (Custom Blend)", "FDA Class II Medical Device"],
              link: "https://www.mitoredlight.com/DARYL87554",
              label: "Shop Mito Red Light",
            },
            {
              title: "Rouge Tabletop G4",
              badge: "Most Advanced Features",
              desc: "Top of the line. Features 8 distinct wavelengths (including 1060nm NIR), mobile app control, pulse rate customization, and dimming capabilities.",
              specs: ["Irradiance: 120 mW/cm² @ 6\"", "Wavelengths: 8 (Multi-Spectral)", "Custom App Control & Pulsing"],
              link: "https://rougecare.ca/?ref=hphwim9l",
              label: "Shop Rouge Care",
            },
            {
              title: "Kala Therapy Pro",
              badge: "Best for Canadian Shipping",
              desc: "An FDA-cleared Class II medical panel. Excellent raw build quality, simple manual controls, and robust output for targeted rehabilitation.",
              specs: ["Irradiance: 85 mW/cm² @ 6\"", "Wavelengths: Red & NIR Blend", "FDA Approved Medical Class II"],
              link: "https://kalaredlight.com/DARYLSTUBBS",
              label: "Shop Kala Therapy",
            },
          ].map((panel) => (
            <div key={panel.title} className="bg-paper border border-rule p-6 rounded-2xl flex flex-col justify-between relative hover:shadow-md transition-all">
              <div>
                <span className="absolute top-4 right-4 bg-accent/10 text-accent-deep text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-accent/15">
                  {panel.badge}
                </span>
                <h3 className="text-lg font-bold text-ink mb-3 mt-2">{panel.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed mb-6">{panel.desc}</p>
                <ul className="space-y-1.5 mb-8">
                  {panel.specs.map((spec) => (
                    <li key={spec} className="text-[11px] font-medium text-ink flex items-center gap-2">
                      <span className="text-accent">•</span> {spec}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={panel.link}
                target="_blank"
                rel="nofollow noopener"
                className="w-full text-center py-3 bg-paper hover:bg-paper-deep border border-rule rounded-xl text-xs font-bold text-ink active:scale-[0.98] transition-all"
              >
                {panel.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

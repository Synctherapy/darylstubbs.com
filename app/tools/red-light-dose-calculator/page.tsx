"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type PresetDose = "skin" | "muscle" | "joint" | "custom";
type PresetPanel = "custom" | "mitopro750" | "rougetabletop" | "kalapro" | "infrarediflex" | "biomax900";

export default function RedLightCalculator() {
  // Calculator State
  const [panel, setPanel] = useState<PresetPanel>("mitopro750");
  const [irradiance, setIrradiance] = useState<number>(100);
  const [dosePreset, setDosePreset] = useState<PresetDose>("muscle");
  const [targetDose, setTargetDose] = useState<number>(20);
  const [customIrradiance, setCustomIrradiance] = useState<boolean>(false);

  // Timer State
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [timerComplete, setTimerComplete] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Irradiance mapping for presets at 6 inches distance
  const panelPresets: Record<Exclude<PresetPanel, "custom">, number> = {
    mitopro750: 100, // 100 mW/cm² at 6 inches
    rougetabletop: 164, // 164 mW/cm² at 6 inches (from clinical specs)
    kalapro: 85, // 85 mW/cm² at 6 inches
    infrarediflex: 120, // 120 mW/cm² at 6 inches
    biomax900: 100, // 100 mW/cm² at 6 inches
  };

  // Dose presets in Joules/cm²
  const dosePresets: Record<Exclude<PresetDose, "custom">, number> = {
    skin: 4, // Anti-aging skin therapy: 3-6 J/cm²
    muscle: 20, // Muscle recovery & fatigue: 15-25 J/cm²
    joint: 30, // Deep joint pain & inflammation: 25-40 J/cm²
  };

  // Update irradiance based on panel preset selection
  useEffect(() => {
    if (panel !== "custom") {
      setIrradiance(panelPresets[panel]);
      setCustomIrradiance(false);
    } else {
      setCustomIrradiance(true);
    }
  }, [panel]);

  // Update target dose based on dose preset selection
  useEffect(() => {
    if (dosePreset !== "custom") {
      setTargetDose(dosePresets[dosePreset]);
    }
  }, [dosePreset]);

  // Calculate session duration in seconds
  // Time = (Dose * 1000) / Irradiance
  const calculatedSeconds = Math.round((targetDose * 1000) / (irradiance || 1));

  // Update timer duration when inputs change (only if timer isn't active)
  useEffect(() => {
    if (!timerRunning) {
      setTimeLeft(calculatedSeconds);
      setTotalDuration(calculatedSeconds);
      setTimerComplete(false);
    }
  }, [calculatedSeconds, timerRunning]);

  // Timer Tick Hook
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

  // Play a browser-generated Web Audio API tone (no external audio assets required)
  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High A note
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
        setTimeLeft(calculatedSeconds);
      }
      setTimerComplete(false);
      setTimerRunning(true);
    }
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimeLeft(calculatedSeconds);
    setTimerComplete(false);
  };

  // Formatting helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Radial progress calculations
  const strokeDashoffset = totalDuration > 0 
    ? 282.6 - (timeLeft / totalDuration) * 282.6 
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      {/* Back Button */}
      <Link href="/tools" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-accent mb-8 transition-colors">
        ← Back to Tools
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form & Inputs */}
        <div className="lg:col-span-7 bg-background border border-border-muted p-8 rounded-2xl shadow-sm">
          <h1 className="editorial-head text-3xl text-ink mb-2">
            Red Light Dose & Time Calculator
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed mb-8">
            Irradiance decreases exponentially with distance. Input your panel's parameters and target dosage below to get the clinically optimal treatment duration.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Panel Brand Preset Selection */}
            <div>
              <label className="block text-sm font-bold text-ink mb-3">
                1. Select Your Device Profile
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "mitopro750", label: "Mito Pro X 750" },
                  { id: "rougetabletop", label: "Rouge G4 Table" },
                  { id: "kalapro", label: "Kala Therapy Pro" },
                  { id: "custom", label: "Custom Panel" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPanel(item.id as PresetPanel)}
                    className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all text-center ${
                      panel === item.id
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-background border-border-muted hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Irradiance Input */}
            {customIrradiance && (
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 border border-border-muted rounded-xl">
                <label htmlFor="irradiance-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Custom Irradiance at Target Distance (mW/cm²)
                </label>
                <input
                  id="irradiance-input"
                  type="number"
                  min="1"
                  max="500"
                  value={irradiance}
                  onChange={(e) => setIrradiance(Number(e.target.value))}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent"
                />
                <span className="text-[10px] text-ink-muted mt-2 block leading-normal">
                  Check your manufacturer specifications. Typically quality panels range from 60 to 120 mW/cm² at 6 inches.
                </span>
              </div>
            )}

            {/* Treatment Target Dose Presets */}
            <div>
              <label className="block text-sm font-bold text-ink mb-3">
                2. Select Target Treatment Area
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { id: "skin", label: "Anti-Aging (Skin)", desc: "4 J/cm² (Shallow)" },
                  { id: "muscle", label: "Muscle Recovery", desc: "20 J/cm² (Medium)" },
                  { id: "joint", label: "Joint Inflammation", desc: "30 J/cm² (Deep)" },
                  { id: "custom", label: "Custom Dosage", desc: "Specify Joules" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDosePreset(item.id as PresetDose)}
                    className={`p-3 border rounded-xl text-left transition-all flex flex-col justify-between h-20 ${
                      dosePreset === item.id
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-background border-border-muted hover:border-ink/20 text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className={`text-[10px] ${dosePreset === item.id ? "text-white/80" : "text-ink-muted"}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dose Input */}
            {dosePreset === "custom" && (
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 border border-border-muted rounded-xl">
                <label htmlFor="dose-input" className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Target Energy Density (Joules/cm²)
                </label>
                <input
                  id="dose-input"
                  type="number"
                  min="0.5"
                  max="150"
                  step="0.5"
                  value={targetDose}
                  onChange={(e) => setTargetDose(Number(e.target.value))}
                  className="w-full bg-background border border-border-muted rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-accent"
                />
                <span className="text-[10px] text-ink-muted mt-2 block leading-normal">
                  Typical protocols recommend 3–8 J/cm² for skin and 15–40 J/cm² for muscle/joint clinical support.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Calculations & Interactive Timer */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Output Card */}
          <div className="bg-background border border-border-muted p-8 rounded-2xl shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
            {timerComplete && (
              <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center p-6 text-white z-10 animate-fade-in">
                <span className="text-4xl mb-3">✓</span>
                <h3 className="text-2xl font-bold mb-2">Session Complete!</h3>
                <p className="text-sm text-white/90 mb-6">
                  You have successfully absorbed {targetDose} J/cm² of red light energy.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-white text-emerald-600 font-bold rounded-full text-xs shadow hover:scale-105 transition-transform"
                >
                  Calculate New Session
                </button>
              </div>
            )}

            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-6">
              Calculated Duration
            </span>

            {/* Radial Clock Visualization */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-neutral-100 dark:stroke-neutral-800 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-accent fill-none transition-all duration-300"
                  strokeWidth="8"
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

            {/* Calculations Breakdown */}
            <div className="w-full border-t border-b border-border-muted py-5 mb-8 flex justify-around text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Power Density
                </span>
                <span className="text-base font-bold text-ink">{irradiance} <span className="text-xs font-normal">mW/cm²</span></span>
              </div>
              <div className="border-l border-border-muted pl-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Total Energy
                </span>
                <span className="text-base font-bold text-ink">{targetDose} <span className="text-xs font-normal">J/cm²</span></span>
              </div>
            </div>

            {/* Timer Actions */}
            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={handleStartStop}
                className={`flex-1 py-4.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                  timerRunning
                    ? "bg-neutral-800 text-white hover:bg-neutral-900"
                    : "bg-accent text-white hover:bg-accent-deep shadow-[0_6px_20px_-4px_rgba(255,100,66,0.4)]"
                }`}
              >
                {timerRunning ? "Pause Session" : "Start Session Timer"}
              </button>
              {(timerRunning || timeLeft !== calculatedSeconds) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-4.5 px-6 border border-border-muted rounded-xl font-bold text-sm text-ink-muted hover:text-ink hover:border-ink/20 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Clinician's Dosing Tips */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-border-muted p-6 rounded-2xl text-xs leading-relaxed text-ink-muted">
            <h4 className="font-bold text-ink mb-2">RMT Clinical Tips:</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong>Distance matters:</strong> If you move from 6 inches to 12 inches, panel irradiance drops by roughly 50%. Double the treatment time to hit the same Joules.</li>
              <li><strong>Dose limit:</strong> More is not better in photobiomodulation. Pushing past 60 J/cm² in one session triggers a biphasic response, actually negating cellular benefits.</li>
              <li><strong>Goggles:</strong> Always wear the provided blackout goggles when exposing your face near panels to protect your retinas.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Affiliate Showcase Section */}
      <div className="mt-20 border-t border-border-muted pt-16">
        <div className="max-w-2xl mb-10">
          <h2 className="editorial-head text-2xl md:text-3xl text-ink mb-3">
            Recommended Clinical Panels (Tested & Verified)
          </h2>
          <p className="text-sm text-ink-muted">
            I verify these models in my private clinic using a calibrated solar power meter to ensure raw power output meets therapeutic thresholds.
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
            <div key={panel.title} className="bg-background border border-border-muted p-6 rounded-2xl flex flex-col justify-between relative">
              <div>
                <span className="absolute top-4 right-4 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
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
                className="w-full text-center py-3 bg-neutral-50 dark:bg-neutral-900 border border-border-muted rounded-xl text-xs font-bold text-ink hover:bg-neutral-100 hover:border-ink/20 transition-all"
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

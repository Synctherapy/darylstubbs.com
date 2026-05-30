import type { Metadata } from "next";
import { RedLightCalculatorClient } from "./calculator";

export const metadata: Metadata = {
  title: "Red Light Therapy Dose & Time Calculator (Clinical Grade)",
  description: "Calculate the exact session time, Joules, and irradiance distance adjustments for your red light therapy panel. Avoid the biphasic dose response with clinician-approved RLT protocols.",
  alternates: {
    canonical: "https://darylstubbs.com/tools/red-light-dose-calculator",
  },
};

export default function Page() {
  return <RedLightCalculatorClient />;
}

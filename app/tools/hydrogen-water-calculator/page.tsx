import type { Metadata } from "next";
import { HydrogenCalculatorClient } from "./calculator";

export const metadata: Metadata = {
  title: "Hydrogen Water Daily Target & Inhalation Calculator (Clinical)",
  description: "Calculate your optimal molecular hydrogen (H2) daily dosage in milligrams. Convert drinking water PPM to mg, and compute clinical gas inhalation (mL/min) flow rates for health goals.",
  alternates: {
    canonical: "https://darylstubbs.com/tools/hydrogen-water-calculator",
  },
};

export default function Page() {
  return <HydrogenCalculatorClient />;
}

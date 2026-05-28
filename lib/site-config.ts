export const siteConfig = {
  name: "Daryl Stubbs",
  title: "Daryl Stubbs — Red Light Therapy, Hydrogen Water & Gut Health",
  description:
    "Honest, research-backed reviews and guides on red light therapy, hydrogen water, probiotics, and the tools I actually use to feel better every day.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://darylstubbs.com",
  tagline: "Field notes on what actually works.",
  foundedYear: 2026,
  author: {
    name: "Daryl Stubbs",
    bio: "Clinician-turned-writer covering red light therapy, hydrogen water, and gut health.",
    avatar: "/images/daryl-avatar.jpg",
    credentials: [
      "Registered Massage Therapist",
      "Athletic Therapist",
      "Certified Nutritionist",
    ],
    credentialsShort: ["RMT", "AT", "Nutritionist"],
    yearsClinical: 10,
  },
  social: {
    instagram: "https://www.instagram.com/synctherapy/",
    youtube: "https://www.youtube.com/@synctherapy",
    pinterest: "https://ca.pinterest.com/SyncTherapyWellness/",
  },
  nav: [
    { label: "Articles", href: "/blog" },
    { label: "Products I Use", href: "/products" },
    { label: "About", href: "/about" },
  ],
  categories: [
    {
      slug: "red-light-therapy",
      label: "Red Light Therapy",
      shortLabel: "Red Light",
      description:
        "Panels, masks, and the dosing protocols that hold up under clinical scrutiny.",
      relatedSlugs: ["red-light-therapy", "red-light-recovery"],
    },
    {
      slug: "hydrogen-water",
      label: "Hydrogen Water",
      shortLabel: "Hydrogen",
      description:
        "Bottles, machines, and what molecular hydrogen actually does inside the body.",
      relatedSlugs: ["hydrogen-water", "wellness"],
    },
    {
      slug: "gut-health",
      label: "Probiotics & Gut Health",
      shortLabel: "Gut Health",
      description:
        "Strains, prebiotics, and the microbiome work that moves the needle on energy and mood.",
      relatedSlugs: ["probiotics", "gut-health-nutrition", "gut-health"],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

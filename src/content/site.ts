/**
 * Canonical PreLLI site copy, sourced from the organisation's own documents
 * (planning/About PreLLI.docx, Donations Writeup, Post Categories).
 * This is the seed/fallback content; the admin CMS will later override via Firestore.
 */

export const org = {
  name: "Precious Little Lives Initiative",
  short: "PreLLI",
  tagline: "Bringing hope to precious little lives.",
  since: 2018,
  location: "Abuja (FCT) & Kaduna, Nigeria",
  email: "prellicares@gmail.com",
  socials: {
    instagram: "https://instagram.com/prelli",
    facebook: "https://facebook.com/prelli",
    twitter: "https://twitter.com/prelli",
  },
} as const;

export const mission =
  "To break cycles of poverty by empowering vulnerable children, single mothers, and families in Nigeria through holistic support — providing immediate relief while creating pathways to self-sufficiency.";

export const vision =
  "A Nigeria where every child, regardless of circumstance, grows up in a nurturing environment with access to education, healthcare, and hope for a self-reliant future.";

export const whyWeExist =
  "In Nigeria, millions of children face hunger, interrupted education, and unstable homes due to poverty, displacement, or loss of parents. Single mothers and widows often lack the resources to provide for their families, trapping generations in hardship. As a charity organisation, we are here to change that narrative.";

export const intro =
  "PreLLI is a passionate charity dedicated to breaking down barriers and creating opportunities for less privileged children. We believe every child deserves access to education, support, and the chance to build a brighter future. Through our programs and community initiatives, we empower these young lives and give them the tools they need to succeed.";

export const values = [
  { title: "Proven Model", body: "We support the whole family, not just the child." },
  { title: "Local Focus", body: "Programs with community-tailored solutions." },
  { title: "Transparency", body: "Reports showing exact donation allocations." },
  { title: "Community-Driven", body: "We work with locals, not just for them." },
] as const;

/** The four pillars / focus areas, with the org's own descriptions. */
export const focusAreas = [
  {
    key: "children",
    title: "Children",
    summary:
      "Supporting orphans and vulnerable children with care, nutrition, and protection in safe, nurturing environments.",
    body: "Children are at the heart of PreLLI's mission. We create safe and nurturing environments that allow children to grow emotionally and socially, promoting inclusion, dignity, and a sense of belonging — because every child deserves love, hope, and stability regardless of their circumstances.",
  },
  {
    key: "education",
    title: "Education",
    summary:
      "School supplies, learning materials, and skills development that break cycles of poverty.",
    body: "PreLLI supports access to quality education for less privileged children and youth by providing school supplies, learning materials, and educational support. Through community-based partnerships we reduce barriers to learning and empower children through knowledge and opportunity.",
  },
  {
    key: "community",
    title: "Community",
    summary:
      "Welfare initiatives for widows, the elderly, and vulnerable families to restore dignity and resilience.",
    body: "PreLLI strengthens communities by supporting widows, the elderly, and vulnerable families through targeted welfare initiatives — addressing food security and basic living needs, and empowering caregivers to create stable, supportive homes for children.",
  },
  {
    key: "idp",
    title: "IDP Support",
    summary:
      "Humanitarian relief for internally displaced persons — food, clothing, sanitation, and family support.",
    body: "PreLLI provides humanitarian assistance to internally displaced persons affected by conflict and hardship — supporting displaced children, widows, and families with food, clothing, and essential relief materials, and improving living conditions through welfare and sanitation support.",
  },
] as const;

/** The three public-facing support pillars (matches the original site's hero icons). */
export const supportPillars = [
  {
    title: "Orphanage Support",
    body: "Food, clothing, and care for orphaned and less-privileged children across Nigeria.",
    accent: "blue",
  },
  {
    title: "Widows Support",
    body: "Empowerment materials and relief to help widows rebuild and provide for their families.",
    accent: "green",
  },
  {
    title: "Relief Programs",
    body: "Humanitarian aid for the elderly, IDP communities, and those who need it most.",
    accent: "orange",
  },
] as const;

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
  location: "Abuja, Nigeria",
  email: "prellicares@gmail.com",
  socials: {
    instagram: "https://instagram.com/prelli",
    facebook: "https://facebook.com/prelli",
    twitter: "https://twitter.com/prelli",
  },
} as const;

export const mission =
  "We break cycles of poverty by empowering vulnerable children, single mothers, and families across Nigeria. We meet urgent needs today while building real pathways to a self-reliant tomorrow.";

export const vision =
  "A Nigeria where every child, whatever their circumstances, grows up cared for and safe, with access to education, healthcare, and genuine hope for the future.";

export const whyWeExist =
  "Across Nigeria, millions of children live with hunger, interrupted schooling, and unstable homes brought on by poverty, displacement, or the loss of a parent. Too often, single mothers and widows simply don't have the means to provide, and the hardship passes from one generation to the next. We exist to help change that story.";

export const intro =
  "PreLLI is a charity built on a simple belief: every child deserves the chance to thrive. We work to remove the barriers that hold less privileged children back, opening doors to education, support, and a brighter future. Through our programmes and community partnerships, we give these young lives the encouragement and tools they need to succeed.";

export const values = [
  { title: "Whole-family care", body: "We support the whole family, not just the child." },
  { title: "Rooted locally", body: "Our programmes are shaped around each community we serve." },
  { title: "Full transparency", body: "We share clear reports on exactly where every donation goes." },
  { title: "Led with community", body: "We work with local people, not just for them." },
] as const;

/** The four pillars / focus areas, with the org's own descriptions. */
export const focusAreas = [
  {
    key: "children",
    title: "Children",
    summary:
      "Supporting orphans and vulnerable children with care, nutrition, and protection in safe, nurturing environments.",
    body: "Children are at the heart of everything we do. We create safe, nurturing spaces where they can grow emotionally and socially, and feel a real sense of belonging and dignity. Every child deserves love, hope, and stability, whatever their circumstances.",
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
    body: "We strengthen communities by standing with widows, the elderly, and families who are struggling. Our welfare work meets everyday needs like food and basic living support, and helps caregivers build stable, loving homes for their children.",
  },
  {
    key: "idp",
    title: "IDP Support",
    summary:
      "Humanitarian relief for internally displaced persons, including food, clothing, sanitation, and family support.",
    body: "We bring humanitarian support to people displaced by conflict and hardship. For displaced children, widows, and families, that means food, clothing, and essential relief materials, alongside welfare and sanitation support that helps restore everyday dignity.",
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

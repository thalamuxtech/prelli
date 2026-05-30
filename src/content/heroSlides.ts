/** Default hero slides (also the seed for the admin-managed `heroSlides` collection). */
export interface HeroSlideSeed {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  order: number;
}

export const defaultHeroSlides: HeroSlideSeed[] = [
  {
    id: "slide-hope",
    image: "/stories/al-ansar-orphanage-home-ramadan-donation-2025.jpg",
    eyebrow: "Precious Little Lives Initiative · since 2018",
    title: "Bringing hope to",
    highlight: "precious little lives",
    body: "We care for orphans, widows, and the elderly across Nigeria, supporting the whole family and not just the child.",
    order: 1,
  },
  {
    id: "slide-dignity",
    image: "/stories/christ-foundation-orphanage-home-widows-outreach-2021.jpg",
    eyebrow: "Empowering families in need",
    title: "Restoring dignity,",
    highlight: "one family at a time",
    body: "From orphanage homes to families across the FCT, we put relief and encouragement directly into the hands that need it most.",
    order: 2,
  },
  {
    id: "slide-kindness",
    image: "/stories/prelli-fun-fair-for-orphans-and-widows-2019.jpg",
    eyebrow: "Joy for orphans and widows",
    title: "Every act of kindness",
    highlight: "brings hope and relief",
    body: "Fun fairs, food drives, and outreach that create moments of joy and lasting change for the communities we serve.",
    order: 3,
  },
  {
    id: "slide-future",
    image: "/stories/orphanage-home-outreach-kaduna-2018.jpg",
    eyebrow: "Supporting the less privileged",
    title: "Creating pathways to",
    highlight: "a brighter future",
    body: "Education, nutrition, and care that break cycles of hardship for children who deserve the chance to thrive.",
    order: 4,
  },
];

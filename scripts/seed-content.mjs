// Seed Firestore with starter content so the public site + admin are populated.
// Idempotent (deterministic doc IDs). Run: SA_KEY=<path> node scripts/seed-content.mjs
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const sa = JSON.parse(readFileSync(process.env.SA_KEY, "utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();
const stamp = () => ({ createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });

const posts = JSON.parse(readFileSync(new URL("./_posts.json", import.meta.url), "utf8"));

const heroSlides = [
  { id: "slide-hope", image: "/stories/al-ansar-orphanage-home-ramadan-donation-2025/1.jpg", eyebrow: "Precious Little Lives Initiative · since 2018", title: "Bringing hope to", highlight: "precious little lives", body: "We care for orphans, widows, and the elderly across Nigeria, supporting the whole family and not just the child.", order: 1 },
  { id: "slide-dignity", image: "/stories/bringing-hope-to-christ-foundation-orphanage-home-2025/1.jpg", eyebrow: "Empowering families in need", title: "Restoring dignity,", highlight: "one family at a time", body: "From orphanage homes to families across the FCT, we put relief and encouragement directly into the hands that need it most.", order: 2 },
  { id: "slide-kindness", image: "/stories/prelli-fun-fair-for-orphans-and-widows-2019/1.jpg", eyebrow: "Joy for orphans and widows", title: "Every act of kindness", highlight: "brings hope and relief", body: "Fun fairs, food drives, and outreach that create moments of joy and lasting change for the communities we serve.", order: 3 },
  { id: "slide-future", image: "/stories/orphanage-home-outreach-kaduna-2018/1.jpg", eyebrow: "Supporting the less privileged", title: "Creating pathways to", highlight: "a brighter future", body: "Education, nutrition, and care that break cycles of hardship for children who deserve the chance to thrive.", order: 4 },
];

const initiatives = [
  ["Special Care for Orphans & Widows", "Food, clothing, and essential support for orphaned children and widows rebuilding their lives.", "2,500+ widows empowered"],
  ["Nigerian Military Family Care", "Support for the families and widows of armed-forces personnel who served the nation.", "100+ families supported"],
  ["Community Health Care Programs", "Health interventions that improve well-being in underserved communities.", "12+ communities reached"],
  ["Quality Education", "Educational resources and support for both gifted and less-privileged children and youth.", "1,000+ children in school"],
  ["Skill Acquisition Programs", "Practical skills training that builds self-sufficiency and livelihoods.", "300+ trained"],
  ["Humanitarian Projects", "Relief that meets real needs: food, sanitation, and shelter for those facing hardship.", "4,000+ lives touched"],
  ["Progressive Planning for Society", "Long-term initiatives that build resilient, self-reliant communities.", ""],
];

// Initiatives removed from the lineup, delete from Firestore if present.
const removedInitiativeIds = [
  "peace-ambassadors",
  "youth-career-training-engagement",
  "stem-camp-for-teen-girls",
  "computer-training-programs",
];

const now = Date.now();
const inDays = (d) => new Date(now + d * 86400000).toISOString().slice(0, 16);
const events = [
  { id: "sample-ramadan-outreach", title: "Ramadan Food Outreach", slug: "ramadan-food-outreach", description: "Join us as we distribute food packages to orphanages and families across Abuja.", startAt: inDays(30), location: "Abuja, Nigeria", impact: "300+ families fed", images: ["/stories/al-ansar-orphanage-home-ramadan-donation-2025/1.jpg", "/stories/bringing-hope-to-christ-foundation-orphanage-home-2025/1.jpg", "/stories/al-ansar-orphanage-home-visit-2020/1.jpg"], countdownEnabled: true, status: "upcoming" },
  { id: "sample-back-to-school", title: "Back-to-School Drive", slug: "back-to-school-drive", description: "Providing school supplies and learning materials to less privileged children.", startAt: inDays(60), location: "Abuja, Nigeria", impact: "200+ children supported", images: ["/stories/mbora-community-visit-empowering-women-2019/1.jpg", "/stories/prelli-fun-fair-for-orphans-and-widows-2019/1.jpg", "/stories/orphanage-home-outreach-kaduna-2018/1.jpg"], countdownEnabled: false, status: "upcoming" },
];

const sponsors = [
  { id: "partner-ntic", name: "NTIC Foundation", order: 1 },
  { id: "partner-al-ansar", name: "Al Ansar Orphanage", order: 2 },
  { id: "partner-christ-foundation", name: "Christ Foundation", order: 3 },
  { id: "partner-community", name: "Community Partners", order: 4 },
];

let c = 0;
for (const p of posts) { await db.collection("posts").doc(p.id).set({ ...p, ...stamp() }, { merge: true }); c++; }
console.log(`posts: ${c}`);
c = 0;
for (const h of heroSlides) { await db.collection("heroSlides").doc(h.id).set({ ...h, ...stamp() }, { merge: true }); c++; }
console.log(`heroSlides: ${c}`);
c = 0;
for (let i = 0; i < initiatives.length; i++) {
  const [title, summary, impact] = initiatives[i];
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  await db.collection("initiatives").doc(id).set({ title, summary, impact: impact || "", order: i + 1, ...stamp() }, { merge: true });
  c++;
}
console.log(`initiatives: ${c}`);
for (const rid of removedInitiativeIds) { await db.collection("initiatives").doc(rid).delete(); }
console.log(`removed initiatives: ${removedInitiativeIds.length}`);
c = 0;
for (const e of events) { await db.collection("events").doc(e.id).set({ ...e, ...stamp() }, { merge: true }); c++; }
console.log(`events: ${c}`);
c = 0;
for (const s of sponsors) { await db.collection("sponsors").doc(s.id).set({ ...s, logo: "", url: "", ...stamp() }, { merge: true }); c++; }
console.log(`sponsors: ${c}`);
console.log("Seed complete.");
process.exit(0);

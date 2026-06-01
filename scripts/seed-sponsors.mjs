// Seed only the sponsors/partners collection with the real partner logos.
// Run: SA_KEY=<path> node scripts/seed-sponsors.mjs
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const sa = JSON.parse(readFileSync(process.env.SA_KEY, "utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();
const stamp = () => ({ createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });

const sponsors = [
  { id: "partner-gearloose-works", name: "Gearloose Works", order: 1, logo: "/partners/gearloose-works.png", url: "" },
  { id: "partner-nightowl-technology", name: "NightOwl Technology", order: 2, logo: "/partners/nightowl-technology.png", url: "" },
  { id: "partner-pick-a-tell", name: "Pick a Tell", order: 3, logo: "/partners/pick-a-tell.png", url: "" },
  { id: "partner-hale-youth-foundation", name: "Hale Youth Foundation", order: 4, logo: "/partners/hale-youth-foundation.png", url: "https://haleyouthfoundation.org" },
];

// Remove the old placeholder partner docs so only the real logos remain.
for (const id of ["partner-ntic", "partner-al-ansar", "partner-christ-foundation", "partner-community"]) {
  await db.collection("sponsors").doc(id).delete();
}
let c = 0;
for (const s of sponsors) {
  await db.collection("sponsors").doc(s.id).set({ ...s, ...stamp() }, { merge: true });
  c++;
}
console.log(`sponsors seeded: ${c}`);
process.exit(0);

// Trim the IDP-camp post gallery in live Firestore to match the bundled content
// (cover = FoodItems at 1.jpg; gallery = [1.jpg, 4.jpg]).
// Run: SA_KEY=<path> node scripts/update-idp-post.mjs
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const sa = JSON.parse(readFileSync(process.env.SA_KEY, "utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const id = "idp-camp-2018";
const ref = db.collection("posts").doc(id);
const snap = await ref.get();
if (!snap.exists) {
  console.log(`Post ${id} not found in Firestore (nothing to update).`);
  process.exit(0);
}
await ref.set(
  {
    coverImage: "/stories/visit-to-idp-camp-2018/1.jpg",
    gallery: ["/stories/visit-to-idp-camp-2018/1.jpg", "/stories/visit-to-idp-camp-2018/4.jpg"],
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true },
);
console.log(`Updated post ${id}: gallery trimmed to [1, 4].`);
process.exit(0);

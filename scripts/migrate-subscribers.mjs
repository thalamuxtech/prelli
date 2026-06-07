// Migrate existing newsletter subscribers into the unified submissions inbox
// as "subscribe" submissions, preserving email, name, source, and join time.
// Idempotent: each subscriber maps to a deterministic submission id, so re-runs
// don't create duplicates. The original subscribers docs are left in place.
// Run: SA_KEY=<path> node scripts/migrate-subscribers.mjs
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const sa = JSON.parse(readFileSync(process.env.SA_KEY, "utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const subs = await db.collection("subscribers").get();
console.log(`Found ${subs.size} subscriber doc(s).`);

let migrated = 0;
let skipped = 0;
for (const d of subs.docs) {
  const s = d.data();
  if (!s.email) {
    skipped++;
    continue;
  }
  // Deterministic id so re-running doesn't duplicate.
  const submissionId = `sub-${d.id}`;
  await db.collection("submissions").doc(submissionId).set(
    {
      type: "subscribe",
      name: s.name || "",
      email: s.email,
      message: "",
      extra: {
        source: s.source || "migrated",
        // keep the prior status visible in case it was "unsubscribed"
        status: s.status || "active",
      },
      handled: s.status === "unsubscribed", // treat unsubscribed as already handled
      archived: false,
      // preserve original join time when available, else stamp now
      createdAt: s.createdAt ?? FieldValue.serverTimestamp(),
      migratedFrom: "subscribers",
    },
    { merge: true },
  );
  migrated++;
  console.log(`  migrated: ${s.email} (${s.status || "active"})`);
}

console.log(`Done. Migrated ${migrated}, skipped ${skipped} (no email).`);
console.log("Original subscribers docs left intact as a backup.");
process.exit(0);

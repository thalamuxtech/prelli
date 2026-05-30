// One-off: create the first superadmin (Auth user + Firestore users/{uid} doc).
// Run with: node scripts/seed-admin.mjs   (uses the Admin SDK service-account key)
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const keyPath = process.env.SA_KEY;
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const NAME = process.env.ADMIN_NAME || "PreLLI Admin";

const sa = JSON.parse(readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(sa) });
const auth = getAuth();
const db = getFirestore();

let uid;
try {
  const existing = await auth.getUserByEmail(EMAIL);
  uid = existing.uid;
  await auth.updateUser(uid, { password: PASSWORD });
  console.log("Updated existing auth user:", uid);
} catch {
  const created = await auth.createUser({ email: EMAIL, password: PASSWORD, displayName: NAME });
  uid = created.uid;
  console.log("Created auth user:", uid);
}

await db.collection("users").doc(uid).set({
  email: EMAIL,
  displayName: NAME,
  role: "superadmin",
  mustChangePassword: false,
  createdAt: FieldValue.serverTimestamp(),
});
console.log("Wrote users/" + uid + " as superadmin. Done.");
process.exit(0);

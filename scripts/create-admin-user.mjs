// Create/refresh an admin user in Firebase Auth + the users Firestore profile.
// Run: SA_KEY=<path> node scripts/create-admin-user.mjs
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const sa = JSON.parse(readFileSync(process.env.SA_KEY, "utf8"));
initializeApp({ credential: cert(sa) });
const auth = getAuth();
const db = getFirestore();

const EMAIL = "admin@prelli.org";
const PASSWORD = "Prelli2018@Admin";
const DISPLAY_NAME = "PreLLI Admin";
const ROLE = "admin";

// Create the Auth account, or reset its password if it already exists.
let uid;
try {
  const rec = await auth.createUser({
    email: EMAIL,
    password: PASSWORD,
    displayName: DISPLAY_NAME,
    emailVerified: true,
  });
  uid = rec.uid;
  console.log(`Created auth user: ${EMAIL} (${uid})`);
} catch (err) {
  if (err.code === "auth/email-already-exists") {
    const rec = await auth.getUserByEmail(EMAIL);
    uid = rec.uid;
    await auth.updateUser(uid, { password: PASSWORD, displayName: DISPLAY_NAME });
    console.log(`Auth user existed — password/display name updated: ${EMAIL} (${uid})`);
  } else {
    throw err;
  }
}

// Write the admin profile so the user appears in Admin > Users & roles.
await db.collection("users").doc(uid).set(
  {
    email: EMAIL,
    displayName: DISPLAY_NAME,
    role: ROLE,
    mustChangePassword: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true },
);
console.log(`Profile written: ${EMAIL} role=${ROLE}`);
process.exit(0);

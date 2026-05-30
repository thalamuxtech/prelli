import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Client-direct writes to Firestore (Implementation Plan §8, free plan).
 * Secured by Security Rules + App Check (App Check added in a later phase).
 * Email notification (EmailJS/Web3Forms) is wired in the same phase.
 */

export async function submitContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  await addDoc(collection(db, "submissions"), {
    type: "contact",
    name: data.name,
    email: data.email,
    message: data.message,
    extra: { subject: data.subject ?? "" },
    handled: false,
    archived: false,
    createdAt: serverTimestamp(),
  });
}

export async function submitVolunteer(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  extra?: Record<string, string>;
}) {
  await addDoc(collection(db, "submissions"), {
    type: "volunteer",
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    message: data.message,
    extra: data.extra ?? {},
    handled: false,
    archived: false,
    createdAt: serverTimestamp(),
  });
}

export async function submitPartner(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  organisation?: string;
}) {
  await addDoc(collection(db, "submissions"), {
    type: "partner",
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    message: data.message,
    extra: { organisation: data.organisation ?? "" },
    handled: false,
    archived: false,
    createdAt: serverTimestamp(),
  });
}

export async function submitPledge(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  amount?: string;
}) {
  await addDoc(collection(db, "submissions"), {
    type: "pledge",
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    message: data.message,
    extra: { amount: data.amount ?? "" },
    handled: false,
    archived: false,
    createdAt: serverTimestamp(),
  });
}

export async function subscribeNewsletter(email: string, source = "footer") {
  await addDoc(collection(db, "subscribers"), {
    email,
    name: "",
    source,
    status: "active",
    createdAt: serverTimestamp(),
  });
}

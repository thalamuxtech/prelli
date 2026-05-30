import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notifyByEmail } from "@/lib/notify";

/**
 * Client-direct writes to Firestore (Implementation Plan §8, free plan).
 * Secured by Security Rules + App Check. Each write also fires an optional
 * EmailJS notification (no-op unless keys are configured).
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
  await notifyByEmail("New contact message", {
    type: "Contact",
    name: data.name,
    email: data.email,
    message: data.message,
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
  await notifyByEmail("New volunteer application", {
    type: "Volunteer",
    name: data.name,
    email: data.email,
    message: data.message,
  });
}

export async function submitPartner(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  organisation?: string;
  country?: string;
  state?: string;
  languages?: string;
}) {
  await addDoc(collection(db, "submissions"), {
    type: "partner",
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    message: data.message,
    extra: {
      organisation: data.organisation ?? "",
      country: data.country ?? "",
      state: data.state ?? "",
      languages: data.languages ?? "",
    },
    handled: false,
    archived: false,
    createdAt: serverTimestamp(),
  });
  await notifyByEmail("New partner / sponsor inquiry", {
    type: "Partner",
    name: data.name,
    email: data.email,
    message: data.message,
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
  await notifyByEmail("New donation pledge", {
    type: "Donation pledge",
    name: data.name,
    email: data.email,
    message: `${data.amount ? `Pledge: ${data.amount}. ` : ""}${data.message}`,
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
  await notifyByEmail("New newsletter subscriber", { type: "Newsletter", name: "", email, message: "" });
}

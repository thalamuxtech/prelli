/** Content types mirroring the Firestore model (Implementation Plan §7). */

export type Category = "children" | "education" | "community" | "idp";

export const categoryLabels: Record<Category, string> = {
  children: "Children",
  education: "Education",
  community: "Community",
  idp: "IDP Support",
};

export const categoryColors: Record<Category, string> = {
  children: "bg-prelli-pink/10 text-prelli-pink",
  education: "bg-prelli-blue/10 text-prelli-blue-700",
  community: "bg-prelli-green/10 text-prelli-green-600",
  idp: "bg-prelli-orange/10 text-prelli-orange",
};

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Plain-text/markdown-ish paragraphs. */
  body: string[];
  /** Bullet list of donated/provided items, if any. */
  donations?: string[];
  coverImage?: string;
  /** Up to 3–5 images for the event/story slider. */
  gallery?: string[];
  category: Category;
  /** ISO date string. */
  date: string;
  year: number;
  location?: string;
  status: "draft" | "published";
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  startAt: string; // ISO
  location?: string;
  coverImage?: string;
  status: "upcoming" | "past";
}

export interface Initiative {
  title: string;
  summary: string;
  /** Optional headline impact figure shown on hover, e.g. "500+ children reached". */
  impact?: string;
}

/** ── Admin / backend types ─────────────────────────────────────────── */

export type Role = "superadmin" | "admin" | "editor";

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  mustChangePassword?: boolean;
  createdAt?: unknown;
}

export type SubmissionType = "contact" | "volunteer" | "partner" | "pledge";

export const submissionLabels: Record<SubmissionType, string> = {
  contact: "Contact",
  volunteer: "Volunteer",
  partner: "Partner / Sponsor",
  pledge: "Donation Pledge",
};

export interface Submission {
  id: string;
  type: SubmissionType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  extra?: Record<string, string>;
  handled: boolean;
  archived: boolean;
  createdAt?: unknown;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  status: "active" | "unsubscribed";
  createdAt?: unknown;
}

export type InventoryCategory =
  | "food"
  | "clothing"
  | "equipment"
  | "school"
  | "household"
  | "medical"
  | "other";

export const inventoryCategoryLabels: Record<InventoryCategory, string> = {
  food: "Food & Groceries",
  clothing: "Clothing",
  equipment: "Equipment",
  school: "School Supplies",
  household: "Household",
  medical: "Medical",
  other: "Other",
};

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  unit: string; // bags, cartons, kg, pieces…
  quantity: number; // current on-hand (number of items / units)
  packages?: number; // number of packages/cartons this represents
  itemsPerPackage?: number; // items contained in each package
  location?: string;
  photo?: string;
  notes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: "in" | "out";
  quantity: number;
  /** For "out": where it was distributed (event/outreach name or slug). */
  destination?: string;
  note?: string;
  createdAt?: unknown;
}

export interface AdminEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startAt: string; // ISO
  location?: string;
  images: string[]; // 3–5 max
  countdownEnabled: boolean;
  status: "upcoming" | "past";
  /** Optional impact figure shown on click/hover, e.g. "300 families fed". */
  impact?: string;
  createdAt?: unknown;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  order: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  order: number;
}

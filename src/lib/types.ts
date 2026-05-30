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
}

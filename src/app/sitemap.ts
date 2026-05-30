import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";

const BASE = "https://prellicares.org";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/work",
    "/impact",
    "/stories",
    "/gallery",
    "/events",
    "/volunteer",
    "/partner",
    "/donate",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const storyRoutes = posts.map((p) => ({
    url: `${BASE}/stories/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...routes, ...storyRoutes];
}

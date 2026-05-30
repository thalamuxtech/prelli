"use client";

import { useState } from "react";
import { StoryCard } from "@/components/site/StoryCard";
import { categoryLabels, type Category, type Post } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "children", label: categoryLabels.children },
  { key: "community", label: categoryLabels.community },
  { key: "education", label: categoryLabels.education },
  { key: "idp", label: categoryLabels.idp },
];

/** Stories grid with client-side category filtering (§4.1). */
export function StoriesGrid({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<Category | "all">("all");
  const visible = active === "all" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            className={cn(
              "min-h-[40px] rounded-pill border px-4 text-sm font-medium transition-all duration-200",
              active === f.key
                ? "border-prelli-green bg-prelli-green text-white shadow-e1"
                : "border-line bg-white text-slate hover:border-prelli-green hover:text-prelli-green-600",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <StoryCard key={post.id} post={post} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-slate">No stories in this category yet.</p>
      )}
    </div>
  );
}

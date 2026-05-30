import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { categoryLabels, categoryColors, type Post } from "@/lib/types";

const coverGradients: Record<string, string> = {
  children: "from-prelli-pink/80 to-prelli-orange/70",
  education: "from-prelli-blue/80 to-prelli-green/70",
  community: "from-prelli-green/80 to-prelli-blue/70",
  idp: "from-prelli-orange/80 to-prelli-pink/70",
};

/** Story/blog card with hover image-zoom, title color-shift, and sliding arrow (§2.5). */
export function StoryCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/stories/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-e2"
    >
      {/* Cover — real photo when available, brand gradient fallback otherwise */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${coverGradients[post.category]} transition-transform duration-500 ease-out-expo group-hover:scale-105`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <div className="absolute inset-0 flex items-end p-4">
          <span className="font-display text-2xl font-bold text-white drop-shadow">
            {post.year}
          </span>
        </div>
        <div className="absolute right-4 top-4">
          <Badge className={`${categoryColors[post.category]} bg-white/95`}>
            {categoryLabels[post.category]}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {post.location && (
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate">
            <MapPin className="h-3.5 w-3.5" /> {post.location}
          </p>
        )}
        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-prelli-green-600">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-prelli-green-600">
          Read story
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

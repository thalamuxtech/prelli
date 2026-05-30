"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export interface GalleryItem {
  src: string;
  caption: string;
  year: number;
}

/** Masonry-ish gallery grid with a shared-layout lightbox (§2.5). */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.button
            key={item.src}
            type="button"
            onClick={() => setActive(item)}
            layoutId={`g-${i}`}
            className="group relative aspect-square overflow-hidden rounded-md bg-cloud focus-visible:outline-none"
          >
            <Image
              src={item.src}
              alt={item.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-pill bg-white/10 text-white hover:bg-white/20"
              style={{ top: "max(1rem, env(safe-area-inset-top))" }}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              className="relative max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-lg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.caption}
                width={1200}
                height={900}
                className="h-auto w-full object-contain"
              />
              <p className="bg-ink/90 p-4 text-center text-sm text-white">
                {active.caption} · {active.year}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

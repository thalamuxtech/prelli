"use client";

import { usePathname } from "next/navigation";

/**
 * The home hero sits flush under the transparent nav. Every other page gets
 * extra top padding so its content clears the (taller) fixed nav with breathing room.
 */
export function MainSpacer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return <main className={isHome ? "" : "pt-28 sm:pt-32"}>{children}</main>;
}

import Image from "next/image";
import Link from "next/link";

/**
 * Official PreLLI logo. When `scrolled` is provided, the logo smoothly scales
 * between a large (hero) and compact (sticky) size via a CSS transition.
 */
export function Logo({
  size = 48,
  scrolled,
}: {
  size?: number;
  scrolled?: boolean;
}) {
  // Animated mode: render at the larger size and scale down with a transition.
  const animated = scrolled !== undefined;
  const big = 60;
  const small = 42;
  const height = animated ? (scrolled ? small : big) : size;

  return (
    <Link
      href="/"
      aria-label="PreLLI — Precious Little Lives Initiative, home"
      className="inline-flex items-center transition-opacity hover:opacity-90"
    >
      <Image
        src="/brand/prelli-logo.png"
        alt="PreLLI — Precious Little Lives Initiative"
        width={Math.round(big * 2.1)}
        height={big}
        priority
        className="w-auto origin-left transition-[height] duration-300 ease-out-expo"
        style={{ height }}
      />
    </Link>
  );
}

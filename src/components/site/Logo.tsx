import Image from "next/image";
import Link from "next/link";

/**
 * Official PreLLI logo (planning/PreLLILogoT.png → public/brand/prelli-logo.png).
 * The mark already carries the wordmark, so we render it as a single image.
 */
export function Logo({ size = 48 }: { size?: number }) {
  return (
    <Link
      href="/"
      aria-label="PreLLI — Precious Little Lives Initiative, home"
      className="inline-flex items-center transition-opacity hover:opacity-90"
    >
      <Image
        src="/brand/prelli-logo.png"
        alt="PreLLI — Precious Little Lives Initiative"
        width={size * 2.1}
        height={size}
        priority
        className="h-auto w-auto"
        style={{ height: size, width: "auto" }}
      />
    </Link>
  );
}

import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cloud px-6 text-center">
      <Logo size={56} />
      <div>
        <p className="font-display text-6xl font-bold text-prelli-green">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 max-w-sm text-slate">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex min-h-[48px] items-center rounded-pill bg-prelli-green px-7 font-semibold text-white transition-colors hover:bg-prelli-green-600"
      >
        Back home
      </Link>
    </main>
  );
}

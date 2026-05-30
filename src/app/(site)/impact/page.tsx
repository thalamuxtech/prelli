"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/** Impact merged into Our Work. Redirect any old /impact links there. */
export default function ImpactRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/work");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-prelli-green" />
    </div>
  );
}

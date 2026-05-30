"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/** Stories are now Events. Redirect the old list page to /events. */
export default function StoriesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/events");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-prelli-green" />
    </div>
  );
}

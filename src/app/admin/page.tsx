"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { FileText, CalendarDays, Boxes, Inbox, Mail, ArrowRight, Eye } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { useCollection } from "@/lib/db";
import { PageHeader, StatTile } from "@/components/admin/ui";
import type { Submission, Subscriber } from "@/lib/types";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const posts = useCollection<{ id: string }>("posts");
  const events = useCollection<{ id: string }>("events");
  const inventory = useCollection<{ id: string }>("inventory");
  const submissions = useCollection<Submission>("submissions");
  const subscribers = useCollection<Subscriber>("subscribers");
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    getDoc(doc(db, "siteStats", "global"))
      .then((snap) => setVisits(snap.exists() ? (snap.data().totalVisits as number) ?? 0 : 0))
      .catch(() => setVisits(null));
  }, []);

  const newSubs = submissions.data.filter((s) => !s.handled).length;

  return (
    <div>
      <PageHeader
        title={`Welcome${profile?.displayName ? `, ${profile.displayName}` : ""}`}
        subtitle="Here's what's happening across the PreLLI website."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile label="Site visits" value={visits ?? "—"} icon={Eye} accent="green" />
        <StatTile label="Posts" value={posts.data.length} icon={FileText} accent="blue" />
        <StatTile label="Events" value={events.data.length} icon={CalendarDays} accent="orange" />
        <StatTile label="Inventory items" value={inventory.data.length} icon={Boxes} accent="green" />
        <StatTile label="New submissions" value={newSubs} icon={Inbox} accent="pink" />
        <StatTile label="Total submissions" value={submissions.data.length} icon={Inbox} accent="blue" />
        <StatTile label="Subscribers" value={subscribers.data.length} icon={Mail} accent="green" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Write a new post", href: "/admin/posts" },
          { label: "Create an event", href: "/admin/events" },
          { label: "Add inventory", href: "/admin/inventory" },
          { label: "Review submissions", href: "/admin/submissions" },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="group flex items-center justify-between rounded-lg border border-line bg-white p-5 shadow-e1 transition-all hover:-translate-y-0.5 hover:shadow-e2"
          >
            <span className="font-medium text-ink">{q.label}</span>
            <ArrowRight className="h-5 w-5 text-slate transition-transform group-hover:translate-x-1 group-hover:text-prelli-green-600" />
          </Link>
        ))}
      </div>
    </div>
  );
}

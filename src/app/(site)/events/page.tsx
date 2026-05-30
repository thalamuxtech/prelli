import type { Metadata } from "next";
import { EventsList } from "@/components/site/EventsList";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Past and upcoming events from Precious Little Lives Initiative: outreaches, fun fairs, and community programmes across Nigeria.",
};

export default function EventsPage() {
  return <EventsList />;
}

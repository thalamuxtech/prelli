/** Primary navigation (Implementation Plan §4). */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Work", href: "/work" },
  { label: "Stories", href: "/stories" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
] as const;

/** Footer link groups. */
export const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "About PreLLI", href: "/about" },
      { label: "Our Work & Impact", href: "/work" },
      { label: "Stories", href: "/stories" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Partner with us", href: "/partner" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

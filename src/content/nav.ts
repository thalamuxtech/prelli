/** Primary navigation (Implementation Plan §4). */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Impact", href: "/work" },
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
      { label: "Impact", href: "/work" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Partner with us", href: "/partner" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

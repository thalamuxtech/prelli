import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Boxes,
  Inbox,
  Mail,
  Users2,
  Image,
  Images,
  Handshake,
  HeartHandshake,
  Settings,
  UserCog,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Restrict to superadmin (e.g. user management). */
  superadminOnly?: boolean;
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hero Slides", href: "/admin/slides", icon: Images },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Initiatives", href: "/admin/initiatives", icon: HeartHandshake },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Team", href: "/admin/team", icon: Users2 },
  { label: "Sponsors", href: "/admin/sponsors", icon: Handshake },
  { label: "Site visits", href: "/admin/visits", icon: MonitorSmartphone, superadminOnly: true },
  { label: "Users", href: "/admin/users", icon: UserCog, superadminOnly: true },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

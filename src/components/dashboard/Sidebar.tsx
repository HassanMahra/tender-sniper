"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/login/actions";
import {
  Crosshair,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  Bell,
  User,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Feed",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/dashboard/saved",
    label: "Gespeichert",
    icon: <Bookmark className="h-5 w-5" />,
  },
  {
    href: "/dashboard/notifications",
    label: "Benachrichtigungen",
    icon: <Bell className="h-5 w-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    href: "/dashboard/profile",
    label: "Profil",
    icon: <User className="h-5 w-5" />,
  },
  {
    href: "/dashboard/settings",
    label: "Einstellungen",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  email?: string;
}

/**
 * Generate initials from name or email
 */
function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  email?: string
): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "??";
}

/**
 * Get display name
 */
function getDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  email?: string
): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (email) {
    return email.split("@")[0];
  }
  return "Gast";
}

export function Sidebar({ firstName, lastName, companyName, email }: SidebarProps) {
  const pathname = usePathname();

  const initials = getInitials(firstName, lastName, email);
  const displayName = getDisplayName(firstName, lastName, email);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-neutral-800 bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-orange">
          <Crosshair className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          Tender<span className="text-signal-orange">Sniper</span>
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-signal-orange/10 text-signal-orange"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
              {item.label === "Feed" && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-signal-orange px-1.5 text-xs font-semibold text-white">
                  5
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-neutral-800 px-3 py-4">
        <div className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-signal-orange/10 text-signal-orange"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <form action={signOut}>
          <button
            type="submit"
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Abmelden
          </button>
        </form>
      </div>

      {/* User Info */}
      <div className="border-t border-neutral-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-orange/20 text-signal-orange font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {displayName}
            </p>
            {companyName && (
              <p className="text-xs text-muted-foreground truncate">
                {companyName}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

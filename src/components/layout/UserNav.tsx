"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { User, Settings, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserNavProps {
  user: SupabaseUser;
}

/**
 * Get initials from user metadata or email
 */
function getInitials(user: SupabaseUser): string {
  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  return "??";
}

/**
 * Get display name from user metadata or email
 */
function getDisplayName(user: SupabaseUser): string {
  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (user.email) {
    return user.email.split("@")[0];
  }
  return "Benutzer";
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const supabase = createClient();

  const initials = getInitials(user);
  const displayName = getDisplayName(user);
  const avatarUrl = user.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Erfolgreich abgemeldet", {
        description: "Bis bald!",
      });
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Fehler beim Abmelden", {
        description: "Bitte versuche es erneut.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-signal-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Benutzermenü öffnen"
        >
          <Avatar className="h-9 w-9 border border-neutral-700 hover:border-signal-orange transition-colors">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="bg-signal-orange/20 text-signal-orange font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-card border-neutral-800"
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-neutral-800" />

        {/* Profile & Settings */}
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>Profil & Einstellungen</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="h-4 w-4" />
            <span>Mein Konto</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-neutral-800" />

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Abmelden</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


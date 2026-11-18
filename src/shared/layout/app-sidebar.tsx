"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  GraduationCap,
  User,
  MoreVertical,
  LayoutDashboard,
  LogOut,
  BookOpen,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { useProfile } from "@/features/account/hooks/use-profile";
import logoImg from "@/assets/logo.png";
import type { IUser } from "@/shared/lib/types/user";

interface AppSidebarProps {
  user?: IUser | null;
}

export function AppSidebar({ user: initialUser }: AppSidebarProps) {
  const { data: user = initialUser } = useProfile({
    initialData: initialUser || undefined,
  });

  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN;

  const isDiplomasActive =
    pathname === ROUTES.HOME ||
    pathname.startsWith("/diplomas") ||
    pathname.startsWith("/exams");
  const isProfileActive =
    pathname === ROUTES.PROFILE ||
    pathname === ROUTES.CHANGE_PASSWORD ||
    pathname.startsWith("/account");

  return (
    <aside className="w-64 h-screen h-dvh border-e border-border/70 bg-brand-blue-50 flex flex-col justify-between shrink-0 p-6 select-none">
      {/* Top: Brand Logos & Navigation */}
      <div className="space-y-8">
        {/* Logos Header */}
        <div className="space-y-2">
          <Link href={ROUTES.HOME} className="block">
            <Image
              src={logoImg}
              alt="Elevate Logo"
              width={140}
              height={36}
              priority
              style={{ width: "auto" }}
              className="h-9 object-contain"
            />
          </Link>
          <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-foreground/80">
            <div className="flex items-center justify-center size-5 rounded-sm bg-primary text-primary-foreground shadow-2xs">
              <BookOpen className="size-3" />
            </div>
            <span>Exam App</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {/* Diplomas Item */}
          <Link
            href={ROUTES.HOME}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isDiplomasActive
                ? "bg-white text-primary border border-primary/20 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-white/60"
            }`}
          >
            <GraduationCap className="size-4.5 text-primary" />
            <span>Diplomas</span>
          </Link>

          {/* Account Settings Item */}
          <Link
            href={ROUTES.PROFILE}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isProfileActive
                ? "bg-white text-primary border border-primary/20 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-white/60"
            }`}
          >
            <User className="size-4.5" />
            <span>Account Settings</span>
          </Link>
        </nav>
      </div>

      {/* Bottom: User Card & Dropdown Menu */}
      <div className="relative pt-6 border-t border-border/70" ref={dropdownRef}>
        {/* Dropdown Menu (Badge A in screenshot) */}
        {isDropdownOpen && (
          <div className="absolute inset-x-0 bottom-full mb-3 rounded-lg border border-border bg-popover p-1.5 shadow-lg text-xs z-50 animate-in fade-in-50 slide-in-from-bottom-2">
            <Link
              href={ROUTES.PROFILE}
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-foreground transition-colors font-medium"
            >
              <User className="size-4 text-muted-foreground" />
              <span>Account</span>
            </Link>

            {/* Only show Dashboard for Admin & Super Admin */}
            {isAdmin && (
              <Link
                href={ROUTES.ADMIN.ROOT}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-foreground transition-colors font-medium"
              >
                <LayoutDashboard className="size-4 text-muted-foreground" />
                <span>Dashboard</span>
              </Link>
            )}

            <div className="my-1 border-t border-border" />

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors font-medium cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* User Card Trigger */}
        <div
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar */}
            <div className="size-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
              {user?.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={user.firstName || "User"}
                  width={36}
                  height={36}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                <span>{(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}</span>
              )}
            </div>

            {/* Info */}
            <div className="overflow-hidden leading-tight text-start">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.username || "Guest User"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground p-1 shrink-0"
            aria-label="User menu"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

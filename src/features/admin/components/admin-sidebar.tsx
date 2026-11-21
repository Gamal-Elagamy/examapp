"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  GraduationCap,
  BookOpen,
  User,
  ListChecks,
  MoreVertical,
  LogOut,
  Code2,
  LayoutGrid,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { useProfile } from "@/features/account/hooks/use-profile";
import logoImg from "@/assets/logo.png";
import type { IUser } from "@/shared/lib/types/user";

interface AdminSidebarProps {
  user?: IUser | null;
  onNavigate?: () => void;
}

export function AdminSidebar({ user: initialUser, onNavigate }: AdminSidebarProps) {
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

  const isDiplomasActive =
    pathname === ROUTES.ADMIN.ROOT ||
    pathname.startsWith("/admin/diplomas");
  const isExamsActive = pathname.startsWith("/admin/exams");
  const isAccountActive =
    pathname.startsWith("/admin/profile") ||
    pathname.startsWith("/admin/change-password") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/change-password") ||
    pathname.startsWith("/account");
  const isAuditLogActive = pathname.startsWith("/admin/audit-log") || pathname.startsWith("/audit-log");

  const avatarInitial = (user?.firstName?.[0] || user?.username?.[0] || "A").toUpperCase();
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : user?.username || "Admin User";

  return (
    <aside className="w-64 h-screen h-dvh border-e border-[#24303F] bg-[#1A2232] text-slate-300 flex flex-col justify-between shrink-0 p-6 select-none">
      {/* Top Section: Logo & Admin Navigation Links */}
      <div className="space-y-8">
        {/* Logos Header */}
        <div className="space-y-2">
          <Link href={ROUTES.ADMIN.DIPLOMAS} onClick={onNavigate} className="block">
            <Image
              src={logoImg}
              alt="Elevate Logo"
              width={140}
              height={36}
              priority
              style={{ width: "auto" }}
              className="h-9 object-contain brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-slate-300">
            <div className="flex items-center justify-center size-5 rounded-sm bg-slate-800 border border-slate-700 text-slate-300 shadow-2xs">
              <Code2 className="size-3" />
            </div>
            <span>Exam App</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {/* Diplomas Item */}
          <Link
            href={ROUTES.ADMIN.DIPLOMAS}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isDiplomasActive
                ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
            }`}
          >
            <GraduationCap className="size-4.5 text-slate-200" />
            <span>Diplomas</span>
          </Link>

          {/* Exams Item */}
          <Link
            href={ROUTES.ADMIN.EXAMS}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isExamsActive
                ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
            }`}
          >
            <BookOpen className="size-4.5" />
            <span>Exams</span>
          </Link>

          {/* Account Settings Item */}
          <Link
            href={ROUTES.ADMIN.PROFILE}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isAccountActive
                ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
            }`}
          >
            <User className="size-4.5" />
            <span>Account Settings</span>
          </Link>

          {/* Audit Log Item */}
          <Link
            href={ROUTES.ADMIN.AUDIT_LOG}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isAuditLogActive
                ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
            }`}
          >
            <ListChecks className="size-4.5" />
            <span>Audit Log</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Section: Admin User Card & Menu */}
      <div className="relative pt-6 border-t border-[#24303F]" ref={dropdownRef}>
        {/* Dropdown Menu (matching screenshot) */}
        {isDropdownOpen && (
          <div className="absolute inset-x-0 bottom-full mb-3 rounded-xl border border-border bg-white p-1.5 shadow-2xl text-xs z-50 animate-in fade-in-50 slide-in-from-bottom-2 text-slate-700 divide-y divide-border/60 font-mono">
            <Link
              href={ROUTES.ADMIN.PROFILE}
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors font-medium"
            >
              <User className="size-4 text-slate-500" />
              <span>Account</span>
            </Link>

            <Link
              href={ROUTES.HOME}
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors font-medium"
            >
              <LayoutGrid className="size-4 text-slate-500" />
              <span>Application</span>
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors font-medium cursor-pointer"
            >
              <LogOut className="size-4 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* User Card Trigger */}
        <div
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-[#24303F] transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar */}
            <div className="size-9 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center shrink-0 border border-slate-600 overflow-hidden text-xs">
              {user?.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={displayName}
                  width={36}
                  height={36}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                <span>{avatarInitial}</span>
              )}
            </div>

            {/* Info */}
            <div className="overflow-hidden leading-tight text-start">
              <p className="text-xs font-semibold text-white truncate font-mono">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-400 truncate font-mono">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="text-slate-400 hover:text-white p-1 shrink-0"
            aria-label="User menu"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

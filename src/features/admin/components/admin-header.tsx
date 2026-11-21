"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  User,
  ListChecks,
  LogOut,
  Code2,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { useProfile } from "@/features/account/hooks/use-profile";
import logoImg from "@/assets/logo.png";
import type { IUser } from "@/shared/lib/types/user";

interface AdminHeaderProps {
  user?: IUser | null;
}

export function AdminHeader({ user: initialUser }: AdminHeaderProps) {
  const { data: user = initialUser } = useProfile({
    initialData: initialUser || undefined,
  });

  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Close drawer and dropdown on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsDrawerOpen(false);
    setIsUserMenuOpen(false);
  }

  // Handle ESC key to close drawer or menu
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setIsUserMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const isDiplomasActive =
    pathname === ROUTES.ADMIN.ROOT ||
    pathname.startsWith("/admin/diplomas");
  const isExamsActive = pathname.startsWith("/admin/exams") || pathname.startsWith("/exams");
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
    <>
      {/* Top Navbar Header (Visible on Mobile & Tablet, Hidden on lg+ Desktop) */}
      <header className="lg:hidden sticky top-0 z-40 w-full h-15 bg-[#1A2232] text-white border-b border-[#24303F] px-4 sm:px-6 flex items-center justify-between shadow-md">
        {/* Left: Hamburger Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="size-9.5 rounded-lg border border-[#313D4A] bg-[#24303F] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#313D4A] transition-colors shadow-2xs cursor-pointer"
          >
            <Menu className="size-5" />
          </button>

          <Link href={ROUTES.ADMIN.DIPLOMAS} className="flex items-center gap-2">
            <Image
              src={logoImg}
              alt="Elevate Logo"
              width={105}
              height={28}
              priority
              style={{ width: "auto" }}
              className="h-7 object-contain brightness-0 invert"
            />
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700">
              <Code2 className="size-3" />
              <span>Exam App</span>
            </div>
          </Link>
        </div>

        {/* Right: User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-label="User menu"
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#24303F] transition-colors cursor-pointer"
          >
            <div className="size-8.5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center shrink-0 border border-slate-600 overflow-hidden text-xs">
              {user?.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={displayName}
                  width={34}
                  height={34}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                <span>{avatarInitial}</span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-200 max-w-32 truncate font-mono">
              {displayName}
            </span>
          </button>

          {/* Quick User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute inset-e-0 top-full mt-2 w-56 rounded-xl border border-[#313D4A] bg-[#24303F] p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95 text-slate-200">
              <div className="px-3 py-2 border-b border-[#313D4A]">
                <p className="font-semibold text-white truncate font-mono">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate font-mono">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  href={ROUTES.ADMIN.PROFILE}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-[#313D4A] text-slate-200 transition-colors font-medium"
                >
                  <User className="size-4 text-slate-400" />
                  <span>Account</span>
                </Link>

                <Link
                  href={ROUTES.HOME}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-[#313D4A] text-slate-200 transition-colors font-medium"
                >
                  <LayoutGrid className="size-4 text-slate-400" />
                  <span>Application</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-[#313D4A]">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-destructive/20 text-red-400 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile & Tablet Slide-Over Drawer Navigation */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <aside className="fixed inset-y-0 inset-s-0 z-50 w-72 max-w-[85vw] bg-[#1A2232] border-e border-[#24303F] p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 select-none text-slate-300">
            {/* Top Brand & Close Button */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#24303F]">
                <div className="space-y-1">
                  <Image
                    src={logoImg}
                    alt="Elevate Logo"
                    width={110}
                    height={30}
                    style={{ width: "auto" }}
                    className="h-7 object-contain brightness-0 invert"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <div className="flex items-center justify-center size-4.5 rounded-sm bg-slate-800 border border-slate-700 text-slate-300 shadow-2xs">
                      <Code2 className="size-2.5" />
                    </div>
                    <span>Exam App</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close navigation menu"
                  className="size-8 rounded-lg border border-[#313D4A] bg-[#24303F] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#313D4A] transition-colors shadow-2xs cursor-pointer"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                <Link
                  href={ROUTES.ADMIN.DIPLOMAS}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isDiplomasActive
                      ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="size-4.5 text-slate-200" />
                    <span>Diplomas</span>
                  </div>
                  <ChevronRight className="size-4 text-slate-500" />
                </Link>

                <Link
                  href={ROUTES.ADMIN.EXAMS}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isExamsActive
                      ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="size-4.5" />
                    <span>Exams</span>
                  </div>
                  <ChevronRight className="size-4 text-slate-500" />
                </Link>

                <Link
                  href={ROUTES.ADMIN.PROFILE}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isAccountActive
                      ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="size-4.5" />
                    <span>Account Settings</span>
                  </div>
                  <ChevronRight className="size-4 text-slate-500" />
                </Link>

                <Link
                  href={ROUTES.ADMIN.AUDIT_LOG}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isAuditLogActive
                      ? "bg-[#24303F] text-white border border-[#313D4A] shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-[#24303F]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ListChecks className="size-4.5" />
                    <span>Audit Log</span>
                  </div>
                  <ChevronRight className="size-4 text-slate-500" />
                </Link>
              </nav>
            </div>

            {/* Bottom User Card & Logout */}
            <div className="pt-6 border-t border-[#24303F] space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-[#24303F] border border-[#313D4A]">
                <div className="size-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center shrink-0 border border-slate-600 overflow-hidden text-sm">
                  {user?.profilePhoto ? (
                    <Image
                      src={user.profilePhoto}
                      alt={displayName}
                      width={40}
                      height={40}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{avatarInitial}</span>
                  )}
                </div>
                <div className="overflow-hidden leading-tight text-start flex-1 font-mono">
                  <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || "admin@example.com"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-900/60 text-red-300 text-xs font-semibold transition-colors cursor-pointer select-none"
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

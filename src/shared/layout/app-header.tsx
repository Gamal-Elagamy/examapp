"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  GraduationCap,
  User,
  LayoutDashboard,
  LogOut,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { useProfile } from "@/features/account/hooks/use-profile";
import logoImg from "@/assets/logo.png";
import type { IUser } from "@/shared/lib/types/user";

interface AppHeaderProps {
  user?: IUser | null;
}

export function AppHeader({ user: initialUser }: AppHeaderProps) {
  const { data: session } = useSession();
  const { data: user = initialUser } = useProfile({
  initialData: initialUser || undefined,
  });

  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

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

  const role = user?.role || (session?.user as IUser | undefined)?.role;
  const isAdmin =
  role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;

  const isDiplomasActive =
  pathname === ROUTES.HOME ||
  pathname.startsWith("/diplomas") ||
  pathname.startsWith("/exams");
  const isProfileActive =
  pathname === ROUTES.PROFILE ||
  pathname === ROUTES.CHANGE_PASSWORD ||
  pathname.startsWith("/account");

  const avatarInitial = (user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase();
  const displayName = user?.firstName
  ? `${user.firstName} ${user.lastName || ""}`
  : user?.username || "Guest User";

  return (
  <>
  {/* Top Navbar Header (Visible on Mobile & Tablet, Hidden on lg+ Desktop) */}
  <header className="lg:hidden sticky top-0 z-40 w-full h-15 bg-white/95 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
  {/* Left: Hamburger Button & Logo */}
  <div className="flex items-center gap-3">
  <button
  type="button"
  onClick={() => setIsDrawerOpen(true)}
  aria-label="Open navigation menu"
  className="size-9.5 border border-border/80 bg-white flex items-center justify-center text-foreground hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
  >
  <Menu className="size-5" />
  </button>

  <Link href={ROUTES.HOME} className="flex items-center gap-2">
  <Image
  src={logoImg}
  alt="Elevate Logo"
  width={105}
  height={28}
  priority
  style={{ width: "auto" }}
  className="h-7 object-contain"
  />
  <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-bold">
  <BookOpen className="size-3" />
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
  className="flex items-center gap-2.5 p-1 hover:bg-slate-100 transition-colors cursor-pointer"
  >
  <div className="size-8.5 bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden text-xs">
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
  <span className="hidden sm:inline text-xs font-semibold text-foreground max-w-32 truncate">
  {displayName}
  </span>
  </button>

  {/* Quick User Dropdown */}
  {isUserMenuOpen && (
  <div className="absolute inset-e-0 top-full mt-2 w-56 border border-border bg-popover p-1.5 shadow-xl text-xs z-50 animate-in fade-in-50 zoom-in-95">
  <div className="px-3 py-2 border-b border-border/60">
  <p className="font-semibold text-foreground truncate">{displayName}</p>
  <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
  </div>

  <div className="py-1">
  <Link
  href={isAdmin ? ROUTES.ADMIN.PROFILE : ROUTES.PROFILE}
  onClick={() => setIsUserMenuOpen(false)}
  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-accent text-foreground transition-colors font-medium"
  >
  <User className="size-4 text-muted-foreground" />
  <span>Account Settings</span>
  </Link>

  {isAdmin && (
  <Link
  href={ROUTES.ADMIN.ROOT}
  onClick={() => setIsUserMenuOpen(false)}
  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-accent text-foreground transition-colors font-medium"
  >
  <LayoutDashboard className="size-4 text-muted-foreground" />
  <span>Dashboard</span>
  </Link>
  )}
  </div>

  <div className="pt-1 border-t border-border/60">
  <button
  type="button"
  onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-destructive/10 text-destructive transition-colors font-medium cursor-pointer"
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
  className="fixed inset-0 bg-black/50 backdrop-blur-xs"
  onClick={() => setIsDrawerOpen(false)}
  aria-hidden="true"
  />

  {/* Slide-out Drawer Panel */}
  <aside className="fixed inset-y-0 inset-s-0 z-50 w-72 max-w-[85vw] bg-brand-blue-50 border-e border-border/70 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 select-none">
  {/* Top Brand & Close Button */}
  <div className="space-y-6">
  <div className="flex items-center justify-between pb-4 border-b border-border/70">
  <div className="space-y-1">
  <Image
  src={logoImg}
  alt="Elevate Logo"
  width={110}
  height={30}
  style={{ width: "auto" }}
  className="h-7 object-contain"
  />
  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
  <div className="flex items-center justify-center size-4.5 bg-primary text-primary-foreground shadow-2xs">
  <BookOpen className="size-2.5" />
  </div>
  <span>Exam App</span>
  </div>
  </div>

  <button
  type="button"
  onClick={() => setIsDrawerOpen(false)}
  aria-label="Close navigation menu"
  className="size-8 border border-border/80 bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
  >
  <X className="size-4.5" />
  </button>
  </div>

  {/* Navigation Links */}
  <nav className="space-y-2">
  <Link
  href={ROUTES.HOME}
  onClick={() => setIsDrawerOpen(false)}
  className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold transition-colors ${
  isDiplomasActive
  ? "bg-white text-primary border border-primary/20 shadow-xs"
  : "text-muted-foreground hover:text-foreground hover:bg-white/60"
  }`}
  >
  <div className="flex items-center gap-3">
  <GraduationCap className="size-4.5 text-primary" />
  <span>Diplomas</span>
  </div>
  <ChevronRight className="size-4 text-muted-foreground/60" />
  </Link>

  <Link
  href={isAdmin ? ROUTES.ADMIN.PROFILE : ROUTES.PROFILE}
  onClick={() => setIsDrawerOpen(false)}
  className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium transition-colors ${
  isProfileActive
  ? "bg-white text-primary border border-primary/20 shadow-xs"
  : "text-muted-foreground hover:text-foreground hover:bg-white/60"
  }`}
  >
  <div className="flex items-center gap-3">
  <User className="size-4.5" />
  <span>Account Settings</span>
  </div>
  <ChevronRight className="size-4 text-muted-foreground/60" />
  </Link>

  {isAdmin && (
  <Link
  href={ROUTES.ADMIN.ROOT}
  onClick={() => setIsDrawerOpen(false)}
  className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/60 transition-colors"
  >
  <div className="flex items-center gap-3">
  <LayoutDashboard className="size-4.5 text-primary" />
  <span>Dashboard</span>
  </div>
  <ChevronRight className="size-4 text-muted-foreground/60" />
  </Link>
  )}
  </nav>
  </div>

  {/* Bottom User Card & Logout */}
  <div className="pt-6 border-t border-border/70 space-y-3">
  <div className="flex items-center gap-3 p-2 bg-white/70 border border-border/60">
  <div className="size-10 bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden text-sm">
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
  <div className="overflow-hidden leading-tight text-start flex-1">
  <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
  <p className="text-[11px] text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
  </div>
  </div>

  <button
  type="button"
  onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-destructive text-xs font-semibold transition-colors cursor-pointer select-none"
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

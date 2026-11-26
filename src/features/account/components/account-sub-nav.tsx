"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Lock, LogOut } from "lucide-react";
import { ROUTES } from "@/routes";

interface AccountSubNavProps {
  basePath?: "user" | "admin";
}

export function AccountSubNav({ basePath = "user" }: AccountSubNavProps) {
  const pathname = usePathname();

  const profileHref = basePath === "admin" ? ROUTES.ADMIN.PROFILE : ROUTES.PROFILE;
  const changePasswordHref =
  basePath === "admin" ? ROUTES.ADMIN.CHANGE_PASSWORD : ROUTES.CHANGE_PASSWORD;

  const isProfileActive = pathname === profileHref;
  const isChangePasswordActive = pathname === changePasswordHref;

  return (
  <div className="flex flex-col md:justify-between h-auto md:h-full md:min-h-110 select-none">
  {/* Navigation Links: Segmented Tabs on Mobile/Tablet, Vertical Menu on Desktop */}
  <nav
  className="grid grid-cols-2 md:grid-cols-1 gap-2 p-1 bg-slate-100/90 md:bg-transparent md:space-y-2"
  aria-label="Account Sub Navigation"
  >
  {/* Profile Link */}
  <Link
  href={profileHref}
  className={`flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all ${
  isProfileActive
  ? "bg-white md:bg-primary/10 text-primary font-semibold shadow-xs md:shadow-2xs"
  : "text-muted-foreground hover:text-foreground hover:bg-white/60 md:hover:bg-slate-50"
  }`}
  >
  <User className="size-4 sm:size-4.5 text-primary" />
  <span>Profile</span>
  </Link>

  {/* Change Password Link */}
  <Link
  href={changePasswordHref}
  className={`flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all ${
  isChangePasswordActive
  ? "bg-white md:bg-primary/10 text-primary font-semibold shadow-xs md:shadow-2xs"
  : "text-muted-foreground hover:text-foreground hover:bg-white/60 md:hover:bg-slate-50"
  }`}
  >
  <Lock className="size-4 sm:size-4.5" />
  <span>Change Password</span>
  </Link>
  </nav>

  {/* Bottom Logout Action: Desktop Only (Mobile has it in AppHeader) */}
  <div className="hidden md:block pt-8">
  <button
  type="button"
  onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
  className="w-fit inline-flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-mono text-destructive bg-red-50/90 hover:bg-red-100 transition-colors cursor-pointer"
  >
  <LogOut className="size-4" />
  <span>Logout</span>
  </button>
  </div>
  </div>
  );
}

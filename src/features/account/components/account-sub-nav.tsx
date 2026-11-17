"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Lock, LogOut } from "lucide-react";
import { ROUTES } from "@/routes";

export function AccountSubNav() {
  const pathname = usePathname();

  const isProfileActive = pathname === ROUTES.PROFILE;
  const isChangePasswordActive = pathname === ROUTES.CHANGE_PASSWORD;

  return (
    <div className="flex flex-col justify-between h-full min-h-[440px] sm:min-h-[480px] select-none">
      {/* Top Navigation Links */}
      <nav className="space-y-2" aria-label="Account Sub Navigation">
        {/* Profile Link */}
        <Link
          href={ROUTES.PROFILE}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isProfileActive
              ? "bg-primary/10 text-primary font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
          }`}
        >
          <User className="size-4.5 text-primary" />
          <span>Profile</span>
        </Link>

        {/* Change Password Link */}
        <Link
          href={ROUTES.CHANGE_PASSWORD}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isChangePasswordActive
              ? "bg-primary/10 text-primary font-semibold shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
          }`}
        >
          <Lock className="size-4.5" />
          <span>Change Password</span>
        </Link>
      </nav>

      {/* Bottom Logout Action (Positioned at bottom of the sub-layout) */}
      <div className="pt-8">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
          className="w-fit inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono text-destructive bg-red-50/90 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

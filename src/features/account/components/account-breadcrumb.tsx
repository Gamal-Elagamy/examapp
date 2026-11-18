"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes";

export function AccountBreadcrumb() {
  const pathname = usePathname();
  const isChangePassword = pathname?.includes("/change-password");

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
      {isChangePassword ? (
        <>
          <Link
            href={ROUTES.PROFILE}
            className="hover:text-foreground transition-colors"
          >
            Account
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-primary font-medium">Change Password</span>
        </>
      ) : (
        <span className="text-foreground font-medium">Account</span>
      )}
    </nav>
  );
}

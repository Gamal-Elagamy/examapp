import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, User } from "lucide-react";
import { ROUTES } from "@/routes";
import { AccountSubNav } from "@/features/account/components/account-sub-nav";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <span className="text-foreground font-medium">Account</span>
      </nav>

      {/* Header Row: Back Button & Blue Banner */}
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.HOME}
          aria-label="Back to home"
          className="size-12 sm:size-14 rounded-lg border border-border/80 bg-white flex items-center justify-center text-primary hover:bg-brand-blue-50 hover:border-primary transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <ChevronLeft className="size-6 text-primary" />
        </Link>

        <div className="flex-1 h-12 sm:h-14 bg-primary text-white rounded-lg px-4 sm:px-6 flex items-center gap-3 shadow-xs overflow-hidden">
          <User className="size-6 shrink-0" />
          <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">
            Account Settings
          </h1>
        </div>
      </div>

      {/* Account Inner Layout: Left Side (~1/4 width) & Right Side (~3/4 width) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Side Sub-Layout (Takes ~1/4 of the width) */}
        <aside className="md:col-span-4 lg:col-span-3 h-full min-h-[460px]">
          <AccountSubNav />
        </aside>

        {/* Right Side Content (Takes ~3/4 of the width) */}
        <main className="md:col-span-8 lg:col-span-9 min-h-[460px]">
          {children}
        </main>
      </div>
    </div>
  );
}

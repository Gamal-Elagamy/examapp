"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardSlotSwitcherProps {
  admin: ReactNode;
  user: ReactNode;
  isAdmin: boolean;
  children?: ReactNode;
}

export function DashboardSlotSwitcher({
  admin,
  user,
  isAdmin,
  children,
}: DashboardSlotSwitcherProps) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  return (
    <>
      {isAdmin && isAdminPath ? admin : user}
      {children}
    </>
  );
}

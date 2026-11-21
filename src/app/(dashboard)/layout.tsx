import type { ReactNode } from "react";
import { auth } from "@/auth";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";
import { DashboardSlotSwitcher } from "./dashboard-slot-switcher";

interface DashboardLayoutProps {
  children?: ReactNode;
  admin: ReactNode;
  user: ReactNode;
}

export default async function DashboardLayout({
  children,
  admin,
  user,
}: DashboardLayoutProps) {
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;

  return (
    <DashboardSlotSwitcher admin={admin} user={user} isAdmin={isAdmin}>
      {children}
    </DashboardSlotSwitcher>
  );
}

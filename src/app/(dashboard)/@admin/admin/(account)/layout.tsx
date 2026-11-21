import type { ReactNode } from "react";
import { AccountLayout } from "@/features/account/layout/account.layout";

export default function AdminAccountLayout({ children }: { children: ReactNode }) {
  return <AccountLayout role="admin">{children}</AccountLayout>;
}

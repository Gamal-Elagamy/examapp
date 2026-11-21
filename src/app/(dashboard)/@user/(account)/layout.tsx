import type { ReactNode } from "react";
import { AccountLayout } from "@/features/account/layout/account.layout";

export default function UserAccountLayout({ children }: { children: ReactNode }) {
  return <AccountLayout role="user">{children}</AccountLayout>;
}

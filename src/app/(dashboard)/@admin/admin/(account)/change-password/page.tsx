import type { Metadata } from "next";
import { ChangePasswordRoute } from "@/features/account/routes/change-password.route";

export const metadata: Metadata = {
  title: "Admin Change Password | Elevate Exam App",
  description: "Update your admin account password.",
};

export default function AdminChangePasswordPage() {
  return <ChangePasswordRoute />;
}

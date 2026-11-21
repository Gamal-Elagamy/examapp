import type { Metadata } from "next";
import { ChangePasswordRoute } from "@/features/account/routes/change-password.route";

export const metadata: Metadata = {
  title: "Change Password | Elevate Exam App",
  description: "Update your account password.",
};

export default function UserChangePasswordPage() {
  return <ChangePasswordRoute />;
}

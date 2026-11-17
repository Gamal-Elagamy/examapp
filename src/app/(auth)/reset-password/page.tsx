import type { Metadata } from "next";
import { ResetPasswordRoute } from "@/features/auth/routes/reset-password.route";

export const metadata: Metadata = {
  title: "Reset Password | Elevate Exam App",
  description: "Create a new password for your Elevate account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordRoute />;
}

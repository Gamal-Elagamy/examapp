import type { Metadata } from "next";
import { ForgotPasswordRoute } from "@/features/auth/routes/forgot-password.route";

export const metadata: Metadata = {
  title: "Forgot Password | Elevate Exam App",
  description: "Recover your Elevate account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordRoute />;
}

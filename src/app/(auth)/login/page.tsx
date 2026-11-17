import type { Metadata } from "next";
import { LoginRoute } from "@/features/auth/routes/login.route";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Elevate exam account",
};

export default function LoginPage() {
  return <LoginRoute />;
}

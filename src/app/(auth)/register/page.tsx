import type { Metadata } from "next";
import { RegisterRoute } from "@/features/auth/routes/register.route";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Sign up for an Elevate Exam account",
};

export default function RegisterPage() {
  return <RegisterRoute />;
}

import type { Metadata } from "next";
import { ProfileRoute } from "@/features/account/routes/profile.route";

export const metadata: Metadata = {
  title: "Admin Profile | Elevate Exam App",
  description: "Manage your admin personal account profile details.",
};

export default function AdminProfilePage() {
  return <ProfileRoute />;
}

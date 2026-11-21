import type { Metadata } from "next";
import { ProfileRoute } from "@/features/account/routes/profile.route";

export const metadata: Metadata = {
  title: "Profile | Elevate Exam App",
  description: "Manage your personal account profile details.",
};

export default function UserProfilePage() {
  return <ProfileRoute />;
}

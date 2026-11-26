import type { Metadata } from "next";
import { AdminDiplomaFormRoute } from "@/features/admin/routes/admin-diploma-form.route";

export const metadata: Metadata = {
  title: "Add New Diploma | Admin",
  description: "Create a new diploma track in the system.",
};

export default function AdminCreateDiplomaPage() {
  return <AdminDiplomaFormRoute />;
}

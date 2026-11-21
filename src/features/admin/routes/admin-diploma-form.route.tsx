import { AdminDiplomaForm } from "../components/admin-diploma-form";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface AdminDiplomaFormRouteProps {
  initialDiploma?: IDiploma;
  isEditing?: boolean;
}

export function AdminDiplomaFormRoute({
  initialDiploma,
  isEditing = false,
}: AdminDiplomaFormRouteProps) {
  return (
    <div className="max-w-5xl mx-auto w-full py-2">
      <AdminDiplomaForm initialDiploma={initialDiploma} isEditing={isEditing} />
    </div>
  );
}

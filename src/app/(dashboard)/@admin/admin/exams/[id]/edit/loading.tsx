import { AdminExamFormSkeleton } from "@/features/admin/skeletons/admin-exam-form.skeleton";

export default function AdminEditExamLoading() {
  return (
    <div className="py-2">
      <AdminExamFormSkeleton isEditing={true} />
    </div>
  );
}

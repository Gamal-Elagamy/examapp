import { AdminExamFormSkeleton } from "@/features/admin/skeletons/admin-exam-form.skeleton";

export default function AdminCreateExamLoading() {
  return (
    <div className="py-2">
      <AdminExamFormSkeleton isEditing={false} />
    </div>
  );
}

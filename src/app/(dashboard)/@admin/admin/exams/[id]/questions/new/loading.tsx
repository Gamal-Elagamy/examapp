import { AdminQuestionFormSkeleton } from "@/features/admin/skeletons/admin-question-form.skeleton";

export default function AdminCreateQuestionLoading() {
  return (
    <div className="py-2">
      <AdminQuestionFormSkeleton />
    </div>
  );
}

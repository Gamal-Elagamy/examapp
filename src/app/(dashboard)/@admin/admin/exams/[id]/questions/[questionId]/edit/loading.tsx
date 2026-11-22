import { AdminQuestionFormSkeleton } from "@/features/admin/skeletons/admin-question-form.skeleton";

export default function AdminEditQuestionLoading() {
  return (
    <div className="py-2">
      <AdminQuestionFormSkeleton />
    </div>
  );
}

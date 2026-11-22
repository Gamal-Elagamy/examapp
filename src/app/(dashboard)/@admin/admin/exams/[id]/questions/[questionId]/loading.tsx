import { AdminQuestionViewSkeleton } from "@/features/admin/skeletons/admin-question-view.skeleton";

export default function AdminQuestionViewLoading() {
  return (
    <div className="py-2">
      <AdminQuestionViewSkeleton />
    </div>
  );
}

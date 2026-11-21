import { AdminExamViewSkeleton } from "@/features/admin/skeletons/admin-exam-view.skeleton";

export default function AdminExamViewLoading() {
  return (
    <div className="py-2">
      <AdminExamViewSkeleton />
    </div>
  );
}

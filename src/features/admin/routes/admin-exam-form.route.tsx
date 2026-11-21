import { AdminExamForm } from "../components/admin-exam-form";
import type { IExamDetails } from "@/shared/lib/types/exam";
import type { IQuestion } from "@/shared/lib/types/question";

interface AdminExamFormRouteProps {
  initialExam?: IExamDetails;
  isEditing?: boolean;
  initialQuestions?: IQuestion[];
  diplomas: { id: string; title: string }[];
}

export function AdminExamFormRoute({
  initialExam,
  isEditing = false,
  initialQuestions = [],
  diplomas = [],
}: AdminExamFormRouteProps) {
  return (
    <div className="py-2">
      <AdminExamForm
        initialExam={initialExam}
        isEditing={isEditing}
        initialQuestions={initialQuestions}
        diplomas={diplomas}
      />
    </div>
  );
}

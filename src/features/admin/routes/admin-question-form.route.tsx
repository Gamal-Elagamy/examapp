import { AdminQuestionForm } from "../components/admin-question-form";
import type { IQuestion } from "@/shared/lib/types/question";

interface ExamOption {
  id: string;
  title: string;
}

interface AdminQuestionFormRouteProps {
  mode: "create" | "edit";
  initialExamId?: string;
  initialQuestion?: IQuestion;
  exams?: ExamOption[];
}

export function AdminQuestionFormRoute({
  mode,
  initialExamId,
  initialQuestion,
  exams = [],
}: AdminQuestionFormRouteProps) {
  return (
    <div className="py-2">
      <AdminQuestionForm
        mode={mode}
        initialExamId={initialExamId}
        initialQuestion={initialQuestion}
        exams={exams}
      />
    </div>
  );
}

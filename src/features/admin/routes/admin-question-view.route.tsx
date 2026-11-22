import { AdminQuestionView } from "../components/admin-question-view";
import type { IQuestion } from "@/shared/lib/types/question";
import type { IExamDetails } from "@/shared/lib/types/exam";

interface AdminQuestionViewRouteProps {
  question: IQuestion;
  exam: IExamDetails;
}

export function AdminQuestionViewRoute({
  question,
  exam,
}: AdminQuestionViewRouteProps) {
  return (
    <div className="py-2">
      <AdminQuestionView question={question} exam={exam} />
    </div>
  );
}


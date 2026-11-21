import { AdminExamView } from "../components/admin-exam-view";
import type { IExamDetails } from "@/shared/lib/types/exam";
import type { IQuestion } from "@/shared/lib/types/question";

interface AdminExamViewRouteProps {
  exam: IExamDetails;
  initialQuestions?: IQuestion[];
}

export function AdminExamViewRoute({
  exam,
  initialQuestions = [],
}: AdminExamViewRouteProps) {
  return (
    <div className="py-2">
      <AdminExamView exam={exam} initialQuestions={initialQuestions} />
    </div>
  );
}

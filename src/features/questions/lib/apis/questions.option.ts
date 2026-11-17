import { queryOptions } from "@tanstack/react-query";
import { questionKeys } from "./questions.key";
import { getClientExamQuestions } from "./questions.api";
import type { GetExamQuestionsParams } from "@/shared/lib/types/question";

export function examQuestionsQueryOptions(
  examId: string,
  params?: GetExamQuestionsParams,
) {
  return queryOptions({
    queryKey: [...questionKeys.exam(examId), params],
    queryFn: () => getClientExamQuestions(examId, params),
    enabled: !!examId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

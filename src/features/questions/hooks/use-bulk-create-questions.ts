import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClientBulkCreateQuestions,
  type IBulkQuestionsBody,
} from "@/features/questions/lib/apis/questions.api";
import { questionKeys } from "@/features/questions/lib/apis/questions.key";
import { examKeys } from "@/features/exams/lib/apis/exams.key";

interface BulkCreateQuestionsVariables {
  examId: string;
  data: IBulkQuestionsBody;
}

export function useBulkCreateQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, data }: BulkCreateQuestionsVariables) =>
      getClientBulkCreateQuestions(examId, data),
    onSuccess: (_data, variables) => {
      toast.success("Questions created successfully");
      queryClient.invalidateQueries({
        queryKey: questionKeys.exam(variables.examId),
      });
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk create questions");
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClientCreateQuestion,
  type ICreateQuestionBody,
} from "@/features/questions/lib/apis/questions.api";
import { questionKeys } from "@/features/questions/lib/apis/questions.key";
import { examKeys } from "@/features/exams/lib/apis/exams.key";

interface CreateQuestionVariables {
  examId: string;
  data: ICreateQuestionBody;
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, data }: CreateQuestionVariables) =>
      getClientCreateQuestion(examId, data),
    onSuccess: (_data, variables) => {
      toast.success("Question created successfully");
      queryClient.invalidateQueries({
        queryKey: questionKeys.exam(variables.examId),
      });
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create question");
    },
  });
}

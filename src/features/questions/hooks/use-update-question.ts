import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClientUpdateQuestion,
  type ICreateQuestionBody,
} from "@/features/questions/lib/apis/questions.api";
import { questionKeys } from "@/features/questions/lib/apis/questions.key";
import { examKeys } from "@/features/exams/lib/apis/exams.key";

interface UpdateQuestionVariables {
  id: string;
  data: ICreateQuestionBody;
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateQuestionVariables) =>
      getClientUpdateQuestion(id, data),
    onSuccess: (data) => {
      toast.success("Question updated successfully");
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update question");
    },
  });
}

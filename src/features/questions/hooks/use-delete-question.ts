import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClientDeleteQuestion } from "@/features/questions/lib/apis/questions.api";
import { questionKeys } from "@/features/questions/lib/apis/questions.key";
import { examKeys } from "@/features/exams/lib/apis/exams.key";

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => getClientDeleteQuestion(id),
    onSuccess: () => {
      toast.success("Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete question");
    },
  });
}

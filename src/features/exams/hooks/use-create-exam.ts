"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getClientCreateExam,
  type ExamMutationPayload,
} from "../lib/apis/exams.api";
import { examKeys } from "../lib/apis/exams.key";
import { ROUTES } from "@/routes";

export function useCreateExam() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ExamMutationPayload) => getClientCreateExam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: examKeys.all });
      router.push(ROUTES.ADMIN.EXAMS);
      router.refresh();
    },
  });
}

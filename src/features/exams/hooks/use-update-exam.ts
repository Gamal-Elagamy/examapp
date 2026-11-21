"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getClientUpdateExam,
  type ExamMutationPayload,
} from "../lib/apis/exams.api";
import { examKeys } from "../lib/apis/exams.key";
import { ROUTES } from "@/routes";

export function useUpdateExam() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExamMutationPayload }) =>
      getClientUpdateExam(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: examKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: examKeys.all });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(variables.id) });
      router.push(ROUTES.ADMIN.EXAMS);
      router.refresh();
    },
  });
}

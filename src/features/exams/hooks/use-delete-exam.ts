"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getClientDeleteExam } from "../lib/apis/exams.api";
import { examKeys } from "../lib/apis/exams.key";
import { ROUTES } from "@/routes";

export function useDeleteExam() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => getClientDeleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: examKeys.all });
      router.push(ROUTES.ADMIN.EXAMS);
      router.refresh();
    },
  });
}

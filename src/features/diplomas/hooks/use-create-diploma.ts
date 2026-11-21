"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getClientCreateDiploma, type DiplomaMutationPayload } from "../lib/apis/diplomas.api";
import { diplomaKeys } from "../lib/apis/diplomas.key";
import { ROUTES } from "@/routes";

export function useCreateDiploma() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: DiplomaMutationPayload) => getClientCreateDiploma(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diplomaKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: diplomaKeys.all });
      router.push(ROUTES.ADMIN.DIPLOMAS);
      router.refresh();
    },
  });
}

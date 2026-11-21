"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getClientUpdateDiploma, type DiplomaMutationPayload } from "../lib/apis/diplomas.api";
import { diplomaKeys } from "../lib/apis/diplomas.key";
import { ROUTES } from "@/routes";

export function useUpdateDiploma() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DiplomaMutationPayload }) =>
      getClientUpdateDiploma(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: diplomaKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: diplomaKeys.all });
      queryClient.invalidateQueries({ queryKey: diplomaKeys.detail(variables.id) });
      router.push(ROUTES.ADMIN.DIPLOMAS);
      router.refresh();
    },
  });
}

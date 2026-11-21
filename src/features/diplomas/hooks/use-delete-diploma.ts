"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getClientDeleteDiploma } from "../lib/apis/diplomas.api";
import { diplomaKeys } from "../lib/apis/diplomas.key";
import type { IDiplomasPayload } from "@/shared/lib/types/diploma";

export function useDeleteDiploma() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => getClientDeleteDiploma(id),
    onSuccess: (_data, deletedId) => {
      // 1. Instantly remove deleted diploma from all cached admin lists (instant feedback)
      queryClient.setQueriesData<IDiplomasPayload>(
        { queryKey: diplomaKeys.adminLists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((d) => d.id !== deletedId),
            metadata: {
              ...old.metadata,
              total: Math.max(0, old.metadata.total - 1),
            },
          };
        },
      );

      // 2. Invalidate both admin and public queries for background sync
      queryClient.invalidateQueries({ queryKey: diplomaKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: diplomaKeys.all });

      router.refresh();
    },
  });
}

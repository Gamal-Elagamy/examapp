"use client";

import { useQuery } from "@tanstack/react-query";
import { diplomaKeys } from "../lib/apis/diplomas.key";
import { getClientDiplomaById } from "../lib/apis/diplomas.api";
import type { IDiploma } from "@/shared/lib/types/diploma";

interface UseDiplomaDetailsOptions {
  id: string;
  initialData?: IDiploma;
}

export function useDiplomaDetails({ id, initialData }: UseDiplomaDetailsOptions) {
  return useQuery({
    queryKey: diplomaKeys.detail(id),
    queryFn: async () => {
      const data = await getClientDiplomaById(id);
      return data.diploma;
    },
    initialData,
    enabled: !!id,
  });
}

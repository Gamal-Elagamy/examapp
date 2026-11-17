"use client";

import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { diplomaKeys } from "../lib/apis/diplomas.key";
import { getClientDiplomas } from "../lib/apis/diplomas.api";
import type { IDiplomasPayload } from "@/shared/lib/types/diploma";

interface UseInfiniteDiplomasOptions {
  search?: string;
  initialData?: IDiplomasPayload;
}

export function useInfiniteDiplomas({
  search,
  initialData,
}: UseInfiniteDiplomasOptions = {}) {
  return useInfiniteQuery({
    queryKey: [...diplomaKeys.lists(), "infinite", { search }],
    queryFn: async ({ pageParam = 1 }): Promise<IDiplomasPayload> => {
      const data = await getClientDiplomas({
        page: typeof pageParam === "number" ? pageParam : 1,
        limit: 12,
        search,
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: IDiplomasPayload) => {
      const metadata = lastPage?.metadata;
      if (!metadata) return undefined;
      return metadata.page < metadata.totalPages ? metadata.page + 1 : undefined;
    },
    initialData: initialData
      ? (): InfiniteData<IDiplomasPayload, number> => ({
          pages: [initialData],
          pageParams: [1],
        })
      : undefined,
  });
}

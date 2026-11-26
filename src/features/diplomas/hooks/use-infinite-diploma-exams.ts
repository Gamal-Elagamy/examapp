import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientExams } from "@/features/exams/lib/apis/exams.api";
import { examKeys } from "@/features/exams/lib/apis/exams.key";
import type { IExamsPayload } from "@/shared/lib/types/exam";

interface UseInfiniteDiplomaExamsOptions {
  diplomaId: string;
  initialData?: IExamsPayload;
  limit?: number;
}

export function useInfiniteDiplomaExams({
  diplomaId,
  initialData,
  limit = 10,
}: UseInfiniteDiplomaExamsOptions) {
  return useInfiniteQuery({
    queryKey: examKeys.list({ diplomaId, limit }),
    queryFn: ({ pageParam = 1 }) =>
      getClientExams({
        diplomaId,
        page: pageParam,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
  });
}

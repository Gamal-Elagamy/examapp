"use client";

import { useQuery } from "@tanstack/react-query";
import { questionKeys } from "../lib/apis/questions.key";
import { getClientExamById } from "../lib/apis/questions.api";
import type { IExamDetails } from "@/shared/lib/types/exam";

interface UseExamDetailsOptions {
  examId: string;
  initialData?: IExamDetails;
}

export function useExamDetails({ examId, initialData }: UseExamDetailsOptions) {
  return useQuery({
    queryKey: questionKeys.examDetail(examId),
    queryFn: async () => {
      const data = await getClientExamById(examId);
      return data.exam;
    },
    initialData,
    enabled: !!examId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

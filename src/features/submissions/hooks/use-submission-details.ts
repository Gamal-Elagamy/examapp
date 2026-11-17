"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientSubmissionById } from "../lib/apis/submissions.api";
import { submissionKeys } from "../lib/apis/submissions.key";
import type { ISubmissionDetailsPayload } from "@/shared/lib/types/submission";

interface UseSubmissionDetailsOptions {
  id: string;
  initialData?: ISubmissionDetailsPayload;
}

export function useSubmissionDetails({ id, initialData }: UseSubmissionDetailsOptions) {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => getClientSubmissionById(id),
    initialData,
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

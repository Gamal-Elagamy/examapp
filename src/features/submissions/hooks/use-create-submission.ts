"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientCreateSubmission } from "../lib/apis/submissions.api";
import { submissionKeys } from "../lib/apis/submissions.key";
import type {
  ICreateSubmissionInput,
  ISubmissionDetailsPayload,
} from "@/shared/lib/types/submission";

interface UseCreateSubmissionOptions {
  onSuccess?: (data: ISubmissionDetailsPayload) => void;
  onError?: (error: Error) => void;
}

export function useCreateSubmission(options?: UseCreateSubmissionOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ICreateSubmissionInput) => getClientCreateSubmission(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

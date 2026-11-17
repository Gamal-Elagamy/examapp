"use client";

import { useQuery } from "@tanstack/react-query";
import { examQuestionsQueryOptions } from "../lib/apis/questions.option";
import type { IQuestion, GetExamQuestionsParams } from "@/shared/lib/types/question";

interface UseExamQuestionsOptions {
  examId: string;
  params?: GetExamQuestionsParams;
  initialData?: IQuestion[];
}

export function useExamQuestions({
  examId,
  params,
  initialData,
}: UseExamQuestionsOptions) {
  return useQuery({
    ...examQuestionsQueryOptions(examId, params),
    initialData: initialData ? { questions: initialData } : undefined,
    select: (data) => data.questions,
  });
}

export const questionKeys = {
  all: ["questions"] as const,
  exam: (examId: string) => [...questionKeys.all, "exam", examId] as const,
  detail: (id: string) => [...questionKeys.all, "detail", id] as const,
};

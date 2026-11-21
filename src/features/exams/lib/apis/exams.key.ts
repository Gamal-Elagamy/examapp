import type { GetExamsParams } from "./exams.api";

export const examKeys = {
  all: ["exams"] as const,
  lists: () => [...examKeys.all, "list"] as const,
  list: (params?: GetExamsParams) => [...examKeys.lists(), params] as const,
  adminLists: () => ["admin-exams"] as const,
  adminList: (params?: GetExamsParams) => [...examKeys.adminLists(), params] as const,
  details: () => [...examKeys.all, "detail"] as const,
  detail: (id: string) => [...examKeys.details(), id] as const,
};

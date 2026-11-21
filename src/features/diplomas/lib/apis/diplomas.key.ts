import type { GetDiplomasParams } from "./diplomas.api";

export const diplomaKeys = {
  all: ["diplomas"] as const,
  lists: () => [...diplomaKeys.all, "list"] as const,
  list: (params?: GetDiplomasParams) => [...diplomaKeys.lists(), params] as const,
  adminLists: () => ["admin-diplomas"] as const,
  adminList: (params?: GetDiplomasParams) => [...diplomaKeys.adminLists(), params] as const,
  details: () => [...diplomaKeys.all, "detail"] as const,
  detail: (id: string) => [...diplomaKeys.details(), id] as const,
};

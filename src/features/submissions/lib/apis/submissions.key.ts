export const submissionKeys = {
  all: ["submissions"] as const,
  lists: () => [...submissionKeys.all, "list"] as const,
  list: (params?: unknown) => [...submissionKeys.lists(), params] as const,
  detail: (id: string) => [...submissionKeys.all, "detail", id] as const,
};

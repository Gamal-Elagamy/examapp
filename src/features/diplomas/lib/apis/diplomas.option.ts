import { queryOptions } from "@tanstack/react-query";
import { diplomaKeys } from "./diplomas.key";
import { getDiplomas, type GetDiplomasParams } from "./diplomas.api";

export function getDiplomasQueryOptions(params?: GetDiplomasParams, token?: string) {
  return queryOptions({
    queryKey: diplomaKeys.list(params),
    queryFn: () => getDiplomas(params, token),
  });
}

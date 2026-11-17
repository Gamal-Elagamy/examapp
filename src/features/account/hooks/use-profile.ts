"use client";

import { useQuery } from "@tanstack/react-query";
import { accountKeys } from "../lib/apis/account.key";
import { getClientUserProfile } from "../lib/apis/account.api";
import type { IUser } from "@/shared/lib/types/user";

interface UseProfileOptions {
  initialData?: IUser;
}

export function useProfile(options?: UseProfileOptions) {
  return useQuery({
    queryKey: accountKeys.profile(),
    queryFn: async () => {
      const data = await getClientUserProfile();
      return data.user;
    },
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

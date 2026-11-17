import { Skeleton } from "@/shared/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

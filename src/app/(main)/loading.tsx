import { DiplomaListSkeleton } from "@/features/diplomas/skeletons/diploma-card.skeleton";

export default function MainLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
      <div className="h-16 w-full bg-primary/20 rounded-lg animate-pulse" />
      <DiplomaListSkeleton />
    </div>
  );
}

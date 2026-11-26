"use client";

import { useEffect, useRef } from "react";
import { DiplomaCard } from "./diploma-card";
import { DiplomaCardSkeleton } from "../skeletons/diploma-card.skeleton";
import { useInfiniteDiplomas } from "../hooks/use-infinite-diplomas";
import { Loader2 } from "lucide-react";
import type { IDiplomasPayload } from "@/shared/lib/types/diploma";

interface DiplomaListProps {
  search?: string;
  initialData?: IDiplomasPayload;
}

export function DiplomaList({ search, initialData }: DiplomaListProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  error,
  } = useInfiniteDiplomas({ search, initialData });

  // IntersectionObserver to trigger infinite scroll as user scrolls down
  useEffect(() => {
  const target = loadMoreRef.current;
  if (!target) return;

  const observer = new IntersectionObserver(
  (entries) => {
  if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  fetchNextPage();
  }
  },
  {
  rootMargin: "200px",
  },
  );

  observer.observe(target);
  return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") {
  return (
  <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 bg-destructive/5">
  <h3 className="text-lg font-semibold text-destructive">Failed to load diplomas</h3>
  <p className="text-sm text-muted-foreground mt-1">
  {error instanceof Error ? error.message : "An unexpected error occurred"}
  </p>
  </div>
  );
  }

  const allDiplomas = data?.pages.flatMap((page) => page.data) || [];

  if (status !== "pending" && allDiplomas.length === 0) {
  return (
  <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border py-16">
  <h3 className="text-lg font-semibold text-foreground">No Diplomas Found</h3>
  <p className="text-sm text-muted-foreground mt-1">
  There are currently no diplomas available. Please check back later.
  </p>
  </div>
  );
  }

  return (
  <div className="space-y-8">
  {/* 3-Column Diplomas Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {allDiplomas.map((diploma, index) => (
  <DiplomaCard key={diploma.id} diploma={diploma} priority={index < 3} />
  ))}
  </div>

  {/* Infinite Scroll Sentinel & Loading Indicator */}
  <div ref={loadMoreRef} className="py-6 flex flex-col items-center justify-center">
  {isFetchingNextPage && (
  <div className="w-full space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <DiplomaCardSkeleton />
  <DiplomaCardSkeleton />
  <DiplomaCardSkeleton />
  </div>
  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
  <Loader2 className="size-4 animate-spin text-primary" />
  <span>Loading more diplomas...</span>
  </div>
  </div>
  )}

  {!hasNextPage && allDiplomas.length > 0 && (
  <p className="text-xs text-muted-foreground/80 font-mono text-center pt-2">
  You have reached the end of the list
  </p>
  )}
  </div>
  </div>
  );
}

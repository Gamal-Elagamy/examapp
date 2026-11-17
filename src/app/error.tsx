"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log server-side/error tracking
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Something went wrong!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        An unexpected error occurred. Please try again or return home.
      </p>
      <div className="mt-6 flex gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
      </div>
    </main>
  );
}

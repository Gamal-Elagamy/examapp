"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log server-side/error tracking
  }, [error]);

  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Application Error</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          A critical system error occurred. Please try again.
        </p>
        <div className="mt-6">
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}

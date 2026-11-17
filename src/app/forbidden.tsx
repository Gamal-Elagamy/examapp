import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/routes";

export default function ForbiddenPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">403</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">Access Forbidden</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        You do not have sufficient permissions to view this resource.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href={ROUTES.HOME}>Return Home</Link>
        </Button>
      </div>
    </main>
  );
}

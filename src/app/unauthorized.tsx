import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/routes";

export default function UnauthorizedPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">401</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">Unauthorized</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Please sign in to access this resource.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href={ROUTES.AUTH.LOGIN}>Sign In</Link>
        </Button>
      </div>
    </main>
  );
}

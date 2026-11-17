import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/routes";

export default function RootNotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">Page Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href={ROUTES.HOME}>Return Home</Link>
        </Button>
      </div>
    </main>
  );
}

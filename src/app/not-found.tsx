import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { ROUTES } from "@/routes";
import { GoBackButton } from "@/shared/components/go-back-button";

export default function RootNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 select-none font-mono">
      <div className="w-full max-w-md border border-border bg-card p-6 sm:p-8 text-center shadow-xs animate-in fade-in duration-200">
        <Image
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="404 Not Found"
          width={400}
          height={300}
          unoptimized
          priority
          className="mx-auto mb-6 h-52 sm:h-56 w-auto object-contain"
        />

        <h1 className="mb-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          404
        </h1>

        <h2 className="mb-3 text-lg sm:text-xl font-bold text-foreground">
          Page Not Found
        </h2>

        <p className="mb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
          <GoBackButton className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 border border-border bg-white hover:bg-slate-50 text-foreground px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer" />

          <Link
            href={ROUTES.HOME}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Home className="size-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

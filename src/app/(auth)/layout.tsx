import type { ReactNode } from "react";
import { AuthHero } from "@/features/auth/components/auth-hero";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2 bg-background">
      {/* Left Column (50%): Hero Section (Server Component, persistent across all auth pages) */}
      <AuthHero />

      {/* Right Column (50%): Centered Form Area (No outer cards or borders) */}
      <section className="flex items-center justify-center p-6 sm:p-12 xl:p-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/routes";
import { LogOut, BookOpen, User, FileText, LogIn } from "lucide-react";
import type { IUser } from "@/shared/lib/types/user";

interface DashboardNavbarProps {
  initialUser?: IUser | null;
}

export function DashboardNavbar({ initialUser }: DashboardNavbarProps) {
  const { data: session } = useSession();
  const currentUser = session?.user || initialUser;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-primary">ELEVATE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Diplomas
            </Link>
            <Link
              href={ROUTES.EXAMS.ROOT}
              className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Exams
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {currentUser.firstName || currentUser.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: ROUTES.AUTH.LOGIN })}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Link href={ROUTES.AUTH.LOGIN} className="flex items-center gap-1.5">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

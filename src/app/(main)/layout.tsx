import type { ReactNode } from "react";
import { auth } from "@/auth";
import { AppSidebar } from "@/shared/layout/app-sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const session = await auth();

  return (
    <div className="min-h-screen flex bg-white">
      {/* Fixed Left Sidebar (Desktop) - background: rgba(239, 246, 255, 1) */}
      <div className="hidden md:block w-64 shrink-0 bg-brand-blue-50">
        <div className="fixed inset-y-0 inset-s-0 w-64 z-30 bg-brand-blue-50">
          <AppSidebar user={session?.user || null} />
        </div>
      </div>

      {/* Main Content Area: Pure White */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

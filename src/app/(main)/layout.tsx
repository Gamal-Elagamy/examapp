import type { ReactNode } from "react";
import { auth } from "@/auth";
import { AppSidebar } from "@/shared/layout/app-sidebar";
import { AppHeader } from "@/shared/layout/app-header";
import { getUserProfile } from "@/features/account/lib/apis/account.api";

interface MainLayoutProps {
  children: ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const session = await auth();
  let user = session?.user || null;

  if (session?.token) {
    try {
      const res = await getUserProfile(session.token);
      if (res?.status && res.payload?.user) {
        user = res.payload.user;
      }
    } catch {
      // Fallback to session user
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Top Navbar Header (Mobile & Tablet, Hidden on Desktop lg+) */}
      <AppHeader user={user} />

      {/* Fixed Left Sidebar (Desktop lg+ Screens) */}
      <div className="hidden lg:block w-64 shrink-0 bg-brand-blue-50">
        <div className="fixed inset-y-0 inset-s-0 w-64 z-30 bg-brand-blue-50">
          <AppSidebar user={user} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

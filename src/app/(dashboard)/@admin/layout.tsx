import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getUserProfile } from "@/features/account/lib/apis/account.api";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";

interface AdminSlotLayoutProps {
  children: ReactNode;
}

export default async function AdminSlotLayout({ children }: AdminSlotLayoutProps) {
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* Top Navbar Header (Mobile & Tablet, Hidden on Desktop lg+) */}
      <AdminHeader user={user} />

      {/* Fixed Left Dark Sidebar (Desktop lg+ Screens) */}
      <div className="hidden lg:block w-64 shrink-0 bg-[#1A2232]">
        <div className="fixed inset-y-0 inset-s-0 w-64 z-30 bg-[#1A2232]">
          <AdminSidebar user={user} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useGetWalletQuery } from "@/lib/store/wallet/walletApiSlice";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch wallet for common balance display if needed
  const { isLoading } = useGetWalletQuery();

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className=" md:w-[280px] shrink-0">
            <ProfileSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

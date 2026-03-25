"use client";

import { cn } from "@/lib/utils";
import { User, Wallet, Package, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery, useLogoutMutation } from "@/lib/store/auth/apislice";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from "js-cookie";

const navigation = [
  { name: "Ümumi baxış", href: "/profile", icon: User },
  { name: "Balansım", href: "/profile/wallet", icon: Wallet },
  { name: "Sifarişlərim", href: "/profile/orders", icon: Package },
  { name: "Tənzimləmələr", href: "/profile/settings", icon: Settings },
];

import { useAuth } from "@/hooks/useAuth";

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth } = useAuth();
  const { data: user, isLoading } = useGetMeQuery(undefined, {
    skip: !isAuth
  });
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      Cookies.remove("token");
      router.push("/");
      router.refresh();
    } catch (err) {
      // Direct cleanup as fallback
      Cookies.remove("token");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[280px]">
      <div className="p-6 bg-white rounded-2xl border border-[#f2f2f2] shadow-sm mb-4">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold uppercase">
              {user?.firstName?.[0] || user?.email?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate">
                {user?.roleName || "Müştəri"}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex flex-col gap-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
        
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all mt-4"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Çıxış yap
        </button>
      </nav>
    </div>
  );
}

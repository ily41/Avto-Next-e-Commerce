"use client";

import { useGetWalletQuery } from "@/lib/store/wallet/walletApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet as WalletIcon } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export function WalletBalance() {
  const { isAuth } = useAuth();
  const { data: wallet, isLoading, error } = useGetWalletQuery(undefined, {
    skip: !isAuth
  });

  if (isLoading || !isAuth) {
    return <Skeleton className="h-[120px] w-full rounded-2xl" />;
  }

  if (error || !wallet) {
    return (
      <Card className="border-red-100 bg-red-50/50 rounded-2xl">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600 font-bold">Balans məlumatlarını yükləmək mümkün olmadı.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-[#f2f2f2] bg-white text-gray-900 shadow-sm rounded-2xl relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
        <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ümumi balans</CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <WalletIcon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-4xl font-black tracking-tight text-gray-900">
          ₼{wallet.balance.toFixed(2)}
        </div>
        <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-tight">İstifadəyə hazır məbləğ</p>
      </CardContent>
      {/* Subtle decorative element instead of black footer */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-blue-50/50 rounded-full -mr-8 -mt-8 blur-2xl" />
    </Card>
  );
}

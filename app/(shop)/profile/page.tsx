"use client";

import { WalletBalance } from "@/components/wallet/WalletBalance";
export const dynamic = 'force-dynamic';
import { OrderList } from "@/components/order/OrderList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Wallet } from "lucide-react";
import Link from "next/link";
import { useGetMeQuery } from "@/lib/store/auth/apislice";
import { useGetFavoritesCountQuery } from "@/lib/store/favorites/apislice";
import { useGetMyOrdersQuery } from "@/lib/store/order/orderApiSlice";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { isAuth } = useAuth();
  const { data: user } = useGetMeQuery(undefined, { skip: !isAuth });
  const { data: favsData, isLoading: isFavsLoading } = useGetFavoritesCountQuery(undefined, { skip: !isAuth });
  console.log(favsData)
  const { data: orders, isLoading: isOrdersLoading } = useGetMyOrdersQuery(undefined, { skip: !isAuth });

  const activeOrdersCount = orders?.filter(o => o.status !== "Completed" && o.status !== "Cancelled").length || 0;
  const wishlistCount = (typeof favsData === 'object' ? favsData?.count : favsData) || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Xoş gəlmisiniz, {user?.firstName || "İstifadəçi"}!</h1>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Hesabınıza ümumi baxış</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wallet Snippet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-500" /> Balansınız
            </h2>
            <Link href="/profile/wallet" className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
              Hamısına bax <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <WalletBalance />
        </div>

        {/* Quick Stats / Actions */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="border-[#f2f2f2] shadow-sm bg-white hover:border-blue-200 transition-all rounded-2xl group">
            <CardHeader className="pb-2">
              <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <div className="text-3xl font-black text-gray-900 tracking-tighter">{activeOrdersCount}</div>
              )}
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Aktiv sifariş</p>
            </CardContent>
          </Card>

          <Card className="border-[#f2f2f2] shadow-sm bg-white hover:border-rose-200 transition-all rounded-2xl group">
            <CardHeader className="pb-2">
              <Link href="/wishlist">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </Link>
            </CardHeader>
            <CardContent>
              {isFavsLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <div className="text-3xl font-black text-gray-900 tracking-tighter">{wishlistCount}</div>
              )}
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Sevimlilər</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders Snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-blue-500" /> Son sifarişlər
          </h2>
          <Link href="/profile/orders" className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest">
            Hamısına bax <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#f2f2f2] p-6 shadow-sm">
          <OrderList />
        </div>
      </div>
    </div>
  );
}

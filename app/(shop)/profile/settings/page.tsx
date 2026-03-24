"use client";

import { User, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useGetMeQuery } from "@/lib/store/auth/apislice";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tənzimləmələr</h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Şəxsi məlumatlarınızı idarə edin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-[#f2f2f2] shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-gray-50/50 border-b border-[#f2f2f2]">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <User className="h-4 w-4" /> Şəxsi Məlumatlar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Ad</p>
                    <p className="text-sm font-bold text-gray-800 tracking-tight">{user?.firstName || "Qeyd edilməyib"}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Soyad</p>
                    <p className="text-sm font-bold text-gray-800 tracking-tight">{user?.lastName || "Qeyd edilməyib"}</p>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Email Ünvanı</p>
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-300" />
                    <p className="text-sm font-bold text-gray-800 tracking-tight">{user?.email}</p>
                </div>
            </div>
            <div className="pt-4">
                <Button variant="outline" className="w-full text-xs font-black h-10 border-[#f2f2f2] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all rounded-xl uppercase tracking-widest">
                    Məlumatları Yenilə
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informational Card instead of Security */}
        <Card className="border-[#f2f2f2] shadow-sm rounded-2xl overflow-hidden bg-blue-50/30 border-dashed border-blue-200">
           <CardContent className="pt-10 pb-8 text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                <User className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Profiliniz Təhlükəsizdir</h3>
              <p className="text-xs text-gray-500 font-bold px-6 leading-relaxed">
                Şəxsi məlumatlarınız Avto027 tərəfindən qorunur. Hər hansı dəyişiklik üçün müştəri xidmətləri ilə əlaqə saxlaya bilərsiniz.
              </p>
           </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center pt-8">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Avto027 Müştəri Portalı v1.1</p>
      </div>
    </div>
  );
}

"use client";
export const dynamic = 'force-dynamic';

import { WalletBalance } from "@/components/wallet/WalletBalance";
import { TransactionList } from "@/components/wallet/TransactionList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Balansım</h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Balans və Əməliyyatlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="max-w-md">
          <WalletBalance />
        </div>
        
        <div className="space-y-4">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}

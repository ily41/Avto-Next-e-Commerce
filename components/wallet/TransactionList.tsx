"use client";

import { useGetWalletTransactionsQuery } from "@/lib/store/wallet/walletApiSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { MinusCircle, PlusCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export function TransactionList() {
  const { isAuth } = useAuth();
  const { data: transactions, isLoading, error } = useGetWalletTransactionsQuery(undefined, {
    skip: !isAuth
  });

  if (isLoading || !isAuth) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !transactions) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-[#f2f2f2]">
        <p className="text-sm text-gray-500 font-bold">Heç bir əməliyyat tarixçəsi tapılmadı.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#f2f2f2] flex items-center justify-between bg-white">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none">Əməliyyat tarixçəsi</h3>
        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{transactions.length} Cəmi</span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50 border-b border-[#f2f2f2]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-gray-400 w-[150px]">Tarix</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-gray-400">Təsvir</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-gray-400">Növü</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-gray-400 text-right">Məbləğ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="h-24 text-center text-gray-500 font-medium text-sm">
                  Hələ heç bir əməliyyat yoxdur.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="border-[#f2f2f2] hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-[11px] text-gray-400 font-bold whitespace-nowrap">
                    {formatDateTime(tx.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 line-clamp-1">
                        {tx.description || tx.typeText}
                      </span>
                      {tx.orderId && (
                        <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">
                          Sifariş #{tx.orderId.slice(0, 8)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {tx.amount >= 0 ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 rounded-lg hover:bg-blue-50 h-5 px-1.5 text-[9px] font-black uppercase tracking-wider">
                          <PlusCircle className="mr-1 h-3 w-3" /> Mədaxil
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 rounded-lg hover:bg-red-50 h-5 px-1.5 text-[9px] font-black uppercase tracking-wider">
                          <MinusCircle className="mr-1 h-3 w-3" /> Məxaric
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-black text-sm ${tx.amount >= 0 ? "text-blue-600" : "text-gray-900"}`}>
                    {tx.amount >= 0 ? "+" : ""}{tx.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

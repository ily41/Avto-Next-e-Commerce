"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  Truck,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCcw,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-tables";
import {
  Order,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useSendToAzerpostMutation
} from "@/lib/store/order/orderApiSlice";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Status Enums & Labels ──────────────────────────────────────────────────────
const STATUS_ENUMS = [
  { value: 0, label: "Gözləmədə", aliases: ["pending", "waiting"], color: "bg-zinc-500  text-white    border-transparent" },
  { value: 1, label: "Ödəniş Başlayıb", aliases: ["paymentstarted", "initiated"], color: "bg-blue-400    text-white    border-transparent" },
  { value: 2, label: "Ödənilib", aliases: ["paid", "completed"], color: "bg-blue-600   text-white       border-transparent" },
  { value: 3, label: "Hazırlanır", aliases: ["processing", "preparing"], color: "bg-indigo-500    text-white    border-transparent" },
  { value: 4, label: "Göndərilib", aliases: ["shipped", "sent"], color: "bg-amber-500   text-white   border-transparent" },
  { value: 5, label: "Çatdırılıb", aliases: ["delivered"], color: "bg-emerald-500 text-white border-transparent" },
  { value: 6, label: "Ləğv Edilib", aliases: ["canceled", "cancelled"], color: "bg-rose-500    text-white    border-transparent" },
  { value: 7, label: "Geri Ödənilib", aliases: ["refunded"], color: "bg-zinc-400    text-white    border-transparent" },
  { value: 8, label: "Uğursuz", aliases: ["failed"], color: "bg-red-600    text-white    border-transparent" },
];

const getStatusById = (id: number) => STATUS_ENUMS.find(s => s.value === id) || STATUS_ENUMS[0];
const getStatusByName = (name: string) => {
  if (!name) return STATUS_ENUMS[0];
  const normalized = name.toLowerCase().trim();
  return STATUS_ENUMS.find(s =>
    s.label.toLowerCase() === normalized ||
    s.aliases.includes(normalized)
  ) || STATUS_ENUMS[0];
};

// ── Component ──────────────────────────────────────────────────────────────────
export function AdminOrdersTable() {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [shippingMethodFilter, setShippingMethodFilter] = React.useState<string | undefined>(undefined);

  const { data, isLoading, isFetching } = useGetAdminOrdersQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    shippingMethod: shippingMethodFilter,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [sendToAzerpost, { isLoading: isSendingToAzerpost }] = useSendToAzerpostMutation();

  const handleStatusChange = async (orderId: string, statusValue: number) => {
    try {
      await updateStatus({ id: orderId, status: statusValue }).unwrap();
      toast.success("Sifariş statusu uğurla yenilendi");
    } catch (err: any) {
      toast.error(err?.data?.message || "Status yenilənə bilmədi");
    }
  };

  const handleSendToAzerpost = async (orderId: string) => {
    try {
      const result = await sendToAzerpost(orderId).unwrap();
      toast.success(result.message);
    } catch (err: any) {
      toast.error(err?.data?.error || "Azərpoçt göndərişi uğursuz oldu");
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderNumber",
      header: "Sifariş #",
      cell: ({ row }) => (
        <div className="font-bold flex items-center gap-2">
          {row.getValue("orderNumber")}
          <Link href={`/dashboard/orders/${row.original.id}`}>
            <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-blue-500 transition-colors" />
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Müştəri",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.customerName}</span>
          <span className="text-[10px] text-muted-foreground">{row.original.customerEmail}</span>
        </div>
      ),
    },
    {
      accessorKey: "shippingMethod",
      header: "Çatdırılma",
      cell: ({ row }) => {
        const method = row.original.shippingMethod;
        const fee = row.original.deliveryFee;
        let label = method || "—";
        if (method?.toLowerCase() === "azerpost") label = "Azərpoçt";
        if (method?.toLowerCase() === "expargo") label = "Expargo";
        if (method?.toLowerCase() === "freedelivery") label = "Pulsuz Çatdırılma";

        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold">{label}</span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {fee === 0 ? "Pulsuz" : `${fee?.toFixed(2)} AZN`}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Cəmi",
      cell: ({ row }) => <span className="font-bold">{row.original.totalAmount.toFixed(2)} AZN</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Tarix",
      cell: ({ row }) => <span className="text-gray-500 text-xs">{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const currentStatus = getStatusByName(row.original.status);
        return (
          <Select
            disabled={isUpdatingStatus}
            onValueChange={(val) => handleStatusChange(row.original.id, parseInt(val))}
            defaultValue={currentStatus.value.toString()}
          >
            <SelectTrigger className={`h-8 w-[140px] text-xs font-bold bg-transparent border ${currentStatus.color}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ENUMS.map((s) => (
                <SelectItem key={s.value} value={s.value.toString()} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "azerpost",
      header: "Azərpoçt İzləmə",
      cell: ({ row }) => {
        const order = row.original;

        if (order.azerpostOrderId) {
          return (
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="text-[10px] font-mono bg-blue-600 text-white border-transparent shadow-sm">
                {order.azerpostOrderId}
              </Badge>
              <a
                href={`https://azerpost.az/tracking?id=${order.azerpostOrderId}`}
                target="_blank"
                className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
              >
                İzlə <ExternalLink className="h-2 w-2" />
              </a>
            </div>
          );
        }

        const isPaidOrProcessing = ["paid", "processing", "shipped"].includes(order.status.toLowerCase());

        if (isPaidOrProcessing) {
          return (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-bold gap-1 transition-all hover:bg-blue-50 hover:text-blue-600"
              onClick={() => handleSendToAzerpost(order.id)}
              disabled={isSendingToAzerpost}
            >
              <Send className="h-3 w-3" /> Azərpoçta göndər
            </Button>
          );
        }

        return <span className="text-[10px] text-gray-400">—</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Fəaliyyətlər</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" /> Detallara bax
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => handleStatusChange(order.id, 6)} // Cancel
              >
                <XCircle className="h-4 w-4 mr-2" /> Sifarişi ləğv et
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select onValueChange={(val) => {
            setShippingMethodFilter(val === "all" ? undefined : val);
            setPagination(p => ({ ...p, pageIndex: 0 }));
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Çatdırılma Üsulu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              <SelectItem value="Azerpost">Azərpoçt</SelectItem>
              <SelectItem value="Expargo">Expargo</SelectItem>
              <SelectItem value="FreeDelivery">Pulsuz Çatdırılma</SelectItem>
            </SelectContent>
          </Select>

          {isFetching && <RefreshCcw className="h-4 w-4 animate-spin text-gray-500" />}
        </div>
      </div>

      <div className="admin-table-dark">
        <DataTable
          columns={columns}
          data={data?.items || []}
          pageCount={data?.totalPages || 0}
          manualPagination={true}
          pagination={pagination}
          onPaginationChange={setPagination}
          filterMode="server"
        />
      </div>
    </div>
  );
}

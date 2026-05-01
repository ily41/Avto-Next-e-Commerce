"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { 
  MoreHorizontal, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone,
  RefreshCcw,
  ExternalLink,
  MessageSquare
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
import { DataTable } from "@/components/data-table/data-tables";
import { 
  CreditRequest, 
  CreditRequestStatus,
  useGetAllCreditRequestsQuery, 
  useUpdateCreditRequestStatusMutation 
} from "@/lib/store/creditRequest/creditRequestApiSlice";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const STATUS_ENUMS = [
  { value: 0, label: "Pending",   color: "bg-zinc-500  text-white border-transparent" },
  { value: 1, label: "Contacted", color: "bg-blue-500  text-white border-transparent" },
  { value: 2, label: "Approved",  color: "bg-emerald-500 text-white border-transparent" },
  { value: 3, label: "Rejected",  color: "bg-rose-500  text-white border-transparent" },
];

const getStatusById = (id: number) => STATUS_ENUMS.find(s => s.value === id) || STATUS_ENUMS[0];

export function CreditRequestsTable() {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);
  const [selectedRequest, setSelectedRequest] = React.useState<CreditRequest | null>(null);
  const [noteValue, setNoteValue] = React.useState("");
  const [pendingStatus, setPendingStatus] = React.useState<number | null>(null);

  const { data, isLoading, isFetching } = useGetAllCreditRequestsQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    status: statusFilter,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateCreditRequestStatusMutation();

  const handleStatusChange = async (requestId: string, statusValue: number, notes?: string) => {
    try {
      await updateStatus({ 
        id: requestId, 
        body: { 
          status: statusValue as CreditRequestStatus, 
          notes: notes || "" 
        } 
      }).unwrap();
      toast.success("Müraciət statusu yeniləndi");
    } catch (err: any) {
      toast.error(err?.data?.message || "Xəta baş verdi");
    }
  };

  const columns: ColumnDef<CreditRequest>[] = [
    {
      accessorKey: "fullName",
      header: "Müştəri",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold">{row.original.fullName}</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Phone className="h-2 w-2" /> {row.original.phoneNumber}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Məbləğ",
      cell: ({ row }) => <span className="font-bold">₼{row.original.totalAmount.toFixed(2)}</span>,
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
        // Find which enum matches the status label or value
        // Assuming backend works with enum values for status updating but provides string label in "status"
        // Let's try to map the current status label back to value if possible, 
        // or use a default if not found.
        const currentLabel = row.original.status;
        const currentEnum = STATUS_ENUMS.find(s => s.label === currentLabel) || STATUS_ENUMS[0];

        return (
          <Select
            disabled={isUpdatingStatus}
            onValueChange={(val) => {
                setSelectedRequest(row.original);
                setPendingStatus(parseInt(val));
                setNoteValue(row.original.notes || "");
            }}
            defaultValue={currentEnum.value.toString()}
          >
            <SelectTrigger className={`h-8 w-[130px] text-[10px] font-black uppercase tracking-widest bg-transparent border ${currentEnum.color}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ENUMS.map((s) => (
                <SelectItem key={s.value} value={s.value.toString()} className="text-[10px] font-bold uppercase tracking-widest">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "items",
      header: "Məhsullar",
      cell: ({ row }) => (
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          {row.original.items.length} məhsul
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-blue-500"
                onClick={() => {
                    setSelectedRequest(row.original);
                    setNoteValue(row.original.notes || "");
                }}
            >
                <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Əməliyyatlar</DropdownMenuLabel>
                    <DropdownMenuItem 
                        className="text-xs flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                            setSelectedRequest(row.original);
                            setNoteValue(row.original.notes || "");
                        }}
                    >
                        <MessageSquare className="h-3.5 w-3.5" /> Qeyd əlavə et
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        className="text-xs text-rose-500 focus:text-rose-500 flex items-center gap-2 cursor-pointer"
                        onClick={() => handleStatusChange(row.original.id, 3, "Rədd edildi")}
                    >
                        <XCircle className="h-3.5 w-3.5" /> İmtina et
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select onValueChange={(val) => setStatusFilter(val === "all" ? undefined : val)}>
            <SelectTrigger className="w-[180px] text-xs font-bold uppercase tracking-widest">
              <SelectValue placeholder="BÜTÜN STATUSLAR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest">BÜTÜN STATUSLAR</SelectItem>
              {STATUS_ENUMS.map(s => (
                <SelectItem key={s.value} value={s.label} className="text-xs font-bold uppercase tracking-widest">{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {data?.totalCount !== undefined && (
            <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/10 px-4 py-1.5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500/70">Ümumi:</span>
              <span className="text-sm font-black text-green-600">{data.totalCount}</span>
            </div>
          )}

          {isFetching && <RefreshCcw className="h-4 w-4 animate-spin text-gray-500" />}
        </div>
      </div>

      <div className="admin-table-dark">
        <DataTable
          columns={columns}
          data={data?.items || []}
          pageCount={Math.ceil((data?.totalCount || 0) / pagination.pageSize)}
          manualPagination={true}
          pagination={pagination}
          onPaginationChange={setPagination}
          filterMode="server"
        />
      </div>

      {/* Detail & Edit Dialog */}
      <Dialog 
        open={!!selectedRequest} 
        onOpenChange={(open) => {
            if (!open) {
                setSelectedRequest(null);
                setPendingStatus(null);
                setNoteValue("");
            }
        }}
    >
        <DialogContent className="max-w-2xl rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">Müraciət Təfərrüatı</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                ID: {selectedRequest?.id}
                {pendingStatus !== null && (
                    <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full text-[9px] animate-pulse">
                        Status Dəyişikliyi Gözlənilir
                    </span>
                )}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-6 bg-muted/50 p-6 rounded-2xl border">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Müştəri</p>
                    <p className="text-sm font-black">{selectedRequest.fullName}</p>
                    <p className="text-[11px] font-bold text-blue-500">{selectedRequest.phoneNumber}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Yekun Məbləğ</p>
                    <p className="text-2xl font-black">₼{selectedRequest.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Məhsullar</p>
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {selectedRequest.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black">{item.productName}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.productSku} × {item.quantity}</span>
                            </div>
                            <span className="text-xs font-black">₼{item.totalPrice.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Admin Qeydi</label>
                <Textarea 
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    placeholder="Bura qeydlərinizi yaza bilərsiniz..."
                    className="rounded-2xl text-xs font-medium focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                    variant="ghost" 
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 font-bold hover:text-white"
                >
                    Bağla
                </Button>
                <Button 
                    onClick={() => {
                        const currentStatusEnum = STATUS_ENUMS.find(s => s.label === selectedRequest.status) || STATUS_ENUMS[0];
                        const statusToApply = pendingStatus !== null ? pendingStatus : currentStatusEnum.value;
                        
                        handleStatusChange(selectedRequest.id, statusToApply, noteValue);
                        setSelectedRequest(null);
                        setPendingStatus(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 rounded-xl shadow-lg shadow-blue-600/20"
                >
                    Yadda saxla
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

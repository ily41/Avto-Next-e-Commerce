"use client";

import { useState } from "react";
import { 
  useGetExpargoRulesQuery, 
  useCreateExpargoRuleMutation, 
  useUpdateExpargoRuleMutation, 
  useDeleteExpargoRuleMutation,
  ExpargoRule 
} from "@/lib/store/payment/expargoApiSlice";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  AlertCircle, 
  Truck, 
  Weight, 
  CreditCard,
  Search,
  MoreVertical,
  Check,
  Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExpargoRulesPage() {
  const { data: rules, isLoading, isError } = useGetExpargoRulesQuery();
  const [createRule, { isLoading: isCreating }] = useCreateExpargoRuleMutation();
  const [updateRule, { isLoading: isUpdating }] = useUpdateExpargoRuleMutation();
  const [deleteRule, { isLoading: isDeleting }] = useDeleteExpargoRuleMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ExpargoRule | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      minWeight: Number(formData.get("minWeight")),
      maxWeight: Number(formData.get("maxWeight")),
      basePrice: Number(formData.get("basePrice")),
      additionalPricePerKg: Number(formData.get("additionalPricePerKg")),
      isActive: true,
    };

    try {
      await createRule(payload).unwrap();
      toast.success("Qayda yaradıldı");
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Xəta baş verdi");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRule) return;
    const formData = new FormData(e.currentTarget);
    const payload = {
      minWeight: Number(formData.get("minWeight")),
      maxWeight: Number(formData.get("maxWeight")),
      basePrice: Number(formData.get("basePrice")),
      additionalPricePerKg: Number(formData.get("additionalPricePerKg")),
      isActive: editingRule.isActive,
    };

    try {
      await updateRule({ id: editingRule.id, rule: payload }).unwrap();
      toast.success("Qayda yeniləndi");
      setEditingRule(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Xəta baş verdi");
    }
  };

  const toggleStatus = async (rule: ExpargoRule) => {
    try {
      await updateRule({ id: rule.id, rule: { isActive: !rule.isActive } }).unwrap();
      toast.success(`Qayda ${!rule.isActive ? "aktivləşdirildi" : "deaktivləşdirildi"}`);
    } catch (err: any) {
      toast.error("Xəta baş verdi");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu qaydanı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteRule(id).unwrap();
      toast.success("Qayda silindi");
    } catch (err: any) {
      toast.error("Silinmə zamanı xəta baş verdi");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight leading-none">Expargo Çatdırılma Qaydaları</h1>
          <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
            <Truck className="h-3 w-3" /> Çatdırılma qiymətlərini və çəki aralıqlarını idarə edin
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black gap-2 shadow-lg shadow-blue-500/20">
              <Plus className="h-5 w-5" /> Yeni Qayda Əlavə Et
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Yeni Qayda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minWeight" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Min Çəki (kq)</Label>
                  <Input id="minWeight" name="minWeight" type="number" step="0.01" defaultValue="0" required className="h-11 rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxWeight" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Max Çəki (kq)</Label>
                  <Input id="maxWeight" name="maxWeight" type="number" step="0.01" defaultValue="1" required className="h-11 rounded-xl font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Baza Qiymət (AZN)</Label>
                <Input id="basePrice" name="basePrice" type="number" step="0.01" defaultValue="5" required className="h-11 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalPricePerKg" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Hər kq üçün əlavə qiymət (AZN)</Label>
                <Input id="additionalPricePerKg" name="additionalPricePerKg" type="number" step="0.01" defaultValue="0" required className="h-11 rounded-xl font-bold" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black">
                  {isCreating ? "Yaradılır..." : "Yarat"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {rules?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border-2 border-dashed border-white/10">
          <Truck className="h-16 w-16 text-white/10 mb-6" />
          <h2 className="text-xl font-black text-white/40">Heç bir qayda tapılmadı</h2>
          <p className="text-sm text-white/20 mt-2">Çatdırılma üçün ən azı bir qayda əlavə etməlisiniz</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules?.map((rule) => (
            <Card key={rule.id} className={`group relative shadow-2xl rounded-[32px] border-white/5 overflow-hidden transition-all hover:shadow-blue-500/10 hover:-translate-y-1 ${!rule.isActive ? 'opacity-40 bg-white/[0.02] grayscale-[0.5]' : 'bg-[#141414]'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
                <div className={`p-3 rounded-2xl ${rule.isActive ? 'bg-blue-500/10 text-blue-500' : 'bg-white/5 text-white/20'}`}>
                  <Weight className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditingRule(rule)} className="h-9 w-9 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(rule)} className={`h-9 w-9 rounded-full transition-colors ${rule.isActive ? 'hover:bg-amber-500/10 text-amber-500/50 hover:text-amber-500' : 'hover:bg-emerald-500/10 text-emerald-500/50 hover:text-emerald-500'}`}>
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)} className="h-9 w-9 rounded-full hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 pt-4">
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black tracking-tighter text-white">₼{rule.basePrice.toFixed(2)}</span>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest pb-2">+ ₼{rule.additionalPricePerKg.toFixed(2)}/kq</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-white/20 uppercase tracking-widest text-[9px]">Çəki Aralığı</span>
                    <span className="font-black text-white/90 text-xs">{rule.minWeight} - {rule.maxWeight} kq</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${rule.isActive ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/10'}`} 
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Badge variant="outline" className={`rounded-lg font-black text-[9px] uppercase tracking-widest border-none px-3 py-1 ${rule.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                      {rule.isActive ? "Aktiv" : "Deaktiv"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Edit Modal ── */}
      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Qaydanı Yenilə</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minWeight" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Min Çəki (kq)</Label>
                <Input id="edit-minWeight" name="minWeight" type="number" step="0.01" defaultValue={editingRule?.minWeight} required className="h-11 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxWeight" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Max Çəki (kq)</Label>
                <Input id="edit-maxWeight" name="maxWeight" type="number" step="0.01" defaultValue={editingRule?.maxWeight} required className="h-11 rounded-xl font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-basePrice" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Baza Qiymət (AZN)</Label>
              <Input id="edit-basePrice" name="basePrice" type="number" step="0.01" defaultValue={editingRule?.basePrice} required className="h-11 rounded-xl font-bold" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-additionalPricePerKg" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Hər kq üçün əlavə qiymət (AZN)</Label>
              <Input id="edit-additionalPricePerKg" name="additionalPricePerKg" type="number" step="0.01" defaultValue={editingRule?.additionalPricePerKg} required className="h-11 rounded-xl font-bold" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isUpdating} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black">
                {isUpdating ? "Yenilənir..." : "Yenilə"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client"

import * as React from "react"
import {
    useGetAdminInstallmentOptionsQuery,
    useCreateInstallmentOptionMutation,
    useUpdateInstallmentOptionMutation,
    useDeleteInstallmentOptionMutation,
    useGetInstallmentConfigurationQuery,
    useUpdateInstallmentConfigurationMutation
} from "@/lib/store/installment/installmentApiSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
    IconLoader2,
    IconCreditCard,
    IconPlus,
    IconTrash,
    IconSettings,
    IconCheck,
    IconX,
    IconPencil
} from "@tabler/icons-react"
import { InstallmentOption } from "@/lib/api/types"

export default function InstallmentDashboardPage() {
    const { data: config, isLoading: isConfigLoading } = useGetInstallmentConfigurationQuery()
    const { data: options, isLoading: isOptionsLoading } = useGetAdminInstallmentOptionsQuery()
    
    const [updateConfig, { isLoading: isUpdatingConfig }] = useUpdateInstallmentConfigurationMutation()
    const [createOption, { isLoading: isCreating }] = useCreateInstallmentOptionMutation()
    const [updateOption, { isLoading: isUpdating }] = useUpdateInstallmentOptionMutation()
    const [deleteOption] = useDeleteInstallmentOptionMutation()

    const [isAddingMode, setIsAddingMode] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)

    const [configState, setConfigState] = React.useState({ isEnabled: false, minimumAmount: 0 })
    const [newOption, setNewOption] = React.useState<Partial<InstallmentOption>>({
        bankName: "",
        installmentPeriod: 3,
        interestPercentage: 0,
        isActive: true,
        minimumAmount: 0,
        displayOrder: 0
    })
    const [editForm, setEditForm] = React.useState<Partial<InstallmentOption>>({})

    React.useEffect(() => {
        if (config) {
            setConfigState({ isEnabled: config.isEnabled, minimumAmount: config.minimumAmount })
        }
    }, [config])

    const startEditing = (option: InstallmentOption) => {
        setEditingId(option.id)
        setEditForm({ ...option })
    }

    const handleSaveConfig = async () => {
        try {
            await updateConfig(configState).unwrap()
            toast.success("Hissəli ödəniş konfiqurasiyası yeniləndi")
        } catch (err) {
            toast.error("Xəta baş verdi")
        }
    }

    const handleCreate = async () => {
        try {
            await createOption(newOption).unwrap()
            toast.success("Yeni seçim əlavə edildi")
            setIsAddingMode(false)
            setNewOption({ bankName: "", installmentPeriod: 3, interestPercentage: 0, isActive: true, minimumAmount: 0, displayOrder: 0 })
        } catch (err) {
            toast.error("Xəta baş verdi")
        }
    }

    const handleUpdate = async () => {
        if (!editingId) return
        try {
            await updateOption({ id: editingId, body: editForm }).unwrap()
            toast.success("Seçim yeniləndi")
            setEditingId(null)
        } catch (err) {
            toast.error("Xəta baş verdi")
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Bu seçimi silmək istədiyinizə əminsiniz?")) {
            try {
                await deleteOption(id).unwrap()
                toast.success("Seçim silindi")
            } catch (err) {
                toast.error("Xəta baş verdi")
            }
        }
    }

    if (isConfigLoading || isOptionsLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight">Hissəli Ödəniş İdarəetməsi</h1>
                <p className="text-muted-foreground text-lg">Bank taksitlərini və ödəniş limitlərini tənzimləyin.</p>
            </div>

            {/* Global Config Section */}
            <Card className="border-primary/10 shadow-sm transition-all hover:shadow-md">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/5">
                            <IconSettings size={22} />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Ümumi Tənzimləmələr</CardTitle>
                            <CardDescription>Hissəli ödənişin saytda aktivliyini və minimum həddini təyin edin.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sistem Statusu</Label>
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-muted/50">
                            <Switch 
                                checked={configState.isEnabled} 
                                onCheckedChange={(val) => setConfigState(prev => ({ ...prev, isEnabled: val }))} 
                            />
                            <div className="flex flex-col">
                                <span className="font-bold">{configState.isEnabled ? "Aktiv" : "Deaktiv"}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-black">Saytda hissəli ödəniş seçimini göstər</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Səbət Minimum Həddi (AZN)</Label>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                <Input 
                                    type="number" 
                                    value={configState.minimumAmount} 
                                    onChange={(e) => setConfigState(prev => ({ ...prev, minimumAmount: Number(e.target.value) }))} 
                                    className="h-12 text-lg font-bold pl-8 focus-visible:ring-primary/20"
                                />
                            </div>
                            <Button 
                                onClick={handleSaveConfig} 
                                disabled={isUpdatingConfig}
                                className="h-12 px-8 font-bold shadow-lg shadow-primary/10 active:scale-95 transition-all"
                            >
                                {isUpdatingConfig && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Yadda Saxla
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Options Management Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Taksit Seçimləri</h2>
                        <p className="text-sm text-muted-foreground">Müştərilərə təklif olunan bank taksit paketləri.</p>
                    </div>
                    <Button onClick={() => setIsAddingMode(true)} className="gap-2 font-bold shadow-lg shadow-primary/10" disabled={isAddingMode}>
                        <IconPlus size={18} /> Yeni Paket
                    </Button>
                </div>

                <div className="grid gap-6">
                    {isAddingMode && (
                        <Card className="border-dashed border-primary/40 bg-primary/5 shadow-inner">
                            <CardContent className="pt-6 grid md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                                <div className="space-y-2 lg:col-span-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Bank Adı</Label>
                                    <Input placeholder="Məs: Birbank" value={newOption.bankName} onChange={e => setNewOption({...newOption, bankName: e.target.value})} className="h-10 bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Müddət (Ay)</Label>
                                    <Input type="number" value={newOption.installmentPeriod} onChange={e => setNewOption({...newOption, installmentPeriod: Number(e.target.value)})} className="h-10 bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Faiz (%)</Label>
                                    <Input type="number" value={newOption.interestPercentage} onChange={e => setNewOption({...newOption, interestPercentage: Number(e.target.value)})} className="h-10 bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Status</Label>
                                    <div className="flex h-10 items-center gap-2">
                                        <Switch checked={newOption.isActive} onCheckedChange={val => setNewOption({...newOption, isActive: val})} />
                                        <span className="text-[10px] font-black uppercase">{newOption.isActive ? "Aktiv" : "Gizli"}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" className="bg-green-600 hover:bg-green-700 h-10 w-10" onClick={handleCreate} disabled={isCreating}>
                                        <IconCheck size={18} />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-10 w-10" onClick={() => setIsAddingMode(false)}>
                                        <IconX size={18} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {options?.map((option) => (
                        editingId === option.id ? (
                            <Card key={option.id} className="border-blue-500 bg-blue-50/5 shadow-lg">
                                <CardContent className="pt-6 grid md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Bank Adı</Label>
                                        <Input value={editForm.bankName} onChange={e => setEditForm({...editForm, bankName: e.target.value})} className="h-10 bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Müddət (Ay)</Label>
                                        <Input type="number" value={editForm.installmentPeriod} onChange={e => setEditForm({...editForm, installmentPeriod: Number(e.target.value)})} className="h-10 bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Faiz (%)</Label>
                                        <Input type="number" value={editForm.interestPercentage} onChange={e => setEditForm({...editForm, interestPercentage: Number(e.target.value)})} className="h-10 bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Status</Label>
                                        <div className="flex h-10 items-center gap-2">
                                            <Switch checked={editForm.isActive} onCheckedChange={val => setEditForm({...editForm, isActive: val})} />
                                            <span className="text-[10px] font-black uppercase">{editForm.isActive ? "Aktiv" : "Gizli"}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" className="bg-blue-600 hover:bg-blue-700 h-10 w-10" onClick={handleUpdate} disabled={isUpdating}>
                                            <IconCheck size={18} />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-10 w-10" onClick={() => setEditingId(null)}>
                                            <IconX size={18} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card key={option.id} className="group hover:border-primary/30 transition-all shadow-sm hover:shadow-md border-muted/50">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bank</span>
                                                <span className="font-bold text-lg">{option.bankName}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Taksit</span>
                                                <span className="font-bold text-lg text-blue-600">{option.installmentPeriod} Ay</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Komissiya</span>
                                                <span className={`font-bold text-lg ${option.interestPercentage > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                    {option.interestPercentage}%
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`w-2 h-2 rounded-full ${option.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
                                                    <span className="text-sm font-bold">{option.isActive ? "Aktiv" : "Deaktiv"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-muted/30 md:h-full p-4 flex md:flex-col gap-2 border-t md:border-t-0 md:border-l border-muted/50 opactiy-0 group-hover:opacity-100 transition-all">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(option.id)} className="text-destructive hover:bg-destructive/10 h-9 w-9">
                                                <IconTrash size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => startEditing(option)} className="text-blue-600 hover:bg-blue-50 h-9 w-9">
                                                <IconPencil size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    ))}

                    {(!options || options.length === 0) && !isAddingMode && (
                        <div className="text-center py-12 bg-muted/10 rounded-2xl border-2 border-dashed border-muted">
                            <IconCreditCard size={48} className="mx-auto text-muted mb-4 opacity-20" />
                            <h3 className="text-lg font-bold">Heç bir taksit paketi yoxdur</h3>
                            <p className="text-muted-foreground">Banklarla razılaşdırılmış taksit planlarını bura əlavə edin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

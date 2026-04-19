"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import {
    useSearchUsersQuery,
    useGetUserRolesQuery,
    useUpdateUserMutation,
    useChangeUserRoleMutation,
    useDeleteUserMutation,
    type User,
} from "@/lib/store/users/apislice";
import { toast } from "sonner";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import type { FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import * as z from "zod";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const { data: usersData, isLoading: isFetchingUsers, error } = useSearchUsersQuery({
        searchTerm,
        page: pageIndex + 1,
        pageSize: pageSize,
    });
    const { data: roles } = useGetUserRolesQuery();

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation();

    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Change Role state
    const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");

    const handleRoleChangeOpen = (user: User) => {
        setRoleChangeUser(user);
        setSelectedRole(user.role.toString());
    };

    const handleSaveRole = async () => {
        if (!roleChangeUser || !selectedRole) return;

        try {
            await changeUserRole({
                id: roleChangeUser.id,
                role: parseInt(selectedRole),
            }).unwrap();

            toast.success("Röl uğurla yenilendi!");
            setRoleChangeUser(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Röl dəyişdirilə bilmədi");
        }
    };

    const editSchema = z.object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
        phoneNumber: z.string().optional(),
        isActive: z.boolean().default(true),
    });

    const editFields: FieldConfig[] = [
        { name: "firstName", label: "Ad", type: "text" },
        { name: "lastName", label: "Soyad", type: "text" },
        { name: "phoneNumber", label: "Telefon Nömrəsi", type: "text" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
    ];

    const columns = useMemo(() => createColumns<User>([
        { key: "firstName", label: "Ad", sortable: true },
        { key: "lastName", label: "Soyad", sortable: true },
        { key: "email", label: "E-poçt", sortable: true },
        { key: "phoneNumber", label: "Telefon" },
        { key: "roleName", label: "Röl" },
        {
            key: "isActive",
            label: "Status",
            render: (value) => (
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${value ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                    {value ? "Aktiv" : "Deaktiv"}
                </div>
            )
        },
        {
            key: "createdAt",
            label: "Qeydiyyat Tarixi",
            render: (value) => value ? new Date(value).toLocaleDateString() : "-"
        }
    ],
        async (item) => {
            try {
                await deleteUser(item.id).unwrap();
                toast.success("İstifadəçi uğurla silindi.");
            } catch (err) {
                toast.error("İstifadəçi silinə bilmədi.");
            }
        },
        (item) => {
            setEditingUser(item);
        },
        (item) => (
            <DropdownMenuItem onClick={() => handleRoleChangeOpen(item)}>
                Rölü dəyiş
            </DropdownMenuItem>
        )
    ), [deleteUser]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-10 h-full">
                <p className="text-red-500 font-bold mb-4">İstifadəçilər yüklənilə bilmədi.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 py-8 px-6 md:px-10 min-h-screen">
            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-table-dark table thead tr {
                    border-bottom: 1px solid var(--border) !important;
                    background: var(--muted) !important;
                }
                .admin-table-dark table thead th {
                    color: var(--muted-foreground) !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    font-size: 10px !important;
                }
                .admin-table-dark table tbody tr {
                    border-bottom: 1px solid var(--border) !important;
                    background: transparent !important;
                }
                .admin-table-dark table tbody tr:hover {
                    background: var(--accent) !important;
                }
                .admin-table-dark table td {
                    color: var(--foreground) !important;
                }
                .admin-table-dark .rounded-md.border {
                    border-color: var(--border) !important;
                }
            `}} />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black tracking-tight">İstifadəçilər</h1>
            </div>

            {isFetchingUsers ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs">Yüklənir...</p>
                </div>
            ) : (
                <div className="admin-table-dark">
                    <DataTable
                        columns={columns}
                        data={usersData?.users || []}
                        manualPagination={true}
                        pageCount={usersData?.totalPages || 0}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        filterMode="server"
                        onFilterChange={setSearchTerm}
                        filterColumn="email"
                    />
                </div>
            )}

            {editingUser && (
                <DynamicEditPopup
                    open={!!editingUser}
                    onOpenChange={(open) => !open && setEditingUser(null)}
                    title={`İstifadəçini Düzəlt: ${editingUser.firstName} ${editingUser.lastName}`}
                    schema={editSchema}
                    defaultValues={{
                        firstName: editingUser.firstName,
                        lastName: editingUser.lastName,
                        phoneNumber: editingUser.phoneNumber || "",
                        isActive: editingUser.isActive,
                    }}
                    fields={editFields}
                    isLoading={isUpdating}
                    onSubmit={async (values) => {
                        await updateUser({
                            id: editingUser.id,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            phoneNumber: values.phoneNumber,
                            isActive: values.isActive,
                            role: editingUser.role,
                        }).unwrap();
                        toast.success("İstifadəçi uğurla yenilendi!");
                    }}
                />
            )}

            {/* Change Role Dialog */}
            <Dialog open={!!roleChangeUser} onOpenChange={(open) => !open && setRoleChangeUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rölü Dəyişdir: {roleChangeUser?.firstName} {roleChangeUser?.lastName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 flex flex-col items-start w-full">
                        <Label>Yeni Röl Seçin</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-full text-left bg-background text-foreground border-border shadow-sm">
                                <SelectValue placeholder="Röl seçin" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover text-popover-foreground rounded-lg border shadow-lg z-50">
                                {roles?.map((role) => {
                                    return (
                                        <SelectItem key={role.value} value={role.value.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleChangeUser(null)}>
                            Ləğv Et
                        </Button>
                        <Button
                            onClick={handleSaveRole}
                            disabled={isChangingRole}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
                        >
                            {isChangingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : "Saxla"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

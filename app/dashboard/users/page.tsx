"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import {
    useGetUsersQuery,
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

    const { data: users, isLoading: isFetchingUsers, error } = useGetUsersQuery();
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

            toast.success("Role updated successfully!");
            setRoleChangeUser(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to change role");
        }
    };

    const editSchema = z.object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
        phoneNumber: z.string().optional(),
        isActive: z.boolean().default(true),
    });

    const editFields: FieldConfig[] = [
        { name: "firstName", label: "First Name", type: "text" },
        { name: "lastName", label: "Last Name", type: "text" },
        { name: "phoneNumber", label: "Phone Number", type: "text" },
        { name: "isActive", label: "Is Active", type: "switch" },
    ];

    const columns = useMemo(() => createColumns<User>([
        { key: "firstName", label: "First Name", sortable: true },
        { key: "lastName", label: "Last Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "phoneNumber", label: "Phone" },
        { key: "roleName", label: "Role" },
        {
            key: "isActive",
            label: "Status",
            render: (value) => (
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {value ? "Active" : "Inactive"}
                </div>
            )
        },
        {
            key: "createdAt",
            label: "Registered At",
            render: (value) => value ? new Date(value).toLocaleDateString() : "-"
        }
    ],
        async (item) => {
            try {
                await deleteUser(item.id).unwrap();
                toast.success("User deleted successfully.");
            } catch (err) {
                toast.error("Failed to delete user.");
            }
        },
        (item) => {
            setEditingUser(item);
        },
        (item) => (
            <DropdownMenuItem onClick={() => handleRoleChangeOpen(item)}>
                Change Role
            </DropdownMenuItem>
        )
    ), [deleteUser]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-10 h-full">
                <p className="text-red-500 font-bold mb-4">Failed to load users.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Users</h1>
                {/* No Add Popup here as requested */}
            </div>

            {isFetchingUsers ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground animate-pulse">Loading users...</p>
                    </div>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={users || []}
                    pagination={{ pageIndex, pageSize }}
                    onPaginationChange={setPagination}
                    filterColumn="email"
                />
            )}

            {editingUser && (
                <DynamicEditPopup
                    open={!!editingUser}
                    onOpenChange={(open) => !open && setEditingUser(null)}
                    title={`Edit User: ${editingUser.firstName} ${editingUser.lastName}`}
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
                            role: editingUser.role, // Pass original role since it hasn't changed here
                        }).unwrap();
                        toast.success("User updated successfully!");
                    }}
                />
            )}

            {/* Change Role Dialog */}
            <Dialog open={!!roleChangeUser} onOpenChange={(open) => !open && setRoleChangeUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Role for {roleChangeUser?.firstName} {roleChangeUser?.lastName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 flex flex-col items-start w-full">
                        <Label>Select New Role</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-full text-left bg-background text-foreground border-border shadow-sm">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover text-popover-foreground rounded-lg border shadow-lg z-50">
                                {roles?.map((role) => {
                                    return(
                                    <SelectItem key={role.value} value={role.value.toString()}>
                                        {role.name}
                                    </SelectItem>
                                )})}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleChangeUser(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveRole}
                            disabled={isChangingRole}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
                        >
                            {isChangingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

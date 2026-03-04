import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
// ... import your Dropdown components

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

export function createColumns<T>(
  config: {
    key: keyof T;
    label: string;
    sortable?: boolean;
    // Add this optional render function
    render?: (value: any, item: T) => React.ReactNode;
  }[],
  onDelete?: (item: T) => void,
  onEdit?: (item: T) => void
): ColumnDef<T>[] {
  return [
    // 1. Static Selection Column
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    // 2. Dynamic Data Columns
    ...config.map((col): ColumnDef<T> => ({
      accessorKey: col.key as string,
      header: ({ column }) => {
        if (!col.sortable) return <div>{col.label}</div>
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {col.label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      // Override the cell rendering if a render function is provided
      cell: ({ getValue, row }) => {
        const val = getValue();
        if (col.render) {
          return col.render(val, row.original);
        }
        return val as React.ReactNode;
      }
    })),
    // 3. Static Actions Column
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionCell row={row} onDelete={onDelete} onEdit={onEdit} />,
    },
  ]
}

function ActionCell<T>({ row, onDelete, onEdit }: { row: any, onDelete?: (item: T) => void, onEdit?: (item: T) => void }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const item = row.original as any

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost"><MoreHorizontal /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
            Copy ID
          </DropdownMenuItem>
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(item)}>
              Edit
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => setShowDeleteDialog(true)}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              {item.name ? ` "${item.name}" ` : " item "}
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(item)
                setShowDeleteDialog(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

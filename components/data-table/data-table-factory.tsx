import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react"
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
    isExpandable?: boolean;
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
        const content = col.render ? col.render(val, row.original) : (val as React.ReactNode);
            
        if (col.isExpandable) {
          return (
            <div 
              style={{ paddingLeft: `${row.depth * 2}rem` }} // Indent based on depth
              className="flex items-center gap-2"
            >
              {row.getCanExpand() && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row clicks from triggering other actions
                    row.getToggleExpandedHandler()();
                  }}
                >
                  {row.getIsExpanded() ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                </Button>
              )}
              {/* Placeholder for rows without children to keep text aligned */}
              {!row.getCanExpand() && <div className="w-6" />} 
              {content}
            </div>
          );
        }
      
        return content;
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

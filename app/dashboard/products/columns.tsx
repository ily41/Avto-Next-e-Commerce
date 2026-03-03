"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Products = {
    id: string,
    name: string,
    category: string,
    quantity: number
}

export const columns: ColumnDef<Products>[] = [
    
    {
        accessorKey: "name",
        header: () => <div >Name</div>,
    },
    {
        accessorKey: "category",
        header: () => <div >Category</div>,
    },
    {
        accessorKey: "quantity",
        header: () => <div >Quantity</div>,
    },
    {
     id: "actions",
     cell: ({ row }) => {
       const payment = row.original
       
       return (
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="h-8 w-8 p-0">
               <span className="sr-only">Open menu</span>
               <MoreHorizontal className="h-4 w-4" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
             <DropdownMenuLabel>Actions</DropdownMenuLabel>
             <DropdownMenuItem
               onClick={() => navigator.clipboard.writeText(payment.id)}
             >
               Copy product ID
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem>Edit Product</DropdownMenuItem>
             <DropdownMenuItem>Delete product</DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       )
     },
    },
]
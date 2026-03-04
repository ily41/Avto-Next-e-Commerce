// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal, ArrowUpDown, HelpCircle, Circle, Timer, CheckCircle2 } from "lucide-react"
// import { Checkbox } from "@/components/ui/checkbox"
 
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import products from './products.json'
// import { array, object } from "zod"



// export type Products = {
//     id: string,
//     name: string,
//     category: string,
//     quantity: number
// }


// export const Categories = [...new Set(products.map(p => p.category))].map(cat => ({
//   value: cat,
//   label: cat,
//   icon: HelpCircle
// }));

// export const columns: ColumnDef<Products>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       ),
//     },
    
//     {
//         accessorKey: "name",
        
//         header: ({ column }) => {
//           return (
//             <Button
//               variant="ghost"
//               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//             >
//               Name
//               <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//           )
//         },

//     },
//     {
//         accessorKey: "category",
//         header: () => <div >Category</div>,
//     },
//     {
//         accessorKey: "quantity",
//         header: () => <div >Quantity</div>,
//     },
//     {
//      id: "actions",
//      cell: ({ row }) => {
//        const payment = row.original
       
//        return (
//          <DropdownMenu>
//            <DropdownMenuTrigger asChild>
//              <Button variant="ghost" className="h-8 w-8 p-0">
//                <span className="sr-only">Open menu</span>
//                <MoreHorizontal className="h-4 w-4" />
//              </Button>
//            </DropdownMenuTrigger>
//            <DropdownMenuContent align="end">
//              <DropdownMenuLabel>Actions</DropdownMenuLabel>
//              <DropdownMenuItem
//                onClick={() => navigator.clipboard.writeText(payment.id)}
//              >
//                Copy product ID
//              </DropdownMenuItem>
//              <DropdownMenuSeparator />
//              <DropdownMenuItem>Edit Product</DropdownMenuItem>
//              <DropdownMenuItem>Delete product</DropdownMenuItem>
//            </DropdownMenuContent>
//          </DropdownMenu>
//        )
//      },
//     },
// ]
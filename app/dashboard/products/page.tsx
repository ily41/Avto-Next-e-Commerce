"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "../../../components/data-table/data-tables"
import products from './products.json'
import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button"
import { AddProductPopup } from "@/components/addEditElement/addProduct"
import { createColumns } from "@/components/data-table/data-table-factory"
import { HelpCircle } from "lucide-react"

export type Products = {
  id: string,
  name: string,
  category: string,
  quantity: number
}

const productColumns = createColumns<Products>([
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category" },
  { key: "quantity", label: "Quantity" },
])

const categories = [...new Set(products.map(p => p.category))].map(cat => ({
  value: cat,
  label: cat,
  icon: HelpCircle
}));

const page = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
      <div className="flex justify-between">
        <h1 className="text-base md:text-xl lg:text-2xl">Products</h1>
        <AddProductPopup />
      </div>

      <DataTable
        columns={productColumns}
        data={products}
        filterColumn="name"
        facetedFilters={[
          {
            column: "category",
            title: "Category",
            options: categories
          }
        ]}
      />

    </div>

  )
}

export default page


"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "../../../components/data-table/data-tables"
import products from './products.json'
import { SectionCards } from "@/components/section-cards"
import { Button } from "@/components/ui/button"
import { AddProductPopup } from "@/components/addEditElement/addProduct"
import { createColumns } from "@/components/data-table/data-table-factory"
import { HelpCircle } from "lucide-react"





const page = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
      <div className="flex justify-between">
        <h1 className="text-base md:text-xl lg:text-2xl">Products</h1>
        <AddProductPopup />
      </div>
    </div>
  )
}

export default page


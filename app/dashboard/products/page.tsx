import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { columns, Products } from "./columns"
import { DataTable } from "./data-tables"
import products from './products.json'
import { SectionCards } from "@/components/section-cards"


const page = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
        <h1 className="text-base md:text-xl lg:text-2xl">Products</h1>
      
      <DataTable columns={columns} data={products} />
    </div>
    
  )
}

export default page


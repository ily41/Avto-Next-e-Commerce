import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"
// import { useState } from "react"
// import { PaginationState } from "@tanstack/react-table"

export default function Page() {
  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 10,
  // })
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      {/* <DataTable 
      data={data}
      pagination={pagination}
      onPaginationChange={setPagination}
      pageCount={data?.totalCount || 0}
      manualPagination
      /> */}
    </div>
  )
}

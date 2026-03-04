"use client"

import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import categories from "./categories.json";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

export type Category = { id: string; name: string; description: string }

export const categoryColumns = createColumns<Category>([
    { key: "name", label: "Category", sortable: true },
    { key: "description", label: "Description", sortable: true },
])

export default function Page() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <h1 className="text-base md:text-xl lg:text-2xl">Categories</h1>
            <DataTable
                columns={categoryColumns}
                data={categories}
                filterColumn="name"
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={data?.totalCount || 0}
                manualPagination
            />
        </div>
    )
}
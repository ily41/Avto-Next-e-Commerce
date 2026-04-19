"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  VisibilityState,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getExpandedRowModel
} from "@tanstack/react-table"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  manualPagination?: boolean
  pagination?: { pageIndex: number; pageSize: number }
  onPaginationChange?: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>
  onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>
  onFilterChange?: (value: string) => void
  getSubRows?: (row: TData) => TData[] | undefined
  filterColumn?: string
  facetedFilters?: {
    column: string
    title: string
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  filterMode?: "client" | "server"
  onFacetedFilterChange?: (columnId: string, values: string[]) => void
  rowSelection?: Record<string, boolean>
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  manualPagination,
  pagination,
  onPaginationChange,
  onSortingChange,
  onFilterChange,
  getSubRows,

  filterColumn,

  facetedFilters,
  filterMode = "client",
  onFacetedFilterChange,
  rowSelection: externalRowSelection,
  onRowSelectionChange: externalOnRowSelectionChange,
}: DataTableProps<TData, TValue>) {


  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [internalRowSelection, setInternalRowSelection] = React.useState({})

  const rowSelection = externalRowSelection !== undefined ? externalRowSelection : internalRowSelection;
  const setRowSelection = externalOnRowSelectionChange !== undefined ? externalOnRowSelectionChange : setInternalRowSelection as any;

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    manualPagination: manualPagination,
    manualFiltering: filterMode === "server",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: onSortingChange ?? setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSubRows,
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: onPaginationChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(pagination && { pagination }),
    },
  })

  return (
    <>
      {/* Search Filter */}
      <div className="flex items-center py-4">
        {filterColumn && (
          <Input
            placeholder="Axtar..."
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
              if (onFilterChange) {
                onFilterChange(event.target.value)
              }
            }}
            className="max-w-sm"
          />
        )}

        <div className="ml-auto flex items-stretch gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Sütunlar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>


          {facetedFilters?.map((filter) => (
            table.getColumn(filter.column) && (
              <DataTableFacetedFilter
                key={filter.column}
                column={table.getColumn(filter.column)}
                title={filter.title}
                options={filter.options}
                onFilterChange={(values) => {
                  table.getColumn(filter.column)?.setFilterValue(values)
                  if (filterMode === "server" && onFacetedFilterChange) {
                    onFacetedFilterChange(filter.column, values)
                  }
                }}

              />
            )
          ))}

        </div>

      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nəticə tapılmadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      {/* table prev next buttons */}
      {pagination &&
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="font-bold"
          >
            Əvvəlki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="font-bold"
          >
            Növbəti
          </Button>
        </div>
      }
    </>
  )
}


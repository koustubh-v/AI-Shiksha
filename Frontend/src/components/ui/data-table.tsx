
"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Loader2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterColumn?: string
    filterPlaceholder?: string
    onDeleteSelected?: (ids: string[]) => Promise<void>
    isLoading?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumn = "title",
    filterPlaceholder = "Filter...",
    onDeleteSelected,
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isDeleting, setIsDeleting] = React.useState(false)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const handleDelete = async () => {
        if (!onDeleteSelected) return

        // Extract IDs from selected rows
        // Assuming the data has an 'id' property. If not, this might need adjustment or the row original should implement an interface.
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const ids = selectedRows.map((row: any) => row.original.id)

        if (ids.length === 0) return

        if (confirm(`Are you sure you want to delete ${ids.length} items?`)) {
            setIsDeleting(true)
            try {
                await onDeleteSelected(ids)
                setRowSelection({})
            } finally {
                setIsDeleting(false)
            }
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-2">
                {filterColumn && (
                    <Input
                        placeholder={filterPlaceholder}
                        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm rounded-xl bg-white"
                    />
                )}

                {onDeleteSelected && Object.keys(rowSelection).length > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-lg"
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete ({Object.keys(rowSelection).length})
                    </Button>
                )}

                <div className="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto rounded-xl">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
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
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
                <Table className="hidden md:table">
                    <TableHeader className="bg-gray-50/50">
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-gray-500"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Mobile Responsive List View */}
                <div className="md:hidden flex flex-col divide-y divide-border">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <div key={row.id} className="flex flex-col p-4 gap-3 bg-white hover:bg-gray-50/50 transition-colors">
                                {row.getVisibleCells().map((cell) => {
                                    if (cell.column.id === 'select') {
                                        return (
                                            <div key={cell.id} className="flex items-center justify-between mb-2 pb-2 border-b border-border/50">
                                                <span className="text-sm font-medium text-muted-foreground">Select</span>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        )
                                    }
                                    if (cell.column.id === 'actions') {
                                        return (
                                            <div key={cell.id} className="pt-2 flex justify-end">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        )
                                    }
                                    return (
                                        <div key={cell.id} className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {typeof cell.column.columnDef.header === 'string'
                                                    ? cell.column.columnDef.header
                                                    : cell.column.id}
                                            </span>
                                            <div className="text-sm text-foreground overflow-hidden">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No results.
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-lg"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-lg"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div >
    )
}

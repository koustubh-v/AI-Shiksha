
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"
import { AdminCourse } from "@/hooks/useAdminCourses"

interface CourseColumnsProps {
    onDelete: (course: AdminCourse) => void;
}

export const createCourseColumns = ({ onDelete }: CourseColumnsProps): ColumnDef<AdminCourse>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ? true :
                        table.getIsSomePageRowsSelected() ? "indeterminate" : false
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                {row.original.thumbnail && (
                    <img src={row.original.thumbnail} alt="" className="h-8 w-8 rounded object-cover" />
                )}
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.getValue("title")}</span>
                    <span className="text-xs text-gray-500">by {row.original.instructor}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "published" ? "default" : "secondary"} className="capitalize">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price)

            return <div className="font-medium">{price === 0 ? "Free" : formatted}</div>
        },
    },
    {
        accessorKey: "students",
        header: "Students",
        cell: ({ row }) => <div className="text-center">{row.getValue("students")}</div>,
    },
    {
        accessorKey: "lessons",
        header: "Lessons",
        cell: ({ row }) => <div className="text-center">{row.getValue("lessons")}</div>,
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => <div className="text-center">{row.original.rating?.toFixed(1) || "N/A"}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const course = row.original

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
                        <DropdownMenuItem asChild>
                            <Link to={`/dashboard/courses/${course.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={`/course/${course.id}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" /> View Public Page
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(course)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Course
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]


"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type Enrollment = {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar_url?: string;
    };
    course: {
        id: string;
        title: string;
        thumbnail_url?: string;
    };
    status: string;
    enrolled_at: string;
    progress?: number;
}

interface EnrollmentColumnsProps {
    onDelete: (enrollment: Enrollment) => void;
    onUpdateStatus: (enrollment: Enrollment, status: string) => void;
}

export const createEnrollmentColumns = ({ onDelete, onUpdateStatus }: EnrollmentColumnsProps): ColumnDef<Enrollment>[] => [
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
        accessorKey: "user.name",
        id: "studentName",
        header: "Student",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.user.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {row.original.user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.original.user.name}</span>
                    <span className="text-xs text-gray-500">{row.original.user.email}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "course.title",
        header: "Course",
        cell: ({ row }) => (
            <div className="font-medium text-gray-900 max-w-[200px] truncate" title={row.original.course.title}>
                {row.original.course.title}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant="secondary"
                    className={`capitalize ${status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "enrolled_at",
        header: "Enrolled Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("enrolled_at"));
            return <div className="text-gray-500">{date.toLocaleDateString()}</div>
        },
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const enrollment = row.original

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
                        <DropdownMenuItem onClick={() => onUpdateStatus(enrollment, 'active')}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(enrollment, 'completed')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(enrollment)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove Enrollment
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

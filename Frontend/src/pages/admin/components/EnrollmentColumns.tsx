
"use client"
import { useState } from "react"

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

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
    completed_at?: string;
    progress?: number;
}

interface EnrollmentColumnsProps {
    onDelete: (enrollment: Enrollment) => void;
    onUpdateStatus: (enrollment: Enrollment, status: string) => void;
    onUpdateDates: (enrollment: Enrollment, enrolledAt: string, completedAt?: string) => void;
}

export const createEnrollmentColumns = ({ onDelete, onUpdateStatus, onUpdateDates }: EnrollmentColumnsProps): ColumnDef<Enrollment>[] => [
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Calendar className="mr-2 h-4 w-4" /> Edit Dates
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Enrollment Dates</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    onUpdateDates(
                                        enrollment, 
                                        formData.get('enrolled_at') as string, 
                                        formData.get('completed_at') as string
                                    );
                                }}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="enrolled_at">Enrollment Date</Label>
                                            <Input id="enrolled_at" name="enrolled_at" type="date" defaultValue={enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toISOString().split('T')[0] : ''} required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="completed_at">Completion Date</Label>
                                            <Input id="completed_at" name="completed_at" type="date" defaultValue={enrollment.completed_at ? new Date(enrollment.completed_at).toISOString().split('T')[0] : ''} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Save Dates</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
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

import { useState } from 'react';
import { useAdminCourses, AdminCourse } from '@/hooks/useAdminCourses';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Courses } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { createCourseColumns } from './components/CourseColumns';
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";

export default function CourseManagement() {
  const { courses, isLoading, mutate } = useAdminCourses();
  const [courseToDelete, setCourseToDelete] = useState<AdminCourse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    setIsDeleting(true);
    try {
      await Courses.delete(courseToDelete.id);
      toast.success("Course deleted successfully");
      setCourseToDelete(null);
      mutate(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete course", error);
      toast.error("Failed to delete course");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      // Since backend doesn't support bulk delete yet, we loop
      await Promise.all(ids.map(id => Courses.delete(id)));
      toast.success(`Deleted ${ids.length} courses`);
      mutate();
    } catch (error) {
      console.error("Failed to bulk delete", error);
      toast.error("Failed to delete some courses");
    }
  };

  const columns = createCourseColumns({
    onDelete: setCourseToDelete
  });

  return (
    <AdminDashboardLayout title="My Courses" subtitle="Manage and organize your courses">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link to="/dashboard/courses/new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transaction-all hover:shadow-blue-300 rounded-xl">
              <Plus className="h-4 w-4" /> Create New Course
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={courses}
          filterColumn="title"
          onDeleteSelected={handleBulkDelete}
          isLoading={isLoading}
        />

        <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course
                "{courseToDelete?.title}" and all its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteCourse();
                }}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Course"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminDashboardLayout>
  );
}

import { useState } from 'react';
import { useAdminCourses, AdminCourse } from '@/hooks/useAdminCourses';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, BookOpen, Search, Filter, Trash2, Edit, MoreVertical, PlayCircle, Clock, Users } from 'lucide-react';
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
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function CourseManagement() {
  const { courses, isLoading, mutate } = useAdminCourses();
  const [courseToDelete, setCourseToDelete] = useState<AdminCourse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.instructor && c.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    setIsDeleting(true);
    try {
      await Courses.delete(courseToDelete.id);
      toast.success("Course deleted successfully");
      setCourseToDelete(null);
      mutate();
    } catch (error) {
      console.error("Failed to delete course", error);
      toast.error("Failed to delete course");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedCourses.length) return;
    if (!confirm(`Are you sure you want to delete ${selectedCourses.length} courses?`)) return;

    try {
      await Promise.all(selectedCourses.map(id => Courses.delete(id)));
      toast.success(`Deleted ${selectedCourses.length} courses`);
      setSelectedCourses([]);
      mutate();
    } catch (error) {
      console.error("Failed to bulk delete", error);
      toast.error("Failed to delete some courses");
    }
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((c) => c.id));
    }
  };

  const handleSelectCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PUBLISHED": return "border-emerald-500/30 text-emerald-600 bg-emerald-500/5";
      case "DRAFT": return "border-zinc-500/30 text-zinc-600 bg-zinc-500/5";
      case "ARCHIVED": return "border-red-500/30 text-red-600 bg-red-500/5";
      default: return "border-blue-500/30 text-blue-600 bg-blue-500/5";
    }
  };

  return (
    <AdminDashboardLayout title="My Courses" subtitle="Manage and organize your courses">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-sky-500/10 to-indigo-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Course Catalog
            </h2>
            <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
              Create, edit, and manage educational content across the platform.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-4 shrink-0">
            <Link to="/dashboard/courses/new">
              <Button className="h-12 bg-white hover:bg-zinc-200 text-zinc-900 rounded-none font-bold uppercase tracking-widest px-6 w-full sm:w-auto">
                <Plus className="h-5 w-5 mr-2" />
                Create Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Glass Stats */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{courses.length}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                  <PlayCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {courses.filter(c => c.status === 'PUBLISHED').length}
                </p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Published</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {courses.filter(c => c.status === 'DRAFT').length}
                </p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Drafts</p>
              </div>
            </div>
          </div>
          
          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {courses.reduce((acc, curr) => acc + (curr.students || 0), 0)}
                </p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Total Enrollments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-zinc-400" />
              Course Roster
            </h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9 h-10 rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-none border-black/10 dark:border-white/10 shrink-0 h-10 w-10">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedCourses.length > 0 && (
            <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-900/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white rounded-none"
                />
                <span className="text-sm font-bold text-red-900 dark:text-red-200 uppercase tracking-widest">
                  {selectedCourses.length} Selected
                </span>
              </div>
              <Button variant="destructive" size="sm" className="rounded-none text-xs font-bold uppercase tracking-widest gap-2" onClick={handleBulkDelete}>
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </div>
          )}
          
          <div className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Catalog...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                  <BookOpen className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">No courses found</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Click "Create Course" to add your first course.</p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Checkbox & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={() => handleSelectCourse(course.id)}
                        className="rounded-none"
                      />
                      <div className="h-16 w-24 shrink-0 rounded-none bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 overflow-hidden relative">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <BookOpen className="h-6 w-6 text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-base truncate max-w-[200px] md:max-w-md" title={course.title}>
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          <span className="truncate max-w-[150px]">{course.instructor || 'Unknown Instructor'}</span>
                          <span>•</span>
                          <span className="font-bold uppercase tracking-widest text-[10px] text-zinc-400">{course.price === 0 ? 'FREE' : `₹${course.price}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Badges */}
                    <div className="flex items-center gap-3 py-2 md:py-0 border-y md:border-y-0 border-black/5 dark:border-white/5 md:px-6">
                      <Badge variant="outline" className={cn("rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border shrink-0", getStatusColor(course.status))}>
                        {course.status}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                        <Users className="h-3 w-3" />
                        <span>{course.students || 0}</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-2 shrink-0 min-w-[120px]">
                      <Link to={`/dashboard/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm" className="rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold uppercase tracking-widest gap-2">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-none border border-transparent hover:border-black/10 dark:hover:border-white/10 shrink-0 h-9 w-9">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none border-black/10 dark:border-white/10">
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-bold uppercase tracking-widest text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-500/10" onClick={() => setCourseToDelete(course)}>
                            <Trash2 className="h-3 w-3" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
          <AlertDialogContent className="rounded-none border border-black/10 dark:border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black text-xl uppercase tracking-widest">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 font-medium">
                <p className="text-sm">
                  This action cannot be undone. This will permanently delete the course
                  <span className="font-bold text-zinc-900 dark:text-white bg-black/5 dark:bg-white/5 px-1 py-0.5 mx-1 uppercase tracking-widest text-[10px]">
                    "{courseToDelete?.title}"
                  </span> 
                  and all its content.
                </p>
                {(courseToDelete?.students ?? 0) > 0 && (
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-none flex items-start gap-3 border border-red-200 dark:border-red-900/50 mt-4">
                    <span className="text-xl leading-none">⚠️</span>
                    <span className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                      Warning: There are {courseToDelete?.students} student(s) actively enrolled in this course. Deleting it will permanently revoke their access.
                    </span>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel disabled={isDeleting} className="rounded-none font-bold uppercase tracking-widest text-xs">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteCourse();
                }}
                className="bg-red-600 hover:bg-red-700 text-white rounded-none font-bold uppercase tracking-widest text-xs"
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

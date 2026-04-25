import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  BookOpen,
  PlayCircle,
  Loader2,
  ShieldCheck,
  Ban
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CourseApproval } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PendingCourse {
  id: string;
  title: string;
  thumbnail_url?: string;
  instructor: {
    user: {
      name: string;
      email: string;
    };
  };
  category?: {
    name: string;
  };
  sections: any[];
  status: string;
  submitted_for_approval_at: string;
  price: number;
}

export default function CourseApprovalPage() {
  const [courses, setCourses] = useState<PendingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<PendingCourse | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();

  const loadPendingCourses = async () => {
    try {
      setLoading(true);
      const data = await CourseApproval.getPending();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load pending courses:", error);
      toast({
        title: "Error",
        description: "Failed to load pending courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingCourses();
  }, []);

  const handleApprove = async (courseId: string) => {
    setActionLoading(courseId);
    try {
      await CourseApproval.approve(courseId);
      toast({
        title: "Course Approved",
        description: "The course has been approved and published successfully.",
      });
      await loadPendingCourses();
    } catch (error: any) {
      console.error("Failed to approve course:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve course",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (course: PendingCourse) => {
    setSelectedCourse(course);
    setRejectDialogOpen(true);
    setRejectionReason("");
  };

  const handleRejectSubmit = async () => {
    if (!selectedCourse || !rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this course.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(selectedCourse.id);
    try {
      await CourseApproval.reject(selectedCourse.id, rejectionReason);
      toast({
        title: "Course Rejected",
        description: "The instructor will be notified of the rejection.",
      });
      setRejectDialogOpen(false);
      setSelectedCourse(null);
      setRejectionReason("");
      await loadPendingCourses();
    } catch (error: any) {
      console.error("Failed to reject course:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject course",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const calculateLessonCount = (course: PendingCourse) => {
    return course.sections?.reduce((total, section) => {
      return total + (section.items?.length || 0);
    }, 0) || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminDashboardLayout title="Course Approval" subtitle="Review and approve pending courses">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Approvals...</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Course Approval" subtitle="Review and approve pending courses">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
            
            <div className="relative z-10 space-y-2">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                    Approval Queue
                </h2>
                <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                    Review submitted courses to ensure they meet quality standards before publishing.
                </p>
            </div>
        </div>

        {/* Floating Glass Stats */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col h-full z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <div className="mt-auto space-y-1">
                        <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{courses.length}</p>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Pending Review</p>
                    </div>
                </div>
            </div>

            <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col h-full z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <div className="mt-auto space-y-1">
                        <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{courses.length}</p>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Awaiting Action</p>
                    </div>
                </div>
            </div>

            <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col h-full z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-auto space-y-1">
                        <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                            {courses.reduce((sum, c) => sum + (c.sections?.length || 0), 0)}
                        </p>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Total Sections</p>
                    </div>
                </div>
            </div>

            <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative p-6 flex flex-col h-full z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                            <PlayCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-auto space-y-1">
                        <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                            {courses.reduce((sum, c) => sum + calculateLessonCount(c), 0)}
                        </p>
                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Total Lessons</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Ledger */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-zinc-400" />
                    Review Requests
                </h3>
            </div>

            <div className="p-0">
                {courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                            <CheckCircle className="h-8 w-8 text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">All Caught Up!</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">There are no courses pending approval at the moment.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-black/5 dark:divide-white/5">
                        {courses.map((course) => (
                            <div key={course.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                
                                {/* Left: Info */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                                    <div className="h-24 w-40 bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded-none overflow-hidden shrink-0 flex items-center justify-center">
                                        {course.thumbnail_url && !course.thumbnail_url.startsWith('blob:') ? (
                                            <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <PlayCircle className="h-8 w-8 text-zinc-400" />
                                        )}
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">
                                                {course.title}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {course.category && (
                                                    <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-0 border-zinc-500/30 text-zinc-600 dark:text-zinc-300 bg-zinc-500/5">
                                                        {course.category.name}
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className={cn("rounded-none uppercase tracking-widest text-[10px] px-2 py-0 border", course.price === 0 ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5" : "border-blue-500/30 text-blue-600 bg-blue-500/5")}>
                                                    {course.price === 0 ? "Free" : `₹${course.price}`}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                <Avatar className="h-5 w-5 rounded-none border border-black/10 dark:border-white/10">
                                                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[10px] rounded-none text-zinc-900 dark:text-white font-bold">
                                                        {course.instructor.user.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{course.instructor.user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {course.sections?.length || 0} Sections</span>
                                                <span className="flex items-center gap-1.5"><PlayCircle className="h-3.5 w-3.5" /> {calculateLessonCount(course)} Lessons</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Meta & Actions */}
                                <div className="flex flex-col items-start xl:items-end gap-4 shrink-0 min-w-[200px] border-t xl:border-t-0 border-black/5 dark:border-white/5 pt-4 xl:pt-0">
                                    <div className="flex flex-col items-start xl:items-end gap-1">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Submitted For Review</span>
                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            {course.submitted_for_approval_at ? formatDate(course.submitted_for_approval_at) : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                                        <Link to={`/dashboard/courses/${course.id}/preview`} target="_blank" className="flex-1 xl:flex-none">
                                            <Button variant="outline" size="sm" className="w-full rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold uppercase tracking-widest gap-2">
                                                <Eye className="h-3 w-3" /> Preview
                                            </Button>
                                        </Link>
                                        <Button 
                                            size="sm" 
                                            className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs flex-1 xl:flex-none"
                                            onClick={() => handleApprove(course.id)}
                                            disabled={actionLoading === course.id}
                                        >
                                            {actionLoading === course.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <CheckCircle className="h-3 w-3 mr-2" />}
                                            Approve
                                        </Button>
                                        <Button 
                                            variant="destructive"
                                            size="sm" 
                                            className="rounded-none font-bold uppercase tracking-widest text-xs flex-1 xl:flex-none"
                                            onClick={() => handleRejectClick(course)}
                                            disabled={actionLoading === course.id}
                                        >
                                            {actionLoading === course.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Ban className="h-3 w-3 mr-2" />}
                                            Reject
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="rounded-none border border-black/10 dark:border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl uppercase tracking-widest text-red-600">Reject Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Please provide a detailed reason for rejecting <strong className="text-zinc-900 dark:text-white font-bold">"{selectedCourse?.title}"</strong>. The instructor will be notified with your feedback to make necessary changes.
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Rejection Reason *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Audio quality is poor in section 2, incomplete materials..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rounded-none border-black/10 dark:border-white/10 min-h-[120px] resize-none focus-visible:ring-red-500"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest text-xs" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              className="rounded-none font-bold uppercase tracking-widest text-xs"
              onClick={handleRejectSubmit}
              disabled={!rejectionReason.trim() || actionLoading === selectedCourse?.id}
            >
              {actionLoading === selectedCourse?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
}

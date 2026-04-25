import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  Loader2,
  MoreHorizontal,
  X,
  Calendar,
} from "lucide-react";
import { Enrollments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Enrollment {
  id: string; // The enrollment ID
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  course: {
    id: string;
    title: string;
  };
  enrolled_at: string;
  status: 'active' | 'completed' | 'cancelled';
  progress_percentage: number;
  completed_at?: string;
}

interface Stats {
  total: number;
  active: number;
  completed: number;
  thisMonth: number;
  growth: number;
}

export default function CompletionPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  // Edit Dates State
  const [datesOpen, setDatesOpen] = useState(false);
  const [incompleteOpen, setIncompleteOpen] = useState(false);
  const [editEnrollmentDate, setEditEnrollmentDate] = useState("");
  const [editCompletionDate, setEditCompletionDate] = useState("");

  useEffect(() => {
    loadData();
  }, [statusFilter]); // Reload when status filter changes

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, enrollmentsData] = await Promise.all([
        Enrollments.getStats(),
        Enrollments.getAll(search, statusFilter === "all" ? undefined : statusFilter),
      ]);
      setStats(statsData);
      setEnrollments(enrollmentsData);
    } catch (error: any) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEnrollments(enrollments.map(e => e.id));
    } else {
      setSelectedEnrollments([]);
    }
  };

  const handleSelectEnrollment = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEnrollments(prev => [...prev, id]);
    } else {
      setSelectedEnrollments(prev => prev.filter(eid => eid !== id));
    }
  };

  const handleBulkComplete = async () => {
    if (selectedEnrollments.length === 0) return;

    try {
      setProcessing(true);
      const res = await Enrollments.bulkComplete(selectedEnrollments);
      toast({
        title: "Success",
        description: res.message,
      });
      setSelectedEnrollments([]);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark as complete",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveDates = async () => {
    try {
      setProcessing(true);
      const res = await Enrollments.bulkUpdateDates(
        selectedEnrollments,
        editEnrollmentDate || undefined,
        editCompletionDate || undefined
      );
      toast({ title: "Success", description: res.message });
      setDatesOpen(false);
      setEditEnrollmentDate("");
      setEditCompletionDate("");
      setSelectedEnrollments([]);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update dates",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkIncomplete = async () => {
    try {
      setProcessing(true);
      const res = await Enrollments.bulkIncomplete(selectedEnrollments);
      toast({ title: "Success", description: res.message });
      setIncompleteOpen(false);
      setSelectedEnrollments([]);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark incomplete",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const openEditDates = (id?: string) => {
    if (id) setSelectedEnrollments([id]);
    setEditEnrollmentDate("");
    setEditCompletionDate("");
    setDatesOpen(true);
  };

  const openMarkIncomplete = (id?: string) => {
    if (id) setSelectedEnrollments([id]);
    setIncompleteOpen(true);
  };

  const handleManualComplete = async (enrollmentId: string) => {
    try {
      setProcessing(true);
      await Enrollments.manualComplete(enrollmentId);
      toast({
        title: "Success",
        description: "Enrollment marked as complete",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to complete enrollment",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const completedRate = stats ? Math.round((stats.completed / (stats.total || 1)) * 100) : 0;

  return (
    <AdminDashboardLayout title="Enrollments & Completions" subtitle="Track progress and manage student completions">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Completion Center
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                Track academic progress, oversee active enrollments, and manage course completions.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  placeholder="Search students..."
                  className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none focus-visible:ring-blue-500 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 h-14 bg-white/10 border-white/20 text-white rounded-none focus-visible:ring-blue-500 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-white/20 bg-zinc-900 text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Floating Glass Stats */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{stats?.total || 0}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Total Enrollments</p>
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
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{stats?.completed || 0}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Completed</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{stats?.active || 0}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Active Students</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{completedRate}%</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Feed */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          <div className="border-b border-black/5 dark:border-white/5 p-4 sm:p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={enrollments.length > 0 && selectedEnrollments.length === enrollments.length}
                onCheckedChange={handleSelectAll}
                className="rounded-none border-black/20 dark:border-white/20 data-[state=checked]:bg-blue-600"
              />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                Student Ledger
                <Badge variant="outline" className="ml-2 rounded-none bg-black/5 dark:bg-white/5 border-0">
                  {enrollments.length} entries
                </Badge>
              </h3>
            </div>
            
            {/* Bulk Actions Toolbar */}
            {selectedEnrollments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2 hidden md:inline-block">
                  {selectedEnrollments.length} Selected
                </span>
                <Button size="sm" variant="outline" onClick={() => openEditDates()} disabled={processing} className="rounded-none border-black/10 dark:border-white/10 gap-2 h-9">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit Dates</span>
                </Button>
                <Button size="sm" variant="outline" onClick={() => openMarkIncomplete()} disabled={processing} className="rounded-none border-orange-500/30 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 gap-2 h-9">
                  <TrendingUp className="h-4 w-4 rotate-180" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
                <Button size="sm" onClick={handleBulkComplete} disabled={processing} className="rounded-none gap-2 h-9 bg-emerald-600 hover:bg-emerald-700 text-white">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  <span className="hidden sm:inline">Mark Complete</span>
                </Button>
              </div>
            )}
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Syncing Ledger...</p>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                  <Search className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">No enrollments found</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {enrollments.map((enrollment) => {
                  const isCompleted = enrollment.status === 'completed' || enrollment.progress_percentage === 100;
                  
                  return (
                    <div key={enrollment.id} className={cn(
                      "group p-4 md:p-6 transition-colors flex flex-col lg:flex-row gap-4 lg:items-center justify-between",
                      selectedEnrollments.includes(enrollment.id) ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    )}>
                      
                      {/* Left: Checkbox & Student Info */}
                      <div className="flex items-start lg:items-center gap-4 min-w-[300px]">
                        <Checkbox
                          checked={selectedEnrollments.includes(enrollment.id)}
                          onCheckedChange={(checked) => handleSelectEnrollment(enrollment.id, checked as boolean)}
                          className="mt-1 lg:mt-0 rounded-none border-black/20 dark:border-white/20 data-[state=checked]:bg-blue-600"
                        />
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-none border border-black/10 dark:border-white/10 shrink-0">
                          <AvatarImage src={enrollment.user.avatar_url} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold rounded-none">
                            {enrollment.user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 overflow-hidden">
                          <p className="font-bold text-zinc-900 dark:text-white truncate">{enrollment.user.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{enrollment.user.email}</p>
                        </div>
                      </div>

                      {/* Middle: Course & Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 py-2 lg:py-0 lg:px-8 border-y lg:border-y-0 border-black/5 dark:border-white/5">
                        <div className="space-y-1 overflow-hidden">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Course</p>
                          <p className="font-bold text-zinc-900 dark:text-white truncate" title={enrollment.course.title}>
                            {enrollment.course.title}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Enrolled</p>
                          <p className="font-medium text-zinc-700 dark:text-zinc-300">
                            {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      {/* Right: Progress & Status */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 min-w-[200px]">
                        <div className="flex-1 lg:flex-none">
                          {isCompleted ? (
                            <div className="flex flex-col items-start lg:items-end">
                              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                Completed
                              </span>
                              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                {enrollment.completed_at ? format(new Date(enrollment.completed_at), "MMM d, yyyy") : "N/A"}
                              </span>
                            </div>
                          ) : (
                            <div className="w-full lg:w-32 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Progress</span>
                                <span className="text-xs font-bold text-zinc-900 dark:text-white">{enrollment.progress_percentage}%</span>
                              </div>
                              <Progress value={enrollment.progress_percentage} className="h-1.5 rounded-none" />
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-none hover:bg-black/5 dark:hover:bg-white/5 h-8 w-8">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-none border-black/10 dark:border-white/10">
                            {!isCompleted && (
                              <DropdownMenuItem className="rounded-none cursor-pointer" onClick={() => handleManualComplete(enrollment.id)}>
                                <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                                Mark as Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="rounded-none cursor-pointer" onClick={() => openEditDates(enrollment.id)}>
                              <Calendar className="h-4 w-4 mr-2" />
                              Edit Dates
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openMarkIncomplete(enrollment.id)}
                              className="text-orange-600 focus:text-orange-700 rounded-none cursor-pointer focus:bg-orange-50 dark:focus:bg-orange-500/10"
                            >
                              <TrendingUp className="h-4 w-4 mr-2 rotate-180" />
                              Reset Progress
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Edit Dates Dialog */}
        <Dialog open={datesOpen} onOpenChange={setDatesOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-none border-black/10 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="font-black text-xl">Edit Dates</DialogTitle>
              <DialogDescription className="font-medium">
                Update enrollment and completion dates for {selectedEnrollments.length} student(s).
                Leave blank to keep existing dates.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enrolledDate" className="text-right font-bold uppercase tracking-widest text-[10px] text-zinc-500">
                  Enrolled
                </Label>
                <Input
                  id="enrolledDate"
                  type="date"
                  className="col-span-3 rounded-none font-medium bg-zinc-50 dark:bg-zinc-900 border-black/10 dark:border-white/10"
                  value={editEnrollmentDate}
                  onChange={(e) => setEditEnrollmentDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="completedDate" className="text-right font-bold uppercase tracking-widest text-[10px] text-zinc-500">
                  Completed
                </Label>
                <Input
                  id="completedDate"
                  type="date"
                  className="col-span-3 rounded-none font-medium bg-zinc-50 dark:bg-zinc-900 border-black/10 dark:border-white/10"
                  value={editCompletionDate}
                  onChange={(e) => setEditCompletionDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDatesOpen(false)} className="rounded-none border-black/10 dark:border-white/10">Cancel</Button>
              <Button onClick={handleSaveDates} disabled={processing} className="rounded-none bg-blue-600 hover:bg-blue-700 text-white">
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mark Incomplete Confirmation Dialog */}
        <Dialog open={incompleteOpen} onOpenChange={setIncompleteOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-none border-orange-500/30">
            <DialogHeader>
              <DialogTitle className="font-black text-xl text-orange-600">Reset Progress?</DialogTitle>
              <DialogDescription className="font-medium text-zinc-600 dark:text-zinc-400">
                Are you sure you want to reset progress for {selectedEnrollments.length} student(s)?
                This will set progress to 0%, mark status as Active, and delete any issued certificates.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIncompleteOpen(false)} className="rounded-none border-black/10 dark:border-white/10">Cancel</Button>
              <Button variant="destructive" onClick={handleMarkIncomplete} disabled={processing} className="rounded-none bg-orange-600 hover:bg-orange-700 text-white">
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Reset Progress
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AdminDashboardLayout>
  );
}
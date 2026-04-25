import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MoreHorizontal,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Loader2,
  Trash2,
} from "lucide-react";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUsers } from "@/hooks/useUsers";
import { Users as UsersAPI, Instructors } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDeleteUser } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";

export default function StudentsPage() {
  const { user } = useAuth();
  
  if (user?.role === 'teacher') {
    return <TeacherStudents />;
  }
  
  return <AdminStudents />;
}

function AdminStudents() {
  const { user } = useAuth();
  const { users: students, isLoading } = useUsers("student");
  const { mutateAsync: deleteUser } = useDeleteUser();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    avgCompletion: 0,
    newThisMonth: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await UsersAPI.getStudentStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch student stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const content = (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
      
      {/* Dynamic Header */}
      <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Students Roster
            </h2>
            <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
              Track student progress, monitor engagement, and manage their learning journey.
            </p>
          </div>
          <div className="shrink-0 relative w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40" />
            </div>
            <Input
              placeholder="Search students by name or email..."
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none focus-visible:ring-indigo-500 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Floating Glass Stats */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="relative p-6 flex flex-col h-full z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-auto space-y-1">
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                {loadingStats ? "..." : stats.totalStudents.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Total Students</p>
            </div>
          </div>
        </div>

        <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="relative p-6 flex flex-col h-full z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-auto space-y-1">
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                {loadingStats ? "..." : stats.activeStudents.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Active Learners</p>
            </div>
          </div>
        </div>

        <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="relative p-6 flex flex-col h-full z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-auto space-y-1">
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                {loadingStats ? "..." : `${stats.avgCompletion}%`}
              </p>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Avg. Completion</p>
            </div>
          </div>
        </div>

        <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="relative p-6 flex flex-col h-full z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-auto space-y-1">
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                {loadingStats ? "..." : `+${stats.newThisMonth.toLocaleString()}`}
              </p>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">New This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex items-center justify-between">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-zinc-400" />
            Students Ledger
          </h3>
          <Button variant="outline" size="icon" className="rounded-none border-black/10 dark:border-white/10 shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                <GraduationCap className="h-8 w-8 text-zinc-400" />
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">No students found</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Try adjusting your search filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {filteredStudents.map((student) => (
                <div key={student.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-none border border-black/10 dark:border-white/10 shadow-sm">
                      <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black rounded-none">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-900 dark:text-white text-base truncate">
                        {student.name}
                      </h4>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                        {student.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 sm:ml-auto">
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-0.5 border border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                        Active
                      </Badge>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                        Joined {new Date(student.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-none border border-transparent hover:border-black/10 dark:hover:border-white/10 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-black/10 dark:border-white/10">
                        <DropdownMenuItem 
                          className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-500/10 rounded-none cursor-pointer gap-2 font-medium text-xs uppercase tracking-widest"
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this student?")) {
                              try {
                                await deleteUser(student.id);
                                toast.success("Student deleted successfully");
                              } catch (error) {
                                toast.error("Failed to delete student");
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete User
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
    </div>
  );

  const isAdminRole = ["admin", "super_admin", "franchise_admin"].includes(user?.role?.toLowerCase() || "");

  if (isAdminRole) {
    return (
      <AdminDashboardLayout title="Students" subtitle="Manage student accounts and enrollments">
        {content}
      </AdminDashboardLayout>
    );
  }

  return (
    <UnifiedDashboard title="Students" subtitle="Manage enrolled students">
      {content}
    </UnifiedDashboard>
  );
}

function TeacherStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await Instructors.getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch instructor students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <UnifiedDashboard title="My Students" subtitle="Track progress of students in your courses">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-sky-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                My Students
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                View all students enrolled in the courses you teach.
              </p>
            </div>
            <div className="shrink-0 relative w-full md:w-80">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/40" />
              </div>
              <Input
                placeholder="Search students..."
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none focus-visible:ring-indigo-500 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-zinc-400" />
              Roster
            </h3>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Roster...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                  <GraduationCap className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">No students yet</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Wait for students to enroll in your courses.</p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-none border border-black/10 dark:border-white/10 shadow-sm">
                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black rounded-none">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-base truncate">
                          {student.name}
                        </h4>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 sm:ml-auto">
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-0.5 border border-indigo-500/30 text-indigo-600 bg-indigo-500/5">
                          Enrolled
                        </Badge>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                          {student.courseCount || 1} Courses
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </UnifiedDashboard>
  );
}

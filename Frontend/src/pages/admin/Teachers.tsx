import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  BookOpen,
  DollarSign,
  Star,
  ShieldCheck,
  ShieldOff,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAdminInstructors } from "@/hooks/useAdminInstructors";
import { Users as UsersAPI } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TeachersPage() {
  const { instructors: teachers, isLoading, refetch } = useAdminInstructors();
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await UsersAPI.getTeacherStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch teacher stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  return (
    <AdminDashboardLayout title="Teachers" subtitle="Manage instructors and verification requests">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-indigo-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Instructors
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                Manage your teaching staff, monitor performance, and verify new instructor applications.
              </p>
            </div>
            <div className="shrink-0 relative w-full md:w-80">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/40" />
              </div>
              <Input
                placeholder="Search by name or email..."
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none focus-visible:ring-violet-500 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{loadingStats ? "..." : stats.totalTeachers}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Active Teachers</p>
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
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{loadingStats ? "..." : stats.totalCourses}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Published Courses</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 group-hover:scale-110 transition-transform duration-500">
                  <DollarSign className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{loadingStats ? "..." : `₹${(stats.totalRevenue / 1000).toFixed(1)}k`}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Revenue Generated</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{loadingStats ? "..." : stats.avgRating.toFixed(1)}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Feed */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-zinc-400" />
              Instructor Roster
            </h3>
            <Button variant="outline" size="icon" className="rounded-none border-black/10 dark:border-white/10 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Roster...</p>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">No instructors found</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                    
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-4 min-w-[250px]">
                      <Avatar className="h-12 w-12 rounded-none border border-black/10 dark:border-white/10 shrink-0">
                        <AvatarFallback className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-bold rounded-none">
                          {teacher.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 overflow-hidden">
                        <p className="font-bold text-zinc-900 dark:text-white truncate">{teacher.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{teacher.email}</p>
                      </div>
                    </div>

                    {/* Middle: Stats */}
                    <div className="grid grid-cols-3 gap-4 lg:gap-8 flex-1 py-2 lg:py-0 border-y lg:border-y-0 border-black/5 dark:border-white/5 lg:px-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Courses</p>
                        <p className="font-bold text-zinc-900 dark:text-white">{teacher.courses}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Students</p>
                        <p className="font-bold text-zinc-900 dark:text-white">{teacher.students.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Revenue</p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{teacher.revenue.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0">
                      <div className="flex items-center gap-4">
                        {teacher.rating > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-none border border-amber-100 dark:border-amber-500/20 text-xs font-bold">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{teacher.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <Badge variant="outline" className={cn(
                          "rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border-0",
                          teacher.status === "verified" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        )}>
                          {teacher.status || "unverified"}
                        </Badge>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-none hover:bg-black/5 dark:hover:bg-white/5">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none border-black/10 dark:border-white/10">
                          <DropdownMenuItem
                            className="rounded-none cursor-pointer"
                            onClick={async () => {
                              try {
                                await UsersAPI.toggleInstructorVerification(teacher.id);
                                toast.success(
                                  teacher.status === "verified"
                                    ? "Instructor unverified"
                                    : "Instructor verified successfully"
                                );
                                refetch();
                              } catch (error) {
                                toast.error("Failed to update verification status");
                              }
                            }}
                          >
                            {teacher.status === "verified" ? (
                              <><ShieldOff className="h-4 w-4 mr-2" />Revoke Verification</>
                            ) : (
                              <><ShieldCheck className="h-4 w-4 mr-2" />Verify Instructor</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground rounded-none cursor-pointer"
                            onClick={async () => {
                              if (confirm("Are you sure you want to delete this teacher?")) {
                                try {
                                  await UsersAPI.delete(teacher.id);
                                  toast.success("Teacher deleted successfully");
                                  refetch();
                                } catch (error) {
                                  toast.error("Failed to delete teacher");
                                }
                              }
                            }}
                          >
                            Delete Account
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
    </AdminDashboardLayout>
  );
}

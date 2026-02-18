import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MoreHorizontal,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Mail,
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
import { Users as UsersAPI } from "@/lib/api";
import { useEffect, useState } from "react";

export default function StudentsPage() {
  const { user } = useAuth();
  const { users: students, isLoading } = useUsers("student");
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    avgCompletion: 0,
    newThisMonth: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

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


  const content = (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? "..." : stats.totalStudents.toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Learners</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? "..." : stats.activeStudents.toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? "..." : `${stats.avgCompletion}%`}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-chart-3/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? "..." : `+${stats.newThisMonth.toLocaleString()}`}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-chart-4/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Students</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">Loading students...</TableCell></TableRow>
              ) : students.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">No students found.</TableCell></TableRow>
              ) : students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>0 courses</TableCell>
                  <TableCell>0 courses</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `0%` }}
                        />
                      </div>
                      <span className="text-sm">0%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Enrollments</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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

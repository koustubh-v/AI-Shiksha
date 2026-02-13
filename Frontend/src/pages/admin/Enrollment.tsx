import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, TrendingUp, Calendar, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Enrollments, Courses, Users as UsersApi } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { createEnrollmentColumns, Enrollment } from "./components/EnrollmentColumns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select-custom";

interface EnrollmentStats {
  total: number;
  active: number;
  completed: number;
  thisMonth: number;
  growth: number;
}

interface Course {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [stats, setStats] = useState<EnrollmentStats>({
    total: 0,
    active: 0,
    completed: 0,
    thisMonth: 0,
    growth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Manual Enroll State
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadEnrollments(),
        loadStats(),
        loadCourses(),
        loadStudents()
      ]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const data = await Enrollments.getAll();
      setEnrollments(data);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive",
      });
    }
  };

  const loadStats = async () => {
    try {
      const data = await Enrollments.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await Courses.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await UsersApi.getAll('student');
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students", error);
    }
  }

  const handleDeleteEnrollment = async (enrollment: Enrollment) => {
    if (!confirm(`Are you sure you want to remove ${enrollment.user.name} from ${enrollment.course.title}?`)) return;

    try {
      await Enrollments.delete(enrollment.id);
      toast({ title: "Success", description: "Enrollment removed successfully" });
      loadEnrollments();
      loadStats();
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove enrollment", variant: "destructive" });
    }
  };

  const handleUpdateStatus = async (enrollment: Enrollment, status: string) => {
    try {
      await Enrollments.updateStatus(enrollment.id, status);
      toast({ title: "Success", description: `Status updated to ${status}` });
      loadEnrollments();
      loadStats();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => Enrollments.delete(id)));
      toast({ title: "Success", description: `Removed ${ids.length} enrollments` });
      loadEnrollments();
      loadStats();
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove some enrollments", variant: "destructive" });
    }
  };

  const handleManualEnroll = async () => {
    if (selectedStudentIds.length === 0 || selectedCourseIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one student and one course.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Iterate over selected students and courses to enroll
      // Note: In a real production app, backend should handle bulk enroll
      const promises = [];
      for (const studentId of selectedStudentIds) {
        const student = students.find(s => s.id === studentId);
        if (!student) continue;

        for (const courseId of selectedCourseIds) {
          promises.push(Enrollments.adminEnroll(student.email, courseId));
        }
      }

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `Enrolled ${selectedStudentIds.length} students in ${selectedCourseIds.length} courses.`
      });
      setIsEnrollOpen(false);
      setSelectedStudentIds([]);
      setSelectedCourseIds([]);
      loadData();
    } catch (error: any) {
      console.error("Bulk enroll error", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to complete enrollment process",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const columns = createEnrollmentColumns({
    onDelete: handleDeleteEnrollment,
    onUpdateStatus: handleUpdateStatus
  });

  return (
    <AdminDashboardLayout title="Enrollments" subtitle="Manage student access and course progress">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Enrollments</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.total.toLocaleString()}</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Active</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.active.toLocaleString()}</p>
                </div>
                <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.thisMonth.toLocaleString()}</p>
                </div>
                <Calendar className="h-6 w-6 md:h-8 md:w-8 text-chart-3/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Growth</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {stats.growth > 0 ? '+' : ''}{stats.growth}%
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-chart-4/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                <UserPlus className="h-4 w-4" /> Manual Enroll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Manual Student Enrollment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Select Students</Label>
                  <MultiSelect
                    options={students.map(s => ({ label: `${s.name} (${s.email})`, value: s.id }))}
                    selected={selectedStudentIds}
                    onChange={setSelectedStudentIds}
                    placeholder="Search students..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Select Courses</Label>
                  <MultiSelect
                    options={courses.map(c => ({ label: c.title, value: c.id }))}
                    selected={selectedCourseIds}
                    onChange={setSelectedCourseIds}
                    placeholder="Search courses..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEnrollOpen(false)}>Cancel</Button>
                <Button onClick={handleManualEnroll} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enroll Selected
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={enrollments}
          filterColumn="studentName"
          filterPlaceholder="Filter by student name..."
          onDeleteSelected={handleBulkDelete}
          isLoading={isLoading}
        />
      </div>
    </AdminDashboardLayout>
  );
}
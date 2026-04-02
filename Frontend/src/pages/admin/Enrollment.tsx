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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Will verify if this exists, otherwise use div
import { Search } from "lucide-react";

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
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
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
      const data = await Courses.getAll(true); // Fetch all courses including unpublished
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

  const handleUpdateDates = async (enrollment: Enrollment, enrolledAt: string, completedAt?: string) => {
    try {
      await Enrollments.bulkUpdateDates([enrollment.id], enrolledAt, completedAt || undefined);
      toast({ title: "Success", description: "Dates updated successfully" });
      loadEnrollments();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update dates", variant: "destructive" });
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
      const result = await Enrollments.bulkEnroll(selectedStudentIds, selectedCourseIds);

      const { success, alreadyEnrolled, failed } = result;

      let description = `Successfully enrolled ${success} students.`;
      if (alreadyEnrolled > 0) description += ` ${alreadyEnrolled} were already enrolled.`;
      if (failed > 0) description += ` ${failed} failed.`;

      toast({
        title: failed > 0 ? "Enrollment Completed with Errors" : "Enrollment Successful",
        description: description,
        variant: failed > 0 ? "destructive" : "default"
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

  const toggleAllStudents = () => {
    const visibleStudents = students.filter((s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
    );

    // Check if all visible students are currently selected
    const allVisibleSelected = visibleStudents.every(s => selectedStudentIds.includes(s.id));

    if (allVisibleSelected) {
      // Deselect all visible students
      setSelectedStudentIds(state => state.filter(id => !visibleStudents.find(s => s.id === id)));
    } else {
      // Select all visible students, adding to existing non-visible selection
      const newIds = [...selectedStudentIds];
      visibleStudents.forEach(s => {
        if (!newIds.includes(s.id)) newIds.push(s.id);
      });
      setSelectedStudentIds(newIds);
    }
  };

  const toggleAllCourses = () => {
    const visibleCourses = courses.filter((c) => c.title.toLowerCase().includes(courseSearch.toLowerCase()));

    // Check if all visible courses are currently selected
    const allVisibleSelected = visibleCourses.every(c => selectedCourseIds.includes(c.id));

    if (allVisibleSelected) {
      // Deselect all visible courses
      setSelectedCourseIds(state => state.filter(id => !visibleCourses.find(c => c.id === id)));
    } else {
      // Select all visible courses
      const newIds = [...selectedCourseIds];
      visibleCourses.forEach(c => {
        if (!newIds.includes(c.id)) newIds.push(c.id);
      });
      setSelectedCourseIds(newIds);
    }
  };


  const columns = createEnrollmentColumns({
    onDelete: handleDeleteEnrollment,
    onUpdateStatus: handleUpdateStatus,
    onUpdateDates: handleUpdateDates,
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
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manual Student Enrollment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Students</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAllStudents}
                      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      {(() => {
                        const visibleStudents = students.filter((s) =>
                          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase())
                        );
                        const allVisibleSelected = visibleStudents.length > 0 && visibleStudents.every(s => selectedStudentIds.includes(s.id));
                        return allVisibleSelected ? 'Deselect All' : 'Select All';
                      })()}
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      <div className="sticky top-0 bg-background pb-4 pt-0 z-10">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search students..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {students
                          .filter((s) =>
                            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                            s.email.toLowerCase().includes(studentSearch.toLowerCase())
                          )
                          .map((student) => (
                            <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md transition-colors">
                              <Checkbox
                                id={`student-${student.id}`}
                                checked={selectedStudentIds.includes(student.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedStudentIds([...selectedStudentIds, student.id]);
                                  } else {
                                    setSelectedStudentIds(selectedStudentIds.filter((id) => id !== student.id));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`student-${student.id}`}
                                className="flex-1 cursor-pointer text-sm font-normal"
                              >
                                <span className="font-medium">{student.name}</span>
                                <span className="text-muted-foreground ml-2 text-xs">({student.email})</span>
                              </Label>
                            </div>
                          ))}
                        {students.filter((s) =>
                          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase())
                        ).length === 0 && (
                            <p className="text-sm text-center text-muted-foreground py-4">No students found</p>
                          )}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Courses</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAllCourses}
                      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      {(() => {
                        const visibleCourses = courses.filter((c) => c.title.toLowerCase().includes(courseSearch.toLowerCase()));
                        const allVisibleSelected = visibleCourses.length > 0 && visibleCourses.every(c => selectedCourseIds.includes(c.id));
                        return allVisibleSelected ? 'Deselect All' : 'Select All';
                      })()}
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      <div className="sticky top-0 bg-background pb-4 pt-0 z-10">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search courses..."
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {courses
                          .filter((c) => c.title.toLowerCase().includes(courseSearch.toLowerCase()))
                          .map((course) => (
                            <div key={course.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md transition-colors">
                              <Checkbox
                                id={`course-${course.id}`}
                                checked={selectedCourseIds.includes(course.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCourseIds([...selectedCourseIds, course.id]);
                                  } else {
                                    setSelectedCourseIds(selectedCourseIds.filter((id) => id !== course.id));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`course-${course.id}`}
                                className="flex-1 cursor-pointer text-sm font-normal"
                              >
                                {course.title}
                              </Label>
                            </div>
                          ))}
                        {courses.filter((c) => c.title.toLowerCase().includes(courseSearch.toLowerCase())).length === 0 && (
                          <p className="text-sm text-center text-muted-foreground py-4">No courses found</p>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
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
import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Plus,
} from "lucide-react";
import { Completions, Users as UsersAPI, Courses } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CompletionStats {
  total_completions: number;
  certificates_issued: number;
  avg_score: number;
  this_month: number;
}

interface Completion {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    certificate_enabled: boolean;
  };
  completed_at: string;
  progress_percentage: number;
  certificate_issued: boolean;
  certificate_id?: string;
  certificate_url?: string;
}

export default function CompletionPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<CompletionStats | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [issuingCertificate, setIssuingCertificate] = useState<string | null>(null);

  // Manual completion dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, completionsData] = await Promise.all([
        Completions.getStats(),
        Completions.getAll(),
      ]);
      setStats(statsData);
      setCompletions(completionsData);
    } catch (error: any) {
      console.error("Failed to load completions:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load completions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadData();
      return;
    }

    try {
      setLoading(true);
      const data = await Completions.getAll(search);
      setCompletions(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to search completions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsAndCourses = async () => {
    try {
      const [studentsData, coursesData] = await Promise.all([
        UsersAPI.getAll("STUDENT"),
        Courses.getAll(),
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load students or courses",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    loadStudentsAndCourses();
  };

  const handleManualCompletion = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast({
        title: "Missing Information",
        description: "Please select both a student and a course",
        variant: "destructive",
      });
      return;
    }

    try {
      setMarkingComplete(true);
      await Completions.markComplete(selectedStudent, selectedCourse);
      toast({
        title: "Course Completed",
        description: "Course has been marked as complete and certificate issued (if enabled)",
      });
      setDialogOpen(false);
      setSelectedStudent("");
      setSelectedCourse("");
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark course as complete",
        variant: "destructive",
      });
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleIssueCertificate = async (studentId: string, courseId: string, completionId: string) => {
    try {
      setIssuingCertificate(completionId);
      await Completions.issueCertificate(studentId, courseId);
      toast({
        title: "Certificate Issued",
        description: "Certificate has been successfully issued to the student",
      });
      // Reload data to update certificate status
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to issue certificate",
        variant: "destructive",
      });
    } finally {
      setIssuingCertificate(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !stats) {
    return (
      <AdminDashboardLayout title="Course Completions" subtitle="Track student course completions and certificates">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-
foreground" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Course Completions" subtitle="Track student course completions and certificates">
      <div className="space-y-4 md:space-y-6">
        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Completions</p>
                  <p className="text-xl md:text-2xl font-bold">{stats?.total_completions || 0}</p>
                </div>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Certificates Issued</p>
                  <p className="text-xl md:text-2xl font-bold">{stats?.certificates_issued || 0}</p>
                </div>
                <Award className="h-6 w-6 md:h-8 md:w-8 text-chart-3/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Avg. Score</p>
                  <p className="text-xl md:text-2xl font-bold">{stats?.avg_score || 0}%</p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl md:text-2xl font-bold">{stats?.this_month || 0}</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-chart-4/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completions Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-base md:text-lg">Recent Completions</CardTitle>
              <div className="flex gap-2">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpenDialog} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Mark Complete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Manually Mark Course Complete</DialogTitle>
                      <DialogDescription>
                        Select a student and course to manually mark as completed. If certificates are enabled for the course, one will be automatically issued.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="student" className="text-sm font-medium">
                          Student
                        </label>
                        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="course" className="text-sm font-medium">
                          Course
                        </label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        disabled={markingComplete}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleManualCompletion}
                        disabled={markingComplete || !selectedStudent || !selectedCourse}
                      >
                        {markingComplete ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Marking Complete...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or course..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} size="sm">Search</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : completions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No completions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    completions.map((completion) => (
                      <TableRow key={completion.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {completion.student.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{completion.student.name}</p>
                              <p className="text-xs text-muted-foreground">{completion.student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm max-w-[200px] truncate">{completion.course.title}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(completion.completed_at)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{completion.progress_percentage}%</span>
                        </TableCell>
                        <TableCell>
                          {completion.certificate_issued ? (
                            <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
                              Issued
                            </Badge>
                          ) : completion.course.certificate_enabled ? (
                            <Badge variant="outline">Not Issued</Badge>
                          ) : (
                            <Badge variant="secondary">Disabled</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!completion.certificate_issued && completion.course.certificate_enabled && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIssueCertificate(completion.student.id, completion.course.id, completion.id)}
                              disabled={issuingCertificate === completion.id}
                            >
                              {issuingCertificate === completion.id ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Issuing...
                                </>
                              ) : (
                                <>
                                  <Award className="h-3 w-3 mr-1" />
                                  Issue
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
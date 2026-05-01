import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  FileSpreadsheet,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Loader2,
  Activity,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  FileText,
  Clock,
  CreditCard,
  XCircle,
  Tag,
} from "lucide-react";
import { Reports } from "@/lib/api";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("students");
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: date.from ? date.from.toISOString() : undefined,
        endDate: date.to ? date.to.toISOString() : undefined,
      };

      let res;
      switch (activeTab) {
        case "students":
          res = await Reports.getStudents(params);
          break;
        case "courses":
          res = await Reports.getCourses(params);
          break;
        case "assessments":
          res = await Reports.getAssessments(params);
          break;
        case "revenue":
          res = await Reports.getRevenue(params);
          break;
      }
      setData(res);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab, date]);

  const exportCSV = () => {
    if (!data) return;
    let exportData: any[] = [];
    let filename = `${activeTab}_report_${format(new Date(), "yyyy-MM-dd")}.csv`;

    switch (activeTab) {
      case "students":
        exportData = data.students;
        break;
      case "courses":
        exportData = data.courses.map((c: any) => ({
          "Course ID": c.courseId,
          "Course Name": c.courseName,
          "Total Enrollments": c.totalEnrollments,
          "Completion Rate": `${c.completionRate}%`,
          "Lecture Completion": `${c.lectureCompletionPct}%`,
        }));
        break;
      case "assessments":
        exportData = [
          ...data.quizSubmissions.map((q: any) => ({
            Type: "Quiz",
            Student: q.studentName,
            Email: q.studentEmail,
            Assessment: q.quizTitle,
            Score: q.score,
            Status: q.passed ? "Passed" : "Failed",
            Date: q.submittedAt,
          })),
          ...data.assignmentSubmissions.map((a: any) => ({
            Type: "Assignment",
            Student: a.studentName,
            Email: a.studentEmail,
            Assessment: a.assignmentTitle,
            Score: a.grade || "Pending",
            Status: a.graded ? "Graded" : "Pending",
            Date: a.submittedAt,
          })),
        ];
        break;
      case "revenue":
        exportData = data.transactions;
        break;
    }

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    if (!data) return;
    let exportData: any[] = [];
    let filename = `${activeTab}_report_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

    switch (activeTab) {
      case "students":
        exportData = data.students;
        break;
      case "courses":
        exportData = data.courses.map((c: any) => ({
          "Course ID": c.courseId,
          "Course Name": c.courseName,
          "Total Enrollments": c.totalEnrollments,
          "Completion Rate": c.completionRate / 100,
          "Lecture Completion": c.lectureCompletionPct / 100,
        }));
        break;
      case "assessments":
        exportData = [
          ...data.quizSubmissions.map((q: any) => ({
            Type: "Quiz",
            Student: q.studentName,
            Email: q.studentEmail,
            Assessment: q.quizTitle,
            Score: q.score,
            Status: q.passed ? "Passed" : "Failed",
            Date: new Date(q.submittedAt),
          })),
          ...data.assignmentSubmissions.map((a: any) => ({
            Type: "Assignment",
            Student: a.studentName,
            Email: a.studentEmail,
            Assessment: a.assignmentTitle,
            Score: a.grade || "Pending",
            Status: a.graded ? "Graded" : "Pending",
            Date: new Date(a.submittedAt),
          })),
        ];
        break;
      case "revenue":
        exportData = data.transactions.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        }));
        break;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, filename);
  };

  const renderKPIs = () => {
    if (!data || !data.summary) return null;

    let kpis = [];
    switch (activeTab) {
      case "students":
        kpis = [
          { title: "Total Students", value: data.summary.totalStudents, icon: Users },
          { title: "New Registrations", value: data.summary.newRegistrations, icon: Users },
          { title: "Active Students", value: data.summary.activeStudents, icon: Activity },
          { title: "Avg Courses/Student", value: data.summary.avgCoursesPerStudent, icon: BookOpen },
        ];
        break;
      case "courses":
        kpis = [
          { title: "Total Enrollments", value: data.summary.totalEnrollments, icon: Users },
          { title: "Active Courses", value: data.summary.activeCourses, icon: BookOpen },
          { title: "Avg Completion Rate", value: `${data.summary.avgCompletionRate}%`, icon: CheckCircle2 },
          { title: "Avg Lecture Completion", value: `${data.summary.avgLectureCompletion}%`, icon: PlayCircle },
        ];
        break;
      case "assessments":
        kpis = [
          { title: "Quiz Attempts", value: data.summary.totalQuizAttempts, icon: HelpCircle },
          { title: "Pass Rate", value: `${data.summary.passRate}%`, icon: CheckCircle2 },
          { title: "Submissions", value: data.summary.assignmentSubmissions, icon: FileText },
          { title: "Pending Eval", value: data.summary.pendingEvaluations, icon: Clock },
        ];
        break;
      case "revenue":
        kpis = [
          { title: "Total Revenue", value: `₹${data.summary.totalRevenue.toLocaleString()}`, icon: DollarSign },
          { title: "Transactions", value: data.summary.totalTransactions, icon: CreditCard },
          { title: "Failed Payments", value: data.summary.failedPayments, icon: XCircle },
          { title: "Coupon Usage", value: data.summary.couponUsage, icon: Tag },
        ];
        break;
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AdminDashboardLayout title="Reports & Analytics">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="students" className="gap-2">
                <Users className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="assessments" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="revenue" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Revenue
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full md:w-[260px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate as any}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={exportCSV} variant="outline" disabled={!data || loading}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button onClick={exportExcel} variant="outline" disabled={!data || loading}>
              <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
              Excel
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <>
            {renderKPIs()}
            
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab} Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                   {/* Table rendering will go here based on active tab. For now showing a placeholder message indicating data is ready for export */}
                   <div className="p-8 text-center text-muted-foreground">
                      Data loaded successfully. Use the export buttons above to download the full report.
                      <br/>
                      <span className="text-sm">Total records: {
                        activeTab === 'students' ? data.students?.length :
                        activeTab === 'courses' ? data.courses?.length :
                        activeTab === 'assessments' ? (data.quizSubmissions?.length + data.assignmentSubmissions?.length) :
                        data.transactions?.length
                      }</span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AdminDashboardLayout>
  );
}

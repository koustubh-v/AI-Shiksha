import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Download, User, ExternalLink, CheckCircle2, ClipboardCheck } from "lucide-react";
import { format } from "date-fns";
import { Courses, Assignments, Sections } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminAssignments() {
    const { toast } = useToast();

    // State
    const [courses, setCourses] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);

    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");

    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);

    // Grade Modal State
    const [gradingSubmission, setGradingSubmission] = useState<any>(null);
    const [grade, setGrade] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [submittingGrade, setSubmittingGrade] = useState(false);

    // Date Editing State
    const [editingDateSubmission, setEditingDateSubmission] = useState<any>(null);
    const [newSubmissionDate, setNewSubmissionDate] = useState<string>("");
    const [submittingDate, setSubmittingDate] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchCourses();
    }, []);

    // Load Assignments when Course changes
    useEffect(() => {
        if (selectedCourseId) {
            fetchAssignments(selectedCourseId);
            setSelectedAssignmentId("");
            setSubmissions([]);
        }
    }, [selectedCourseId]);

    // Load Submissions when Assignment changes
    useEffect(() => {
        if (selectedAssignmentId) {
            fetchSubmissions(selectedAssignmentId);
        } else {
            setSubmissions([]);
        }
    }, [selectedAssignmentId]);

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true);
            const data = await Courses.getAll(true);
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchAssignments = async (courseId: string) => {
        try {
            setLoadingAssignments(true);
            const sections = await Sections.getByCourse(courseId);
            const extractedAssignments: any[] = [];

            sections.forEach((section: any) => {
                section.items?.forEach((item: any) => {
                    if (item.type === 'ASSIGNMENT' && item.assignment) {
                        extractedAssignments.push({
                            id: item.assignment.id,
                            title: item.title,
                            totalPoints: item.assignment.max_points || 100
                        });
                    }
                });
            });

            setAssignments(extractedAssignments);
        } catch (error) {
            console.error("Failed to fetch assignments:", error);
            toast({ title: "Error", description: "Failed to load assignments", variant: "destructive" });
        } finally {
            setLoadingAssignments(false);
        }
    };

    const fetchSubmissions = async (assignmentId: string) => {
        try {
            setLoadingSubmissions(true);
            const data = await Assignments.getSubmissions(assignmentId);
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
            toast({ title: "Error", description: "Failed to load submissions", variant: "destructive" });
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleGradeClick = (submission: any) => {
        setGradingSubmission(submission);
        setGrade(submission.grade || 0);
        setFeedback(submission.feedback || "");
    };

    const submitGrade = async () => {
        if (!gradingSubmission) return;

        try {
            setSubmittingGrade(true);
            await Assignments.grade(gradingSubmission.id, grade, feedback);

            toast({ title: "Success", description: "Assignment graded successfully" });

            // Refresh submissions
            fetchSubmissions(selectedAssignmentId);
            setGradingSubmission(null);
        } catch (error) {
            console.error("Failed to save grade:", error);
            toast({ title: "Error", description: "Failed to save grade", variant: "destructive" });
        } finally {
            setSubmittingGrade(false);
        }
    };

    const handleEditDateClick = (submission: any) => {
        setEditingDateSubmission(submission);
        setNewSubmissionDate(new Date(submission.submitted_at).toISOString().split('T')[0]);
    };

    const submitDate = async () => {
        if (!editingDateSubmission) return;
        setSubmittingDate(true);
        try {
            await Assignments.updateSubmissionDate(editingDateSubmission.id, newSubmissionDate);
            toast({ title: "Success", description: "Submission date updated" });
            setEditingDateSubmission(null);
            fetchSubmissions(selectedAssignmentId!);
        } catch (error) {
            toast({ title: "Error", description: "Failed to update date", variant: "destructive" });
        } finally {
            setSubmittingDate(false);
        }
    };

    return (
        <AdminDashboardLayout title="Assignment Management" subtitle="Review and grade student submissions">
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">

                {/* Dynamic Header */}
                <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
                    
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                            Submissions
                        </h2>
                        <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                            Select a course and assignment to review and grade submissions.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
                        <div className="space-y-1 w-full sm:w-64">
                            <Label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Select Course</Label>
                            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                <SelectTrigger className="w-full h-12 rounded-none bg-white/10 border-white/20 text-white shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
                                    <SelectValue placeholder="Choose a course..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-black/10 dark:border-white/10">
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id} className="cursor-pointer">{course.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1 w-full sm:w-64">
                            <Label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Select Assignment</Label>
                            <Select
                                value={selectedAssignmentId}
                                onValueChange={setSelectedAssignmentId}
                                disabled={!selectedCourseId || loadingAssignments}
                            >
                                <SelectTrigger className="w-full h-12 rounded-none bg-white/10 border-white/20 text-white shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
                                    <SelectValue placeholder={loadingAssignments ? "Loading..." : "Choose an assignment..."} />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-black/10 dark:border-white/10">
                                    {assignments.map(assignment => (
                                        <SelectItem key={assignment.id} value={assignment.id} className="cursor-pointer">{assignment.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Submissions Ledger */}
                {selectedAssignmentId && (
                    <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                                <ClipboardCheck className="h-5 w-5 text-zinc-400" />
                                Submissions ({submissions.length})
                            </h3>
                            <Button variant="outline" size="sm" className="rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-bold uppercase tracking-widest gap-2" onClick={() => alert("Export CSV functionality coming soon")}>
                                <Download className="w-4 h-4" /> Export CSV
                            </Button>
                        </div>
                        <div className="p-0">
                            {loadingSubmissions ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Submissions...</p>
                                </div>
                            ) : submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                        <FileText className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <p className="text-lg font-bold text-zinc-900 dark:text-white">No submissions found</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Students have not submitted this assignment yet.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/5 dark:divide-white/5">
                                    {submissions.map((sub) => (
                                        <div key={sub.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            
                                            {/* Left: Student Info */}
                                            <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                                                <Avatar className="h-10 w-10 rounded-none border border-black/10 dark:border-white/10">
                                                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-none">
                                                        {sub.student?.name?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                                                        {sub.student?.name || "Unknown Student"}
                                                    </h4>
                                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                        {sub.student?.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Middle: Content & Meta */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 border-t lg:border-t-0 border-black/5 dark:border-white/5 pt-4 lg:pt-0">
                                                <div className="flex-1">
                                                    {sub.submission_url ? (
                                                        <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 border border-blue-200 dark:border-blue-900/50">
                                                            <FileText className="w-3 h-3 mr-2" /> View File
                                                        </a>
                                                    ) : sub.text_submission ? (
                                                        <span className="text-sm italic text-zinc-500 dark:text-zinc-400 line-clamp-1 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
                                                            "{sub.text_submission}"
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">- No Content -</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start sm:items-end shrink-0 gap-1">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                        {format(new Date(sub.submitted_at), "MMM d, yyyy")}
                                                    </span>
                                                    {sub.grade !== null ? (
                                                        <Badge variant="outline" className={sub.grade >= 60 ? "rounded-none uppercase tracking-widest text-[10px] px-2 py-0.5 border border-emerald-500/30 text-emerald-600 bg-emerald-500/5" : "rounded-none uppercase tracking-widest text-[10px] px-2 py-0.5 border border-red-500/30 text-red-600 bg-red-500/5"}>
                                                            Grade: {sub.grade} / 100
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-0.5 border border-amber-500/30 text-amber-600 bg-amber-500/5">
                                                            Pending Grade
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex items-center gap-2 lg:justify-end shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-black/5 dark:border-white/5">
                                                <Button variant="outline" size="sm" className="rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs font-bold uppercase tracking-widest flex-1 lg:flex-none" onClick={() => handleEditDateClick(sub)}>
                                                    Edit Date
                                                </Button>
                                                <Button size="sm" className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest flex-1 lg:flex-none" onClick={() => handleGradeClick(sub)}>
                                                    {sub.grade !== null ? "Regrade" : "Grade"}
                                                </Button>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Grading Dialog */}
                <Dialog open={!!gradingSubmission} onOpenChange={(open) => !open && setGradingSubmission(null)}>
                    <DialogContent className="rounded-none border border-black/10 dark:border-white/10 sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-black text-xl uppercase tracking-widest">Grade Submission</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Student Content</Label>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-none text-sm">
                                    {gradingSubmission?.submission_url ? (
                                        <a href={gradingSubmission.submission_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 font-bold hover:underline">
                                            <ExternalLink className="w-4 h-4 mr-2" /> Open Submission File
                                        </a>
                                    ) : (
                                        <div className="max-h-40 overflow-y-auto whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                            {gradingSubmission?.text_submission || "No content"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Grade (0-100)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="rounded-none border-black/10 dark:border-white/10 h-12 text-lg font-bold"
                                    value={grade}
                                    onChange={(e) => setGrade(Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Feedback Notes</Label>
                                <Textarea
                                    placeholder="Provide detailed feedback to the student..."
                                    className="rounded-none border-black/10 dark:border-white/10 min-h-[120px] resize-none"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest text-xs" onClick={() => setGradingSubmission(null)}>Cancel</Button>
                            <Button className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold uppercase tracking-widest text-xs" onClick={submitGrade} disabled={submittingGrade}>
                                {submittingGrade ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Grade"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Date Dialog */}
                <Dialog open={!!editingDateSubmission} onOpenChange={(open) => !open && setEditingDateSubmission(null)}>
                    <DialogContent className="rounded-none border border-black/10 dark:border-white/10 sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="font-black text-xl uppercase tracking-widest">Edit Date</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Submission Date</Label>
                                <Input
                                    type="date"
                                    className="rounded-none border-black/10 dark:border-white/10 h-12"
                                    value={newSubmissionDate}
                                    onChange={(e) => setNewSubmissionDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest text-xs" onClick={() => setEditingDateSubmission(null)}>Cancel</Button>
                            <Button className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold uppercase tracking-widest text-xs" onClick={submitDate} disabled={submittingDate}>
                                {submittingDate ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Date"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </AdminDashboardLayout>
    );
}

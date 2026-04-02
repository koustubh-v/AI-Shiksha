import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Download, CheckCircle2, User, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import api, { Courses, Assignments, Sections } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
            // Use admin endpoint which is franchise-scoped via the JWT token
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
            <div className="space-y-6">

                {/* Filters */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                                <Label>Select Course</Label>
                                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a course..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map(course => (
                                            <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label>Select Assignment</Label>
                                <Select
                                    value={selectedAssignmentId}
                                    onValueChange={setSelectedAssignmentId}
                                    disabled={!selectedCourseId || loadingAssignments}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={loadingAssignments ? "Loading..." : "Choose an assignment..."} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignments.map(assignment => (
                                            <SelectItem key={assignment.id} value={assignment.id}>{assignment.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submissions Table */}
                {selectedAssignmentId && (
                    <Card className="border-none shadow-sm">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Submissions ({submissions.length})</h3>
                            <Button variant="outline" size="sm" onClick={() => alert("Export CSV functionality coming soon")}>
                                <Download className="w-4 h-4 mr-2" /> Export CSV
                            </Button>
                        </div>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Submission</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingSubmissions ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                            </TableCell>
                                        </TableRow>
                                    ) : submissions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                No submissions found for this assignment.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        submissions.map((sub) => (
                                            <TableRow key={sub.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{sub.student?.name || "Unknown"}</span>
                                                        <span className="text-xs text-muted-foreground">{sub.student?.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {sub.submission_url ? (
                                                        <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                                                            <FileText className="w-4 h-4 mr-2" />
                                                            View File
                                                        </a>
                                                    ) : sub.text_submission ? (
                                                        <span className="text-sm italic text-muted-foreground line-clamp-1">
                                                            {sub.text_submission.substring(0, 50)}...
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {format(new Date(sub.submitted_at), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    {sub.grade !== null ? (
                                                        <Badge variant={sub.grade >= 60 ? "default" : "destructive"}>
                                                            {sub.grade} / 100
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleEditDateClick(sub)}>
                                                            Edit Date
                                                        </Button>
                                                        <Button size="sm" onClick={() => handleGradeClick(sub)}>
                                                            {sub.grade !== null ? "Regrade" : "Grade"}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Grading Dialog */}
                <Dialog open={!!gradingSubmission} onOpenChange={(open) => !open && setGradingSubmission(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Grade Submission</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Student Submission</Label>
                                <div className="p-3 bg-muted rounded-md text-sm">
                                    {gradingSubmission?.submission_url ? (
                                        <a href={gradingSubmission.submission_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                            <ExternalLink className="w-4 h-4 mr-2" /> Open Submission File
                                        </a>
                                    ) : (
                                        <div className="max-h-40 overflow-y-auto whitespace-pre-wrap">
                                            {gradingSubmission?.text_submission || "No content"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Grade (0-100)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={grade}
                                    onChange={(e) => setGrade(Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Feedback</Label>
                                <Textarea
                                    placeholder="Provide feedback to the student..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setGradingSubmission(null)}>Cancel</Button>
                            <Button onClick={submitGrade} disabled={submittingGrade}>
                                {submittingGrade ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Grade"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Date Dialog */}
                <Dialog open={!!editingDateSubmission} onOpenChange={(open) => !open && setEditingDateSubmission(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Submission Date</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Submission Date</Label>
                                <Input
                                    type="date"
                                    value={newSubmissionDate}
                                    onChange={(e) => setNewSubmissionDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingDateSubmission(null)}>Cancel</Button>
                            <Button onClick={submitDate} disabled={submittingDate}>
                                {submittingDate ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Date"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </AdminDashboardLayout>
    );
}

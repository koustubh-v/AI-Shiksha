import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText, Calendar, Clock, User, Edit2 } from "lucide-react";
import { format } from "date-fns";
import api, { Quizzes } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Quiz {
    id: string;
    title: string;
}

interface Submission {
    id: string;
    student: {
        name: string;
        email: string;
    };
    score: number;
    passed: boolean;
    time_taken_minutes: number;
    submitted_at: string;
}

interface QuizResultsViewProps {
    quizzes: Quiz[];
}

export function QuizResultsView({ quizzes }: QuizResultsViewProps) {
    const [selectedQuizId, setSelectedQuizId] = useState<string>("");
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Date editing
    const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
    const [newDate, setNewDate] = useState<string>("");
    const [submittingDate, setSubmittingDate] = useState(false);

    useEffect(() => {
        if (quizzes.length > 0 && !selectedQuizId) {
            // Optional: auto-select first quiz
            // setSelectedQuizId(quizzes[0].id);
        }
    }, [quizzes]);

    useEffect(() => {
        if (selectedQuizId) {
            fetchSubmissions(selectedQuizId);
        } else {
            setSubmissions([]);
        }
    }, [selectedQuizId]);

    const fetchSubmissions = async (quizId: string) => {
        try {
            setLoading(true);
            const response = await api.get(`/quizzes/${quizId}/submissions`);
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else {
                setSubmissions([]);
            }
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        // Placeholder for export functionality
        alert("Exporting functionality coming soon!");
    };

    const handleEditDate = (sub: Submission) => {
        setEditingSubmission(sub);
        setNewDate(sub.submitted_at ? new Date(sub.submitted_at).toISOString().split('T')[0] : "");
    };

    const submitNewDate = async () => {
        if (!editingSubmission || !newDate) return;
        setSubmittingDate(true);
        try {
            await Quizzes.updateSubmissionDate(editingSubmission.id, newDate);
            toast({ title: "Success", description: "Submission date updated successfully" });
            setEditingSubmission(null);
            fetchSubmissions(selectedQuizId);
        } catch (error) {
            toast({ title: "Error", description: "Failed to update date", variant: "destructive" });
        } finally {
            setSubmittingDate(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
                <div className="w-full md:w-1/3">
                    <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                        <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Select a Quiz to view results" />
                        </SelectTrigger>
                        <SelectContent>
                            {quizzes.map((quiz) => (
                                <SelectItem key={quiz.id} value={quiz.id}>
                                    {quiz.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedQuizId && (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-8 px-3">
                            {submissions.length} Submissions
                        </Badge>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                )}
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Result</TableHead>
                                <TableHead>Time Taken</TableHead>
                                <TableHead className="text-right">Submitted At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!selectedQuizId ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                                <FileText className="h-8 w-8 opacity-20" />
                                            <span>Please select a quiz to check results</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        No submissions found for this quiz.
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
                                        <TableCell className="font-medium">
                                            {sub.score !== null ? `${sub.score}%` : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={sub.passed ? "default" : "destructive"}>
                                                {sub.passed ? "PASSED" : "FAILED"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{sub.time_taken_minutes} min</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            <div className="flex items-center justify-end gap-2">
                                                {sub.submitted_at ? format(new Date(sub.submitted_at), "MMM d, yyyy • h:mm a") : "-"}
                                                <Button variant="ghost" size="icon" onClick={() => handleEditDate(sub)}>
                                                    <Edit2 className="h-4 w-4" />
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

            <Dialog open={!!editingSubmission} onOpenChange={(open) => !open && setEditingSubmission(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Exam Attendance Date</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Attendance Date</Label>
                            <Input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingSubmission(null)}>Cancel</Button>
                        <Button onClick={submitNewDate} disabled={submittingDate}>
                            {submittingDate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Date"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

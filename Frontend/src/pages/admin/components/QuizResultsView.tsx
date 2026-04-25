import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText, Clock, Edit2, ShieldAlert } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
            <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 max-w-md space-y-1">
                        <Label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Select Assessment</Label>
                        <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                            <SelectTrigger className="w-full h-12 rounded-none bg-white dark:bg-zinc-900 border-black/10 dark:border-white/10 font-bold">
                                <SelectValue placeholder="Choose a Quiz to view results" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-black/10 dark:border-white/10">
                                {quizzes.map((quiz) => (
                                    <SelectItem key={quiz.id} value={quiz.id} className="cursor-pointer">{quiz.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedQuizId && (
                        <div className="flex items-center gap-4 pt-4 md:pt-0 shrink-0">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Attempts</span>
                                <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">{submissions.length}</span>
                            </div>
                            <Button variant="outline" className="h-12 rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 font-bold uppercase tracking-widest text-xs" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    )}
                </div>

                <div className="p-0">
                    {!selectedQuizId ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                <FileText className="h-8 w-8 text-zinc-400" />
                            </div>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white">Select a Quiz</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose a quiz from the dropdown to view student results.</p>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Results...</p>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                <ShieldAlert className="h-8 w-8 text-zinc-400" />
                            </div>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white">No submissions yet</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Students have not taken this quiz.</p>
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
                                            <h4 className="font-bold text-zinc-900 dark:text-white text-base truncate">
                                                {sub.student?.name || "Unknown Student"}
                                            </h4>
                                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                                                {sub.student?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle: Stats */}
                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-8 py-4 lg:py-0 border-y lg:border-y-0 border-black/5 dark:border-white/5 lg:px-6 shrink-0">
                                        <div className="flex flex-col gap-1 w-[80px]">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Score</span>
                                            <span className="font-black text-lg text-zinc-900 dark:text-white leading-none">
                                                {sub.score !== null ? `${sub.score}%` : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 w-[100px]">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Result</span>
                                            <Badge variant="outline" className={sub.passed ? "rounded-none uppercase tracking-widest text-[10px] px-2 py-0.5 border border-emerald-500/30 text-emerald-600 bg-emerald-500/5 justify-center" : "rounded-none uppercase tracking-widest text-[10px] px-2 py-0.5 border border-red-500/30 text-red-600 bg-red-500/5 justify-center"}>
                                                {sub.passed ? "PASSED" : "FAILED"}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-col gap-1 w-[80px]">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time</span>
                                            <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-bold text-sm">
                                                <Clock className="h-3 w-3" />
                                                <span>{sub.time_taken_minutes}m</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Date & Actions */}
                                    <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 min-w-[200px]">
                                        <div className="flex flex-col gap-1 text-right">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Submitted On</span>
                                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                {sub.submitted_at ? format(new Date(sub.submitted_at), "MMM d, yyyy • h:mm a") : "-"}
                                            </span>
                                        </div>
                                        <Button variant="outline" size="icon" className="rounded-none border-black/10 dark:border-white/10 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" onClick={() => handleEditDate(sub)}>
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={!!editingSubmission} onOpenChange={(open) => !open && setEditingSubmission(null)}>
                <DialogContent className="rounded-none border border-black/10 dark:border-white/10 sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl uppercase tracking-widest">Edit Date</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Attendance Date</Label>
                            <Input
                                type="date"
                                className="rounded-none border-black/10 dark:border-white/10 h-12"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest text-xs" onClick={() => setEditingSubmission(null)}>Cancel</Button>
                        <Button className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold uppercase tracking-widest text-xs" onClick={submitNewDate} disabled={submittingDate}>
                            {submittingDate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Date"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

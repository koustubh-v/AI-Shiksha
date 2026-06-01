import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ManualEvaluationView({ quizzes }: { quizzes: any[] }) {
    const { toast } = useToast();
    const [selectedQuizId, setSelectedQuizId] = useState<string>("");
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    
    // UI state
    const [activeSet, setActiveSet] = useState<number>(1);
    const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

    const subjectiveTypes = ['SHORT_ANSWER', 'ESSAY', 'DESCRIPTIVE', 'CODE'];
    
    const filteredQuizzes = quizzes.filter(q => 
        q.questions?.some((question: any) => subjectiveTypes.includes(question.type))
    );

    const handleSelectQuiz = async (quizId: string) => {
        setSelectedQuizId(quizId);
        setLoadingSubmissions(true);
        setActiveSet(1);
        setExpandedSubmissionId(null);
        try {
            // Fetch full quiz details to get question_text, correct_answers, etc.
            const [quizResponse, submissionsResponse] = await Promise.all([
                api.get(`/quizzes/${quizId}`),
                api.get(`/quizzes/${quizId}/submissions`)
            ]);
            setSelectedQuiz(quizResponse.data);
            setSubmissions(submissionsResponse.data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load quiz data", variant: "destructive" });
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleEvaluate = async (submissionId: string, evaluations: Record<string, boolean>) => {
        try {
            const response = await api.patch(`/quizzes/submissions/${submissionId}/evaluate`, {
                evaluations
            });
            const updatedSubmission = response.data;
            toast({ title: "Success", description: "Evaluation submitted successfully!" });
            
            // Update local state with the backend-calculated score
            setSubmissions(submissions.map(s => 
                s.id === submissionId ? { 
                    ...s, 
                    score: updatedSubmission.score, 
                    passed: updatedSubmission.passed,
                    is_evaluated: updatedSubmission.is_evaluated,
                    evaluations: updatedSubmission.evaluations 
                } : s
            ));
            
            setExpandedSubmissionId(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit evaluation", variant: "destructive" });
        }
    };

    // Calculate submissions per set
    const submissionsBySet: Record<number, any[]> = {};
    if (selectedQuiz) {
        for (let i = 1; i <= (selectedQuiz.total_sets || 1); i++) {
            submissionsBySet[i] = [];
        }
        
        submissions.forEach(sub => {
            let setNumber = 1;
            if (sub.answers) {
                const answeredQIds = Object.keys(sub.answers);
                const q = selectedQuiz.questions?.find((qu: any) => answeredQIds.includes(qu.id));
                if (q && q.set_number) {
                    setNumber = q.set_number;
                }
            }
            if (!submissionsBySet[setNumber]) {
                submissionsBySet[setNumber] = [];
            }
            submissionsBySet[setNumber].push(sub);
        });
    }

    const activeSubmissions = submissionsBySet[activeSet] || [];

    return (
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px]">
            <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Manual Evaluation
                    </h3>
                    <p className="text-sm text-muted-foreground">Select a quiz and grade subjective questions.</p>
                </div>
                <div className="w-full md:w-80">
                    <Select value={selectedQuizId} onValueChange={handleSelectQuiz}>
                        <SelectTrigger className="w-full h-12 rounded-none bg-white dark:bg-zinc-900">
                            <SelectValue placeholder="Select a quiz to evaluate..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            {filteredQuizzes.length === 0 && (
                                <SelectItem value="none" disabled>No subjective quizzes found</SelectItem>
                            )}
                            {filteredQuizzes.map(q => (
                                <SelectItem key={q.id} value={q.id}>{q.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!selectedQuizId ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">No Quiz Selected</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Please select a quiz from the dropdown menu to view submissions.</p>
                </div>
            ) : loadingSubmissions ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Left Sidebar: Sets Navigation */}
                    <div className="w-full lg:w-64 border-r border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-2 shrink-0">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Select Set</h4>
                        {Array.from({ length: selectedQuiz.total_sets || 1 }).map((_, i) => {
                            const setNum = i + 1;
                            const count = submissionsBySet[setNum]?.length || 0;
                            const isActive = activeSet === setNum;
                            return (
                                <button
                                    key={setNum}
                                    onClick={() => { setActiveSet(setNum); setExpandedSubmissionId(null); }}
                                    className={`w-full flex items-center justify-between p-4 text-left border transition-all ${
                                        isActive 
                                        ? "bg-white dark:bg-zinc-950 border-violet-500 shadow-sm" 
                                        : "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                                    }`}
                                >
                                    <span className={`font-bold ${isActive ? "text-violet-600 dark:text-violet-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                                        Set {setNum}
                                    </span>
                                    <Badge variant={count > 0 ? "default" : "secondary"} className="rounded-full px-2 py-0.5 text-[10px]">
                                        {count}
                                    </Badge>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Content: Submissions List */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h4 className="text-lg font-bold">Submissions for Set {activeSet}</h4>
                            <p className="text-sm text-muted-foreground">{activeSubmissions.length} students have submitted this set.</p>
                        </div>

                        {activeSubmissions.length === 0 ? (
                            <div className="text-center p-12 bg-white/50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                                <p className="text-muted-foreground font-medium">No submissions yet for this set.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeSubmissions.map((submission) => {
                                    const isExpanded = expandedSubmissionId === submission.id;
                                    
                                    // Parse past evaluations if any exist
                                    let pastEvaluations: Record<string, boolean> = {};
                                    if (submission.evaluations) {
                                        try {
                                            pastEvaluations = typeof submission.evaluations === 'string' 
                                                ? JSON.parse(submission.evaluations) 
                                                : submission.evaluations;
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }

                                    return (
                                        <Card key={submission.id} className={`rounded-none border-black/10 dark:border-white/10 shadow-sm overflow-hidden transition-colors ${isExpanded ? "ring-2 ring-violet-500 border-transparent" : ""}`}>
                                            <div 
                                                className="bg-zinc-50 dark:bg-zinc-900/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                                                onClick={() => setExpandedSubmissionId(isExpanded ? null : submission.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 shrink-0 bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center font-bold text-violet-700 dark:text-violet-400">
                                                        {submission.student?.name?.[0] || "?"}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-base">{submission.student?.name || "Unknown Student"}</h5>
                                                        <p className="text-xs text-muted-foreground">Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Score</div>
                                                        <div className="font-black text-lg">{submission.score || 0}%</div>
                                                    </div>
                                                    <Badge variant={submission.is_evaluated ? "default" : "secondary"} className="rounded-none">
                                                        {submission.is_evaluated ? "Evaluated" : "Needs Review"}
                                                    </Badge>
                                                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="border-t border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-6">
                                                    <EvaluationForm 
                                                        submission={submission} 
                                                        quiz={selectedQuiz} 
                                                        pastEvaluations={pastEvaluations}
                                                        onEvaluate={handleEvaluate} 
                                                        subjectiveTypes={subjectiveTypes}
                                                        activeSet={activeSet}
                                                    />
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function EvaluationForm({ 
    submission, 
    quiz, 
    pastEvaluations, 
    onEvaluate, 
    subjectiveTypes, 
    activeSet 
}: { 
    submission: any, 
    quiz: any, 
    pastEvaluations: Record<string, boolean>,
    onEvaluate: (id: string, evals: Record<string, boolean>) => void,
    subjectiveTypes: string[],
    activeSet: number
}) {
    const studentAnswers = submission.answers || {};
    // Only get subjective questions for the active set
    const subjectiveQuestions = (quiz.questions || []).filter((q: any) => 
        (q.set_number || 1) === activeSet && subjectiveTypes.includes(q.type)
    );

    // Local state for grading this session
    const [evals, setEvals] = useState<Record<string, boolean>>({ ...pastEvaluations });

    const toggleMark = (qId: string, isCorrect: boolean) => {
        setEvals(prev => ({ ...prev, [qId]: isCorrect }));
    };

    const handleSubmit = () => {
        onEvaluate(submission.id, evals);
    };

    if (subjectiveQuestions.length === 0) {
        return (
            <div className="text-sm text-muted-foreground italic">
                No subjective questions found in this set to manually evaluate.
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-6">
                {subjectiveQuestions.map((q: any, i: number) => {
                    const ans = studentAnswers[q.id];
                    const markedCorrect = evals[q.id] === true;
                    const markedIncorrect = evals[q.id] === false;

                    return (
                        <div key={q.id} className="space-y-3 bg-zinc-50 dark:bg-zinc-900 p-5 border border-black/5 dark:border-white/5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                                        Question {i + 1}
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{q.type}</Badge>
                                    </span>
                                    <p className="text-sm font-medium mt-2">{q.question_text}</p>
                                </div>
                                <div className="text-xs font-semibold text-muted-foreground whitespace-nowrap bg-white dark:bg-zinc-950 px-2 py-1 border border-black/5 dark:border-white/5">
                                    {q.points} Points
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-950 p-4 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap border border-black/10 dark:border-white/10 mt-2">
                                {ans || <span className="text-muted-foreground italic">No answer provided by student.</span>}
                            </div>
                            
                            {q.correct_answers && q.correct_answers.length > 0 && (
                                <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-100 dark:border-emerald-900/30 mt-2">
                                    <strong>Sample Answer / Expected Criteria: </strong> 
                                    <span className="opacity-90">{q.correct_answers.join(", ")}</span>
                                </div>
                            )}

                            {/* Correct / Incorrect Marking Buttons */}
                            <div className="flex items-center gap-3 pt-3 mt-4 border-t border-black/5 dark:border-white/5">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-2">Grade:</span>
                                <Button 
                                    size="sm" 
                                    variant={markedCorrect ? "default" : "outline"}
                                    onClick={() => toggleMark(q.id, true)}
                                    className={`rounded-none font-bold gap-2 ${markedCorrect ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" : "hover:text-emerald-600 hover:border-emerald-200"}`}
                                >
                                    <CheckCircle2 className="h-4 w-4" /> Correct
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={markedIncorrect ? "destructive" : "outline"}
                                    onClick={() => toggleMark(q.id, false)}
                                    className={`rounded-none font-bold gap-2 ${markedIncorrect ? "" : "hover:text-red-600 hover:border-red-200"}`}
                                >
                                    <XCircle className="h-4 w-4" /> Incorrect
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-black/10 dark:border-white/10 flex justify-end">
                <Button 
                    onClick={handleSubmit} 
                    className="h-12 rounded-none bg-violet-600 hover:bg-violet-700 text-white font-bold uppercase tracking-widest px-8"
                >
                    Submit Evaluation & Recalculate
                </Button>
            </div>
        </div>
    );
}

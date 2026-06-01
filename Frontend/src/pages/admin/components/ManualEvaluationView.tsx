import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

export function ManualEvaluationView({ quizzes }: { quizzes: any[] }) {
    const { toast } = useToast();
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const subjectiveTypes = ['SHORT_ANSWER', 'ESSAY', 'DESCRIPTIVE', 'CODE'];

    const handleSelectQuiz = async (quiz: any) => {
        setSelectedQuiz(quiz);
        setLoadingSubmissions(true);
        try {
            const response = await api.get(`/quizzes/${quiz.id}/submissions`);
            setSubmissions(response.data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load submissions", variant: "destructive" });
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleBack = () => {
        setSelectedQuiz(null);
        setSubmissions([]);
    };

    const handleEvaluate = async (submissionId: string, updatedScore: number, passed: boolean) => {
        try {
            await api.patch(`/quizzes/submissions/${submissionId}/evaluate`, {
                score: updatedScore,
                passed,
            });
            toast({ title: "Success", description: "Evaluation submitted successfully!" });
            // Update local state
            setSubmissions(submissions.map(s => 
                s.id === submissionId ? { ...s, score: updatedScore, passed } : s
            ));
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit evaluation", variant: "destructive" });
        }
    };

    if (selectedQuiz) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={handleBack} className="gap-2 rounded-none">
                        <ArrowLeft className="h-4 w-4" /> Back to Quizzes
                    </Button>
                    <div className="text-right">
                        <h3 className="font-bold text-lg">{selectedQuiz.title}</h3>
                        <p className="text-sm text-muted-foreground">Manual Evaluation Mode</p>
                    </div>
                </div>

                {loadingSubmissions ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="text-center p-12 bg-white/50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                        <p className="text-muted-foreground font-medium">No submissions found for this quiz.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {submissions.map((submission) => {
                            const studentAnswers = submission.answers || {};
                            const questions = selectedQuiz.questions || [];
                            
                            // Filter only subjective questions
                            const subjectiveQuestions = questions.filter((q: any) => subjectiveTypes.includes(q.type));
                            
                            // If no subjective questions in the quiz, skip rendering or note it
                            if (subjectiveQuestions.length === 0) return null;

                            return (
                                <Card key={submission.id} className="rounded-none border-black/10 dark:border-white/10 shadow-sm">
                                    <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-black/5 dark:border-white/5 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    {submission.student?.name || "Unknown Student"}
                                                    <Badge variant={submission.passed ? "default" : "secondary"} className="rounded-none text-xs">
                                                        {submission.passed ? "Passed" : "Needs Review"}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    Submitted: {new Date(submission.submitted_at).toLocaleString()}
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground">Current Score</div>
                                                <div className="text-2xl font-black">{submission.score || 0}%</div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-8">
                                        {subjectiveQuestions.map((q: any, i: number) => (
                                            <div key={q.id} className="space-y-3 bg-white dark:bg-zinc-950 p-4 border border-black/5 dark:border-white/5">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-sm text-zinc-900 dark:text-white">Question {i + 1} ({q.type})</span>
                                                    <span className="text-xs font-semibold text-muted-foreground">Points: {q.points}</span>
                                                </div>
                                                <p className="text-sm font-medium">{q.question_text}</p>
                                                <div className="bg-zinc-50 dark:bg-zinc-900 p-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap border border-black/5 dark:border-white/5">
                                                    {studentAnswers[q.id] || <span className="text-muted-foreground italic">No answer provided.</span>}
                                                </div>
                                                {q.correct_answers && q.correct_answers.length > 0 && (
                                                    <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2 border border-emerald-100 dark:border-emerald-900/30">
                                                        <strong>Expected/Sample Answer: </strong> {q.correct_answers.join(", ")}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <EvaluationForm 
                                            submission={submission} 
                                            quiz={selectedQuiz} 
                                            onEvaluate={handleEvaluate} 
                                        />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    const filteredQuizzes = quizzes.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        q.questions?.some((question: any) => subjectiveTypes.includes(question.type))
    );

    return (
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    Manual Evaluation Required
                </h3>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        className="pl-10 h-10 rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900"
                        placeholder="Search quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-0">
                {filteredQuizzes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">No subjective quizzes found</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Only quizzes containing Short Answer, Essay, or Code questions appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-black/5 dark:divide-white/5">
                        {filteredQuizzes.map((quiz) => (
                            <div key={quiz.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4 cursor-pointer" onClick={() => handleSelectQuiz(quiz)}>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                                        {quiz.title}
                                    </h4>
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-lg">
                                        Contains subjective questions requiring manual grading
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs font-bold uppercase tracking-widest gap-2">
                                    Review Submissions
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function EvaluationForm({ submission, quiz, onEvaluate }: { submission: any, quiz: any, onEvaluate: (id: string, score: number, passed: boolean) => void }) {
    const [score, setScore] = useState<number>(submission.score || 0);

    const handleSubmit = () => {
        const passed = score >= (quiz.passing_score || 75);
        onEvaluate(submission.id, score, passed);
    };

    return (
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-end gap-6 justify-between bg-zinc-50 dark:bg-zinc-900/30 p-6">
            <div className="space-y-2 w-full md:w-64">
                <Label className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Final Score (%)</Label>
                <Input 
                    type="number" 
                    value={score} 
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="rounded-none font-bold text-lg h-12"
                    min={0}
                    max={100}
                />
            </div>
            <div className="w-full md:w-auto">
                <Button onClick={handleSubmit} className="w-full md:w-auto h-12 rounded-none bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest px-8">
                    Submit Evaluation
                </Button>
            </div>
        </div>
    );
}

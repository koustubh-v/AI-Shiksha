import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle, ChevronRight, RotateCcw } from "lucide-react";
import { Quizzes } from "@/lib/api";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
    quizId: string;
    onComplete: () => void;
}

interface Question {
    id: string;
    question_text: string;
    type: string;
    options?: string | string[]; // JSON string, comma-separated, or Array
    points: number;
    set_number?: number;
}

interface QuizData {
    id: string;
    title: string;
    description: string;
    passing_score: number;
    time_limit_minutes: number;
    attempts_allowed: number;
    questions: Question[];
    total_sets?: number;
}

export default function QuizPlayer({ quizId, onComplete }: QuizPlayerProps) {
    const { toast } = useToast();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Quiz State
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    // Result State
    const [result, setResult] = useState<any>(null);
    const [attemptsUsed, setAttemptsUsed] = useState(0);

    useEffect(() => {
        loadQuiz();
    }, [quizId]);

    useEffect(() => {
        if (started && timeRemaining !== null && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev !== null && prev <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev !== null ? prev - 1 : null;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [started, timeRemaining]);

    const loadQuiz = async () => {
        try {
            setLoading(true);
            const [quizData, submissions] = await Promise.all([
                Quizzes.get(quizId),
                Quizzes.getMySubmissions(quizId).catch(() => []) // Handle error gracefully
            ]);

            // Determine active set
            // If failed previous attempt, move to next set
            const failedAttempts = submissions.filter((s: any) => !s.passed).length;
            setAttemptsUsed(submissions.length);

            const totalSets = quizData.total_sets || 1;
            const currentSet = (failedAttempts % totalSets) + 1;

            // Filter questions for the current set
            // Ensure we handle potential string/number mismatches
            let activeQuestions = quizData.questions.filter((q: Question) => {
                const qSet = q.set_number ? Number(q.set_number) : 1;
                return qSet === currentSet;
            });

            // Fallback: If no questions found for the current set, try set 1, then all questions
            if (activeQuestions.length === 0) {
                activeQuestions = quizData.questions.filter((q: Question) => {
                    const qSet = q.set_number ? Number(q.set_number) : 1;
                    return qSet === 1;
                });
                if (activeQuestions.length === 0) {
                    activeQuestions = quizData.questions;
                }
            }

            setQuiz({
                ...quizData,
                questions: activeQuestions
            });

        } catch (error) {
            console.error("Failed to load quiz:", error);
            toast({
                title: "Error",
                description: "Failed to load quiz content",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        setStarted(true);
        if (quiz?.time_limit_minutes) {
            setTimeRemaining(quiz.time_limit_minutes * 60);
        }
    };

    const handleAnswer = (value: string) => {
        if (!quiz) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const handleNext = () => {
        if (!quiz) return;
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!quiz || submitting) return;

        try {
            setSubmitting(true);
            const timeTaken = quiz.time_limit_minutes
                ? (quiz.time_limit_minutes * 60) - (timeRemaining || 0)
                : 0; // consistent calculation needed, simplistic for now

            const submission = await Quizzes.submit(quiz.id, answers, Math.ceil(timeTaken / 60));
            setResult(submission);
            if (submission.passed) {
                onComplete();
                toast({
                    title: "Quiz Completed!",
                    description: `You scored ${submission.score}%`,
                });
            } else {
                toast({
                    title: "Quiz Failed",
                    description: `You scored ${submission.score}%. Passing score is ${quiz.passing_score}%`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            toast({
                title: "Error",
                description: "Failed to submit quiz",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!quiz) return null;

    // Result View
    if (result) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <Card className={cn("border-t-4", result.passed ? "border-t-green-500" : "border-t-red-500")}>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">
                            {result.passed ? "Congratulations! 🎉" : "Not quite there yet"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center pt-6">
                        <div className="flex justify-center">
                            <div className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center border-4 text-3xl font-bold",
                                result.passed
                                    ? "border-green-100 bg-green-50 text-green-600"
                                    : "border-red-100 bg-red-50 text-red-600"
                            )}>
                                {result.score}%
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-2 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Passing</div>
                                <div className="font-semibold text-sm">{quiz.passing_score}%</div>
                            </div>
                            <div className="p-2 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Status</div>
                                <Badge variant={result.passed ? "default" : "destructive"} className="text-xs">
                                    {result.passed ? "PASSED" : "FAILED"}
                                </Badge>
                            </div>
                            <div className="p-2 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Attempts</div>
                                <div className="font-semibold text-sm">{attemptsUsed}/{quiz.attempts_allowed}</div>
                            </div>
                        </div>

                        {/* Attempts Limit Message */}
                        {!result.passed && attemptsUsed >= quiz.attempts_allowed && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                Maximum attempts reached. You cannot retry this quiz.
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="justify-center gap-4 pb-6">
                        {(!result.passed && attemptsUsed < quiz.attempts_allowed) && (
                            <Button variant="outline" size="sm" onClick={() => {
                                setResult(null);
                                setStarted(false);
                                setAnswers({});
                                setCurrentQuestionIndex(0);
                                loadQuiz(); // Reload to update attempts and questions set
                            }}>
                                <RotateCcw className="w-3 h-3 mr-2" />
                                Retry Quiz
                            </Button>
                        )}
                        {result.passed && (
                            <Button size="sm" onClick={() => onComplete()}>
                                Continue Learning
                                <ChevronRight className="w-3 h-3 ml-2" />
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Start Screen
    // Start Screen - Modernized
    // Start Screen - Compact & Centered
    if (!started) {
        const isLimitReached = attemptsUsed >= quiz.attempts_allowed;

        return (
            <div className="flex flex-col items-center justify-center p-4 h-full">
                <Card className="w-full max-w-2xl border-none shadow-lg rounded-2xl overflow-hidden bg-white/95 backdrop-blur">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Left Side - Hero / Info */}
                        <div className="p-6 flex flex-col justify-between bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
                            <div className="space-y-4">
                                <Badge className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full w-fit">
                                    Quiz
                                </Badge>
                                <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                                    {quiz.title}
                                </h1>
                                {quiz.description && (
                                    <div className="prose prose-sm prose-gray text-muted-foreground leading-snug line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: quiz.description }} />
                                )}
                            </div>

                            <div className="mt-8 space-y-2">
                                {isLimitReached ? (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium text-center">
                                        Maximum attempts ({quiz.attempts_allowed}) reached.
                                    </div>
                                ) : (
                                    <Button size="default" className="w-full rounded-full font-semibold shadow-md transition-all" onClick={handleStart}>
                                        Start Quiz
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Stats Grid */}
                        <div className="p-6 bg-white flex flex-col justify-center">
                            <h3 className="text-xs font-semibold mb-4 text-gray-400 uppercase tracking-wider">Details</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm shrink-0">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{quiz.passing_score}%</div>
                                        <div className="text-xs text-gray-500 font-medium">Passing</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">
                                            {quiz.time_limit_minutes ? `${quiz.time_limit_minutes}m` : "No Limit"}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">Time</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{attemptsUsed}/{quiz.attempts_allowed}</div>
                                        <div className="text-xs text-gray-500 font-medium">Attempts</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                                        <RotateCcw className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{quiz.questions.length}</div>
                                        <div className="text-xs text-gray-500 font-medium">Questions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    // Question View
    const currentQuestion = quiz.questions[currentQuestionIndex];

    if (!currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-semibold">Error Loading Question</h3>
                <p className="text-muted-foreground">Detailed question data could not be found.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Reload Lesson</Button>
            </div>
        );
    }

    const parseOptions = (optionsData: string | string[] | undefined) => {
        if (!optionsData) return [];

        // If it's already an array, return it
        if (Array.isArray(optionsData)) {
            return optionsData;
        }

        try {
            // Try parsing as JSON first
            const parsed = JSON.parse(optionsData);
            if (Array.isArray(parsed)) return parsed;
            return [];
        } catch (e) {
            // Fallback: If it's a comma-separated string, split it
            if (typeof optionsData === 'string') {
                return optionsData.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
            }
            return [];
        }
    };

    const options = parseOptions(currentQuestion.options);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 w-full">
            <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Quiz Header - Clean & Centered */}
                <div className="flex items-center justify-between">
                    <div>
                        <Badge variant="outline" className="mb-2 uppercase tracking-wider text-xs font-bold text-muted-foreground px-2 py-0.5">
                            Quiz • {currentQuestionIndex + 1} of {quiz.questions.length}
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{quiz.title}</h2>
                    </div>
                    {timeRemaining !== null && (
                        <div className={cn(
                            "flex items-center gap-2 font-mono text-base font-medium px-4 py-2 bg-secondary/50 rounded-full transition-colors",
                            timeRemaining < 60 && "text-red-600 bg-red-50 animate-pulse"
                        )}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeRemaining)}
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                </div>

                {/* Question Card */}
                <Card className="border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-10 md:p-14 space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-2xl md:text-4xl font-medium leading-normal text-gray-800 tracking-tight">
                                {currentQuestion.question_text}
                            </h3>
                        </div>

                        <RadioGroup
                            value={answers[currentQuestion.id] || ""}
                            onValueChange={handleAnswer}
                            className="space-y-4"
                        >
                            {options.map((option: string, index: number) => {
                                const isSelected = answers[currentQuestion.id] === option;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleAnswer(option)}
                                        className={cn(
                                            "flex items-center space-x-4 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 group relative overflow-hidden",
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-inner"
                                                : "border-transparent bg-secondary/30 hover:bg-secondary/60 hover:scale-[1.01]"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                            isSelected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover:border-muted-foreground"
                                        )}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </div>
                                        <Label className="flex-1 cursor-pointer text-lg font-normal text-gray-700 group-hover:text-gray-900">
                                            {option}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </CardContent >

                    <CardFooter className="flex justify-between items-center p-8 bg-muted/5 border-t">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            size="lg"
                            className="px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold text-lg h-12"
                            onClick={handleNext}
                            disabled={submitting}
                        >
                            {currentQuestionIndex === quiz.questions.length - 1 ? (
                                submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Submit Quiz"
                            ) : (
                                <>
                                    Next <ChevronRight className="w-5 h-5 ml-1" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card >
            </div>
        </div>
    );
}

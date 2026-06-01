import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    HelpCircle,
    BarChart,
    Settings,
    PlayCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { QuizResultsView } from "./components/QuizResultsView";
import { ManualEvaluationView } from "./components/ManualEvaluationView";

export default function QuizManagement() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"QUIZZES" | "RESULTS" | "MANUAL_EVALUATION">("QUIZZES");

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get("/quizzes");
            setQuizzes(response.data);
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
            toast({
                title: "Error",
                description: "Failed to load quizzes",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;
        try {
            await api.delete(`/quizzes/${id}`);
            setQuizzes(quizzes.filter((q) => q.id !== id));
            toast({
                title: "Success",
                description: "Quiz deleted successfully",
            });
        } catch (error) {
            console.error("Failed to delete quiz:", error);
            toast({
                title: "Error",
                description: "Failed to delete quiz",
                variant: "destructive",
            });
        }
    };

    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminDashboardLayout title="Quiz Management" subtitle="Create and manage quizzes">
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">

                {/* Dynamic Header */}
                <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-pink-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
                    
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                            Assessments
                        </h2>
                        <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                            Create engaging quizzes, manage question banks, and review student performance.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 shrink-0">
                        <Link to="/dashboard/quizzes/new">
                            <Button className="h-12 bg-white hover:bg-zinc-200 text-zinc-900 rounded-none font-bold uppercase tracking-widest px-6 w-full sm:w-auto">
                                <Plus className="h-5 w-5 mr-2" />
                                Create Quiz
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Brutalist Toggle */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-white/40 dark:bg-zinc-900/40 p-1 rounded-none border border-black/10 dark:border-white/10 shadow-sm backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("QUIZZES")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all ${
                                activeTab === "QUIZZES"
                                    ? "bg-violet-600 text-white shadow-md border border-violet-500/20"
                                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50"
                            }`}
                        >
                            <FileText className="h-4 w-4" />
                            Quizzes
                        </button>
                        <button
                            onClick={() => setActiveTab("RESULTS")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all ${
                                activeTab === "RESULTS"
                                    ? "bg-violet-600 text-white shadow-md border border-violet-500/20"
                                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50"
                            }`}
                        >
                            <BarChart className="h-4 w-4" />
                            Results
                        </button>
                        <button
                            onClick={() => setActiveTab("MANUAL_EVALUATION")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all ${
                                activeTab === "MANUAL_EVALUATION"
                                    ? "bg-violet-600 text-white shadow-md border border-violet-500/20"
                                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50"
                            }`}
                        >
                            <Edit className="h-4 w-4" />
                            Manual Eval
                        </button>
                    </div>
                </div>

                {activeTab === "QUIZZES" ? (
                    <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Settings className="h-5 w-5 text-zinc-400" />
                                Quiz Library
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
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Library...</p>
                                </div>
                            ) : filteredQuizzes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                        <PlayCircle className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <p className="text-lg font-bold text-zinc-900 dark:text-white">No quizzes found</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Click "Create Quiz" to add an assessment.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/5 dark:divide-white/5">
                                    {filteredQuizzes.map((quiz) => (
                                        <div key={quiz.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            
                                            {/* Left: Info */}
                                            <div className="flex items-start gap-4 flex-1 min-w-[300px]">
                                                <div className="h-10 w-10 shrink-0 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-none flex items-center justify-center mt-1">
                                                    <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                                                        {quiz.title}
                                                    </h4>
                                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-lg">
                                                        {quiz.description || "No description provided"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Middle: Badges */}
                                            <div className="flex flex-wrap items-center gap-3 py-2 md:py-0 border-y md:border-y-0 border-black/5 dark:border-white/5 md:px-6">
                                                <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border border-zinc-500/30 text-zinc-600 dark:text-zinc-300 bg-zinc-500/5 shrink-0">
                                                    {quiz._count?.questions || 0} Questions
                                                </Badge>
                                                <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border border-blue-500/30 text-blue-600 bg-blue-500/5 shrink-0">
                                                    {quiz.total_sets || 1} Sets
                                                </Badge>
                                                <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border border-emerald-500/30 text-emerald-600 bg-emerald-500/5 shrink-0">
                                                    Pass: {quiz.passing_score}%
                                                </Badge>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex items-center justify-end gap-2 shrink-0">
                                                <Link to={`/dashboard/quizzes/${quiz.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs font-bold uppercase tracking-widest gap-2">
                                                        <Edit className="h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-none border border-transparent hover:border-black/10 dark:hover:border-white/10 shrink-0 h-9 w-9">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-none border-black/10 dark:border-white/10">
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer text-xs font-bold uppercase tracking-widest text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-500/10"
                                                            onClick={() => handleDelete(quiz.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Delete Quiz
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === "RESULTS" ? (
                    <QuizResultsView quizzes={quizzes} />
                ) : (
                    <ManualEvaluationView quizzes={quizzes} />
                )}
            </div>
        </AdminDashboardLayout>
    );
}

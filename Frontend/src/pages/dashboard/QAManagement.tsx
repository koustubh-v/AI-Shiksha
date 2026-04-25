import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { QA, Courses } from '@/lib/api';
import { Loader2, Reply, MessageSquare, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedDashboard } from '@/components/layout/UnifiedDashboard';
import { AdminDashboardLayout } from '@/components/layout/AdminDashboardLayout';
import { Label } from '@/components/ui/label';

export default function QAManagement() {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [questions, setQuestions] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingQA, setLoadingQA] = useState(false);
    
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [submittingReply, setSubmittingReply] = useState<string | null>(null);
    
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            let data = [];
            if (user?.role === 'teacher') {
                data = await Courses.getMyCourses();
            } else {
                data = await QA.getAdminCourses();
            }
            setCourses(data);
            if (data.length > 0) {
                setSelectedCourse(data[0].id);
                loadQuestions(data[0].id);
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load courses', variant: 'destructive' });
        } finally {
            setLoadingCourses(false);
        }
    };

    const loadQuestions = async (courseId: string) => {
        if (!courseId) return;
        setLoadingQA(true);
        try {
            const data = await QA.getCourseQuestions(courseId);
            setQuestions(data);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load Q/A', variant: 'destructive' });
        } finally {
            setLoadingQA(false);
        }
    };

    const handleCourseChange = (courseId: string) => {
        setSelectedCourse(courseId);
        loadQuestions(courseId);
    };

    const handleReply = async (qaId: string) => {
        const text = replyText[qaId];
        if (!text || !text.trim()) return;

        setSubmittingReply(qaId);
        try {
            const reply = await QA.replyQuestion(qaId, text);
            // Update local state
            setQuestions(questions.map(q => {
                if (q.id === qaId) {
                    return {
                        ...q,
                        status: 'ANSWERED',
                        replies: [...(q.replies || []), {
                            ...reply,
                            user: {
                                name: user?.name,
                                avatar_url: user?.avatar_url,
                                role: user?.role
                            }
                        }]
                    };
                }
                return q;
            }));
            
            setReplyText(prev => ({ ...prev, [qaId]: '' }));
            toast({ title: 'Success', description: 'Reply sent successfully. Student has been notified.' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to send reply', variant: 'destructive' });
        } finally {
            setSubmittingReply(null);
        }
    };

    if (loadingCourses) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Courses...</p>
            </div>
        );
    }

    const content = (
        <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">

            {/* Dynamic Header */}
            <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-sky-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
                
                <div className="relative z-10 space-y-2">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                        Q/A Management
                    </h2>
                    <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                        Monitor and respond to student inquiries across your courses.
                    </p>
                </div>

                <div className="relative z-10 shrink-0 w-full md:w-80 space-y-1">
                    <Label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Select Course Context</Label>
                    <Select value={selectedCourse} onValueChange={handleCourseChange}>
                        <SelectTrigger className="w-full h-12 rounded-none bg-white/10 border-white/20 text-white shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
                            <SelectValue placeholder="Choose a course..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-black/10 dark:border-white/10">
                            {courses.length === 0 ? (
                                <SelectItem value="none" disabled>No courses available</SelectItem>
                            ) : (
                                courses.map(course => (
                                    <SelectItem key={course.id} value={course.id} className="cursor-pointer">
                                        {course.title} ({course._count?.qa_questions || 0})
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content Area */}
            {selectedCourse && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="h-5 w-5 text-indigo-500" />
                        <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">
                            Discussion Thread ({questions.length})
                        </h3>
                    </div>

                    {loadingQA ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-sm">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Questions...</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-sm">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                <HelpCircle className="h-8 w-8 text-zinc-400" />
                            </div>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white">No questions yet</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Students haven't asked anything in this course.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {questions.map(qa => (
                                <div key={qa.id} className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                                    
                                    {/* Header */}
                                    <div className="p-6 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <Avatar className="h-12 w-12 rounded-none border border-black/10 dark:border-white/10 shadow-sm">
                                                <AvatarImage src={qa.student?.avatar_url} className="rounded-none" />
                                                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black rounded-none text-lg">
                                                    {qa.student?.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1 mt-1">
                                                <h4 className="font-bold text-zinc-900 dark:text-white text-base leading-none">
                                                    {qa.student?.name || "Unknown Student"}
                                                </h4>
                                                <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span>Lesson: {qa.lesson?.title || "General"}</span>
                                                    <span>•</span>
                                                    <span>{new Date(qa.created_at).toLocaleDateString()} {new Date(qa.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={qa.status === 'OPEN' ? "rounded-none uppercase tracking-widest text-[10px] px-3 py-1 border border-amber-500/30 text-amber-600 bg-amber-500/5 shrink-0 h-fit" : "rounded-none uppercase tracking-widest text-[10px] px-3 py-1 border border-emerald-500/30 text-emerald-600 bg-emerald-500/5 shrink-0 h-fit"}>
                                            {qa.status}
                                        </Badge>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 space-y-6">
                                        {/* Original Question */}
                                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-none border-l-4 border-indigo-500">
                                            <div className="font-black text-xs text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <HelpCircle className="h-3 w-3" />
                                                Question
                                            </div>
                                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                                                {qa.question}
                                            </p>
                                        </div>

                                        {/* Replies */}
                                        {qa.replies && qa.replies.length > 0 && (
                                            <div className="pl-6 space-y-4 border-l-2 border-black/10 dark:border-white/10 ml-2">
                                                {qa.replies.map((reply: any) => (
                                                    <div key={reply.id} className="bg-white dark:bg-zinc-950 p-4 rounded-none border border-black/5 dark:border-white/5 shadow-sm">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                                                                    {reply.user?.name || "Instructor"}
                                                                    {['admin', 'super_admin', 'teacher', 'instructor'].includes(reply.user?.role?.toLowerCase() || '') && (
                                                                        <Shield className="h-3 w-3 text-emerald-500" />
                                                                    )}
                                                                </span>
                                                                <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[8px] px-1.5 py-0 border-black/10 dark:border-white/10 text-zinc-500">
                                                                    {reply.user?.role || "Staff"}
                                                                </Badge>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                                {new Date(reply.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                            {reply.reply}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply Box */}
                                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                                            <Textarea 
                                                placeholder="Write a detailed response..."
                                                value={replyText[qa.id] || ''}
                                                onChange={e => setReplyText({ ...replyText, [qa.id]: e.target.value })}
                                                className="resize-none min-h-[60px] flex-1 rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 focus-visible:ring-indigo-500 text-sm"
                                            />
                                            <Button 
                                                onClick={() => handleReply(qa.id)}
                                                disabled={submittingReply === qa.id || !(replyText[qa.id]?.trim())}
                                                className="rounded-none h-auto min-h-[60px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs px-6 shrink-0"
                                            >
                                                {submittingReply === qa.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Reply className="w-4 h-4" />
                                                        <span>Send Reply</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    if (user?.role === 'teacher') {
        return (
            <UnifiedDashboard title="Q/A Management" subtitle="Respond to your students">
                {content}
            </UnifiedDashboard>
        );
    }

    return (
        <AdminDashboardLayout title="Q/A Management" subtitle="Answer student questions from franchise courses.">
            {content}
        </AdminDashboardLayout>
    );
}

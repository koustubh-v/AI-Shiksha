import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Mail, X, Send, MessageSquare, AlertCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Feedback } from "@/lib/api";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Email dialog state
    const [emailDialog, setEmailDialog] = useState(false);
    const [emailTarget, setEmailTarget] = useState<{ email: string; name: string } | null>(null);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await Feedback.getAdminFeedback();
            setFeedbacks(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load feedback", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await Feedback.updateStatus(id, status);
            toast({ title: "Success", description: "Status updated" });
            loadFeedbacks();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    };

    const openEmailDialog = (student: { email: string; name: string }, feedbackContent: string) => {
        setEmailTarget(student);
        setEmailSubject("Re: Your Feedback");
        setEmailBody(`Hi ${student.name},\n\nThank you for your feedback.\n\n`);
        setEmailDialog(true);
    };

    const handleSendEmail = async () => {
        if (!emailTarget || !emailSubject.trim() || !emailBody.trim()) return;
        setSendingEmail(true);
        try {
            await api.post('/mail/send-notification', {
                email: emailTarget.email,
                name: emailTarget.name,
                subject: emailSubject,
                message: emailBody,
            });
            toast({ title: "Email Sent", description: `Email sent to ${emailTarget.email}` });
            setEmailDialog(false);
            setEmailSubject("");
            setEmailBody("");
        } catch (error: any) {
            toast({
                title: "Failed to Send",
                description: error?.response?.data?.message || "Could not send email.",
                variant: "destructive",
            });
        } finally {
            setSendingEmail(false);
        }
    };

    const pendingCount = feedbacks.filter(f => f.status !== 'RESOLVED').length;

    return (
        <AdminDashboardLayout title="Student Feedback" subtitle="Review feedback from students">
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">

                {/* Dynamic Header */}
                <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-sky-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
                    
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
                            Feedback
                            {pendingCount > 0 && (
                                <Badge variant="destructive" className="rounded-none text-xl px-4 py-1.5 uppercase tracking-widest bg-red-600">
                                    {pendingCount} Pending
                                </Badge>
                            )}
                        </h2>
                        <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                            Review and respond to platform suggestions, bugs, and student feedback.
                        </p>
                    </div>
                </div>

                {/* Ledger */}
                <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-zinc-400" />
                            Feedback Inbox
                        </h3>
                    </div>

                    <div className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Feedback...</p>
                            </div>
                        ) : feedbacks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                    <CheckCircle className="h-8 w-8 text-zinc-400" />
                                </div>
                                <p className="text-lg font-bold text-zinc-900 dark:text-white">Inbox Zero!</p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">No feedback submitted yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-black/5 dark:divide-white/5">
                                {feedbacks.map((item) => (
                                    <div key={item.id} className="group p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                        
                                        {/* Left: User Info & Content */}
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                                            <Avatar className="h-12 w-12 rounded-none border border-black/10 dark:border-white/10 shrink-0">
                                                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black rounded-none text-lg">
                                                    {item.student?.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-3 flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-zinc-900 dark:text-white text-base leading-none">
                                                            {item.student?.name || "Unknown Student"}
                                                        </h4>
                                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                            {item.student?.email}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className={item.status === 'RESOLVED' ? "rounded-none uppercase tracking-widest text-[10px] px-2 py-0 border-emerald-500/30 text-emerald-600 bg-emerald-500/5 h-fit w-fit" : "rounded-none uppercase tracking-widest text-[10px] px-2 py-0 border-amber-500/30 text-amber-600 bg-amber-500/5 h-fit w-fit"}>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-black/5 dark:border-white/5 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap rounded-none">
                                                    {item.content}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(item.created_at), "MMM d, yyyy h:mm a")}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0 border-t lg:border-t-0 border-black/5 dark:border-white/5 pt-4 lg:pt-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 font-bold uppercase tracking-widest text-xs w-full lg:w-32"
                                                onClick={() => openEmailDialog(
                                                    { email: item.student?.email, name: item.student?.name },
                                                    item.content
                                                )}
                                            >
                                                <Mail className="w-3.5 h-3.5 mr-2" /> Email
                                            </Button>
                                            {item.status !== 'RESOLVED' && (
                                                <Button 
                                                    size="sm" 
                                                    className="rounded-none font-bold uppercase tracking-widest text-xs w-full lg:w-32" 
                                                    onClick={() => updateStatus(item.id, 'RESOLVED')}
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5 mr-2" /> Resolve
                                                </Button>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Email Dialog */}
            <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
                <DialogContent className="rounded-none border border-black/10 dark:border-white/10 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-black text-xl uppercase tracking-widest flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Send Email
                        </DialogTitle>
                        <DialogDescription className="font-bold text-zinc-500">
                            To: {emailTarget?.name} ({emailTarget?.email})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-subject" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Subject</Label>
                            <input
                                id="email-subject"
                                className="flex h-12 w-full rounded-none border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Email subject..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email-body" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</Label>
                            <Textarea
                                id="email-body"
                                rows={7}
                                className="resize-none rounded-none border-black/10 dark:border-white/10 focus-visible:ring-1 focus-visible:ring-indigo-500"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Write your message here..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest text-xs" onClick={() => setEmailDialog(false)}>
                            <X className="h-4 w-4 mr-2" /> Cancel
                        </Button>
                        <Button
                            className="rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs"
                            onClick={handleSendEmail}
                            disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                        >
                            {sendingEmail ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminDashboardLayout>
    );
}

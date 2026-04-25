import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Mail, X, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Feedback } from "@/lib/api";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

    return (
        <AdminDashboardLayout title="Student Feedback" subtitle="Review feedback from students">
            <div className="space-y-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Feedback</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                ) : feedbacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            No feedback submitted yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    feedbacks.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.student?.name || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{item.student?.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="max-w-md whitespace-pre-wrap text-sm">{item.content}</p>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(item.created_at), "MMM d, yyyy h:mm a")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={item.status === 'RESOLVED' ? "default" : "secondary"}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEmailDialog(
                                                            { email: item.student?.email, name: item.student?.name },
                                                            item.content
                                                        )}
                                                    >
                                                        <Mail className="w-4 h-4 mr-2" /> Email
                                                    </Button>
                                                    {item.status !== 'RESOLVED' && (
                                                        <Button size="sm" onClick={() => updateStatus(item.id, 'RESOLVED')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Email Dialog */}
            <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Send Email to {emailTarget?.name}
                        </DialogTitle>
                        <DialogDescription>{emailTarget?.email}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="email-subject">Subject</Label>
                            <input
                                id="email-subject"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Email subject..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email-body">Message</Label>
                            <Textarea
                                id="email-body"
                                rows={7}
                                className="resize-none"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Write your message here..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setEmailDialog(false)}>
                            <X className="h-4 w-4 mr-2" /> Cancel
                        </Button>
                        <Button
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

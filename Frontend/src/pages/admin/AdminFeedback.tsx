import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, CheckCircle, Mail } from "lucide-react";
import { Feedback } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

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
                                                        onClick={() => window.location.href = `mailto:${item.student?.email}`}
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
        </AdminDashboardLayout>
    );
}

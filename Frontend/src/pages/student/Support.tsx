import { useState, useEffect } from "react";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Support as supportApi } from "@/lib/api";

interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | string;
    created_at: string;
    updated_at: string;
}

export default function Support() {
    const { toast } = useToast();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [activeTab, setActiveTab] = useState("create");
    const [loading, setLoading] = useState(false);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [newTicket, setNewTicket] = useState({
        subject: "",
        description: "",
        priority: "MEDIUM",
    });

    // Load tickets on mount
    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            setLoadingTickets(true);
            const data = await supportApi.getStudentTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error loading tickets:', error);
            toast({
                title: "Error",
                description: "Failed to load tickets. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const createdTicket = await supportApi.createTicket(newTicket);

            setTickets([createdTicket, ...tickets]);
            toast({
                title: "Ticket Created",
                description: `Support team has been notified. ID: TICK-${createdTicket.id.split('-')[0]}`,
            });

            setNewTicket({ subject: "", description: "", priority: "MEDIUM" });
            setActiveTab("recent");
        } catch (error) {
            console.error('Error creating ticket:', error);
            toast({
                title: "Error",
                description: "Failed to create ticket. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "OPEN": return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
            case "IN_PROGRESS": return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
            case "RESOLVED": return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
            case "CLOSED": return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toUpperCase()) {
            case "HIGH": return "text-red-600 bg-red-50 border-red-100";
            case "MEDIUM": return "text-amber-600 bg-amber-50 border-amber-100";
            case "LOW": return "text-green-600 bg-green-50 border-green-100";
            default: return "text-gray-600";
        }
    };

    return (
        <UnifiedDashboard title="Support Center" subtitle="We're here to help you">
            <div className="max-w-6xl mx-auto p-6 font-sans space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-lms-blue" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F1F1F]">{tickets.filter(t => t.status !== 'CLOSED').length}</p>
                            <p className="text-sm text-gray-500">Active Tickets</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F1F1F]">{tickets.filter(t => t.status === 'CLOSED' || t.status === 'RESOLVED').length}</p>
                            <p className="text-sm text-gray-500">Solved Issues</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F1F1F]">~2 hrs</p>
                            <p className="text-sm text-gray-500">Avg. Response Time</p>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
                            <TabsTrigger value="create" className="rounded-full px-6 data-[state=active]:bg-[#1F1F1F] data-[state=active]:text-white">New Ticket</TabsTrigger>
                            <TabsTrigger value="recent" className="rounded-full px-6 data-[state=active]:bg-[#1F1F1F] data-[state=active]:text-white">Recent Tickets</TabsTrigger>
                            <TabsTrigger value="closed" className="rounded-full px-6 data-[state=active]:bg-[#1F1F1F] data-[state=active]:text-white">Closed Tickets</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="create">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 border-none shadow-md rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                    <CardTitle className="text-xl font-semibold text-[#1F1F1F]">Submit a Request</CardTitle>
                                    <CardDescription>Our support team will get back to you as soon as possible.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleCreateTicket} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Subject</label>
                                            <Input
                                                placeholder="Brief summary of the issue"
                                                value={newTicket.subject}
                                                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                                required
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Priority</label>
                                                <Select
                                                    value={newTicket.priority}
                                                    onValueChange={(val) => setNewTicket({ ...newTicket, priority: val })}
                                                >
                                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                                        <SelectValue placeholder="Select Priority" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="LOW">Low</SelectItem>
                                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                                        <SelectItem value="HIGH">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Description</label>
                                            <Textarea
                                                placeholder="Please describe your issue in detail..."
                                                className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                value={newTicket.description}
                                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button type="button" variant="outline" onClick={() => setNewTicket({ subject: "", description: "", priority: "MEDIUM" })}>Clear</Button>
                                            <Button type="submit" disabled={loading} className="bg-[#0056D2] hover:bg-[#0041a3] text-white px-8">
                                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Submit Ticket
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Card className="border-none shadow-sm bg-blue-50/50 rounded-2xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                                            <AlertCircle className="h-5 w-5" />
                                            Before you submit
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-blue-900/80 space-y-3">
                                        <p>• Check our FAQ section for instant answers.</p>
                                        <p>• Provide as much detail as possible (screenshots help!).</p>
                                        <p>• Allow up to 24 hours for a response during business days.</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm rounded-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Support Hours</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-gray-600 space-y-2">
                                        <p><strong>Monday - Friday:</strong><br />9:00 AM - 6:00 PM EST</p>
                                        <p><strong>Weekend:</strong><br />Limited Support</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="recent" className="space-y-4">
                        {loadingTickets ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">No tickets found</p>
                                <p className="text-sm text-gray-400 mt-2">Create your first support ticket to get started</p>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div key={ticket.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                                            <FileText className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <Badge variant="outline" className="font-normal text-xs bg-gray-50">TICK-{ticket.id.split('-')[0]}</Badge>
                                                <Badge variant="outline" className={`font-normal text-xs border ${getStatusColor(ticket.status)}`}>{ticket.status.toUpperCase()}</Badge>
                                                <Badge variant="outline" className={`font-normal text-xs border ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-6 min-w-[200px]">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Created</p>
                                            <p className="text-sm font-medium text-gray-700">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View Details</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="closed" className="space-y-4">
                        {loadingTickets ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : tickets.filter(t => t.status === 'CLOSED').length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">No closed tickets found</p>
                            </div>
                        ) : (
                            tickets.filter(t => t.status === 'CLOSED').map((ticket) => (
                                <div key={ticket.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm opacity-75 hover:opacity-100 transition-opacity flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <Badge variant="outline" className="font-normal text-xs bg-gray-50">TICK-{ticket.id.split('-')[0]}</Badge>
                                                <Badge variant="outline" className="font-normal text-xs bg-green-100 text-green-700 border-green-200">SOLVED</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Closed On</p>
                                        <p className="text-sm font-medium text-gray-700">{new Date(ticket.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>
                </Tabs>

            </div>
        </UnifiedDashboard>
    );
}

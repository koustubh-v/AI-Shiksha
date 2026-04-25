import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Loader2,
  Send,
  User,
  Paperclip,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Support as supportApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SupportTicketMessage {
  id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  sender: {
    name: string;
    role: string;
    avatar_url: string;
  };
  image_url?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | string;
  created_at: string;
  updated_at: string;
  student?: {
    name: string;
    email: string;
    avatar_url: string | null;
  };
  messages?: SupportTicketMessage[];
}

export default function TicketsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await supportApi.getAdminTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN": return "border-blue-500/30 text-blue-600 bg-blue-500/5";
      case "IN_PROGRESS": return "border-amber-500/30 text-amber-600 bg-amber-500/5";
      case "RESOLVED": return "border-emerald-500/30 text-emerald-600 bg-emerald-500/5";
      case "CLOSED": return "border-zinc-500/30 text-zinc-600 bg-zinc-500/5";
      default: return "border-zinc-500/30 text-zinc-600 bg-zinc-500/5";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH": return "border-red-500/30 text-red-600 bg-red-500/5";
      case "MEDIUM": return "border-orange-500/30 text-orange-600 bg-orange-500/5";
      case "LOW": return "border-emerald-500/30 text-emerald-600 bg-emerald-500/5";
      default: return "border-zinc-500/30 text-zinc-600 bg-zinc-500/5";
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ticket.student?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsSheetOpen(true);
    try {
      const details = await supportApi.getTicketDetails(ticket.id);
      setSelectedTicket(details);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ticket details",
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() && !replyImage) return;
    setIsReplying(true);
    try {
      let imageUrl = undefined;
      if (replyImage) {
          setUploadingImage(true);
          const uploadRes = await import('@/lib/api').then(m => m.Upload.uploadFile(replyImage));
          imageUrl = uploadRes.url;
          setUploadingImage(false);
      }

      await supportApi.addMessage(selectedTicket!.id, { message: replyMessage || "Sent an attachment.", image_url: imageUrl });
      setReplyMessage("");
      setReplyImage(null);
      const details = await supportApi.getTicketDetails(selectedTicket!.id);
      setSelectedTicket(details);
      loadTickets();
      toast({ title: "Success", description: "Reply sent successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    } finally {
      setIsReplying(false);
      setUploadingImage(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    try {
      await supportApi.closeTicket(selectedTicket.id);
      const details = await supportApi.getTicketDetails(selectedTicket.id);
      setSelectedTicket(details);
      loadTickets();
      toast({ title: "Success", description: "Ticket manually closed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to close ticket", variant: "destructive" });
    }
  };

  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <AdminDashboardLayout title="Support Tickets" subtitle="Handle user support requests">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-yellow-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Support Hub
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                Manage inbound requests, assist students, and resolve technical issues quickly.
              </p>
            </div>
            <div className="shrink-0 relative w-full md:w-80">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/40" />
              </div>
              <Input
                placeholder="Search tickets by subject or ID..."
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none focus-visible:ring-red-500 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Floating Glass Stats */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 group-hover:scale-110 transition-transform duration-500">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{openCount}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Open Tickets</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{inProgressCount}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">In Progress</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{resolvedCount}</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Resolved</p>
              </div>
            </div>
          </div>

          <div className="relative group rounded-none bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col h-full z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-none flex items-center justify-center shadow-sm bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-auto space-y-1">
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">2.4h</p>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Avg. Response Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Ledger */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Ticket className="h-5 w-5 text-zinc-400" />
              Tickets Queue
            </h3>
            <Button variant="outline" size="icon" className="rounded-none border-black/10 dark:border-white/10 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Queue...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                  <Ticket className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">No tickets found</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Everyone seems happy! Zero pending issues.</p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                    
                    {/* Left: User & Subject */}
                    <div className="flex items-start lg:items-center gap-4 min-w-[300px] flex-1">
                      <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">TICK</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white">#{ticket.id.split('-')[0].substring(0, 4)}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-base max-w-[300px] md:max-w-md lg:max-w-lg truncate" title={ticket.subject}>
                          {ticket.subject}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <Avatar className="h-5 w-5 rounded-none border border-black/10 dark:border-white/10">
                            <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700 text-[8px] font-bold rounded-none">
                              {ticket.student?.name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium truncate">{ticket.student?.name || 'Unknown Student'}</span>
                          <span>•</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Badges */}
                    <div className="flex flex-row items-center gap-2 py-2 lg:py-0 border-y lg:border-y-0 border-black/5 dark:border-white/5 lg:px-8">
                      <Badge variant="outline" className={cn("rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border", getPriorityColor(ticket.priority))}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline" className={cn("rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border", getStatusColor(ticket.status))}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Right: Action */}
                    <div className="flex items-center justify-end shrink-0 min-w-[100px]">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewTicket(ticket)}
                        className="rounded-none border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 w-full lg:w-auto"
                      >
                        View Thread
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl flex flex-col p-0 bg-white dark:bg-zinc-950 border-l border-black/10 dark:border-white/10 rounded-none shadow-2xl">
          <SheetHeader className="p-6 border-b border-black/5 dark:border-white/5 pb-6 bg-zinc-50 dark:bg-zinc-900 rounded-none text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <SheetTitle className="text-xl font-black text-zinc-900 dark:text-white leading-tight">
                  {selectedTicket?.subject}
                </SheetTitle>
                <SheetDescription className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  TICKET #{selectedTicket?.id?.split('-')[0]} • {selectedTicket && new Date(selectedTicket.created_at).toLocaleDateString()}
                </SheetDescription>
              </div>
              {selectedTicket && (
                <Badge variant="outline" className={cn("rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border shrink-0", getStatusColor(selectedTicket.status))}>
                  {selectedTicket.status.replace("_", " ")}
                </Badge>
              )}
            </div>
          </SheetHeader>

          {selectedTicket && (
            <ScrollArea className="flex-1 p-6 bg-white dark:bg-zinc-950">
              <div className="space-y-8">
                {/* Description / Initial Message */}
                <div className="space-y-4 pb-8 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-none border border-black/10 dark:border-white/10">
                      <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-none">
                        {selectedTicket.student?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{selectedTicket.student?.name || 'Student'}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Original Request</span>
                    </div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-none text-sm leading-relaxed border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-200 shadow-sm font-medium">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Messages Timeline */}
                <div className="space-y-6">
                  {!selectedTicket.messages && (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                    </div>
                  )}

                  {selectedTicket.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-4 max-w-[90%] ${msg.is_admin ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      <Avatar className="h-10 w-10 shrink-0 rounded-none border border-black/10 dark:border-white/10">
                        {msg.is_admin ? (
                          <AvatarFallback className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-none"><User className="h-5 w-5" /></AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-none">
                            {msg.sender?.name?.[0] || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className={`space-y-2 flex flex-col ${msg.is_admin ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            {msg.sender?.name || (msg.is_admin ? "Support Team" : "Student")}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`p-4 rounded-none text-sm leading-relaxed shadow-sm font-medium border ${msg.is_admin
                            ? "bg-zinc-900 text-white border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200"
                            : "bg-zinc-50 border-black/5 text-zinc-800 dark:bg-zinc-900 dark:border-white/5 dark:text-zinc-200"
                            }`}
                        >
                          {msg.message}
                          {msg.image_url && (
                              <div className="mt-3">
                                  <img src={msg.image_url} alt="Attachment" className="max-w-xs rounded-none shadow-sm border border-black/10 dark:border-white/10" />
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}

          {selectedTicket?.status !== 'CLOSED' && selectedTicket?.status !== 'RESOLVED' && (
            <div className="p-4 border-t border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex flex-col gap-3">
                {replyImage && (
                    <div className="relative w-20 h-20 rounded-none border border-black/10 dark:border-white/10 overflow-hidden group">
                        <img src={URL.createObjectURL(replyImage)} alt="Upload Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <button 
                            className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm text-white rounded-none p-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => setReplyImage(null)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}
                <Textarea
                  placeholder="Type your response here..."
                  className="resize-none min-h-[100px] w-full rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 shadow-inner"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="text-zinc-500 hover:text-emerald-600 rounded-none text-xs font-bold uppercase tracking-widest h-9"
                        size="sm"
                        onClick={handleCloseTicket}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                      <div className="relative">
                          <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              accept="image/*"
                              onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                      setReplyImage(e.target.files[0]);
                                  }
                              }}
                          />
                          <Button variant="outline" size="sm" type="button" className="text-zinc-600 dark:text-zinc-400 rounded-none border-black/10 dark:border-white/10 gap-2 h-9 text-xs font-bold uppercase tracking-widest">
                              <Paperclip className="h-4 w-4" />
                              Attach File
                          </Button>
                      </div>
                  </div>
                  <Button
                    onClick={handleReply}
                    disabled={isReplying || uploadingImage || (!replyMessage.trim() && !replyImage)}
                    className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-none h-9 text-xs font-bold uppercase tracking-widest w-full sm:w-auto"
                    size="sm"
                  >
                    {isReplying || uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send Response
                  </Button>
                </div>
              </div>
            </div>
          )}
          {(selectedTicket?.status === 'CLOSED' || selectedTicket?.status === 'RESOLVED') && (
            <div className="p-6 border-t border-black/10 dark:border-white/10 bg-emerald-50/50 dark:bg-emerald-900/10 text-center">
              <div className="mx-auto w-fit px-4 py-2 rounded-none border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/20 shadow-sm">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">This ticket has been resolved</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminDashboardLayout>
  );
}

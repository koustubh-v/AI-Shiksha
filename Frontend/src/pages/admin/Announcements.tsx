import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Megaphone,
  Plus,
  Send,
  Users,
  GraduationCap,
  UserCheck,
  Clock,
  Trash2,
  Power,
  Loader2,
  ShieldAlert
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Announcements as announcementsApi } from "@/lib/api";

interface Announcement {
  id: string;
  title: string;
  content: string;
  role_intended?: string;
  is_active: boolean;
  created_at: string;
}

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    role_intended: "ALL"
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementsApi.getAdminAll();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast({
        title: "Error",
        description: "Failed to load announcements.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({ title: "Error", description: "Title and content are required.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        // Send null for ALL, otherwise send role
        role_intended: newAnnouncement.role_intended === "ALL" ? null : newAnnouncement.role_intended
      };

      const created = await announcementsApi.create(payload);
      setAnnouncements([created, ...announcements]);
      setNewAnnouncement({ title: "", content: "", role_intended: "ALL" });

      toast({ title: "Success", description: "Announcement created successfully." });
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({ title: "Error", description: "Failed to create announcement.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const updated = await announcementsApi.toggleStatus(id);
      setAnnouncements(announcements.map(a => a.id === id ? updated : a));
      toast({ title: "Success", description: `Announcement is now ${updated.is_active ? 'active' : 'inactive'}.` });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await announcementsApi.delete(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast({ title: "Deleted", description: "Announcement deleted successfully." });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({ title: "Error", description: "Failed to delete announcement.", variant: "destructive" });
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "STUDENT": return <GraduationCap className="h-4 w-4" />;
      case "TEACHER": return <UserCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "All Users";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() + "s";
  };

  return (
    <AdminDashboardLayout title="Announcements" subtitle="Send platform-wide messages">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-rose-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
            
            <div className="relative z-10 space-y-2 flex-1">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
                    Announcements
                </h2>
                <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                    Broadcast important updates and alerts to students, teachers, or the entire platform.
                </p>
            </div>

            {/* Create Announcement Form */}
            <div className="relative z-10 w-full md:w-[400px] shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-none space-y-4 shadow-xl">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <Plus className="h-4 w-4" /> New Announcement
                </h3>
                <div className="space-y-3">
                    <Input
                        placeholder="Announcement Title"
                        className="rounded-none bg-white/90 dark:bg-zinc-950/90 border-0 text-zinc-900 dark:text-white h-10 focus-visible:ring-2 focus-visible:ring-purple-500 font-bold"
                        value={newAnnouncement.title}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    />
                    <Textarea
                        placeholder="Write your message here..."
                        rows={3}
                        className="rounded-none bg-white/90 dark:bg-zinc-950/90 border-0 text-zinc-900 dark:text-white resize-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        value={newAnnouncement.content}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                        <select
                            className="flex-1 h-10 px-3 rounded-none bg-white/90 dark:bg-zinc-950/90 border-0 text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                            value={newAnnouncement.role_intended}
                            onChange={e => setNewAnnouncement({ ...newAnnouncement, role_intended: e.target.value })}
                        >
                            <option value="ALL">All Users</option>
                            <option value="STUDENT">Students</option>
                            <option value="INSTRUCTOR">Instructors</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                        <Button 
                            className="h-10 rounded-none bg-purple-600 hover:bg-purple-700 text-white px-4 font-bold uppercase tracking-widest text-xs" 
                            onClick={handleCreate} 
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Ledger */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-zinc-400" />
                    Broadcast History
                </h3>
            </div>

            <div className="p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Broadcasts...</p>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                            <Megaphone className="h-8 w-8 text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">No announcements found</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Create an announcement above to broadcast a message.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-black/5 dark:divide-white/5">
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className={`group p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 ${!announcement.is_active ? 'opacity-60 grayscale' : ''}`}>
                                
                                {/* Left: Info */}
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Badge variant="outline" className={announcement.is_active ? "rounded-none uppercase tracking-widest text-[10px] px-2 py-0 border-emerald-500/30 text-emerald-600 bg-emerald-500/5" : "rounded-none uppercase tracking-widest text-[10px] px-2 py-0 border-zinc-500/30 text-zinc-600 bg-zinc-500/5"}>
                                                {announcement.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                            <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-0 border-purple-500/30 text-purple-600 bg-purple-500/5 flex items-center gap-1">
                                                {getRoleIcon(announcement.role_intended)}
                                                {getRoleLabel(announcement.role_intended)}
                                            </Badge>
                                        </div>
                                        <h3 className="font-black text-xl text-zinc-900 dark:text-white leading-tight">
                                            {announcement.title}
                                        </h3>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-950 p-4 border-l-4 border-purple-500 shadow-sm">
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                            {announcement.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                        <Clock className="h-3 w-3" />
                                        {new Date(announcement.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex flex-row md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 border-black/5 dark:border-white/5 pt-4 md:pt-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`rounded-none font-bold uppercase tracking-widest text-xs w-full md:w-32 border-black/10 dark:border-white/10 ${announcement.is_active ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                                        onClick={() => handleToggleStatus(announcement.id, announcement.is_active)}
                                    >
                                        <Power className="h-3.5 w-3.5 mr-2" />
                                        {announcement.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-none font-bold uppercase tracking-widest text-xs w-full md:w-32 border-black/10 dark:border-white/10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                                        onClick={() => handleDelete(announcement.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                                        Delete
                                    </Button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

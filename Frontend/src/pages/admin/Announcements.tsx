import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
      <div className="space-y-4 md:space-y-6">
        {/* Create Announcement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Announcement Title"
                value={newAnnouncement.title}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Announcement content..."
                rows={3}
                value={newAnnouncement.content}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Target Audience</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={newAnnouncement.role_intended}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, role_intended: e.target.value })}
                >
                  <option value="ALL">All Users</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="TEACHER">Teachers Only</option>
                  <option value="ADMIN">Admins Only</option>
                </select>
              </div>
            </div>
            <Button className="gap-2" onClick={handleCreate} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Announcement
            </Button>
          </CardContent>
        </Card>

        {/* Announcement List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No announcements found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={`p-4 border rounded-lg transition-opacity ${!announcement.is_active ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={announcement.is_active ? "ghost" : "secondary"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(announcement.id, announcement.is_active)}
                          title={announcement.is_active ? "Deactivate" : "Activate"}
                        >
                          <Power className={`h-4 w-4 ${announcement.is_active ? 'text-green-600' : 'text-gray-500'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(announcement.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm mt-4">
                      <Badge variant={announcement.is_active ? "default" : "secondary"}>
                        {announcement.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        {getRoleIcon(announcement.role_intended)}
                        {getRoleLabel(announcement.role_intended)}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

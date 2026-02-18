import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Building2,
  Users,
  TrendingUp,
  Edit,
  Pause,
  Play,
  ShieldOff,
  AlertCircle,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface Franchise {
  id: string;
  name: string;
  lms_name: string | null;
  domain: string;
  logo_url: string | null;
  primary_color: string | null;
  support_email: string | null;
  is_active: boolean;
  domain_verified: boolean;
  created_at: string;
  _count?: { users: number; courses: number; enrollments: number };
}

interface CreateFranchiseForm {
  name: string;
  lms_name: string;
  domain: string;
  admin_name: string;
  admin_email: string;
  logo_url: string;
  primary_color: string;
  support_email: string;
}

const EMPTY_FORM: CreateFranchiseForm = {
  name: "",
  lms_name: "",
  domain: "",
  admin_name: "",
  admin_email: "",
  logo_url: "",
  primary_color: "#6366f1",
  support_email: "",
};

export default function FranchisesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFranchise, setNewFranchise] = useState<CreateFranchiseForm>(EMPTY_FORM);
  const [createdAdmin, setCreatedAdmin] = useState<{ email: string; temp_password: string } | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    if (isSuperAdmin) {
      fetchFranchises();
    } else {
      setIsLoading(false);
    }
  }, [isSuperAdmin]);

  const fetchFranchises = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/franchises");
      setFranchises(response.data);
    } catch {
      toast({ title: "Error", description: "Failed to load franchises.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newFranchise.name || !newFranchise.domain || !newFranchise.admin_email || !newFranchise.admin_name || !newFranchise.lms_name) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await api.post("/franchises", newFranchise);
      const { franchise, admin } = response.data;
      setFranchises((prev) => [franchise, ...prev]);
      setCreatedAdmin({ email: admin.email, temp_password: admin.temp_password });
      setNewFranchise(EMPTY_FORM);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to create franchise.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSuspend = async (franchise: Franchise) => {
    try {
      const response = await api.patch(`/franchises/${franchise.id}/suspend`);
      setFranchises((prev) =>
        prev.map((f) => (f.id === franchise.id ? { ...f, is_active: response.data.is_active } : f))
      );
      toast({
        description: `Franchise "${franchise.name}" has been ${response.data.is_active ? "activated" : "suspended"}.`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to update franchise status.", variant: "destructive" });
    }
  };

  const copyPassword = () => {
    if (createdAdmin?.temp_password) {
      navigator.clipboard.writeText(createdAdmin.temp_password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const filteredFranchises = franchises.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Access denied for non-super-admins
  if (!isSuperAdmin) {
    return (
      <AdminDashboardLayout title="Franchise Management" subtitle="Manage your franchise network">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="rounded-full bg-destructive/10 p-4">
              <ShieldOff className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Access Restricted</h3>
              <p className="text-muted-foreground max-w-sm">
                You don't have permission to manage franchises. Please contact the main domain administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Franchise Management" subtitle="Manage your franchise network">
      <div className="space-y-4 md:space-y-6">
        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Franchises</p>
                  <p className="text-xl md:text-2xl font-bold">{franchises.length}</p>
                </div>
                <Building2 className="h-6 w-6 md:h-8 md:w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Active</p>
                  <p className="text-xl md:text-2xl font-bold">{franchises.filter((f) => f.is_active).length}</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Users</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {franchises.reduce((sum, f) => sum + (f._count?.users || 0), 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-chart-3/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Franchises Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-base md:text-lg">All Franchises</CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) { setCreatedAdmin(null); } }}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                      <Plus className="h-4 w-4" />
                      <span>Add Franchise</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {createdAdmin ? "Franchise Created!" : "Create New Franchise"}
                      </DialogTitle>
                    </DialogHeader>

                    {createdAdmin ? (
                      /* Success state — show admin credentials */
                      <div className="space-y-4">
                        <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 space-y-3">
                          <div className="flex items-center gap-2 text-accent font-medium">
                            <AlertCircle className="h-4 w-4" />
                            Share these credentials securely
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Admin Email:</span>
                              <span className="ml-2 font-mono font-medium">{createdAdmin.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Temp Password:</span>
                              <span className="ml-2 font-mono font-medium bg-muted px-2 py-0.5 rounded">{createdAdmin.temp_password}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyPassword}>
                                {copiedPassword ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          The franchise admin should change their password on first login.
                        </p>
                        <Button className="w-full" onClick={() => { setIsAddOpen(false); setCreatedAdmin(null); }}>
                          Done
                        </Button>
                      </div>
                    ) : (
                      /* Creation form */
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5 col-span-2">
                            <Label htmlFor="name">Franchise Name *</Label>
                            <Input id="name" placeholder="e.g., NYC Learning Hub" value={newFranchise.name} onChange={(e) => setNewFranchise({ ...newFranchise, name: e.target.value })} />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <Label htmlFor="lms_name">LMS Brand Name *</Label>
                            <Input id="lms_name" placeholder="e.g., NYC Academy LMS" value={newFranchise.lms_name} onChange={(e) => setNewFranchise({ ...newFranchise, lms_name: e.target.value })} />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <Label htmlFor="domain">Domain *</Label>
                            <Input id="domain" placeholder="e.g., nyc.yourlms.com" value={newFranchise.domain} onChange={(e) => setNewFranchise({ ...newFranchise, domain: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="admin_name">Admin Name *</Label>
                            <Input id="admin_name" placeholder="John Doe" value={newFranchise.admin_name} onChange={(e) => setNewFranchise({ ...newFranchise, admin_name: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="admin_email">Admin Email *</Label>
                            <Input id="admin_email" type="email" placeholder="admin@nyc.com" value={newFranchise.admin_email} onChange={(e) => setNewFranchise({ ...newFranchise, admin_email: e.target.value })} />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <Label htmlFor="logo_url">Logo URL</Label>
                            <Input id="logo_url" placeholder="https://..." value={newFranchise.logo_url} onChange={(e) => setNewFranchise({ ...newFranchise, logo_url: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="primary_color">Brand Color</Label>
                            <div className="flex gap-2">
                              <input type="color" id="primary_color" value={newFranchise.primary_color} onChange={(e) => setNewFranchise({ ...newFranchise, primary_color: e.target.value })} className="h-9 w-12 rounded border cursor-pointer" />
                              <Input value={newFranchise.primary_color} onChange={(e) => setNewFranchise({ ...newFranchise, primary_color: e.target.value })} className="font-mono" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="support_email">Support Email</Label>
                            <Input id="support_email" type="email" placeholder="support@nyc.com" value={newFranchise.support_email} onChange={(e) => setNewFranchise({ ...newFranchise, support_email: e.target.value })} />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                          <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleCreate} disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : "Create Franchise"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFranchises.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <Building2 className="h-10 w-10 text-muted-foreground/40" />
                <div>
                  <p className="font-medium">No franchises found</p>
                  <p className="text-sm text-muted-foreground">Create your first franchise to get started.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Franchise</TableHead>
                      <TableHead className="hidden md:table-cell">Domain</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="hidden sm:table-cell">Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFranchises.map((franchise) => (
                      <TableRow key={franchise.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="p-2 md:p-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Avatar className="h-8 w-8 md:h-10 md:w-10">
                              {franchise.logo_url && <AvatarImage src={franchise.logo_url} alt={franchise.name} />}
                              <AvatarFallback
                                className="text-xs font-semibold text-white"
                                style={{ backgroundColor: franchise.primary_color || "#6366f1" }}
                              >
                                {franchise.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-xs md:text-sm truncate">{franchise.name}</p>
                              <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                                {franchise.lms_name || franchise.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm hidden md:table-cell font-mono text-muted-foreground">
                          {franchise.domain}
                          {franchise.domain_verified && (
                            <Badge variant="secondary" className="ml-2 text-[10px] bg-accent/10 text-accent">verified</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm p-2 md:p-4">
                          {(franchise._count?.users || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm hidden sm:table-cell">
                          {(franchise._count?.courses || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="p-2 md:p-4">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] md:text-xs ${franchise.is_active ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}
                          >
                            {franchise.is_active ? "Active" : "Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2 md:p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 md:h-8 md:w-8"
                              title={franchise.is_active ? "Suspend" : "Activate"}
                              onClick={() => handleToggleSuspend(franchise)}
                            >
                              {franchise.is_active ? (
                                <Pause className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
                              ) : (
                                <Play className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8">
                              <Edit className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
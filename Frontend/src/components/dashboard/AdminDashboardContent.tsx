import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Shield,
  GraduationCap,
  UserCog,
  Building2,
  Search,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import * as LucideIcons from "lucide-react";

export function AdminDashboardContent() {
  const [isFranchiseDialogOpen, setIsFranchiseDialogOpen] = useState(false);
  const [newFranchise, setNewFranchise] = useState({
    name: "",
    location: "",
    adminEmail: "",
  });
  const { toast } = useToast();
  const { stats, pendingActions: apiPendingActions, isLoading } = useAdminDashboard();

  const handleAddFranchise = () => {
    if (!newFranchise.name || !newFranchise.location || !newFranchise.adminEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Franchise Created",
      description: `${newFranchise.name} has been successfully created.`,
    });
    setNewFranchise({ name: "", location: "", adminEmail: "" });
    setIsFranchiseDialogOpen(false);
  };

  const quickActions = [
    { label: "Manage Users", icon: Users, href: "/dashboard/users", color: "bg-primary" },
    { label: "Manage Courses", icon: BookOpen, href: "/dashboard/courses", color: "bg-accent" },
    { label: "Manage Teachers", icon: GraduationCap, href: "/dashboard/teachers", color: "bg-chart-4" },
    { label: "Manage Students", icon: UserCog, href: "/dashboard/students", color: "bg-chart-3" },
    { label: "SEO Settings", icon: Search, href: "/dashboard/seo-settings", color: "bg-chart-2" },
  ];

  const systemHealth = [
    { label: "Server Uptime", value: "99.9%", healthy: true },
    { label: "Database", value: "100%", healthy: true },
    { label: "API Response", value: "45ms", healthy: true },
    { label: "Storage", value: "68%", healthy: false },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Row */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => {
          // Dynamic icon rendering
          const IconComponent = (LucideIcons as any)[stat.icon] || LucideIcons.HelpCircle;

          return (
            <Card key={stat.label} className={`border bg-gradient-to-br ${stat.gradient}`}>
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`h-4 w-4 md:h-5 md:w-5 ${stat.iconColor}`} />
                  <span className="text-[10px] md:text-xs text-accent flex items-center gap-0.5">
                    <ArrowUpRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Admin Control Center */}
      <Card className="border bg-gradient-to-br from-muted/50 to-background">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Shield className="h-4 w-4 text-primary" />
            Admin Control Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:gap-3 grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer rounded-lg">
                  <div className={`h-8 w-8 md:h-10 md:w-10 ${action.color} flex items-center justify-center flex-shrink-0 rounded-lg`}>
                    <action.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <span className="font-medium text-xs md:text-sm text-foreground">{action.label}</span>
                </div>
              </Link>
            ))}
            {/* Add Franchise with Dialog */}
            <Dialog open={isFranchiseDialogOpen} onOpenChange={setIsFranchiseDialogOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer rounded-lg">
                  <div className="h-8 w-8 md:h-10 md:w-10 bg-destructive flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Building2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <span className="font-medium text-xs md:text-sm text-foreground">Add Franchise</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Franchise</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="franchiseName">Franchise Name *</Label>
                    <Input
                      id="franchiseName"
                      placeholder="e.g., NYC Learning Hub"
                      value={newFranchise.name}
                      onChange={(e) => setNewFranchise({ ...newFranchise, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="franchiseLocation">Location *</Label>
                    <Input
                      id="franchiseLocation"
                      placeholder="e.g., New York, USA"
                      value={newFranchise.location}
                      onChange={(e) => setNewFranchise({ ...newFranchise, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="franchiseAdmin">Admin Email *</Label>
                    <Input
                      id="franchiseAdmin"
                      type="email"
                      placeholder="admin@franchise.com"
                      value={newFranchise.adminEmail}
                      onChange={(e) => setNewFranchise({ ...newFranchise, adminEmail: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsFranchiseDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={handleAddFranchise}
                    >
                      Create Franchise
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Pending Actions */}
        <Card className="border bg-gradient-to-br from-destructive/5 to-background">
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm">Pending Actions</CardTitle>
              <Badge variant="destructive" className="text-[10px] md:text-xs">20</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {apiPendingActions?.map((action, index) => (
              <Link key={index} to={action.href}>
                <div className="flex items-center gap-2 md:gap-3 p-2 bg-muted/50 hover:bg-muted transition-colors rounded-lg cursor-pointer">
                  <AlertTriangle className={`h-3 w-3 md:h-4 md:w-4 ${action.priority === "high" ? "text-destructive" : "text-chart-3"}`} />
                  <span className="text-xs md:text-sm text-foreground">{action.title}</span>
                </div>
              </Link>
            ))}
            <Link to="/dashboard/tickets">
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border lg:col-span-2 bg-gradient-to-br from-accent/5 to-background">
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs md:text-sm">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:gap-3 grid-cols-2">
              {systemHealth.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-3 w-3 md:h-4 md:w-4 ${metric.healthy ? "text-accent" : "text-chart-3"}`} />
                    <span className="text-xs md:text-sm text-foreground">{metric.label}</span>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-foreground">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Franchise Overview */}
      <Card className="border bg-gradient-to-br from-chart-4/5 to-background">
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xs md:text-sm">
              <Building2 className="h-4 w-4" />
              Franchise Network
            </CardTitle>
            <Link to="/dashboard/franchises">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs h-7 md:h-8">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-2 md:p-3 bg-muted/50 rounded-lg">
              <p className="text-lg md:text-2xl font-bold text-foreground">24</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Franchises</p>
            </div>
            <div className="text-center p-2 md:p-3 bg-muted/50 rounded-lg">
              <p className="text-lg md:text-2xl font-bold text-foreground">8,542</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Users</p>
            </div>
            <div className="text-center p-2 md:p-3 bg-muted/50 rounded-lg">
              <p className="text-lg md:text-2xl font-bold text-accent">$45.2K</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Revenue</p>
            </div>
            <div className="text-center p-2 md:p-3 bg-muted/50 rounded-lg">
              <p className="text-lg md:text-2xl font-bold text-chart-4">+18%</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Growth</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
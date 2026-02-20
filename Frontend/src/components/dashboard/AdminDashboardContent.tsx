import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Search,
  ArrowUpRight,
  Plus,
  Clock,
  ChevronRight,
  Settings,
  Bell,
  Server,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import * as LucideIcons from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function AdminDashboardContent() {
  const navigate = useNavigate();
  const { stats, pendingActions: apiPendingActions, isLoading } = useAdminDashboard();

  const quickActions = [
    { label: "Manage Users", icon: Users, href: "/dashboard/users", color: "bg-blue-600", lightBg: "bg-blue-50" },
    { label: "Manage Courses", icon: BookOpen, href: "/dashboard/courses", color: "bg-indigo-600", lightBg: "bg-indigo-50" },
    { label: "Manage Teachers", icon: GraduationCap, href: "/dashboard/teachers", color: "bg-purple-600", lightBg: "bg-purple-50" },
    { label: "Manage Students", icon: UserCog, href: "/dashboard/students", color: "bg-emerald-600", lightBg: "bg-emerald-50" },
    { label: "SEO Config", icon: Search, href: "/dashboard/seo-settings", color: "bg-rose-600", lightBg: "bg-rose-50" },
    { label: "Platform Setup", icon: Settings, href: "/dashboard/platform-settings", color: "bg-slate-700", lightBg: "bg-slate-100" },
  ];

  const systemHealth = [
    { label: "Server Uptime", value: "99.99%", healthy: true },
    { label: "Database Load", value: "Healthy", healthy: true },
    { label: "API Response", value: "42ms", healthy: true },
    { label: "Storage Used", value: "68%", healthy: false },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading workspace...</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1600px] mx-auto pb-10">

      {/* Header and Call to Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Welcome to Mission Control</h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Here's what's happening across your learning platform today.</p>
        </div>
        <Link to="/dashboard/courses/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all px-6 h-12">
            <Plus className="h-5 w-5" />
            <span className="font-semibold tracking-wide">Add Course</span>
          </Button>
        </Link>
      </div>

      {/* Material Stats Row  */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => {
          const IconComponent = (LucideIcons as any)[stat.icon] || LucideIcons.HelpCircle;
          return (
            <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-3xl bg-card overflow-hidden relative group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-6 w-6 ${stat.iconColor} drop-shadow-sm`} />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold bg-green-50 text-green-700 border-green-200 gap-1 rounded-full px-2 py-0.5 shadow-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Quick Actions Panel */}
        <Card className="border-0 shadow-sm rounded-3xl bg-card lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="border-b px-6 py-5 bg-muted/10">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Shield className="h-5 w-5 text-primary" />
              Administrative Toolkit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}>
                  <div className="group flex flex-col items-center justify-center gap-3 p-4 h-full rounded-2xl border border-border/50 bg-background hover:bg-muted/30 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer">
                    <div className={`h-12 w-12 ${action.lightBg} ${action.color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-sm text-center text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Inbox (Pending Actions) */}
        <Card className="border-0 shadow-sm rounded-3xl bg-card overflow-hidden flex flex-col">
          <CardHeader className="border-b px-6 py-5 bg-muted/10 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Bell className="h-5 w-5 text-amber-500" />
              Action Required
            </CardTitle>
            <Badge variant="destructive" className="rounded-full px-2.5 shadow-sm font-bold">
              {apiPendingActions?.length || 0}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[320px]">
              {apiPendingActions && apiPendingActions.length > 0 ? (
                <div className="flex flex-col">
                  {apiPendingActions.map((action, index) => (
                    <div key={index} className="flex flex-col">
                      <Link to={action.href} className="group flex items-start gap-4 p-5 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className={`mt-0.5 h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${action.priority === "high" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}>
                          {action.priority === "high" ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {action.title}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">
                            {action.priority === 'high' ? 'Urgent Review' : 'Pending Request'}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors self-center" />
                      </Link>
                      {index < apiPendingActions.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-3 text-muted-foreground opacity-70 p-8 text-center mt-10">
                  <CheckCircle className="h-12 w-12 text-green-500/50" />
                  <p className="text-sm font-semibold text-foreground">You're all caught up!</p>
                  <p className="text-xs">No pending actions require your attention.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t bg-muted/10">
            <Button variant="outline" className="w-full rounded-xl font-semibold hover:bg-background" onClick={() => navigate('/dashboard/tickets')}>
              View All Communications
            </Button>
          </div>
        </Card>

        {/* System Health Module */}
        <Card className="border-0 shadow-sm rounded-3xl bg-card lg:col-span-3 overflow-hidden">
          <CardHeader className="border-b px-6 py-5 bg-muted/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Server className="h-5 w-5 text-slate-500" />
              Infrastructure Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
              {systemHealth.map((metric) => (
                <div key={metric.label} className="flex flex-col p-4 rounded-2xl bg-muted/30 border border-border/50 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between space-x-2 mb-3">
                    <span className="text-sm font-semibold text-muted-foreground">{metric.label}</span>
                    <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${metric.healthy ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                  </div>
                  <span className="text-2xl font-extrabold text-foreground tracking-tight">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
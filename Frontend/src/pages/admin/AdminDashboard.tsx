import AdminLayout from "@/components/admin/AdminLayout";
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
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";

const platformStats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+8.2%",
    positive: true,
    icon: Users,
    color: "bg-lms-blue",
  },
  {
    title: "Active Courses",
    value: "348",
    change: "+12",
    positive: true,
    icon: BookOpen,
    color: "bg-lms-emerald",
  },
  {
    title: "Monthly Revenue",
    value: "$284,520",
    change: "+15.3%",
    positive: true,
    icon: DollarSign,
    color: "bg-lms-purple",
  },
  {
    title: "Platform Health",
    value: "98.5%",
    change: "-0.2%",
    positive: false,
    icon: TrendingUp,
    color: "bg-lms-amber",
  },
];

const userGrowthData = [
  { month: "Jan", students: 8200, teachers: 120 },
  { month: "Feb", students: 8800, teachers: 135 },
  { month: "Mar", students: 9400, teachers: 148 },
  { month: "Apr", students: 10200, teachers: 162 },
  { month: "May", students: 11100, teachers: 178 },
  { month: "Jun", students: 12847, teachers: 195 },
];

const revenueData = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 195000 },
  { month: "Mar", revenue: 220000 },
  { month: "Apr", revenue: 245000 },
  { month: "May", revenue: 268000 },
  { month: "Jun", revenue: 284520 },
];

const pendingActions = [
  { type: "course", title: "Advanced React Patterns", teacher: "John Smith", status: "pending" },
  { type: "user", title: "Teacher Verification", user: "Sarah Johnson", status: "pending" },
  { type: "report", title: "Content Violation Report", course: "Python Basics", status: "urgent" },
  { type: "payout", title: "Payout Request", teacher: "Mike Chen", amount: "$2,450", status: "pending" },
];

const aiInsights = [
  {
    type: "warning",
    title: "Churn Risk Detected",
    description: "127 students haven't logged in for 14+ days. Consider re-engagement campaign.",
  },
  {
    type: "success",
    title: "Revenue Trend",
    description: "Revenue is projected to exceed $300K next month based on current growth.",
  },
  {
    type: "info",
    title: "Popular Category",
    description: "Web Development courses have 40% higher enrollment this month.",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, userGrowthData, revenueData, actionsData] = await Promise.all([
          adminService.getStats(),
          adminService.getUserGrowth(),
          adminService.getRevenue(),
          adminService.getPendingActions()
        ]);

        // Map backend stats to match frontend component expectation (icon component)
        const mappedStats = statsData.map((stat: any) => {
          let IconComponent = Users;
          if (stat.icon === 'BookOpen') IconComponent = BookOpen;
          if (stat.icon === 'DollarSign') IconComponent = DollarSign;
          if (stat.icon === 'TrendingUp') IconComponent = TrendingUp;

          return {
            ...stat,
            icon: IconComponent,
            positive: stat.change.startsWith('+') // Simple heuristic
          };
        });

        setStats(mappedStats);
        setUserGrowth(userGrowthData);
        setRevenue(revenueData);
        setPendingActions(actionsData);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>
          <Button className="gap-2 bg-lms-blue hover:bg-lms-blue/90">
            <Sparkles className="h-4 w-4" />
            AI Health Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.gradient}`}> {/* Using gradient from backend or color mapping */}
                    <stat.icon className={`h-5 w-5 ${stat.iconColor ? stat.iconColor.replace('text-', 'text-') : 'text-white'}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.positive ? "text-lms-emerald" : "text-lms-rose"}`}>
                    {stat.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stackId="1"
                      stroke="hsl(217, 91%, 60%)"
                      fill="hsl(217, 91%, 60%, 0.3)"
                    />
                    <Area
                      type="monotone"
                      dataKey="teachers"
                      stackId="2"
                      stroke="hsl(160, 84%, 39%)"
                      fill="hsl(160, 84%, 39%, 0.3)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-lms-blue" />
                  <span className="text-sm text-muted-foreground">Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-lms-emerald" />
                  <span className="text-sm text-muted-foreground">Teachers</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Actions */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Pending Actions</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingActions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.priority === "high" ? "bg-lms-rose/10" : "bg-lms-amber/10"
                        }`}>
                        {action.priority === "high" ? (
                          <AlertTriangle className="h-4 w-4 text-lms-rose" />
                        ) : (
                          <Clock className="h-4 w-4 text-lms-amber" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {/* Backend doesn't return detailed info like teacher name yet for all actions, just title. 
                              Frontend expected 'action.teacher' etc. 
                              For now, display title as main info. */}
                          High Priority Item
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>
                        {action.priority || 'Normal'}
                      </Badge>
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights - Keeping static for now as backend doesn't provide them yet, or use mock if preferred */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-lms-purple" />
                AI Platform Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      {insight.type === "warning" && <AlertTriangle className="h-4 w-4 text-lms-amber" />}
                      {insight.type === "success" && <CheckCircle className="h-4 w-4 text-lms-emerald" />}
                      {insight.type === "info" && <Sparkles className="h-4 w-4 text-lms-purple" />}
                      <span className="text-sm font-medium">{insight.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

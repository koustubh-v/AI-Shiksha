import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TopCourses } from "@/components/dashboard/TopCourses";
import { DollarSign, Users, BookOpen, Star } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back, John!">
      <div className="page-container">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="₹84,254"
            change={{ value: "+12.5%", positive: true }}
            icon={DollarSign}
            iconColor="emerald"
          />
          <StatCard
            title="Total Students"
            value="3,842"
            change={{ value: "+8.2%", positive: true }}
            icon={Users}
            iconColor="blue"
          />
          <StatCard
            title="Active Courses"
            value="12"
            change={{ value: "+2", positive: true }}
            icon={BookOpen}
            iconColor="purple"
          />
          <StatCard
            title="Avg. Rating"
            value="4.8"
            change={{ value: "+0.2", positive: true }}
            icon={Star}
            iconColor="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>

          {/* AI Insights Panel */}
          <div className="lg:col-span-1">
            <AIInsightsPanel />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TopCourses />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, Users, BookOpen, Star, ArrowRight, Plus, TrendingUp } from "lucide-react";

import { useInstructorDashboard } from "@/hooks/useInstructorDashboard";
import * as LucideIcons from "lucide-react";

export function TeacherDashboardContent() {
  const { data, isLoading } = useInstructorDashboard();

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard data...</div>;
  }

  const { stats, topCourses, recentActivity } = data || { stats: [], topCourses: [], recentActivity: [] };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground">Overview</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Your teaching performance this month</p>
        </div>
        <Link to="/dashboard/courses/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2 text-xs md:text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Course</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => {
          const IconComponent = (LucideIcons as any)[stat.icon] || LucideIcons.HelpCircle;
          return (
            <Card key={stat.label} className={`border bg-gradient-to-br ${stat.gradient}`}>
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <IconComponent className={`h-4 w-4 ${stat.iconColor}`} />
                  {stat.change && (
                    <span className="text-[10px] md:text-xs text-accent flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-5">
        {/* Top Courses */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="font-semibold text-sm md:text-base text-foreground">Top Performing Courses</h3>
            <Link to="/dashboard/courses" className="text-xs md:text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <Card className="border">
            <CardContent className="p-0">
              <div className="divide-y">
                {topCourses.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No courses data available.</div>
                ) : (
                  topCourses.map((course, index) => (
                    <div key={index} className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
                      <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-xs md:text-sm font-bold text-primary rounded-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-xs md:text-sm truncate">{course.title}</p>
                        <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                          <span>{course.students} students</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-chart-3" />
                            {course.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-xs md:text-sm">{course.revenue}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-sm md:text-base text-foreground mb-3 md:mb-4">Recent Activity</h3>
          <Card className="border">
            <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground">No recent activity</div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{activity.course}</p>
                    </div>
                    <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Earnings Summary */}
          <Card className="border mt-3 md:mt-4 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-3 md:p-4">
              <h4 className="text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">This Month</h4>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Gross Revenue</span>
                  <span className="font-medium text-foreground">$12,450</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Platform Fee (15%)</span>
                  <span className="font-medium text-foreground">-$1,867</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xs md:text-sm">
                  <span className="font-medium text-foreground">Net Earnings</span>
                  <span className="font-bold text-primary">$10,583</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, DollarSign, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "enrollment" | "review" | "sale" | "course";
  user: {
    name: string;
    avatar?: string;
  };
  description: string;
  time: string;
  meta?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "enrollment",
    user: { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    description: "enrolled in React Masterclass",
    time: "2 minutes ago",
  },
  {
    id: "2",
    type: "review",
    user: { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    description: "left a 5-star review",
    time: "15 minutes ago",
    meta: "JavaScript Fundamentals",
  },
  {
    id: "3",
    type: "sale",
    user: { name: "Emily Davis" },
    description: "purchased JavaScript Fundamentals",
    time: "1 hour ago",
    meta: "₹49.00",
  },
  {
    id: "4",
    type: "enrollment",
    user: { name: "James Wilson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    description: "enrolled in TypeScript Essentials",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "course",
    user: { name: "You" },
    description: "published Node.js Backend Course",
    time: "5 hours ago",
  },
];

const activityIcons = {
  enrollment: UserPlus,
  review: Star,
  sale: DollarSign,
  course: BookOpen,
};

const activityColors = {
  enrollment: "bg-lms-blue-light text-lms-blue",
  review: "bg-lms-amber-light text-lms-amber",
  sale: "bg-lms-emerald-light text-lms-emerald",
  course: "bg-lms-purple-light text-lms-purple",
};

export function RecentActivity() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.description}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    {activity.meta && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.meta}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", activityColors[activity.type])}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

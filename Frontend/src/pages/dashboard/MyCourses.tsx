import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";

const enrolledCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    instructor: "John Smith",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop",
    progress: 68,
    totalLessons: 45,
    completedLessons: 31,
    duration: "42h 30m",
    lastAccessed: "2 hours ago",
    category: "Development",
  },
  {
    id: "2",
    title: "Advanced React & TypeScript",
    instructor: "Sarah Johnson",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    progress: 35,
    totalLessons: 32,
    completedLessons: 11,
    duration: "28h 15m",
    lastAccessed: "1 day ago",
    category: "Development",
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    instructor: "Mike Chen",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
    progress: 100,
    totalLessons: 24,
    completedLessons: 24,
    duration: "18h 45m",
    lastAccessed: "1 week ago",
    category: "Design",
  },
  {
    id: "4",
    title: "Machine Learning Basics",
    instructor: "Dr. Emily White",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
    progress: 12,
    totalLessons: 38,
    completedLessons: 5,
    duration: "35h 20m",
    lastAccessed: "3 days ago",
    category: "Data Science",
  },
];

export default function MyCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "in-progress") return matchesSearch && course.progress > 0 && course.progress < 100;
    if (activeTab === "completed") return matchesSearch && course.progress === 100;
    return matchesSearch;
  });

  return (
    <UnifiedDashboard title="My Courses" subtitle="Continue learning where you left off">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link to="/courses">
            <Button className="bg-lms-blue hover:bg-lms-blue/90">
              Browse More Courses
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Courses ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({enrolledCourses.filter(c => c.progress === 100).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredCourses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No courses found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-48 h-32 sm:h-auto">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        {course.progress === 100 && (
                          <div className="absolute inset-0 bg-lms-emerald/80 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                          </div>
                        )}
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {course.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{course.lastAccessed}</span>
                        </div>

                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          by {course.instructor}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {course.completedLessons}/{course.totalLessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.duration}
                            </span>
                          </div>
                        </div>

                        <Link to={`/course/${course.id}/learn`}>
                          <Button size="sm" className="w-full gap-2 bg-lms-blue hover:bg-lms-blue/90">
                            <Play className="h-4 w-4" />
                            {course.progress === 100 ? "Review Course" : "Continue Learning"}
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedDashboard>
  );
}

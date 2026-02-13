import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Clock,
  Users,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  GraduationCap,
  Share2,
  Heart,
  BookOpen,
  FileText,
  Globe,
  Smartphone,
  LifeBuoy,
  Award,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Courses } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  price: number;
  level?: string;
  language?: string;
  updated_at: string;
  certificate_enabled?: boolean;
  instructor: {
    user: {
      name: string;
      email: string;
      avatar_url?: string;
    };
  };
  category?: {
    name: string;
  };
  sections: Array<{
    id: string;
    title: string;
    order_index: number;
    items: Array<{
      id: string;
      title: string;
      item_type: string;
      duration_minutes?: number;
      order_index: number;
    }>;
  }>;
  enrollments?: any[];
  reviews?: any[];
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await Courses.getOne(id);
        setCourse(data);
      } catch (error: any) {
        console.error("Failed to load course:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load course",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, toast]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const calculateTotalLessons = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce((total, section) => total + (section.items?.length || 0), 0);
  };

  const calculateTotalDuration = () => {
    if (!course?.sections) return "0 hours";
    const totalMinutes = course.sections.reduce((total, section) => {
      return total + (section.items?.reduce((sum, item) => sum + (item.duration_minutes || 0), 0) || 0);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}+ hours`;
  };

  const getItemIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "lecture":
      case "video":
        return Play;
      case "quiz":
        return FileText;
      case "assignment":
        return BookOpen;
      default:
        return Play;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const studentCount = course.enrollments?.length || 0;
  const reviewCount = course.reviews?.length || 0;
  const avgRating = 4.8; // TODO: Calculate from reviews

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-nav">
        <div className="container-coursera h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/courses" className="text-muted-foreground hover:text-foreground">Courses</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{course.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-coursera-navy text-white py-8 lg:py-12">
        <div className="container-coursera">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {course.level || "All Levels"}
                </Badge>
                <span className="text-white/70">•</span>
                <span className="text-white/70">{calculateTotalDuration()}</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-white/80 max-w-2xl">{course.subtitle || course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-coursera-orange text-coursera-orange" />
                  <span className="font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-white/70">({reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <Users className="h-4 w-4" />
                  {studentCount} students
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  {course.instructor.user.avatar_url ? (
                    <AvatarImage src={course.instructor.user.avatar_url} />
                  ) : null}
                  <AvatarFallback>
                    {course.instructor.user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{course.instructor.user.name}</p>
                  <p className="text-sm text-white/70">Instructor</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 pt-2">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {course.language || "English"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {calculateTotalDuration()}
                </span>
                <span>Updated {formatDate(course.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-coursera py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            {course.description && (
              <div className="bg-card border p-6">
                <h2 className="text-lg font-semibold mb-4">About this Course</h2>
                <p className="text-muted-foreground whitespace-pre-line">{course.description}</p>
              </div>
            )}

            {/* Curriculum */}
            <div className="bg-card border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Course Content - {course.sections?.length || 0} sections
                </h2>
                <span className="text-sm text-muted-foreground">
                  {calculateTotalLessons()} lessons
                </span>
              </div>
              <div className="space-y-2">
                {course.sections?.sort((a, b) => a.order_index - b.order_index).map((section, sectionIndex) => (
                  <div key={section.id} className="border overflow-hidden">
                    <button
                      onClick={() => toggleSection(sectionIndex)}
                      className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="h-8 w-8 rounded-full bg-coursera-blue flex items-center justify-center text-white font-semibold text-sm">
                          {sectionIndex + 1}
                        </div>
                        <div>
                          <span className="font-medium">{section.title}</span>
                          <p className="text-sm text-muted-foreground">
                            {section.items?.length || 0} items
                          </p>
                        </div>
                      </div>
                      {expandedSections.includes(sectionIndex) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    {expandedSections.includes(sectionIndex) && (
                      <div className="divide-y">
                        {section.items?.sort((a, b) => a.order_index - b.order_index).map((item) => {
                          const Icon = getItemIcon(item.item_type);
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{item.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDuration(item.duration_minutes)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-card border p-6">
              <h2 className="text-lg font-semibold mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  {course.instructor.user.avatar_url ? (
                    <AvatarImage src={course.instructor.user.avatar_url} />
                  ) : null}
                  <AvatarFallback>
                    {course.instructor.user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-coursera-blue">{course.instructor.user.name}</h3>
                  <p className="text-muted-foreground">{course.instructor.user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Course Card */}
              <div className="bg-card border shadow-card overflow-hidden">
                <div className="relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-muted flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-coursera-blue ml-1" />
                    </div>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </p>
                  </div>
                  <Button className="w-full bg-coursera-blue hover:bg-coursera-blue-hover font-semibold h-12 text-base">
                    Enroll Now
                  </Button>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">This course includes:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Play className="h-4 w-4" />
                        <span>{calculateTotalDuration()} on-demand video</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{calculateTotalLessons()} lessons</span>
                      </div>
                      {course.certificate_enabled && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Award className="h-4 w-4" />
                          <span>Certificate of completion</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Smartphone className="h-4 w-4" />
                        <span>Access on mobile and desktop</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              {course.category && (
                <div className="bg-card border p-6">
                  <p className="text-sm font-medium mb-3">Category</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-coursera-blue" />
                    </div>
                    <div>
                      <p className="font-semibold">{course.category.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden z-50 shadow-nav">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {course.price === 0 ? "Free Course" : `$${course.price}`}
            </p>
            <p className="font-semibold">{course.title}</p>
          </div>
          <Button className="bg-coursera-blue hover:bg-coursera-blue-hover font-semibold px-6">
            Enroll
          </Button>
        </div>
      </div>
    </div>
  );
}

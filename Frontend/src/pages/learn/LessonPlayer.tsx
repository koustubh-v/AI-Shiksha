import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Maximize,
  CheckCircle2,
  Circle,
  Send,
  BookOpen,
  HelpCircle,
  FileText,
  Brain,
  X,
  Settings,
  Download,
  Menu,
  FileDown,
  MessageCircle,
  Loader2,
  Clock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Courses } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SectionItem {
  id: string;
  title: string;
  item_type: string;
  duration_minutes?: number;
  order_index: number;
  content?: any;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  items: SectionItem[];
}

interface Course {
  id: string;
  title: string;
  sections: Section[];
}

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentItem, setCurrentItem] = useState<SectionItem | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAITutor, setShowAITutor] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [aiConversation, setAiConversation] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI tutor. I can help explain concepts, answer questions, or quiz you on this material. What would you like to know?",
    },
  ]);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const data = await Courses.getOne(courseId);
        setCourse(data);

        // Find current lesson
        let foundItem: SectionItem | null = null;
        let foundSection: Section | null = null;

        for (const section of data.sections || []) {
          const item = section.items?.find((i: SectionItem) => i.id === lessonId);
          if (item) {
            foundItem = item;
            foundSection = section;
            break;
          }
        }

        if (foundItem && foundSection) {
          setCurrentItem(foundItem);
          setCurrentSection(foundSection);
        } else {
          toast({
            title: "Lesson not found",
            description: "The requested lesson could not be found.",
            variant: "destructive",
          });
        }
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
  }, [courseId, lessonId, toast]);

  const handleSendMessage = () => {
    if (!aiMessage.trim()) return;
    setAiConversation([...aiConversation, { role: "user", content: aiMessage }]);
    setAiMessage("");
    setIsTyping(true);
    setTimeout(() => {
      setAiConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm here to help! This is a demo response. In production, this would connect to an AI service to provide personalized tutoring.",
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const calculateProgress = () => {
    if (!course?.sections) return 0;
    // TODO: Calculate based on completed lessons
    return 0;
  };

  const getNextLesson = () => {
    if (!course?.sections || !currentItem || !currentSection) return null;

    const currentSectionItems = currentSection.items?.sort((a, b) => a.order_index - b.order_index) || [];
    const currentIndex = currentSectionItems.findIndex(item => item.id === currentItem.id);

    // Check if there's a next item in current section
    if (currentIndex < currentSectionItems.length - 1) {
      return currentSectionItems[currentIndex + 1];
    }

    // Check next section
    const sections = course.sections.sort((a, b) => a.order_index - b.order_index);
    const sectionIndex = sections.findIndex(s => s.id === currentSection.id);

    if (sectionIndex < sections.length - 1) {
      const nextSection = sections[sectionIndex + 1];
      const firstItem = nextSection.items?.sort((a, b) => a.order_index - b.order_index)[0];
      return firstItem || null;
    }

    return null;
  };

  const getPreviousLesson = () => {
    if (!course?.sections || !currentItem || !currentSection) return null;

    const currentSectionItems = currentSection.items?.sort((a, b) => a.order_index - b.order_index) || [];
    const currentIndex = currentSectionItems.findIndex(item => item.id === currentItem.id);

    // Check if there's a previous item in current section
    if (currentIndex > 0) {
      return currentSectionItems[currentIndex - 1];
    }

    // Check previous section
    const sections = course.sections.sort((a, b) => a.order_index - b.order_index);
    const sectionIndex = sections.findIndex(s => s.id === currentSection.id);

    if (sectionIndex > 0) {
      const prevSection = sections[sectionIndex - 1];
      const items = prevSection.items?.sort((a, b) => a.order_index - b.order_index) || [];
      return items[items.length - 1] || null;
    }

    return null;
  };

  const handleNext = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      navigate(`/learn/${courseId}/lesson/${nextLesson.id}`);
    }
  };

  const handlePrevious = () => {
    const prevLesson = getPreviousLesson();
    if (prevLesson) {
      navigate(`/learn/${courseId}/lesson/${prevLesson.id}`);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const CurriculumContent = () => (
    <div className="divide-y divide-border">
      {course?.sections?.sort((a, b) => a.order_index - b.order_index).map((section) => (
        <div key={section.id}>
          <div className="p-4 bg-muted/50">
            <p className="font-semibold text-sm">{section.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {section.items?.length || 0} items
            </p>
          </div>
          <div>
            {section.items?.sort((a, b) => a.order_index - b.order_index).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/learn/${courseId}/lesson/${item.id}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors border-l-2",
                  item.id === lessonId
                    ? "bg-coursera-blue-light border-l-coursera-blue"
                    : "border-l-transparent hover:bg-muted/50"
                )}
              >
                <div className="shrink-0">
                  {item.id === lessonId ? (
                    <Play className="h-4 w-4 text-coursera-blue" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("truncate", item.id === lessonId && "font-medium text-coursera-blue")}>
                    {item.title}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(item.duration_minutes)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course || !currentItem) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
        <Button onClick={() => navigate("/dashboard/my-courses")}>Go to My Courses</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0 shadow-nav">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/my-courses")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
          <div className="hidden sm:block border-l pl-4">
            <p className="text-sm font-semibold truncate max-w-[300px]">{course.title}</p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-coursera-green transition-all"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{calculateProgress()}% complete</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAITutor ? "default" : "outline"}
            size="sm"
            className={cn("gap-2", showAITutor && "bg-coursera-purple hover:bg-coursera-purple/90")}
            onClick={() => setShowAITutor(!showAITutor)}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Tutor</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Course Content</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <CurriculumContent />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="hidden lg:flex"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video & Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video Player Placeholder */}
          <div className="relative bg-black" style={{ aspectRatio: "16/9", maxHeight: "65vh" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors mb-4"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-10 w-10 text-white" />
                ) : (
                  <Play className="h-10 w-10 text-white ml-1" />
                )}
              </button>
              <p className="text-white/70 text-sm">Video player will be integrated here</p>
              <p className="text-white/50 text-xs mt-1">Lesson: {currentItem.title}</p>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                </button>
                <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer group">
                  <div className="w-1/3 h-full bg-coursera-blue rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-sm text-white font-mono">0:00 / {formatDuration(currentItem.duration_minutes)}</span>
                <button className="hover:opacity-75 hidden sm:block"><Volume2 className="h-5 w-5 text-white" /></button>
                <button className="hover:opacity-75 hidden sm:block"><Settings className="h-5 w-5 text-white" /></button>
                <button className="hover:opacity-75"><Maximize className="h-5 w-5 text-white" /></button>
              </div>
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="border-b bg-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
            <div>
              <p className="text-xs text-muted-foreground">{currentSection?.title}</p>
              <p className="font-semibold">{currentItem.title}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none gap-2"
                onClick={handlePrevious}
                disabled={!getPreviousLesson()}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none gap-2 bg-coursera-green hover:bg-coursera-green/90">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Mark Complete</span>
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none gap-2 bg-coursera-blue hover:bg-coursera-blue-hover"
                onClick={handleNext}
                disabled={!getNextLesson()}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-muted/30 p-6">
            <div className="bg-white border p-6 max-w-3xl">
              <h2 className="text-lg font-bold mb-3">About this lesson</h2>
              <p className="text-muted-foreground leading-relaxed">
                {currentItem.item_type === "LECTURE" ? "This is a video lecture." :
                  currentItem.item_type === "QUIZ" ? "This is a quiz to test your knowledge." :
                    currentItem.item_type === "ASSIGNMENT" ? "This is an assignment to practice what you've learned." :
                      "Lesson content will be displayed here."}
              </p>
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar - Desktop */}
        {showSidebar && (
          <aside className="w-80 xl:w-96 border-l bg-white flex-col hidden lg:flex shrink-0">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Course content</h3>
              <button onClick={() => setShowSidebar(false)}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <ScrollArea className="flex-1">
              <CurriculumContent />
            </ScrollArea>
          </aside>
        )}

        {/* AI Tutor Panel */}
        {showAITutor && (
          <aside className="w-80 xl:w-96 border-l bg-white flex flex-col hidden md:flex shrink-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-coursera-purple flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">AI Tutor</p>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setShowAITutor(false)}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {aiConversation.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 text-sm rounded-lg",
                      msg.role === "assistant"
                        ? "bg-muted"
                        : "bg-coursera-blue text-white ml-4"
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2 mb-3">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Explain
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  Quiz Me
                </Button>
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask anything about this lesson..."
                  className="min-h-[60px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!aiMessage.trim() || isTyping}
                  className="bg-coursera-purple hover:bg-coursera-purple/90 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

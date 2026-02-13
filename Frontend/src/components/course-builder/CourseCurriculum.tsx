import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  ClipboardList,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define types locally since CourseBuilder no longer exports them
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: number;
  is_free_preview?: boolean;
  is_required?: boolean;
  video_url?: string;
  content?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface CourseData {
  id?: string;
  title: string;
  description?: string;
  sections?: Section[];
  [key: string]: any;
}

interface CourseCurriculumProps {
  data: CourseData;
  onUpdate: (updates: Partial<CourseData>) => void;
}

const lessonTypes = [
  { value: "video", label: "Video", icon: Video },
  { value: "text", label: "Text/Article", icon: FileText },
  { value: "quiz", label: "Quiz", icon: HelpCircle },
  { value: "assignment", label: "Assignment", icon: ClipboardList },
];

export function CourseCurriculum({ data, onUpdate }: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingLesson, setEditingLesson] = useState<{ sectionId: string; lesson?: Lesson } | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: newSectionTitle,
      lessons: [],
    };
    onUpdate({ sections: [...data.sections, newSection] });
    setNewSectionTitle("");
    setIsAddingSection(false);
    setExpandedSections((prev) => [...prev, newSection.id]);
  };

  const deleteSection = (sectionId: string) => {
    onUpdate({ sections: data.sections.filter((s) => s.id !== sectionId) });
  };

  const addLesson = (sectionId: string, lessonData: Omit<Lesson, "id">) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      ...lessonData,
    };
    onUpdate({
      sections: data.sections.map((section) =>
        section.id === sectionId
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      ),
    });
    setEditingLesson(null);
  };

  const updateLesson = (sectionId: string, lessonId: string, lessonData: Partial<Lesson>) => {
    onUpdate({
      sections: data.sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            lessons: section.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, ...lessonData } : lesson
            ),
          }
          : section
      ),
    });
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    onUpdate({
      sections: data.sections.map((section) =>
        section.id === sectionId
          ? { ...section, lessons: section.lessons.filter((l) => l.id !== lessonId) }
          : section
      ),
    });
  };

  const totalLessons = data.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDuration = data.sections.reduce(
    (acc, s) => acc + s.lessons.reduce((la, l) => la + l.duration, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-lms-blue/10 flex items-center justify-center">
              <PlayCircle className="h-5 w-5 text-lms-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalLessons}</p>
              <p className="text-sm text-muted-foreground">Total Lessons</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-lms-emerald/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-lms-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-lms-purple/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-lms-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.sections.length}</p>
              <p className="text-sm text-muted-foreground">Sections</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Section Button - Prominently placed */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Course Curriculum</h3>
          <p className="text-sm text-muted-foreground">Organize your course content into sections and lessons</p>
        </div>
        <Button
          onClick={() => setIsAddingSection(true)}
          className="bg-lms-blue hover:bg-lms-blue/90 text-white rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Curriculum Builder */}
      <Card className="rounded-2xl">
        <CardContent className="pt-6 space-y-4">
          {/* Add Section Form */}
          {isAddingSection && (
            <div className="flex gap-2 p-4 bg-muted/50 rounded-2xl">
              <Input
                placeholder="Section title (e.g., Getting Started)"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="flex-1 rounded-xl"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && addSection()}
              />
              <Button onClick={addSection} className="rounded-xl">Add</Button>
              <Button variant="ghost" onClick={() => setIsAddingSection(false)} className="rounded-xl">
                Cancel
              </Button>
            </div>
          )}

          {/* Sections List */}
          {data.sections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PlayCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No sections yet</p>
              <p className="text-sm">Start by adding your first section</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.sections.map((section, sectionIndex) => (
                <div key={section.id} className="border rounded-2xl overflow-hidden">
                  {/* Section Header */}
                  <div
                    className="flex items-center gap-3 p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Section {sectionIndex + 1}: {section.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {section.lessons.length} lessons
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.id);
                      }}
                      className="rounded-xl text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedSections.includes(section.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Section Content */}
                  {expandedSections.includes(section.id) && (
                    <div className="p-4 space-y-3">
                      {/* Lessons */}
                      {section.lessons.map((lesson, lessonIndex) => {
                        const TypeIcon = lessonTypes.find((t) => t.value === lesson.type)?.icon || Video;
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 p-3 bg-background border rounded-xl"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{lesson.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{lesson.duration} min</span>
                                {lesson.is_free_preview && (
                                  <Badge variant="secondary" className="text-xs">
                                    Free Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingLesson({ sectionId: section.id, lesson })}
                              className="rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteLesson(section.id, lesson.id)}
                              className="rounded-lg text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}

                      {/* Add Lesson Button */}
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-dashed"
                        onClick={() => setEditingLesson({ sectionId: section.id })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Lesson Dialog */}
      <LessonDialog
        open={!!editingLesson}
        onOpenChange={(open) => !open && setEditingLesson(null)}
        lesson={editingLesson?.lesson}
        onSave={(lessonData) => {
          if (editingLesson) {
            if (editingLesson.lesson) {
              updateLesson(editingLesson.sectionId, editingLesson.lesson.id, lessonData);
            } else {
              addLesson(editingLesson.sectionId, lessonData as Omit<Lesson, "id">);
            }
          }
          setEditingLesson(null);
        }}
      />
    </div>
  );
}

interface LessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: Lesson;
  onSave: (data: Partial<Lesson>) => void;
}

function LessonDialog({ open, onOpenChange, lesson, onSave }: LessonDialogProps) {
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: "",
    type: "video",
    duration: 10,
    content: "",
    is_free_preview: false,
    ...lesson,
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Lesson Title *</Label>
            <Input
              placeholder="e.g., Introduction to React Hooks"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Lesson Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lessonTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min="1"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="rounded-xl"
              />
            </div>
          </div>

          {formData.type === "video" && (
            <div className="space-y-4 p-4 border rounded-xl bg-muted/30">
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.video_url || ""}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground">Paste a link to a YouTube or Vimeo video</p>
              </div>

              <div className="relative">
                <Button variant="outline" className="w-full gap-2 rounded-xl" disabled>
                  <Video className="h-4 w-4" />
                  Upload Video
                </Button>
                <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] px-1.5 h-5">Coming Soon</Badge>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Content / Description</Label>
            <Textarea
              placeholder="Lesson description or content..."
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium">Free Preview</p>
              <p className="text-sm text-muted-foreground">Allow non-enrolled users to watch</p>
            </div>
            <Switch
              checked={formData.is_free_preview || false}
              onCheckedChange={(checked) => setFormData({ ...formData, is_free_preview: checked })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-lms-blue hover:bg-lms-blue/90 rounded-xl">
            {lesson ? "Update Lesson" : "Add Lesson"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Video,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Course Details", description: "Basic information" },
  { id: 2, title: "Curriculum", description: "Add chapters & lessons" },
  { id: 3, title: "Pricing", description: "Set your price" },
  { id: 4, title: "Publish", description: "Review & launch" },
];

const aiGeneratedOutline = [
  { chapter: "Introduction to the Course", lessons: ["Welcome & Overview", "What You'll Learn", "Prerequisites"] },
  { chapter: "Core Concepts", lessons: ["Understanding the Basics", "Key Terminology", "First Practical Example"] },
  { chapter: "Intermediate Techniques", lessons: ["Building on Fundamentals", "Real-world Applications", "Common Mistakes to Avoid"] },
  { chapter: "Advanced Topics", lessons: ["Deep Dive", "Expert Strategies", "Case Studies"] },
  { chapter: "Conclusion & Next Steps", lessons: ["Course Summary", "Additional Resources", "Final Project"] },
];

export default function CourseCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState<typeof aiGeneratedOutline | null>(null);
  const [courseTitle, setCourseTitle] = useState("");

  const handleGenerateOutline = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setOutline(aiGeneratedOutline);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <DashboardLayout title="Create New Course" subtitle="Build your course step by step">
      <div className="page-container max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                      currentStep > step.id
                        ? "bg-lms-emerald text-white"
                        : currentStep === step.id
                        ? "bg-lms-blue text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-24 mx-4",
                      currentStep > step.id ? "bg-lms-emerald" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Tell us about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input
                  placeholder="e.g., Complete React Development Masterclass"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  <Button variant="ghost" size="sm" className="gap-1 text-lms-purple">
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  placeholder="Describe what students will learn..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Course Thumbnail</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Drag and drop an image or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Upload Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>Structure your course content</CardDescription>
                </div>
                <Button
                  onClick={handleGenerateOutline}
                  disabled={isGenerating}
                  className="gap-2 bg-lms-purple hover:bg-lms-purple/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Outline with AI
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {outline ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-lms-purple-light border border-lms-purple/20">
                    <Sparkles className="h-4 w-4 text-lms-purple" />
                    <span className="text-sm">AI-generated outline. Drag to reorder or edit as needed.</span>
                  </div>
                  {outline.map((chapter, idx) => (
                    <div key={idx} className="border border-border rounded-lg">
                      <div className="flex items-center gap-3 p-4 bg-muted/50">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <span className="font-semibold">Chapter {idx + 1}: {chapter.chapter}</span>
                        <Badge variant="secondary" className="ml-auto">{chapter.lessons.length} lessons</Badge>
                      </div>
                      <div className="p-4 space-y-2">
                        {chapter.lessons.map((lesson, lidx) => (
                          <div key={lidx} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <Video className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lesson}</span>
                            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                          <Plus className="h-4 w-4" />
                          Add Lesson
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Chapter
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No curriculum yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate an AI-powered outline or add chapters manually
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Chapter Manually
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set your course price and discounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Regular Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input type="number" placeholder="99" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sale Price (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input type="number" placeholder="49" className="pl-8" />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-lms-purple-light border border-lms-purple/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-lms-purple mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">AI Pricing Suggestion</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on similar courses and your content, we suggest pricing at <strong>₹79</strong> for optimal conversions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Ready to Publish!</CardTitle>
              <CardDescription>Review your course and go live</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-5 w-5 text-lms-emerald" />
                  <span>Course details completed</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-5 w-5 text-lms-emerald" />
                  <span>5 chapters with 15 lessons added</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-5 w-5 text-lms-emerald" />
                  <span>Pricing set at ₹79</span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-lms-blue/20 bg-lms-blue/5">
                <p className="text-sm">
                  Your course will be submitted for review. Once approved, it will be live on the platform.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="gap-2 bg-lms-blue hover:bg-lms-blue/90"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="gap-2 bg-lms-emerald hover:bg-lms-emerald/90">
              <CheckCircle className="h-4 w-4" />
              Publish Course
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

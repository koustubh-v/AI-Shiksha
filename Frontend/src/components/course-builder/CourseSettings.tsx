import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Lock,
  MessageSquare,
  Star,
  Users,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Placeholder interface if imported one is missing
interface CourseData {
  title: string;
  description: string;
  category: string;
  sections: any[];
  price: number;
  isPublic: boolean;
  enableDrip: boolean;
  enableComments: boolean;
  enableReviews: boolean;
  maxStudents: number;
  access_days_limit?: number;
  estimated_duration?: number;
  enrollmentDuration?: number; // kept for compatibility if needed
}

interface CourseSettingsProps {
  data: CourseData;
  onUpdate: (updates: Partial<CourseData>) => void;
}

export function CourseSettings({ data, onUpdate }: CourseSettingsProps) {
  const completionChecks = [
    {
      label: "Course title added",
      done: !!data.title,
    },
    {
      label: "Description added",
      done: !!data.description,
    },
    {
      label: "Category selected",
      done: !!data.category,
    },
    {
      label: "At least one section created",
      done: data.sections.length > 0,
    },
    {
      label: "At least one lesson added",
      done: data.sections.some((s) => s.lessons.length > 0),
    },
    {
      label: "Price configured",
      done: data.price > 0,
    },
  ];

  const completedCount = completionChecks.filter((c) => c.done).length;
  const isReadyToPublish = completedCount === completionChecks.length;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Visibility */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Course Visibility</CardTitle>
            <CardDescription>Control who can see and access your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${data.isPublic ? "border-lms-blue bg-lms-blue/5" : "border-border"
                }`}
              onClick={() => onUpdate({ isPublic: true })}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-lms-blue/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-lms-blue" />
                </div>
                <div>
                  <p className="font-medium">Public</p>
                  <p className="text-sm text-muted-foreground">
                    Anyone can find and enroll in this course
                  </p>
                </div>
              </div>
              {data.isPublic && <CheckCircle2 className="h-5 w-5 text-lms-blue" />}
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${!data.isPublic ? "border-lms-blue bg-lms-blue/5" : "border-border"
                }`}
              onClick={() => onUpdate({ isPublic: false })}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Private</p>
                  <p className="text-sm text-muted-foreground">
                    Only people with a direct link can access
                  </p>
                </div>
              </div>
              {!data.isPublic && <CheckCircle2 className="h-5 w-5 text-lms-blue" />}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Course Features</CardTitle>
            <CardDescription>Enable or disable specific course functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-lms-purple/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-lms-purple" />
                </div>
                <div>
                  <p className="font-medium">Drip Content</p>
                  <p className="text-sm text-muted-foreground">
                    Release content on a schedule
                  </p>
                </div>
              </div>
              <Switch
                checked={data.enableDrip}
                onCheckedChange={(checked) => onUpdate({ enableDrip: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-lms-blue/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-lms-blue" />
                </div>
                <div>
                  <p className="font-medium">Q&A / Comments</p>
                  <p className="text-sm text-muted-foreground">
                    Allow students to ask questions
                  </p>
                </div>
              </div>
              <Switch
                checked={data.enableComments}
                onCheckedChange={(checked) => onUpdate({ enableComments: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-lms-amber/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-lms-amber" />
                </div>
                <div>
                  <p className="font-medium">Student Reviews</p>
                  <p className="text-sm text-muted-foreground">
                    Allow students to rate and review
                  </p>
                </div>
              </div>
              <Switch
                checked={data.enableReviews}
                onCheckedChange={(checked) => onUpdate({ enableReviews: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Limits */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Enrollment Settings</CardTitle>
            <CardDescription>Set limits for course enrollment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Maximum Students
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0 = Unlimited"
                  value={data.maxStudents || ""}
                  onChange={(e) => onUpdate({ maxStudents: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground">Leave 0 for unlimited</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Access Duration (days)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0 = Lifetime"
                  value={data.access_days_limit || ""}
                  onChange={(e) => onUpdate({ access_days_limit: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground">Leave 0 for lifetime access</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Estimated Duration (minutes)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 120 (2 hours)"
                  value={data.estimated_duration || ""}
                  onChange={(e) => onUpdate({ estimated_duration: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground">Total time to complete course (for certificate)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publish Checklist */}
      <div className="space-y-6">
        <Card className="rounded-2xl sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Publish Checklist
              <Badge
                variant={isReadyToPublish ? "default" : "secondary"}
                className={isReadyToPublish ? "bg-lms-emerald" : ""}
              >
                {completedCount}/{completionChecks.length}
              </Badge>
            </CardTitle>
            <CardDescription>Complete these items before publishing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {completionChecks.map((check, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl ${check.done ? "bg-lms-emerald/10" : "bg-muted/30"
                  }`}
              >
                {check.done ? (
                  <CheckCircle2 className="h-5 w-5 text-lms-emerald" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <span
                  className={`text-sm ${check.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {isReadyToPublish && (
          <Card className="rounded-2xl bg-lms-emerald/10 border-lms-emerald">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-lms-emerald mt-0.5" />
                <div>
                  <p className="font-medium text-lms-emerald">Ready to Publish!</p>
                  <p className="text-sm text-muted-foreground">
                    Your course meets all requirements. Click "Publish Course" to go live.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

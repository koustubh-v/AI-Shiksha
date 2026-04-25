import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseData } from "./CourseCurriculum";

interface CourseCertificateProps {
  data: CourseData;
  onUpdate: (updates: Partial<CourseData>) => void;
}

const templates = [
  {
    id: "modern",
    name: "Modern",
    preview: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(262 83% 58%) 100%)",
    description: "Clean, contemporary design",
  },
  {
    id: "classic",
    name: "Classic",
    preview: "linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(38 92% 35%) 100%)",
    description: "Traditional certificate style",
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "linear-gradient(135deg, hsl(0 0% 20%) 0%, hsl(0 0% 40%) 100%)",
    description: "Simple and elegant",
  },
  {
    id: "professional",
    name: "Professional",
    preview: "linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(160 84% 25%) 100%)",
    description: "Business-focused design",
  },
];

export function CourseCertificate({ data, onUpdate }: CourseCertificateProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Enable Certificate */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-lms-amber/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-lms-amber" />
                </div>
                <div>
                  <h3 className="font-semibold">Certificate of Completion</h3>
                  <p className="text-sm text-muted-foreground">
                    Award a certificate when students complete the course
                  </p>
                </div>
              </div>
              <Switch
                checked={data.certificateEnabled}
                onCheckedChange={(checked) => onUpdate({ certificateEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {data.certificateEnabled && (
          <>
            {/* Template Selection */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Choose Template</CardTitle>
                <CardDescription>Select a design for your certificate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => onUpdate({ certificateTemplate: template.id })}
                      className={cn(
                        "relative p-4 rounded-2xl border-2 text-left transition-all",
                        data.certificateTemplate === template.id
                          ? "border-lms-blue bg-lms-blue/5"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      {data.certificateTemplate === template.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="h-5 w-5 text-lms-blue" />
                        </div>
                      )}
                      <div
                        className="h-24 rounded-xl mb-3"
                        style={{ background: template.preview }}
                      />
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificate Content */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Certificate Content</CardTitle>
                <CardDescription>Customize what appears on the certificate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certTitle">Certificate Title</Label>
                  <Input
                    id="certTitle"
                    placeholder="Certificate of Completion"
                    value={data.certificateTitle}
                    onChange={(e) => onUpdate({ certificateTitle: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certDesc">Completion Text</Label>
                  <Textarea
                    id="certDesc"
                    placeholder="has successfully completed the course"
                    value={data.certificateDescription}
                    onChange={(e) => onUpdate({ certificateDescription: e.target.value })}
                    rows={3}
                    className="rounded-xl resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    This text appears after the student's name
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Preview */}
      <div className="space-y-6">
        <Card className="rounded-2xl sticky top-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {data.certificateEnabled ? (
              <div
                className="aspect-[1.4/1] rounded-xl p-6 flex flex-col items-center justify-center text-center text-white relative overflow-hidden"
                style={{
                  background: templates.find((t) => t.id === data.certificateTemplate)?.preview,
                }}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 space-y-3">
                  <Award className="h-8 w-8 mx-auto" />
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    {data.certificateTitle || "Certificate of Completion"}
                  </p>
                  <p className="text-lg font-bold">Student Name</p>
                  <p className="text-xs opacity-80 max-w-[200px]">
                    {data.certificateDescription || "has successfully completed"}
                  </p>
                  <p className="text-sm font-medium">{data.title || "Course Title"}</p>
                  <p className="text-xs opacity-60">January 2024</p>
                </div>
              </div>
            ) : (
              <div className="aspect-[1.4/1] rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Certificate disabled</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-lms-emerald mt-0.5" />
              <div>
                <p className="text-sm font-medium">Automatic Generation</p>
                <p className="text-xs text-muted-foreground">
                  Certificates are generated automatically when students complete all lessons
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

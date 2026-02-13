import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Award, FileText, Eye } from 'lucide-react';
import { Courses } from '@/lib/api';
import { toast } from 'sonner';

interface CourseSettingsFormProps {
    courseId: string;
    course: any;
    onUpdate: () => void;
}

export function CourseSettingsForm({ courseId, course, onUpdate }: CourseSettingsFormProps) {
    const [saving, setSaving] = useState(false);

    // Certificate settings
    const [certificateEnabled, setCertificateEnabled] = useState(course?.certificate_enabled || false);
    const [certificateTitle, setCertificateTitle] = useState(course?.certificate_title || '');
    const [certificateDescription, setCertificateDescription] = useState(course?.certificate_description || '');

    // Access control
    const [isPrivate, setIsPrivate] = useState(course?.is_private || false);
    const [password, setPassword] = useState(course?.password || '');
    const [maxStudents, setMaxStudents] = useState(course?.max_students || '');
    const [dripEnabled, setDripEnabled] = useState(course?.drip_enabled || false);

    useEffect(() => {
        if (course) {
            setCertificateEnabled(course.certificate_enabled || false);
            setCertificateTitle(course.certificate_title || '');
            setCertificateDescription(course.certificate_description || '');
            setIsPrivate(course.is_private || false);
            setPassword(course.password || '');
            setMaxStudents(course.max_students || '');
            setDripEnabled(course.drip_enabled || false);
        }
    }, [course]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await Courses.update(courseId, {
                certificate_enabled: certificateEnabled,
                certificate_title: certificateTitle.trim() || undefined,
                certificate_description: certificateDescription.trim() || undefined,
                is_private: isPrivate,
                password: isPrivate && password.trim() ? password.trim() : undefined,
                max_students: maxStudents ? parseInt(maxStudents) : undefined,
                drip_enabled: dripEnabled,
            });

            toast.success('Course settings updated successfully!');
            onUpdate();
        } catch (error: any) {
            console.error('Failed to update settings:', error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const getCertificatePreview = () => {
        const title = certificateTitle || 'Certificate of Completion';
        const description = certificateDescription || 'This certifies that {{student_name}} has successfully completed {{course_title}}.';

        return description
            .replace('{{student_name}}', '[Student Name]')
            .replace('{{course_title}}', course?.title || '[Course Title]')
            .replace('{{completion_date}}', new Date().toLocaleDateString());
    };

    return (
        <div className="space-y-6">
            {/* Certificate Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Certificate of Completion</CardTitle>
                            <CardDescription>
                                Issue certificates to students who complete this course
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Enable Certificate Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">Enable Certificates</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically issue certificates when students complete all required content
                            </p>
                        </div>
                        <Switch
                            checked={certificateEnabled}
                            onCheckedChange={setCertificateEnabled}
                        />
                    </div>

                    {certificateEnabled && (
                        <>
                            <Separator />

                            {/* Certificate Title */}
                            <div className="space-y-2">
                                <Label htmlFor="cert-title">Certificate Title</Label>
                                <Input
                                    id="cert-title"
                                    value={certificateTitle}
                                    onChange={(e) => setCertificateTitle(e.target.value)}
                                    placeholder="Certificate of Completion"
                                />
                                <p className="text-xs text-muted-foreground">
                                    This will appear as the main heading on the certificate
                                </p>
                            </div>

                            {/* Certificate Description */}
                            <div className="space-y-2">
                                <Label htmlFor="cert-desc">Certificate Text</Label>
                                <Textarea
                                    id="cert-desc"
                                    value={certificateDescription}
                                    onChange={(e) => setCertificateDescription(e.target.value)}
                                    placeholder="This certifies that {{student_name}} has successfully completed {{course_title}}."
                                    rows={4}
                                />
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Available variables:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            '{{student_name}}',
                                            '{{course_title}}',
                                            '{{completion_date}}',
                                            '{{instructor_name}}',
                                        ].map((variable) => (
                                            <Badge key={variable} variant="secondary" className="text-xs font-mono">
                                                {variable}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Preview */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Preview
                                </Label>
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-primary/20">
                                    <CardContent className="p-8 text-center space-y-4">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                                            <Award className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold text-primary">
                                                {certificateTitle || 'Certificate of Completion'}
                                            </h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                {getCertificatePreview()}
                                            </p>
                                            <div className="pt-4 text-sm text-muted-foreground">
                                                <p>Issued by: {course?.instructor?.user?.name || '[Instructor Name]'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <CardTitle>Access Control</CardTitle>
                            <CardDescription>
                                Manage who can access this course and how
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Private Course Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">Private Course</Label>
                            <p className="text-sm text-muted-foreground">
                                Require a password to enroll in this course
                            </p>
                        </div>
                        <Switch
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                        />
                    </div>

                    {isPrivate && (
                        <div className="space-y-2 pl-4">
                            <Label htmlFor="password">Course Password</Label>
                            <Input
                                id="password"
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password..."
                            />
                        </div>
                    )}

                    <Separator />

                    {/* Max Students */}
                    <div className="space-y-2">
                        <Label htmlFor="max-students">Maximum Students</Label>
                        <Input
                            id="max-students"
                            type="number"
                            min="0"
                            value={maxStudents}
                            onChange={(e) => setMaxStudents(e.target.value)}
                            placeholder="Unlimited"
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave empty for unlimited enrollment
                        </p>
                    </div>

                    <Separator />

                    {/* Drip Content Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">Drip Content</Label>
                            <p className="text-sm text-muted-foreground">
                                Release course content gradually over time
                            </p>
                        </div>
                        <Switch
                            checked={dripEnabled}
                            onCheckedChange={setDripEnabled}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Settings
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

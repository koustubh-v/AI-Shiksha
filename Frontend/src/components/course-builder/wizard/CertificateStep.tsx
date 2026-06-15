import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Award, Check, Loader2, LayoutTemplate, Type, Eye, Download, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FloatingSaveBar } from './FloatingSaveBar';
import { Badge } from '@/components/ui/badge';
import { CertificateTemplates } from '@/lib/api';
import { CertificateTemplateConfig } from '@/types/certificate';
import { CertificateCanvas } from '@/components/certificates/builder/CertificateCanvas';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CertificateStepProps {
    courseId: string;
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    onBack?: () => void;
}

interface CertificateTemplate {
    id: string;
    name: string;
    description?: string;
    is_default: boolean;
    template_config: CertificateTemplateConfig;
    preview_image_url?: string;
}

export function CertificateStep({ initialData, onSave, onBack }: CertificateStepProps) {
    const [enabled, setEnabled] = useState(initialData?.certificate_enabled || false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(initialData?.certificate_template_id || '');
    const [title, setTitle] = useState(initialData?.certificate_title || 'Certificate of Completion');
    const [description, setDescription] = useState(initialData?.certificate_description || 'This certifies that [Student Name] has successfully completed the course.');
    const [saving, setSaving] = useState(false);

    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [templateError, setTemplateError] = useState<string | null>(null);

    useEffect(() => {
        if (enabled && templates.length === 0) {
            loadTemplates();
        }
    }, [enabled]);

    const loadTemplates = async () => {
        try {
            setLoadingTemplates(true);
            const data = await CertificateTemplates.getAll();
            // Ensure config matches type, or fallback (same protection as in admin page)
            const safeData = data.map((t: any) => ({
                ...t,
                template_config: t.template_config?.elements ? t.template_config : null
            })).filter((t: any) => t.template_config !== null);

            setTemplates(safeData);

            // If no template is selected but we have templates, select the default one or the first one
            if (!selectedTemplateId && safeData.length > 0) {
                const defaultTemplate = safeData.find((t: any) => t.is_default);
                setSelectedTemplateId(defaultTemplate ? defaultTemplate.id : safeData[0].id);
            }
        } catch (error) {
            console.error("Failed to load templates", error);
            setTemplateError("Failed to load certificate templates. Please try again.");
        } finally {
            setLoadingTemplates(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({
                certificate_enabled: enabled,
                certificate_template_id: selectedTemplateId,
                certificate_title: title,
                certificate_description: description,
            });
        } finally {
            setSaving(false);
        }
    };

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-24">

            {/* Header / Toggle */}
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Enable Course Certificate</h3>
                            <p className="text-sm text-muted-foreground">Automatically award students upon 100% completion.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium", enabled ? "text-purple-600" : "text-gray-500")}>
                            {enabled ? "Active" : "Disabled"}
                        </span>
                        <Switch
                            checked={enabled}
                            onCheckedChange={setEnabled}
                        />
                    </div>
                </CardContent>
            </Card>

            {enabled && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Template Selection & Settings */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-lg">Certificate Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Tabs defaultValue="template" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="template">Template</TabsTrigger>
                                        <TabsTrigger value="content">Content</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="template" className="mt-4 space-y-4">
                                        {loadingTemplates ? (
                                            <div className="flex justify-center py-8">
                                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : templateError ? (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>{templateError}</AlertDescription>
                                            </Alert>
                                        ) : templates.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>No templates found.</p>
                                                <p className="text-xs mt-1">Please ask an admin to create one.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
                                                {templates.map((template) => (
                                                    <div
                                                        key={template.id}
                                                        onClick={() => setSelectedTemplateId(template.id)}
                                                        className={cn(
                                                            "flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                                                            selectedTemplateId === template.id
                                                                ? "border-purple-600 bg-purple-50 ring-1 ring-purple-600"
                                                                : "border-gray-200 bg-white hover:bg-gray-50"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-sm">{template.name}</span>
                                                            {template.is_default && <Badge variant="secondary" className="text-[10px] px-1 h-5">Default</Badge>}
                                                        </div>
                                                        {/* Mini Preview */}
                                                        <div className="w-full aspect-[1.414/1] bg-gray-100 rounded overflow-hidden relative pointer-events-none border border-gray-100 flex items-center justify-center">
                                                            <CertificateCanvas
                                                                config={template.template_config}
                                                                selectedElementId={null}
                                                                onSelectElement={() => { }}
                                                                onUpdateElement={() => { }}
                                                                zoom={0.25}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="content" className="mt-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label>Certificate Title</Label>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. Certificate of Achievement"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Takes precedence if the template uses the <code>{'{certificate_title}'}</code> variable.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description / Body</Label>
                                            <Textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={4}
                                                placeholder="Enter certificate body text..."
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Takes precedence if the template uses the <code>{'{certificate_description}'}</code> variable.
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="lg:col-span-8">
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm sticky top-6">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Preview</CardTitle>
                                <Button variant="outline" size="sm" disabled>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Sample PDF
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full aspect-[1.414/1] bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
                                    {loadingTemplates ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    ) : selectedTemplate ? (
                                        <div className="shadow-xl">
                                            <CertificateCanvas
                                                config={{
                                                    ...selectedTemplate.template_config,
                                                    // Inject live values into placeholders for preview
                                                    elements: selectedTemplate.template_config.elements.map(el => {
                                                        if (el.type === 'variable') {
                                                            let content = el.content;
                                                            if (content === '{student_name}') content = 'John Doe';
                                                            if (content === '{course_name}') content = 'Advanced React Development';
                                                            if (content === '{instructor_name}') content = 'Jane Smith';
                                                            if (content === '{completion_date}') content = new Date().toLocaleDateString();
                                                            if (content === '{certificate_title}') content = title;
                                                            if (content === '{certificate_description}') content = description;
                                                            return { ...el, content };
                                                        }
                                                        return el;
                                                    })
                                                }}
                                                selectedElementId={null}
                                                onSelectElement={() => { }}
                                                onUpdateElement={() => { }}
                                                zoom={0.5}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <LayoutTemplate className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>Select a template to preview</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex items-start gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <p>
                                        This is a preview with sample data. Actual certificates will include the student's real name and completion date.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Save Actions */}
            <FloatingSaveBar
                onSave={handleSave}
                loading={saving}
                onBack={onBack}
            />
            <div className="h-12" /> {/* Spacer */}
        </div >
    );
}

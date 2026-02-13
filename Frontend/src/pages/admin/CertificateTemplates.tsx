import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import {
    Plus,
    Award,
    Edit,
    Trash2,
    Star,
    Loader2,
    FileText,
} from "lucide-react";
import { CertificateTemplates } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CertificatePreview } from "@/components/certificates/CertificatePreview";

interface CertificateTemplate {
    id: string;
    name: string;
    description?: string;
    is_default: boolean;
    template_config: any;
    preview_image_url?: string;
    created_at: string;
    creator?: {
        name: string;
        email: string;
    };
    _count?: {
        courses: number;
    };
}

export default function CertificateTemplatesPage() {
    const { toast } = useToast();
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        layout: "classic",
        background_color: "#ffffff",
        border_color: "#000000",
        border_style: "double",
        title_text: "Certificate of Completion",
        title_font: "Georgia",
        title_color: "#1a1a1a",
        body_font: "Arial",
        body_color: "#333333",
        is_default: false,
    });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const data = await CertificateTemplates.getAll();
            setTemplates(data);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load certificate templates",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (template?: CertificateTemplate) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({
                name: template.name,
                description: template.description || "",
                layout: template.template_config.layout || "classic",
                background_color: template.template_config.background_color || "#ffffff",
                border_color: template.template_config.border_color || "#000000",
                border_style: template.template_config.border_style || "double",
                title_text: template.template_config.title_text || "Certificate of Completion",
                title_font: template.template_config.title_font || "Georgia",
                title_color: template.template_config.title_color || "#1a1a1a",
                body_font: template.template_config.body_font || "Arial",
                body_color: template.template_config.body_color || "#333333",
                is_default: template.is_default,
            });
        } else {
            setEditingTemplate(null);
            setFormData({
                name: "",
                description: "",
                layout: "classic",
                background_color: "#ffffff",
                border_color: "#000000",
                border_style: "double",
                title_text: "Certificate of Completion",
                title_font: "Georgia",
                title_color: "#1a1a1a",
                body_font: "Arial",
                body_color: "#333333",
                is_default: false,
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast({
                title: "Missing Information",
                description: "Please provide a template name",
                variant: "destructive",
            });
            return;
        }

        try {
            setSubmitting(true);
            const template_config = {
                layout: formData.layout,
                background_color: formData.background_color,
                border_color: formData.border_color,
                border_style: formData.border_style,
                title_text: formData.title_text,
                title_font: formData.title_font,
                title_color: formData.title_color,
                body_font: formData.body_font,
                body_color: formData.body_color,
            };

            if (editingTemplate) {
                await CertificateTemplates.update(editingTemplate.id, {
                    name: formData.name,
                    description: formData.description,
                    template_config,
                    is_default: formData.is_default,
                });
                toast({
                    title: "Template Updated",
                    description: "Certificate template has been updated successfully",
                });
            } else {
                await CertificateTemplates.create({
                    name: formData.name,
                    description: formData.description,
                    template_config,
                    is_default: formData.is_default,
                });
                toast({
                    title: "Template Created",
                    description: "New certificate template has been created successfully",
                });
            }

            setDialogOpen(false);
            loadTemplates();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save template",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;

        try {
            await CertificateTemplates.delete(id);
            toast({
                title: "Template Deleted",
                description: "Certificate template has been deleted",
            });
            loadTemplates();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete template",
                variant: "destructive",
            });
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await CertificateTemplates.setDefault(id);
            toast({
                title: "Default Set",
                description: "Template has been set as default",
            });
            loadTemplates();
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to set default template",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <AdminDashboardLayout title="Certificate Templates" subtitle="Create and manage certificate templates">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout title="Certificate Templates" subtitle="Create and manage certificate templates">
            <div className="space-y-6">
                {/* Header with Create Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {templates.length} template{templates.length !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => handleOpenDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Template
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingTemplate ? "Edit Template" : "Create Certificate Template"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingTemplate
                                        ? "Update the certificate template configuration"
                                        : "Create a new certificate template for your courses"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Classic Certificate"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Optional description"
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="layout">Layout</Label>
                                        <Select value={formData.layout} onValueChange={(value) => setFormData({ ...formData, layout: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="classic">Classic</SelectItem>
                                                <SelectItem value="modern">Modern</SelectItem>
                                                <SelectItem value="elegant">Elegant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="border_style">Border Style</Label>
                                        <Select value={formData.border_style} onValueChange={(value) => setFormData({ ...formData, border_style: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="solid">Solid</SelectItem>
                                                <SelectItem value="double">Double</SelectItem>
                                                <SelectItem value="dashed">Dashed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bg_color">Background</Label>
                                        <Input
                                            id="bg_color"
                                            type="color"
                                            value={formData.background_color}
                                            onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="border_color">Border</Label>
                                        <Input
                                            id="border_color"
                                            type="color"
                                            value={formData.border_color}
                                            onChange={(e) => setFormData({ ...formData, border_color: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="title_color">Title</Label>
                                        <Input
                                            id="title_color"
                                            type="color"
                                            value={formData.title_color}
                                            onChange={(e) => setFormData({ ...formData, title_color: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title_text">Title Text</Label>
                                    <Input
                                        id="title_text"
                                        value={formData.title_text}
                                        onChange={(e) => setFormData({ ...formData, title_text: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : editingTemplate ? (
                                        "Update Template"
                                    ) : (
                                        "Create Template"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Templates Grid */}
                {templates.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Create your first certificate template to get started
                            </p>
                            <Button onClick={() => handleOpenDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Template
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates.map((template) => (
                            <Card key={template.id} className={template.is_default ? "border-primary" : ""}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-base">{template.name}</CardTitle>
                                                {template.is_default && (
                                                    <Badge className="bg-primary/10 text-primary">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            {template.description && (
                                                <CardDescription className="mt-1 text-xs">
                                                    {template.description}
                                                </CardDescription>
                                            )}
                                        </div>
                                        <Award className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex justify-between">
                                            <span>Layout:</span>
                                            <span className="font-medium capitalize">
                                                {template.template_config.layout || "Classic"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Used by:</span>
                                            <span className="font-medium">
                                                {template._count?.courses || 0} course{template._count?.courses !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleOpenDialog(template)}
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        {!template.is_default && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetDefault(template.id)}
                                            >
                                                <Star className="h-3 w-3" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(template.id)}
                                            disabled={template._count?.courses && template._count.courses > 0}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}

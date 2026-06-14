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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Plus,
    Award,
    Edit,
    Trash2,
    Star,
    Loader2,
    FileText,
    Maximize2,
    Save,
    Undo2,
    Redo2,
    Minus
} from "lucide-react";
import { CertificateTemplates, Settings } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useHistory } from "@/hooks/useHistory";
import { CertificateTemplateConfig, CertificateElement } from "@/types/certificate";
import { CertificateCanvas } from "@/components/certificates/builder/CertificateCanvas";
import { CertificateSidebar } from "@/components/certificates/builder/CertificateSidebar";
import { CertificatePropertiesBar } from "@/components/certificates/builder/CertificatePropertiesBar";
import { COURSERA_TEMPLATE, UDEMY_TEMPLATE, CISCO_TEMPLATE } from "@/lib/certificate-templates";

interface CertificateTemplate {
    id: string;
    name: string;
    description?: string;
    is_default: boolean;
    template_config: CertificateTemplateConfig;
    preview_image_url?: string;
    created_at: string;
    _count?: {
        courses: number;
    };
}

const DEFAULT_CONFIG: CertificateTemplateConfig = {
    canvas: {
        width: 1122,
        height: 794,
        backgroundColor: '#ffffff',
        orientation: 'landscape',
    },
    elements: [
        {
            id: 'title',
            type: 'text',
            content: 'CERTIFICATE OF COMPLETION',
            x: 400,
            y: 100,
            style: {
                fontFamily: 'serif',
                fontSize: 48,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#1a1a1a',
            }
        },
        {
            id: 'subtitle',
            type: 'text',
            content: 'This is awarded to',
            x: 400,
            y: 180,
            style: {
                fontFamily: 'sans-serif',
                fontSize: 18,
                color: '#666666',
                textAlign: 'center',
            }
        },
        {
            id: 'student-name',
            type: 'variable',
            content: '{student_name}',
            x: 400,
            y: 240,
            style: {
                fontFamily: 'serif',
                fontSize: 36,
                fontWeight: 'bold',
                color: '#d4af37',
                textAlign: 'center',
            }
        }
    ]
};

const COURSERA_TEMPLATE_CONFIG: CertificateTemplateConfig = {
    canvas: {
        width: 1000,
        height: 700,
        backgroundColor: '#ffffff',
        orientation: 'landscape',
    },
    elements: [
        {
            id: 'border-outer',
            type: 'shape',
            content: '',
            x: 20,
            y: 20,
            width: 960,
            height: 660,
            shapeType: 'rectangle',
            zIndex: 0,
            style: {
                borderColor: '#1a365d',
                borderWidth: 4,
            }
        },
        {
            id: 'border-inner',
            type: 'shape',
            content: '',
            x: 30,
            y: 30,
            width: 940,
            height: 640,
            shapeType: 'rectangle',
            zIndex: 1,
            style: {
                borderColor: '#cbd5e1',
                borderWidth: 1,
            }
        },
        {
            id: 'coursera-title',
            type: 'text',
            content: 'CERTIFICATE\nOF COMPLETION',
            x: 100,
            y: 100,
            width: 800,
            height: 100,
            zIndex: 2,
            style: {
                fontFamily: 'serif',
                fontSize: 48,
                color: '#1a365d',
                textAlign: 'left',
                fontWeight: 'bold',
                lineHeight: 1.2
            }
        },
        {
            id: 'coursera-student-name',
            type: 'variable',
            content: '{student_name}',
            x: 100,
            y: 250,
            width: 800,
            height: 60,
            zIndex: 2,
            style: {
                fontFamily: 'sans-serif',
                fontSize: 42,
                color: '#000000',
                textAlign: 'left',
                fontWeight: 'normal'
            }
        },
        {
            id: 'coursera-desc',
            type: 'text',
            content: 'has successfully completed the online, non-credit course',
            x: 100,
            y: 330,
            width: 800,
            height: 30,
            zIndex: 2,
            style: {
                fontFamily: 'sans-serif',
                fontSize: 16,
                color: '#475569',
                textAlign: 'left',
            }
        },
        {
            id: 'coursera-course-name',
            type: 'variable',
            content: '{course_name}',
            x: 100,
            y: 380,
            width: 800,
            height: 50,
            zIndex: 2,
            style: {
                fontFamily: 'serif',
                fontSize: 28,
                color: '#000000',
                textAlign: 'left',
                fontWeight: 'bold'
            }
        },
        {
            id: 'coursera-instructor',
            type: 'variable',
            content: '{instructor_name}',
            x: 100,
            y: 480,
            width: 300,
            height: 30,
            zIndex: 2,
            style: {
                fontFamily: 'sans-serif',
                fontSize: 18,
                color: '#1a365d',
                textAlign: 'left',
                fontWeight: 'bold'
            }
        },
        {
            id: 'coursera-instructor-title',
            type: 'text',
            content: 'Instructor',
            x: 100,
            y: 520,
            width: 300,
            height: 30,
            zIndex: 2,
            style: {
                fontFamily: 'sans-serif',
                fontSize: 14,
                color: '#64748b',
                textAlign: 'left',
            }
        },
        {
            id: 'coursera-qr',
            type: 'qrcode',
            content: 'https://example.com/verify/{certificate_id}',
            x: 750,
            y: 460,
            width: 100,
            height: 100,
            zIndex: 2,
            style: {}
        },
        {
            id: 'coursera-issue-date',
            type: 'variable',
            content: 'Issued: {issue_date}',
            x: 700,
            y: 580,
            width: 200,
            height: 30,
            zIndex: 2,
            style: {
                fontFamily: 'sans-serif',
                fontSize: 12,
                color: '#64748b',
                textAlign: 'center',
            }
        }
    ]
};

export default function CertificateTemplatesPage() {
    const { toast } = useToast();
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Builder State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { state: config, setState: setConfig, undo, redo, canUndo, canRedo, reset: resetHistory } = useHistory<CertificateTemplateConfig>(DEFAULT_CONFIG);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(0.5);
    const [platformName, setPlatformName] = useState("Institution Name");

    useEffect(() => {
        loadTemplates();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        if (!dialogOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Undo/Redo
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
            // Delete selected element
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedElementId && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handleDeleteElement(selectedElementId);
                }
            }
            // Arrow keys to nudge position
            else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                if (selectedElementId && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    const selectedElement = config.elements.find(el => el.id === selectedElementId);
                    if (selectedElement) {
                        const nudgeAmount = e.shiftKey ? 10 : 1;
                        let deltaX = 0, deltaY = 0;
                        if (e.key === 'ArrowLeft') deltaX = -nudgeAmount;
                        if (e.key === 'ArrowRight') deltaX = nudgeAmount;
                        if (e.key === 'ArrowUp') deltaY = -nudgeAmount;
                        if (e.key === 'ArrowDown') deltaY = nudgeAmount;

                        handleUpdateElement(selectedElementId, {
                            x: selectedElement.x + deltaX,
                            y: selectedElement.y + deltaY,
                        });
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dialogOpen, selectedElementId, config.elements, undo, redo]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const [data, settings] = await Promise.all([
                CertificateTemplates.getAll(),
                Settings.getPlatformSettings().catch(() => null)
            ]);
            
            if (settings?.lms_name) {
                setPlatformName(settings.lms_name);
            }
            
            // Ensure config matches type, or fallback
            const typoFixData = data.map((t: any) => ({
                ...t,
                template_config: t.template_config?.elements ? t.template_config : DEFAULT_CONFIG
            }));
            setTemplates(typoFixData);
        } catch (error: any) {
            console.error("Failed to load templates", error);
            // Don't show toast on initial load error to avoid spam if backend is weird
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (template?: CertificateTemplate) => {
        if (template) {
            setEditingTemplate(template);
            setName(template.name);
            setDescription(template.description || "");
            resetHistory(template.template_config || DEFAULT_CONFIG);
        } else {
            setEditingTemplate(null);
            setName("");
            setDescription("");
            resetHistory(DEFAULT_CONFIG);
        }
        setSelectedElementId(null);
        setDialogOpen(true);
    };

    const handleUpdateCanvasBackground = (color: string) => {
        setConfig(prev => ({
            ...prev,
            canvas: { ...prev.canvas, backgroundColor: color }
        }));
    };

    // Helper to read file as base64 (since we don't have a direct file upload endpoint for this yet)
    // In a real app, you'd upload -> get URL. For now, data URI is fine for MVP or small images.
    const handleUploadBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setConfig(prev => ({
                    ...prev,
                    canvas: { ...prev.canvas, backgroundImage: event.target?.result as string }
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveBackground = () => {
        setConfig(prev => ({
            ...prev,
            canvas: { ...prev.canvas, backgroundImage: undefined }
        }));
    };

    const handleAddText = (text: string) => {
        const newElement: CertificateElement = {
            id: crypto.randomUUID(),
            type: text.startsWith('{') ? 'variable' : 'text',
            content: text,
            x: config.canvas.width / 2,
            y: config.canvas.height / 2,
            width: 300,
            height: 50,
            zIndex: 10,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 24,
                color: '#000000',
                textAlign: 'center',
                fontWeight: 'normal',
                fontStyle: 'normal'
            }
        };
        setConfig(prev => ({
            ...prev,
            elements: [...prev.elements, newElement]
        }));
        setSelectedElementId(newElement.id);
    };

    const handleAddImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const newElement: CertificateElement = {
                    id: crypto.randomUUID(),
                    type: 'image',
                    content: event.target.result as string,
                    x: config.canvas.width / 2,
                    y: config.canvas.height / 2,
                    width: 150,
                    height: 150,
                    style: {
                        opacity: 1,
                    }
                };
                setConfig(prev => ({
                    ...prev,
                    elements: [...prev.elements, newElement]
                }));
                setSelectedElementId(newElement.id);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddQrCode = () => {
        const newElement: CertificateElement = {
            id: crypto.randomUUID(),
            type: 'qrcode',
            content: 'https://example.com/verify/{certificate_id}', // Default placeholder
            x: config.canvas.width / 2,
            y: config.canvas.height / 2,
            width: 100,
            height: 100,
            zIndex: 10,
            style: {
                opacity: 1,
            }
        };
        setConfig(prev => ({
            ...prev,
            elements: [...prev.elements, newElement]
        }));
        setSelectedElementId(newElement.id);
    };

    const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'line') => {
        const newElement: CertificateElement = {
            id: crypto.randomUUID(),
            type: 'shape',
            content: '',
            shapeType,
            x: config.canvas.width / 2,
            y: config.canvas.height / 2,
            width: shapeType === 'line' ? 200 : 100,
            height: shapeType === 'line' ? 4 : 100,
            zIndex: 1,
            style: {
                backgroundColor: shapeType === 'line' ? '#000000' : '#e2e8f0',
                borderColor: '#000000',
                borderWidth: shapeType === 'line' ? 0 : 2,
            }
        };
        setConfig(prev => ({
            ...prev,
            elements: [...prev.elements, newElement]
        }));
        setSelectedElementId(newElement.id);
    };

    const handleUpdateCanvasBorder = (updates: { borderWidth?: number, borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none', borderColor?: string }) => {
        setConfig(prev => ({
            ...prev,
            canvas: { ...prev.canvas, ...updates }
        }));
    };

    const handleLoadTemplate = (templateId: string) => {
        if (!confirm("This will overwrite your current design. Continue?")) return;
        
        let newConfig: CertificateTemplateConfig;
        switch (templateId) {
            case 'coursera':
                newConfig = JSON.parse(JSON.stringify(COURSERA_TEMPLATE));
                break;
            case 'udemy':
                newConfig = JSON.parse(JSON.stringify(UDEMY_TEMPLATE));
                break;
            case 'cisco':
                newConfig = JSON.parse(JSON.stringify(CISCO_TEMPLATE));
                break;
            default:
                return;
        }

        // Replace 'Institution Name' with actual platform name
        newConfig.elements = newConfig.elements.map(el => {
            if (el.type === 'text' && el.content === 'Institution Name') {
                return { ...el, content: platformName || 'Institution Name' };
            }
            return el;
        });

        setConfig(newConfig);
    };

    const handleDuplicateElement = (id: string) => {
        const element = config.elements.find(el => el.id === id);
        if (!element) return;
        const newElement = {
            ...element,
            id: crypto.randomUUID(),
            x: element.x + 20,
            y: element.y + 20,
        };
        setConfig(prev => ({
            ...prev,
            elements: [...prev.elements, newElement]
        }));
        setSelectedElementId(newElement.id);
    };

    const handleUpdateElement = (id: string, updates: Partial<CertificateElement>) => {
        setConfig(prev => ({
            ...prev,
            elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
        }));
    };

    const handleDeleteElement = (id: string) => {
        setConfig(prev => ({
            ...prev,
            elements: prev.elements.filter(el => el.id !== id)
        }));
        setSelectedElementId(null);
    };

    const handleSubmit = async () => {
        if (!name) {
            toast({
                title: "Missing Information",
                description: "Please provide a template name",
                variant: "destructive",
            });
            return;
        }

        try {
            setSubmitting(true);
            const templateData = {
                name,
                description,
                template_config: config,
                is_default: false, // Default handling separate
            };

            if (editingTemplate) {
                await CertificateTemplates.update(editingTemplate.id, templateData);
                toast({ title: "Template Updated", description: "Certificate template updated successfully" });
            } else {
                await CertificateTemplates.create(templateData);
                toast({ title: "Template Created", description: "New certificate template created successfully" });
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
            toast({ title: "Template Deleted", description: "Certificate template has been deleted" });
            loadTemplates();
        } catch (error: any) {
            toast({ title: "Error", variant: "destructive", description: "Failed to delete template" });
        }
    };

    const selectedElement = config.elements.find(el => el.id === selectedElementId) || null;

    if (loading && templates.length === 0) {
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
            <div className="p-3 md:p-0 space-y-6">
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
                        <DialogContent className="max-w-[95vw] w-full lg:max-w-[1400px] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">

                            {/* Toolbar Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-3 border-b bg-gray-50/50 gap-4">
                                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                                    <h2 className="text-sm md:text-lg font-semibold shrink-0">
                                        {editingTemplate ? "Edit Template" : "New Template"}
                                    </h2>
                                    <div className="h-6 w-px bg-gray-200" />
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Template Name"
                                        className="h-8 w-full md:w-64 bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                                    {/* Undo/Redo */}
                                    <div className="flex items-center gap-1 mr-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={undo}
                                            disabled={!canUndo}
                                            title="Undo (Cmd/Ctrl+Z)"
                                        >
                                            <Undo2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={redo}
                                            disabled={!canRedo}
                                            title="Redo (Cmd/Ctrl+Y)"
                                        >
                                            <Redo2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-1 mr-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                                            title="Zoom Out"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                                            title="Zoom In"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="h-6 w-px bg-gray-200" />
                                    <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} disabled={submitting}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit} size="sm" disabled={submitting} className="gap-2">
                                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        <Save className="h-4 w-4" />
                                        Save
                                    </Button>
                                </div>
                            </div>

                            {/* Top Context Menu (Fixed Height to prevent layout shift) */}
                            <div className="min-h-[56px] border-b bg-white shrink-0 flex items-center">
                                {selectedElement ? (
                                    <CertificatePropertiesBar
                                        selectedElement={selectedElement}
                                        onUpdateElement={handleUpdateElement}
                                        onDeleteElement={handleDeleteElement}
                                        onDuplicateElement={handleDuplicateElement}
                                    />
                                ) : (
                                    <div className="text-sm text-muted-foreground px-4">
                                        Select an element on the canvas to view its properties
                                    </div>
                                )}
                            </div>
                            {/* Builder Area */}
                            <div className="flex-1 flex flex-row overflow-hidden bg-gray-100">
                                {/* Left Sidebar Controls */}
                                <CertificateSidebar
                                    onAddText={handleAddText}
                                    onAddImage={handleAddImage}
                                    onAddQrCode={handleAddQrCode}
                                    onUploadBackground={handleUploadBackground}
                                    onRemoveBackground={handleRemoveBackground}
                                    canvasBackgroundColor={config.canvas.backgroundColor}
                                    onUpdateCanvasBackground={handleUpdateCanvasBackground}
                                    onAddShape={handleAddShape}
                                    canvasBorderWidth={config.canvas.borderWidth}
                                    canvasBorderStyle={config.canvas.borderStyle}
                                    canvasBorderColor={config.canvas.borderColor}
                                    onUpdateCanvasBorder={handleUpdateCanvasBorder}
                                    onLoadTemplate={handleLoadTemplate}
                                />

                                {/* Main Canvas Area */}
                                <div className="flex-1 overflow-auto flex items-start md:items-center justify-center p-4 md:p-8 relative min-h-[300px]">
                                    <div className="shadow-2xl ring-1 ring-black/5">
                                        <CertificateCanvas
                                            config={config}
                                            selectedElementId={selectedElementId}
                                            onSelectElement={setSelectedElementId}
                                            onUpdateElement={handleUpdateElement}
                                            zoom={zoom}
                                        />
                                    </div>
                                </div>
                            </div>

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
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {templates.map((template) => (
                            <Card key={template.id} className={template.is_default ? "border-primary" : ""}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-base truncate">{template.name}</CardTitle>
                                                {template.is_default && (
                                                    <Badge className="bg-primary/10 text-primary">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="mt-1 text-xs truncate">
                                                {template.description || "No description"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Mini Preview using simple scaling of the Canvas logic */}
                                    <div className="w-full aspect-[4/3] rounded border bg-gray-50 relative overflow-hidden pointer-events-none"
                                         style={{ 
                                            backgroundColor: template.template_config?.canvas?.backgroundColor || '#fff',
                                         }}
                                    >
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform scale-[0.25] sm:scale-[0.3] origin-center">
                                            <CertificateCanvas
                                                config={template.template_config || DEFAULT_CONFIG}
                                                selectedElementId={null}
                                                onSelectElement={() => {}}
                                                onUpdateElement={() => {}}
                                                zoom={1}
                                            />
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


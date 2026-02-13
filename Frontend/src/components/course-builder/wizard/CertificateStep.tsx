import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Award, Check, Loader2, LayoutTemplate, Type, Eye, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface CertificateStepProps {
    courseId: string;
    initialData?: any;
    onSave: (data: any) => Promise<void>;
}

const TEMPLATES = [
    { id: 'simple-classic', name: 'Simple Classic', bg: 'bg-white border-4 border-double border-gray-200', text: 'text-gray-900', font: 'serif' },
    { id: 'modern-dark', name: 'Modern Dark', bg: 'bg-slate-900 text-white border border-slate-700', text: 'text-white', font: 'sans' },
    { id: 'elegance-gold', name: 'Elegance Gold', bg: 'bg-[#fffbf0] border-8 border-[#d4af37]', text: 'text-slate-800', font: 'serif' },
    { id: 'tech-blue', name: 'Tech Blue', bg: 'bg-blue-50 border-y-8 border-blue-600', text: 'text-blue-900', font: 'sans' },
];

export function CertificateStep({ initialData, onSave }: CertificateStepProps) {
    const [enabled, setEnabled] = useState(initialData?.certificate_enabled || false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(initialData?.certificate_template_id || 'simple-classic');
    const [title, setTitle] = useState(initialData?.certificate_title || 'Certificate of Completion');
    const [description, setDescription] = useState(initialData?.certificate_description || 'This certifies that [Student Name] has successfully completed the course.');
    const [saving, setSaving] = useState(false);

    const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

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

    return (
        <div className="space-y-8 max-w-6xl mx-auto">

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

                    {/* Left Column: Editor */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-lg">Customization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Tabs defaultValue="template" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="template">Template</TabsTrigger>
                                        <TabsTrigger value="content">Content</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="template" className="mt-4 space-y-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {TEMPLATES.map((template) => (
                                                <div
                                                    key={template.id}
                                                    onClick={() => setSelectedTemplateId(template.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                        selectedTemplateId === template.id
                                                            ? "border-purple-600 bg-purple-50 ring-1 ring-purple-200"
                                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <div className={cn("w-12 h-8 rounded border text-[6px] p-1 overflow-hidden", template.bg, template.text)}>
                                                        <div className="w-full text-center font-bold">CERTIFICATE</div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">{template.name}</div>
                                                    </div>
                                                    {selectedTemplateId === template.id && (
                                                        <Check className="h-4 w-4 text-purple-600" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="content" className="mt-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Heading</Label>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="bg-white/70"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Body Text</Label>
                                            <Textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="h-32 bg-white/70 resize-none"
                                            />
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => setDescription(d => d + ' [Student Name] ')}>[Student Name]</Badge>
                                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => setDescription(d => d + ' [Course Name] ')}>[Course Name]</Badge>
                                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => setDescription(d => d + ' [Date] ')}>[Date]</Badge>
                                            </div>
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
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-gray-500" /> Live Preview
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
                                    <Download className="h-3 w-3 mr-1" /> Download Sample
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full aspect-[1.414/1] bg-gray-100 rounded-lg overflow-hidden shadow-inner flex items-center justify-center p-8">
                                    {/* Certificate Canvas */}
                                    <div className={cn(
                                        "w-full h-full shadow-2xl flex flex-col items-center justify-center p-12 text-center relative",
                                        activeTemplate.bg,
                                        activeTemplate.text,
                                        activeTemplate.font === 'serif' ? 'font-serif' : 'font-sans'
                                    )}>
                                        {/* Decorative Elements based on template */}
                                        {activeTemplate.id === 'elegance-gold' && (
                                            <div className="absolute inset-4 border border-[#d4af37] opacity-50" />
                                        )}

                                        <div className="space-y-2 mb-8">
                                            <Award className={cn("mx-auto h-16 w-16 opacity-80 mb-4", activeTemplate.text)} />
                                            <h1 className="text-4xl font-bold uppercase tracking-widest">{title}</h1>
                                            <div className="w-24 h-1 bg-current mx-auto opacity-30 my-4" />
                                        </div>

                                        <div className="space-y-6 max-w-2xl">
                                            <p className="text-lg opacity-80">PROUDLY PRESENTED TO</p>
                                            <h2 className="text-5xl font-script italic py-4 text-purple-600 font-bold">John Doe</h2>
                                            <p className="text-lg leading-relaxed opacity-90">
                                                {description
                                                    .replace('[Student Name]', 'John Doe')
                                                    .replace('[Course Name]', 'Advanced React Patterns')
                                                    .replace('[Date]', new Date().toLocaleDateString())
                                                }
                                            </p>
                                        </div>

                                        <div className="mt-16 flex justify-between w-full px-16">
                                            <div className="text-center">
                                                <div className="border-b border-current w-48 mb-2 opacity-50" />
                                                <p className="text-sm font-bold uppercase opacity-70">Instructor</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-current w-48 mb-2 opacity-50" />
                                                <p className="text-sm font-bold uppercase opacity-70">Date Issued</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-6 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-end gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-20 mt-8">
                <Button variant="outline" onClick={() => { }} className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300 px-8"
                >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Certificate
                </Button>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/editors/RichTextEditor';
import { Video, FileText, Link as LinkIcon, Type, Clock, CheckCircle2, Eye, Save, X, UploadCloud, Loader2 } from 'lucide-react';
import type { SectionItem, LectureContentType } from '@/types/courseBuilder';

interface LessonEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: SectionItem;
    onSave: (itemId: string, updates: Partial<SectionItem>) => Promise<void>;
    onSaveContent?: (itemId: string, content: { type: LectureContentType; content: string }) => Promise<void>;
    loading?: boolean;
}

export function LessonEditor({
    open,
    onOpenChange,
    item,
    onSave,
    onSaveContent,
    loading
}: LessonEditorProps) {
    const [title, setTitle] = useState(item.title);
    const [duration, setDuration] = useState(item.duration_minutes?.toString() || '');
    const [isPreview, setIsPreview] = useState(item.is_preview || false);
    const [isMandatory, setIsMandatory] = useState(item.is_mandatory || false);

    // Content State
    const [contentType, setContentType] = useState<LectureContentType>('TEXT');
    const [textContent, setTextContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        if (open) {
            setTitle(item.title);
            setDuration(item.duration_minutes?.toString() || '');
            setIsPreview(item.is_preview || false);
            setIsMandatory(item.is_mandatory || false);
            // In a real app, fetch content here
        }
    }, [open, item]);

    const handleSave = async () => {
        await onSave(item.id, {
            title,
            duration_minutes: parseInt(duration) || 0,
            is_preview: isPreview,
            is_mandatory: isMandatory,
        });

        if (onSaveContent && item.type === 'LECTURE') {
            await onSaveContent(item.id, {
                type: contentType,
                content: contentType === 'VIDEO' ? videoUrl : textContent
            });
        }

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Edit Lesson: {item.title}</DialogTitle>
                    <DialogDescription>
                        Configure lesson details and content.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Lesson Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                            <Switch id="preview" checked={isPreview} onCheckedChange={setIsPreview} />
                            <Label htmlFor="preview" className="flex items-center gap-1 cursor-pointer">
                                <Eye className="w-4 h-4" /> Free Preview
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="mandatory" checked={isMandatory} onCheckedChange={setIsMandatory} />
                            <Label htmlFor="mandatory" className="flex items-center gap-1 cursor-pointer">
                                <CheckCircle2 className="w-4 h-4" /> Mandatory
                            </Label>
                        </div>
                    </div>

                    {/* Content Editor */}
                    {item.type === 'LECTURE' && (
                        <div className="border rounded-xl p-4 bg-slate-50/50">
                            <Tabs value={contentType} onValueChange={(v) => setContentType(v as LectureContentType)} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-4">
                                    <TabsTrigger value="TEXT"><Type className="h-4 w-4 mr-2" />Text & Media</TabsTrigger>
                                    <TabsTrigger value="VIDEO"><Video className="h-4 w-4 mr-2" />Video Source</TabsTrigger>
                                    <TabsTrigger value="FILE"><FileText className="h-4 w-4 mr-2" />Attachments</TabsTrigger>
                                </TabsList>

                                <TabsContent value="TEXT" className="mt-0">
                                    <RichTextEditor
                                        content={textContent}
                                        onChange={setTextContent}
                                        placeholder="Add lesson content..."
                                    />
                                </TabsContent>

                                <TabsContent value="VIDEO" className="mt-0 space-y-4">
                                    <div className="space-y-2">
                                        <Label>Video URL</Label>
                                        <Input
                                            placeholder="YouTube, Vimeo, or direct link..."
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium">Upload Video</h3>
                                        <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="FILE" className="mt-0">
                                    <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium">Upload Attachments</h3>
                                        <p className="text-sm text-muted-foreground">PDFs, Docs, Zips</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-slate-50/50">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

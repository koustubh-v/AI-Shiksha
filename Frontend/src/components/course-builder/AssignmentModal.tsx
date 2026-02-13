import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { SectionItem } from '@/types/courseBuilder';
import { RichTextEditor } from '@/components/editors/RichTextEditor';

interface AssignmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: SectionItem;
    onSave: (itemId: string, updates: Partial<SectionItem>) => Promise<void>;
}

export function AssignmentModal({ open, onOpenChange, item, onSave }: AssignmentModalProps) {
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState(item.title);
    const [description, setDescription] = useState(item.description || '');

    // Assignment specific settings
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const [maxFileSize, setMaxFileSize] = useState(10);
    const [allowedTypes, setAllowedTypes] = useState('pdf, docx, zip');

    useEffect(() => {
        if (open) {
            setTitle(item.title);
            setDescription(item.description || '');
            // Load backend details
        }
    }, [open, item]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await onSave(item.id, {
                title,
                description,
                // In a real app, save assignment specific fields to Assignment table via API
            });
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Assignment: {title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Instructions / Description</Label>
                        <RichTextEditor
                            content={description}
                            onChange={setDescription}
                            placeholder="Describe the assignment task..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 flex flex-col">
                            <Label>Deadline</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !deadline && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={deadline}
                                        onSelect={setDeadline}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Max File Size (MB)</Label>
                            <Input
                                type="number"
                                value={maxFileSize}
                                onChange={(e) => setMaxFileSize(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Allowed File Types</Label>
                            <Input
                                value={allowedTypes}
                                onChange={(e) => setAllowedTypes(e.target.value)}
                                placeholder="pdf, docx, zip"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

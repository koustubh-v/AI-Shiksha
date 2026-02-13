import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DocumentUpload } from './FileUpload';
import type { AssignmentSubmissionType } from '@/types/courseBuilder';

interface AssignmentEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemTitle: string;
    assignmentId?: string;
    initialData?: {
        instructions?: string;
        submission_type?: AssignmentSubmissionType;
        max_score?: number;
        deadline?: string;
        allow_late_submission?: boolean;
        late_penalty_percentage?: number;
        rubric?: any;
        enable_peer_review?: boolean;
    };
    onSave: (assignmentData: any) => Promise<void>;
    saving?: boolean;
}

export function AssignmentEditor({
    open,
    onOpenChange,
    itemTitle,
    assignmentId,
    initialData,
    onSave,
    saving,
}: AssignmentEditorProps) {
    const [instructions, setInstructions] = useState(initialData?.instructions || '');
    const [submissionType, setSubmissionType] = useState<AssignmentSubmissionType>(
        initialData?.submission_type || 'FILE'
    );
    const [maxScore, setMaxScore] = useState(initialData?.max_score || 100);
    const [deadline, setDeadline] = useState(
        initialData?.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : ''
    );
    const [allowLate, setAllowLate] = useState(initialData?.allow_late_submission ?? true);
    const [latePenalty, setLatePenalty] = useState(initialData?.late_penalty_percentage || 10);
    const [enablePeerReview, setEnablePeerReview] = useState(
        initialData?.enable_peer_review ?? false
    );
    const [rubricText, setRubricText] = useState(
        initialData?.rubric ? JSON.stringify(initialData.rubric, null, 2) : ''
    );

    const handleSave = async () => {
        let rubric = null;
        try {
            if (rubricText.trim()) {
                rubric = JSON.parse(rubricText);
            }
        } catch (e) {
            console.error('Invalid rubric JSON');
        }

        const assignmentData = {
            instructions,
            submission_type: submissionType,
            max_score: maxScore,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            allow_late_submission: allowLate,
            late_penalty_percentage: allowLate ? latePenalty : undefined,
            rubric,
            enable_peer_review: enablePeerReview,
        };

        await onSave(assignmentData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Assignment</DialogTitle>
                    <DialogDescription>{itemTitle}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Instructions */}
                    <div className="space-y-2">
                        <Label>Instructions *</Label>
                        <Textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Describe what students need to do..."
                            rows={4}
                        />
                    </div>

                    {/* Basic Settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Submission Type</Label>
                            <Select
                                value={submissionType}
                                onValueChange={(v) => setSubmissionType(v as AssignmentSubmissionType)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FILE">File Upload</SelectItem>
                                    <SelectItem value="CODE">Code Submission</SelectItem>
                                    <SelectItem value="TEXT">Text Submission</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Max Score</Label>
                            <Input
                                type="number"
                                min={1}
                                value={maxScore}
                                onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label>Deadline (Optional)</Label>
                            <Input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Late Submission */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="allow-late">Allow Late Submissions</Label>
                            <Switch
                                id="allow-late"
                                checked={allowLate}
                                onCheckedChange={setAllowLate}
                            />
                        </div>

                        {allowLate && (
                            <div className="space-y-2">
                                <Label>Late Penalty (%)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={latePenalty}
                                    onChange={(e) => setLatePenalty(parseInt(e.target.value) || 10)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Percentage deducted from score for late submissions
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Peer Review */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="peer-review">Enable Peer Review</Label>
                            <p className="text-sm text-muted-foreground">
                                Students review each other's work
                            </p>
                        </div>
                        <Switch
                            id="peer-review"
                            checked={enablePeerReview}
                            onCheckedChange={setEnablePeerReview}
                        />
                    </div>

                    {/* Grading Rubric */}
                    <div className="space-y-2">
                        <Label>Grading Rubric (JSON, Optional)</Label>
                        <Textarea
                            value={rubricText}
                            onChange={(e) => setRubricText(e.target.value)}
                            placeholder='{"criteria": ["Quality", "Completeness", "Creativity"], "max_points": [40, 40, 20]}'
                            rows={4}
                            className="font-mono text-sm"
                        />
                        <p className="text-sm text-muted-foreground">
                            Define grading criteria as JSON
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || !instructions.trim()}>
                        {saving ? 'Saving...' : 'Save Assignment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

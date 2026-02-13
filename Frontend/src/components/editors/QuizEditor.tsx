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
import { Switch } from '@/components/ui/switch';
import { QuizBuilder } from './QuizBuilder';
import { Separator } from '@/components/ui/separator';

interface QuizEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemTitle: string;
    quizId?: string;
    initialData?: {
        time_limit_minutes?: number;
        passing_score?: number;
        max_attempts?: number;
        show_correct_answers?: boolean;
        randomize_questions?: boolean;
        questions?: any[];
    };
    onSave: (quizData: any, questions: any[]) => Promise<void>;
    saving?: boolean;
}

export function QuizEditor({
    open,
    onOpenChange,
    itemTitle,
    quizId,
    initialData,
    onSave,
    saving,
}: QuizEditorProps) {
    const [timeLimit, setTimeLimit] = useState(initialData?.time_limit_minutes || 30);
    const [passingScore, setPassingScore] = useState(initialData?.passing_score || 70);
    const [maxAttempts, setMaxAttempts] = useState(initialData?.max_attempts || 3);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(
        initialData?.show_correct_answers ?? true
    );
    const [randomizeQuestions, setRandomizeQuestions] = useState(
        initialData?.randomize_questions ?? false
    );
    const [questions, setQuestions] = useState<any[]>(initialData?.questions || []);

    const handleSaveQuestions = async (updatedQuestions: any[]) => {
        setQuestions(updatedQuestions);
    };

    const handleFinalSave = async () => {
        const quizData = {
            time_limit_minutes: timeLimit,
            passing_score: passingScore,
            max_attempts: maxAttempts,
            show_correct_answers: showCorrectAnswers,
            randomize_questions: randomizeQuestions,
        };

        await onSave(quizData, questions);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Quiz</DialogTitle>
                    <DialogDescription>{itemTitle}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Quiz Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quiz Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Time Limit (minutes)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Passing Score (%)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={passingScore}
                                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Attempts</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={maxAttempts}
                                    onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 3)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="show-correct">Show Correct Answers After Submission</Label>
                                <Switch
                                    id="show-correct"
                                    checked={showCorrectAnswers}
                                    onCheckedChange={setShowCorrectAnswers}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="randomize">Randomize Question Order</Label>
                                <Switch
                                    id="randomize"
                                    checked={randomizeQuestions}
                                    onCheckedChange={setRandomizeQuestions}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Quiz Builder */}
                    <QuizBuilder
                        quizId={quizId}
                        initialQuestions={questions}
                        onSave={handleSaveQuestions}
                        saving={false}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleFinalSave} disabled={saving || questions.length === 0}>
                        {saving ? 'Saving...' : 'Save Quiz'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

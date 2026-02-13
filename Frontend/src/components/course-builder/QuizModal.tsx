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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit2, ChevronLeft, Save, Loader2, HelpCircle } from 'lucide-react';
import { Quizzes } from '@/lib/api'; // Assume api exists
import type { SectionItem } from '@/types/courseBuilder';

interface QuizModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: SectionItem; // The quiz item
    onSave: (itemId: string, updates: Partial<SectionItem>) => Promise<void>;
}

export function QuizModal({ open, onOpenChange, item, onSave }: QuizModalProps) {
    const [view, setView] = useState<'SETTINGS' | 'QUESTIONS' | 'EDIT_QUESTION'>('SETTINGS');
    const [loading, setLoading] = useState(false);

    // Quiz Basic Info
    const [title, setTitle] = useState(item.title);
    const [description, setDescription] = useState(item.description || '');

    // Quiz Settings (fetched from backend usually)
    const [settings, setSettings] = useState({
        passing_score: 70,
        time_limit_minutes: 0,
        attempts_allowed: 0,
        randomize_questions: false,
        show_answers: true,
        auto_grade: true,
    });

    // Questions State
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null); // For editing

    // Fetch quiz details on open
    useEffect(() => {
        if (open) {
            setTitle(item.title);
            setDescription(item.description || '');
            setView('SETTINGS');
            // Fetch quiz settings and questions
            // mock fetch for now or use api if ready
            // Quizzes.get(item.id).then(...)
        }
    }, [open, item]);

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await onSave(item.id, { title, description });
            // await Quizzes.update(item.id, settings); 
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveQuestion = async (q: any) => {
        // Save question to backend
        // const saved = await Quizzes.addQuestion(item.id, q);
        // setQuestions([...questions, saved]);
        // For now mock:
        if (currentQuestion?.id) {
            setQuestions(questions.map(qk => qk.id === currentQuestion.id ? { ...q, id: currentQuestion.id } : qk));
        } else {
            setQuestions([...questions, { ...q, id: Math.random().toString() }]);
        }
        setView('QUESTIONS');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        {view !== 'SETTINGS' && (
                            <Button variant="ghost" size="sm" onClick={() => setView('SETTINGS')}>
                                <ChevronLeft className="h-4 w-4" /> Back
                            </Button>
                        )}
                        <DialogTitle>
                            {view === 'SETTINGS' ? `Edit Quiz: ${title}` :
                                view === 'QUESTIONS' ? 'Manage Questions' : 'Edit Question'}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    {view === 'SETTINGS' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Quiz Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Time Limit (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={settings.time_limit_minutes}
                                        onChange={(e) => setSettings({ ...settings, time_limit_minutes: parseInt(e.target.value) || 0 })}
                                        placeholder="0 for unlimited"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 border p-4 rounded-lg">
                                    <h3 className="font-medium flex items-center gap-2"><SettingsIcon /> Grading</h3>
                                    <div className="flex items-center justify-between">
                                        <Label>Passing Score (%)</Label>
                                        <Input
                                            type="number"
                                            className="w-20"
                                            value={settings.passing_score}
                                            onChange={(e) => setSettings({ ...settings, passing_score: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Attempts Allowed</Label>
                                        <Input
                                            type="number"
                                            className="w-20"
                                            value={settings.attempts_allowed}
                                            onChange={(e) => setSettings({ ...settings, attempts_allowed: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 border p-4 rounded-lg">
                                    <h3 className="font-medium flex items-center gap-2"><SettingsIcon /> Options</h3>
                                    <div className="flex items-center justify-between">
                                        <Label>Randomize Questions</Label>
                                        <Switch
                                            checked={settings.randomize_questions}
                                            onCheckedChange={(c) => setSettings({ ...settings, randomize_questions: c })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Show Answers (Post-submit)</Label>
                                        <Switch
                                            checked={settings.show_answers}
                                            onCheckedChange={(c) => setSettings({ ...settings, show_answers: c })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button variant="secondary" className="w-full" onClick={() => setView('QUESTIONS')}>
                                    Manage Questions ({questions.length})
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'QUESTIONS' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Questions List</h3>
                                <Button onClick={() => { setCurrentQuestion(null); setView('EDIT_QUESTION'); }}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Question
                                </Button>
                            </div>
                            {questions.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                                    No questions added yet.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {questions.map((q, idx) => (
                                        <div key={q.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">Q{idx + 1}</span>
                                                <span className="font-medium">{q.question_text}</span>
                                                <span className="text-xs text-muted-foreground bg-slate-50 px-2 py-0.5 rounded border">{q.type}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => { setCurrentQuestion(q); setView('EDIT_QUESTION'); }}>
                                                    <Edit2 className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'EDIT_QUESTION' && (
                        <QuestionEditor
                            initialData={currentQuestion}
                            onSave={handleSaveQuestion}
                            onCancel={() => setView('QUESTIONS')}
                        />
                    )}
                </div>

                {view === 'SETTINGS' && (
                    <DialogFooter className="px-6 py-4 border-t bg-slate-50">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSaveSettings} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Quiz
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

function QuestionEditor({ initialData, onSave, onCancel }: { initialData: any, onSave: (data: any) => void, onCancel: () => void }) {
    const [questionText, setQuestionText] = useState(initialData?.question_text || '');
    const [type, setType] = useState(initialData?.type || 'MCQ');
    const [points, setPoints] = useState(initialData?.points || 1);
    // ... options logic would go here

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Question Type</Label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="MCQ">Multiple Choice</option>
                        <option value="TRUE_FALSE">True / False</option>
                        <option value="SHORT_ANSWER">Short Answer</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Points</Label>
                    <Input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value))} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Enter your question..." />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground text-center">
                    (Options editor placeholder - implement full options UI here)
                </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onSave({ question_text: questionText, type, points })}>Save Question</Button>
            </div>
        </div>
    );
}

function SettingsIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-2"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
    )
}

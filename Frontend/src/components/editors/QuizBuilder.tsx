import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Trash2,
    GripVertical,
    CheckCircle2,
    Circle,
    Save,
    Loader2,
} from 'lucide-react';
import type { QuizQuestionType } from '@/types/courseBuilder';
import { cn } from '@/lib/utils';

interface QuizQuestion {
    id?: string;
    type: QuizQuestionType;
    question_text: string;
    points: number;
    options?: string[];
    correct_answer?: string;
    correct_answers?: string[];
    explanation?: string;
    order_index: number;
}

interface QuizBuilderProps {
    quizId?: string;
    initialQuestions?: QuizQuestion[];
    onSave: (questions: QuizQuestion[]) => Promise<void>;
    saving?: boolean;
}

const questionTypeConfig: Record<QuizQuestionType, { label: string; description: string }> = {
    MCQ: { label: 'Multiple Choice (Single)', description: 'One correct answer from multiple options' },
    MULTIPLE: { label: 'Multiple Choice (Multiple)', description: 'Multiple correct answers' },
    TRUE_FALSE: { label: 'True/False', description: 'Simple true or false question' },
    FILL_BLANK: { label: 'Fill in the Blank', description: 'Type the correct answer' },
    DESCRIPTIVE: { label: 'Descriptive Answer', description: 'Long-form answer (manual grading)' },
    CODE: { label: 'Code Question', description: 'Programming question (manual grading)' },
};

export function QuizBuilder({ quizId, initialQuestions = [], onSave, saving }: QuizBuilderProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const addQuestion = (type: QuizQuestionType) => {
        const newQuestion: QuizQuestion = {
            type,
            question_text: '',
            points: 1,
            options: type === 'MCQ' || type === 'MULTIPLE' ? ['', '', '', ''] : undefined,
            correct_answer: type === 'TRUE_FALSE' ? 'true' : undefined,
            correct_answers: type === 'MULTIPLE' ? [] : undefined,
            order_index: questions.length,
        };
        setQuestions([...questions, newQuestion]);
        setEditingIndex(questions.length);
    };

    const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], ...updates };
        setQuestions(updated);
    };

    const deleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
        setEditingIndex(null);
    };

    const addOption = (questionIndex: number) => {
        const question = questions[questionIndex];
        if (question.options) {
            updateQuestion(questionIndex, {
                options: [...question.options, ''],
            });
        }
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        const question = questions[questionIndex];
        if (question.options) {
            const newOptions = [...question.options];
            newOptions[optionIndex] = value;
            updateQuestion(questionIndex, { options: newOptions });
        }
    };

    const deleteOption = (questionIndex: number, optionIndex: number) => {
        const question = questions[questionIndex];
        if (question.options && question.options.length > 2) {
            updateQuestion(questionIndex, {
                options: question.options.filter((_, i) => i !== optionIndex),
            });
        }
    };

    const toggleCorrectAnswer = (questionIndex: number, optionValue: string) => {
        const question = questions[questionIndex];

        if (question.type === 'MCQ') {
            updateQuestion(questionIndex, { correct_answer: optionValue });
        } else if (question.type === 'MULTIPLE') {
            const current = question.correct_answers || [];
            const updated = current.includes(optionValue)
                ? current.filter(a => a !== optionValue)
                : [...current, optionValue];
            updateQuestion(questionIndex, { correct_answers: updated });
        }
    };

    const handleSave = async () => {
        await onSave(questions);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Quiz Questions</h3>
                    <p className="text-sm text-muted-foreground">
                        {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving || questions.length === 0}>
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Quiz
                        </>
                    )}
                </Button>
            </div>

            {/* Add Question Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Add Question</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {(Object.keys(questionTypeConfig) as QuizQuestionType[]).map((type) => (
                        <Button
                            key={type}
                            size="sm"
                            variant="outline"
                            onClick={() => addQuestion(type)}
                        >
                            <Plus className="h-3 w-3 mr-2" />
                            {questionTypeConfig[type].label}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {/* Questions List */}
            {questions.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-sm text-muted-foreground">
                            No questions yet. Add your first question above!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <Card
                            key={index}
                            className={cn(
                                'border',
                                editingIndex === index && 'ring-2 ring-primary'
                            )}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2 flex-1">
                                        <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="secondary">
                                                    Question {index + 1}
                                                </Badge>
                                                <Badge>
                                                    {questionTypeConfig[question.type].label}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {question.points} {question.points === 1 ? 'point' : 'points'}
                                                </Badge>
                                            </div>
                                            {editingIndex === index ? (
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <Label>Question Text *</Label>
                                                        <Textarea
                                                            value={question.question_text}
                                                            onChange={(e) => updateQuestion(index, { question_text: e.target.value })}
                                                            placeholder="Enter your question..."
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Points</Label>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                value={question.points}
                                                                onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 1 })}
                                                            />
                                                        </div>
                                                        {question.type === 'TRUE_FALSE' && (
                                                            <div className="space-y-2">
                                                                <Label>Correct Answer</Label>
                                                                <Select
                                                                    value={question.correct_answer}
                                                                    onValueChange={(value) => updateQuestion(index, { correct_answer: value })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="true">True</SelectItem>
                                                                        <SelectItem value="false">False</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        )}
                                                        {question.type === 'FILL_BLANK' && (
                                                            <div className="space-y-2">
                                                                <Label>Correct Answer</Label>
                                                                <Input
                                                                    value={question.correct_answer || ''}
                                                                    onChange={(e) => updateQuestion(index, { correct_answer: e.target.value })}
                                                                    placeholder="Expected answer"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* MCQ/MULTIPLE Options */}
                                                    {(question.type === 'MCQ' || question.type === 'MULTIPLE') && question.options && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label>Answer Options *</Label>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => addOption(index)}
                                                                >
                                                                    <Plus className="h-3 w-3 mr-1" />
                                                                    Add Option
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {question.options.map((option, optionIndex) => (
                                                                    <div key={optionIndex} className="flex items-center gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="px-2"
                                                                            onClick={() => toggleCorrectAnswer(index, option)}
                                                                        >
                                                                            {question.type === 'MCQ' ? (
                                                                                question.correct_answer === option ? (
                                                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                                ) : (
                                                                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                                                                )
                                                                            ) : (
                                                                                question.correct_answers?.includes(option) ? (
                                                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                                ) : (
                                                                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                                                                )
                                                                            )}
                                                                        </Button>
                                                                        <Input
                                                                            value={option}
                                                                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                                                            placeholder={`Option ${optionIndex + 1}`}
                                                                            className="flex-1"
                                                                        />
                                                                        {question.options!.length > 2 && (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() => deleteOption(index, optionIndex)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Click the circle icon to mark correct {question.type === 'MCQ' ? 'answer' : 'answers'}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <Label>Explanation (Optional)</Label>
                                                        <Textarea
                                                            value={question.explanation || ''}
                                                            onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                                                            placeholder="Explain the correct answer..."
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="flex gap-2 pt-2">
                                                        <Button size="sm" onClick={() => setEditingIndex(null)}>
                                                            Done Editing
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => deleteQuestion(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Question
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => setEditingIndex(index)}
                                                >
                                                    <p className="font-medium">
                                                        {question.question_text || <span className="text-muted-foreground italic">Click to add question text...</span>}
                                                    </p>
                                                    {question.options && question.options.some(o => o) && (
                                                        <div className="mt-2 space-y-1">
                                                            {question.options.filter(o => o).map((option, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm">
                                                                    {question.type === 'MCQ' ? (
                                                                        question.correct_answer === option ? (
                                                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                                        ) : (
                                                                            <Circle className="h-3 w-3 text-muted-foreground" />
                                                                        )
                                                                    ) : (
                                                                        question.correct_answers?.includes(option) ? (
                                                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                                        ) : (
                                                                            <Circle className="h-3 w-3 text-muted-foreground" />
                                                                        )
                                                                    )}
                                                                    <span>{option}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {editingIndex !== index && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditingIndex(index)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

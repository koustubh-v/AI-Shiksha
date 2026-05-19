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
    ArrowUp,
    ArrowDown,
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
    correct_answers?: any[];
    explanation?: string;
    order_index: number;
}

interface QuizBuilderProps {
    quizId?: string;
    questions: QuizQuestion[];
    onChange: (questions: QuizQuestion[]) => void;
    onSave?: () => Promise<void>;
    saving?: boolean;
}

const questionTypeConfig: Record<QuizQuestionType, { label: string; description: string }> = {
    MCQ: { label: 'Multiple Choice (Single)', description: 'One correct answer from multiple options' },
    MULTIPLE: { label: 'Multiple Choice (Multiple)', description: 'Multiple correct answers' },
    TRUE_FALSE: { label: 'True/False', description: 'Simple true or false question' },
    FILL_BLANK: { label: 'Fill in the Blank', description: 'Type the correct answer(s) into [blank] gaps' },
    DESCRIPTIVE: { label: 'Descriptive Answer', description: 'Long-form answer (manual grading)' },
    CODE: { label: 'Code Question', description: 'Programming question (manual grading)' },
    MATCHING: { label: 'Matching Pairs', description: 'Pair items from two separate lists' },
    ORDERING: { label: 'Ordering / Ranking', description: 'Arrange items in the correct order' },
    MATRIX: { label: 'Matrix / Grid', description: 'Rate multiple items against a set of options' },
    SHORT_ANSWER: { label: 'Short Answer', description: 'Brief text response' },
    ESSAY: { label: 'Essay / Long Answer', description: 'In-depth paragraphs (manual grading)' },
    NUMERICAL: { label: 'Numerical Input', description: 'Enter a specific number with optional tolerance' },
    DRAG_DROP: { label: 'Drag and Drop', description: 'Drag items into correct positions in the text' },
};

export function QuizBuilder({ quizId, questions, onChange, onSave, saving }: QuizBuilderProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const addQuestion = (type: QuizQuestionType) => {
        const newQuestion: QuizQuestion = {
            type,
            question_text: '',
            points: 1,
            options: 
                type === 'MCQ' || type === 'MULTIPLE' 
                    ? ['', '', '', ''] 
                    : type === 'MATCHING' 
                    ? ['', '']
                    : type === 'ORDERING'
                    ? ['', '']
                    : type === 'MATRIX'
                    ? ['row:Row 1', 'col:Column 1']
                    : type === 'DRAG_DROP'
                    ? ['', '']
                    : undefined,
            correct_answer: type === 'TRUE_FALSE' ? 'true' : undefined,
            correct_answers: 
                type === 'MULTIPLE' 
                    ? [] 
                    : type === 'MATCHING'
                    ? ['', '']
                    : type === 'ORDERING'
                    ? ['', '']
                    : type === 'MATRIX'
                    ? ['Column 1']
                    : type === 'DRAG_DROP'
                    ? []
                    : type === 'NUMERICAL'
                    ? ['0', '0'] // target, tolerance
                    : undefined,
            order_index: questions.length,
        };
        onChange([...questions, newQuestion]);
        setEditingIndex(questions.length);
    };

    const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], ...updates };
        onChange(updated);
    };

    const deleteQuestion = (index: number) => {
        onChange(questions.filter((_, i) => i !== index));
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
        if (onSave) {
            await onSave();
        }
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
                {onSave && (
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
                )}
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
                                                 <div className="space-y-4 pt-2">
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

                                                     {/* MATCHING Pairs */}
                                                     {question.type === 'MATCHING' && (
                                                         <div className="space-y-3">
                                                             <div className="flex items-center justify-between">
                                                                 <Label className="font-semibold">Matching Pairs *</Label>
                                                                 <Button
                                                                     size="sm"
                                                                     variant="ghost"
                                                                     onClick={() => {
                                                                         const newOptions = [...(question.options || []), ''];
                                                                         const newCorrect = [...(question.correct_answers || []), ''];
                                                                         updateQuestion(index, { options: newOptions, correct_answers: newCorrect });
                                                                     }}
                                                                 >
                                                                     <Plus className="h-3 w-3 mr-1" />
                                                                     Add Pair
                                                                 </Button>
                                                             </div>
                                                             <div className="space-y-2">
                                                                 {(question.options || []).map((leftVal, pairIdx) => (
                                                                     <div key={pairIdx} className="flex items-center gap-2">
                                                                         <Input
                                                                             value={leftVal}
                                                                             onChange={(e) => {
                                                                                 const newOptions = [...(question.options || [])];
                                                                                 newOptions[pairIdx] = e.target.value;
                                                                                 updateQuestion(index, { options: newOptions });
                                                                             }}
                                                                             placeholder={`Left Item ${pairIdx + 1}`}
                                                                             className="flex-1"
                                                                         />
                                                                         <span className="text-muted-foreground">⇄</span>
                                                                         <Input
                                                                             value={(question.correct_answers || [])[pairIdx] || ''}
                                                                             onChange={(e) => {
                                                                                 const newCorrect = [...(question.correct_answers || [])];
                                                                                 newCorrect[pairIdx] = e.target.value;
                                                                                 updateQuestion(index, { correct_answers: newCorrect });
                                                                             }}
                                                                             placeholder={`Right Item ${pairIdx + 1}`}
                                                                             className="flex-1"
                                                                         />
                                                                         {(question.options || []).length > 2 && (
                                                                             <Button
                                                                                 size="sm"
                                                                                 variant="ghost"
                                                                                 onClick={() => {
                                                                                     const newOptions = (question.options || []).filter((_, i) => i !== pairIdx);
                                                                                     const newCorrect = (question.correct_answers || []).filter((_, i) => i !== pairIdx);
                                                                                     updateQuestion(index, { options: newOptions, correct_answers: newCorrect });
                                                                                 }}
                                                                             >
                                                                                 <Trash2 className="h-4 w-4" />
                                                                             </Button>
                                                                         )}
                                                                     </div>
                                                                 ))}
                                                             </div>
                                                         </div>
                                                     )}

                                                     {/* ORDERING */}
                                                     {question.type === 'ORDERING' && (
                                                         <div className="space-y-3">
                                                             <div className="flex items-center justify-between">
                                                                 <Label className="font-semibold">Items in Correct Order *</Label>
                                                                 <Button
                                                                     size="sm"
                                                                     variant="ghost"
                                                                     onClick={() => {
                                                                         const newCorrect = [...(question.correct_answers || []), ''];
                                                                         updateQuestion(index, { correct_answers: newCorrect, options: newCorrect });
                                                                     }}
                                                                 >
                                                                     <Plus className="h-3 w-3 mr-1" />
                                                                     Add Item
                                                                 </Button>
                                                             </div>
                                                             <div className="space-y-2">
                                                                 {(question.correct_answers || []).map((val, itemIdx) => (
                                                                     <div key={itemIdx} className="flex items-center gap-2">
                                                                         <span className="text-sm font-semibold w-6 text-center">{itemIdx + 1}.</span>
                                                                         <Input
                                                                             value={val}
                                                                             onChange={(e) => {
                                                                                 const newCorrect = [...(question.correct_answers || [])];
                                                                                 newCorrect[itemIdx] = e.target.value;
                                                                                 updateQuestion(index, { correct_answers: newCorrect, options: newCorrect });
                                                                             }}
                                                                             placeholder={`Item ${itemIdx + 1}`}
                                                                             className="flex-1"
                                                                         />
                                                                         <div className="flex gap-1">
                                                                             <Button
                                                                                 size="sm"
                                                                                 variant="ghost"
                                                                                 disabled={itemIdx === 0}
                                                                                 onClick={() => {
                                                                                     const newCorrect = [...(question.correct_answers || [])];
                                                                                     const temp = newCorrect[itemIdx];
                                                                                     newCorrect[itemIdx] = newCorrect[itemIdx - 1];
                                                                                     newCorrect[itemIdx - 1] = temp;
                                                                                     updateQuestion(index, { correct_answers: newCorrect, options: newCorrect });
                                                                                 }}
                                                                             >
                                                                                 <ArrowUp className="h-3 w-3" />
                                                                             </Button>
                                                                             <Button
                                                                                 size="sm"
                                                                                 variant="ghost"
                                                                                 disabled={itemIdx === (question.correct_answers || []).length - 1}
                                                                                 onClick={() => {
                                                                                     const newCorrect = [...(question.correct_answers || [])];
                                                                                     const temp = newCorrect[itemIdx];
                                                                                     newCorrect[itemIdx] = newCorrect[itemIdx + 1];
                                                                                     newCorrect[itemIdx + 1] = temp;
                                                                                     updateQuestion(index, { correct_answers: newCorrect, options: newCorrect });
                                                                                 }}
                                                                             >
                                                                                 <ArrowDown className="h-3 w-3" />
                                                                             </Button>
                                                                         </div>
                                                                         {(question.correct_answers || []).length > 2 && (
                                                                             <Button
                                                                                 size="sm"
                                                                                 variant="ghost"
                                                                                 onClick={() => {
                                                                                     const newCorrect = (question.correct_answers || []).filter((_, i) => i !== itemIdx);
                                                                                     updateQuestion(index, { correct_answers: newCorrect, options: newCorrect });
                                                                                 }}
                                                                             >
                                                                                 <Trash2 className="h-4 w-4" />
                                                                             </Button>
                                                                         )}
                                                                     </div>
                                                                 ))}
                                                             </div>
                                                         </div>
                                                     )}

                                                     {/* MATRIX */}
                                                     {question.type === 'MATRIX' && (() => {
                                                         const rows = (question.options || []).filter(o => o.startsWith('row:')).map(o => o.slice(4));
                                                         const cols = (question.options || []).filter(o => o.startsWith('col:')).map(o => o.slice(4));
                                                         const updateMatrix = (newRows: string[], newCols: string[], newCorrect?: string[]) => {
                                                             const combined = [...newRows.map(r => `row:${r}`), ...newCols.map(c => `col:${c}`)];
                                                             const correct = newCorrect || question.correct_answers || [];
                                                             const adjustedCorrect = newRows.map((_, i) => correct[i] || newCols[0] || '');
                                                             updateQuestion(index, { options: combined, correct_answers: adjustedCorrect });
                                                         };

                                                         return (
                                                             <div className="space-y-4">
                                                                 <div className="grid grid-cols-2 gap-4">
                                                                     <div className="space-y-2 border p-3 rounded-md">
                                                                         <div className="flex justify-between items-center">
                                                                             <Label className="font-semibold">Rows (Criteria)</Label>
                                                                             <Button
                                                                                 size="sm"
                                                                                 variant="ghost"
                                                                                 onClick={() => updateMatrix([...rows, `New Row ${rows.length + 1}`], cols)}
                                                                             >
                                                                                 <Plus className="h-3 w-3 mr-1" /> Add Row
                                                                             </Button>
                                                                         </div>
                                                                         <div className="space-y-1">
                                                                             {rows.map((r, rIdx) => (
                                                                                 <div key={rIdx} className="flex gap-2 items-center">
                                                                                     <Input
                                                                                         value={r}
                                                                                         onChange={(e) => {
                                                                                             const nextRows = [...rows];
                                                                                             nextRows[rIdx] = e.target.value;
                                                                                             updateMatrix(nextRows, cols);
                                                                                         }}
                                                                                         className="h-8"
                                                                                     />
                                                                                     {rows.length > 1 && (
                                                                                         <Button
                                                                                             size="sm"
                                                                                             variant="ghost"
                                                                                             onClick={() => updateMatrix(rows.filter((_, i) => i !== rIdx), cols)}
                                                                                         >
                                                                                             <Trash2 className="h-3 w-3" />
                                                                                         </Button>
                                                                                     )}
                                                                                 </div>
                                                                             ))}
                                                                         </div>
                                                                     </div>

                                                                     <div className="space-y-2 border p-3 rounded-md">
                                                                         <div className="flex justify-between items-center">
                                                                             <Label className="font-semibold">Columns (Choices)</Label>
                                                                             <Button
                                                                                 size="sm"
                                                                                 variant="ghost"
                                                                                 onClick={() => updateMatrix(rows, [...cols, `New Col ${cols.length + 1}`])}
                                                                             >
                                                                                 <Plus className="h-3 w-3 mr-1" /> Add Col
                                                                             </Button>
                                                                         </div>
                                                                         <div className="space-y-1">
                                                                             {cols.map((c, cIdx) => (
                                                                                 <div key={cIdx} className="flex gap-2 items-center">
                                                                                     <Input
                                                                                         value={c}
                                                                                         onChange={(e) => {
                                                                                             const nextCols = [...cols];
                                                                                             nextCols[cIdx] = e.target.value;
                                                                                             updateMatrix(rows, nextCols);
                                                                                         }}
                                                                                         className="h-8"
                                                                                     />
                                                                                     {cols.length > 1 && (
                                                                                         <Button
                                                                                             size="sm"
                                                                                             variant="ghost"
                                                                                             onClick={() => updateMatrix(rows, cols.filter((_, i) => i !== cIdx))}
                                                                                         >
                                                                                             <Trash2 className="h-3 w-3" />
                                                                                         </Button>
                                                                                     )}
                                                                                 </div>
                                                                             ))}
                                                                         </div>
                                                                     </div>
                                                                 </div>

                                                                 <div className="space-y-2 border p-3 rounded-md overflow-x-auto">
                                                                     <Label className="font-semibold">Set Correct Matrix Mapping</Label>
                                                                     <table className="w-full text-sm">
                                                                         <thead>
                                                                             <tr className="border-b">
                                                                                 <th className="text-left p-2 font-medium">Row / Criteria</th>
                                                                                 {cols.map((col, cIdx) => (
                                                                                     <th key={cIdx} className="text-center p-2 font-medium">{col}</th>
                                                                                 ))}
                                                                             </tr>
                                                                         </thead>
                                                                         <tbody>
                                                                             {rows.map((row, rIdx) => (
                                                                                 <tr key={rIdx} className="border-b">
                                                                                     <td className="p-2 font-medium">{row}</td>
                                                                                     {cols.map((col, cIdx) => {
                                                                                         const isChecked = (question.correct_answers || [])[rIdx] === col;
                                                                                         return (
                                                                                             <td key={cIdx} className="text-center p-2">
                                                                                                 <input
                                                                                                     type="radio"
                                                                                                     name={`correct_matrix_row_${index}_${rIdx}`}
                                                                                                     checked={isChecked}
                                                                                                     onChange={() => {
                                                                                                         const nextCorrect = [...(question.correct_answers || [])];
                                                                                                         nextCorrect[rIdx] = col;
                                                                                                         updateQuestion(index, { correct_answers: nextCorrect });
                                                                                                     }}
                                                                                                     className="h-4 w-4 text-primary"
                                                                                                 />
                                                                                             </td>
                                                                                         );
                                                                                     })}
                                                                                 </tr>
                                                                             ))}
                                                                         </tbody>
                                                                     </table>
                                                                 </div>
                                                             </div>
                                                         );
                                                     })()}

                                                     {/* FILL_BLANK */}
                                                     {question.type === 'FILL_BLANK' && (() => {
                                                         const blankCount = (question.question_text.match(/\[blank\]/g) || []).length;
                                                         const correctAnswersList = question.correct_answers || [];

                                                         return (
                                                             <div className="space-y-3">
                                                                 <p className="text-xs text-muted-foreground">
                                                                     Add <strong>[blank]</strong> in the Question Text box above to define fill-in-the-blank gaps. E.g. "The capital of [blank] is [blank]."
                                                                 </p>
                                                                 {blankCount > 0 ? (
                                                                     <div className="space-y-2">
                                                                         <Label className="font-semibold">Correct Answers for Blanks</Label>
                                                                         {Array.from({ length: blankCount }).map((_, bIdx) => (
                                                                             <div key={bIdx} className="flex items-center gap-2">
                                                                                 <span className="text-sm font-semibold w-16">Blank {bIdx + 1}:</span>
                                                                                 <Input
                                                                                     value={correctAnswersList[bIdx] || ''}
                                                                                     onChange={(e) => {
                                                                                         const nextAnswers = [...correctAnswersList];
                                                                                         nextAnswers[bIdx] = e.target.value;
                                                                                         updateQuestion(index, { correct_answers: nextAnswers });
                                                                                     }}
                                                                                     placeholder={`Correct value for blank ${bIdx + 1}`}
                                                                                     className="flex-1"
                                                                                 />
                                                                             </div>
                                                                         ))}
                                                                     </div>
                                                                 ) : (
                                                                     <div className="space-y-2">
                                                                         <Label className="font-semibold">Correct Answer</Label>
                                                                         <Input
                                                                             value={question.correct_answer || ''}
                                                                             onChange={(e) => updateQuestion(index, { correct_answer: e.target.value, correct_answers: [e.target.value] })}
                                                                             placeholder="Expected answer"
                                                                         />
                                                                     </div>
                                                                 )}
                                                             </div>
                                                         );
                                                     })()}

                                                     {/* SHORT_ANSWER */}
                                                     {question.type === 'SHORT_ANSWER' && (
                                                         <div className="space-y-3">
                                                             <div className="flex items-center justify-between">
                                                                 <Label className="font-semibold">Acceptable Short Answers *</Label>
                                                                 <Button
                                                                     size="sm"
                                                                     variant="ghost"
                                                                     onClick={() => {
                                                                         const newCorrect = [...(question.correct_answers || []), ''];
                                                                         updateQuestion(index, { correct_answers: newCorrect });
                                                                     }}
                                                                 >
                                                                     <Plus className="h-3 w-3 mr-1" />
                                                                     Add Alternative
                                                                 </Button>
                                                             </div>
                                                             <div className="space-y-2">
                                                                 {(question.correct_answers || []).map((val, ansIdx) => (
                                                                     <div key={ansIdx} className="flex items-center gap-2">
                                                                         <Input
                                                                             value={val}
                                                                             onChange={(e) => {
                                                                                 const newCorrect = [...(question.correct_answers || [])];
                                                                                 newCorrect[ansIdx] = e.target.value;
                                                                                 updateQuestion(index, { correct_answers: newCorrect });
                                                                             }}
                                                                             placeholder={`Acceptable Answer option ${ansIdx + 1}`}
                                                                             className="flex-1"
                                                                         />
                                                                         {(question.correct_answers || []).length > 1 && (
                                                                             <Button
                                                                                 size="sm"
                                                                                 variant="ghost"
                                                                                 onClick={() => {
                                                                                     const newCorrect = (question.correct_answers || []).filter((_, i) => i !== ansIdx);
                                                                                     updateQuestion(index, { correct_answers: newCorrect });
                                                                                 }}
                                                                             >
                                                                                 <Trash2 className="h-4 w-4" />
                                                                             </Button>
                                                                         )}
                                                                     </div>
                                                                 ))}
                                                             </div>
                                                             <p className="text-xs text-muted-foreground">
                                                                 Any match (case-insensitive) against the list above will be marked as correct.
                                                             </p>
                                                         </div>
                                                     )}

                                                     {/* ESSAY */}
                                                     {question.type === 'ESSAY' && (
                                                         <div className="space-y-2 border p-3 rounded-md bg-muted/30">
                                                             <Label className="font-semibold text-amber-500">Essay Question (Manual Grading)</Label>
                                                             <p className="text-sm text-muted-foreground">
                                                                 Students will be provided with a text response field. This type of question cannot be auto-graded and will require manual evaluation.
                                                             </p>
                                                         </div>
                                                     )}

                                                     {/* NUMERICAL */}
                                                     {question.type === 'NUMERICAL' && (() => {
                                                         const target = (question.correct_answers || [])[0] || '0';
                                                         const tolerance = (question.correct_answers || [])[1] || '0';

                                                         return (
                                                             <div className="space-y-3">
                                                                 <Label className="font-semibold">Numerical Input Configuration</Label>
                                                                 <div className="grid grid-cols-2 gap-4">
                                                                     <div className="space-y-2">
                                                                         <Label className="text-xs">Correct Number Value *</Label>
                                                                         <Input
                                                                             type="number"
                                                                             step="any"
                                                                             value={target}
                                                                             onChange={(e) => {
                                                                                 const nextAnswers = [...(question.correct_answers || ['0', '0'])];
                                                                                 nextAnswers[0] = e.target.value;
                                                                                 updateQuestion(index, { correct_answers: nextAnswers });
                                                                             }}
                                                                             placeholder="e.g. 3.14"
                                                                         />
                                                                     </div>
                                                                     <div className="space-y-2">
                                                                         <Label className="text-xs">Tolerance (+/-)</Label>
                                                                         <Input
                                                                             type="number"
                                                                             step="any"
                                                                             min="0"
                                                                             value={tolerance}
                                                                             onChange={(e) => {
                                                                                 const nextAnswers = [...(question.correct_answers || ['0', '0'])];
                                                                                 nextAnswers[1] = e.target.value;
                                                                                 updateQuestion(index, { correct_answers: nextAnswers });
                                                                             }}
                                                                             placeholder="e.g. 0.01"
                                                                         />
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                         );
                                                     })()}

                                                     {/* DRAG_DROP */}
                                                     {question.type === 'DRAG_DROP' && (() => {
                                                         const dropCount = (question.question_text.match(/\[drop\]/g) || []).length;
                                                         const draggableOptions = question.options || [];
                                                         const correctAnswers = question.correct_answers || [];

                                                         return (
                                                             <div className="space-y-4">
                                                                 <p className="text-xs text-muted-foreground">
                                                                     Add <strong>[drop]</strong> in the Question Text box above to define drag-and-drop slots. E.g. "Water freezes at [drop] and boils at [drop]."
                                                                 </p>
                                                                 
                                                                 <div className="space-y-2 border p-3 rounded-md">
                                                                     <div className="flex justify-between items-center">
                                                                         <Label className="font-semibold">Draggable Words/Options *</Label>
                                                                         <Button
                                                                             size="sm"
                                                                             variant="ghost"
                                                                             onClick={() => {
                                                                                 const nextOptions = [...draggableOptions, ''];
                                                                                 updateQuestion(index, { options: nextOptions });
                                                                             }}
                                                                         >
                                                                             <Plus className="h-3 w-3 mr-1" /> Add Option
                                                                         </Button>
                                                                     </div>
                                                                     <div className="space-y-2">
                                                                         {draggableOptions.map((opt, optIdx) => (
                                                                             <div key={optIdx} className="flex gap-2 items-center">
                                                                                 <Input
                                                                                     value={opt}
                                                                                     onChange={(e) => {
                                                                                         const nextOptions = [...draggableOptions];
                                                                                         nextOptions[optIdx] = e.target.value;
                                                                                         updateQuestion(index, { options: nextOptions });
                                                                                     }}
                                                                                     placeholder={`Draggable word ${optIdx + 1}`}
                                                                                 />
                                                                                 {draggableOptions.length > 1 && (
                                                                                     <Button
                                                                                         size="sm"
                                                                                         variant="ghost"
                                                                                         onClick={() => {
                                                                                             const nextOptions = draggableOptions.filter((_, i) => i !== optIdx);
                                                                                             const nextCorrect = correctAnswers.map(ans => ans === opt ? '' : ans);
                                                                                             updateQuestion(index, { options: nextOptions, correct_answers: nextCorrect });
                                                                                         }}
                                                                                     >
                                                                                         <Trash2 className="h-3.5 w-3.5" />
                                                                                     </Button>
                                                                                 )}
                                                                             </div>
                                                                         ))}
                                                                     </div>
                                                                 </div>

                                                                 {dropCount > 0 && (
                                                                     <div className="space-y-3 border p-3 rounded-md">
                                                                         <Label className="font-semibold">Assign Correct Drag Items to Slots</Label>
                                                                         <div className="space-y-2">
                                                                             {Array.from({ length: dropCount }).map((_, dropIdx) => (
                                                                                 <div key={dropIdx} className="flex items-center gap-4">
                                                                                     <span className="text-sm font-medium w-16">Slot {dropIdx + 1}:</span>
                                                                                     <Select
                                                                                         value={correctAnswers[dropIdx] || ''}
                                                                                         onValueChange={(val) => {
                                                                                             const nextCorrect = [...correctAnswers];
                                                                                             nextCorrect[dropIdx] = val;
                                                                                             updateQuestion(index, { correct_answers: nextCorrect });
                                                                                         }}
                                                                                     >
                                                                                         <SelectTrigger className="flex-1">
                                                                                             <SelectValue placeholder="Select correct word" />
                                                                                         </SelectTrigger>
                                                                                         <SelectContent>
                                                                                             {draggableOptions.filter(o => o).map((opt, oIdx) => (
                                                                                                 <SelectItem key={oIdx} value={opt}>{opt}</SelectItem>
                                                                                             ))}
                                                                                         </SelectContent>
                                                                                     </Select>
                                                                                 </div>
                                                                             ))}
                                                                         </div>
                                                                     </div>
                                                                 )}
                                                             </div>
                                                         );
                                                     })()}

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
                                                     className="cursor-pointer space-y-2"
                                                     onClick={() => setEditingIndex(index)}
                                                 >
                                                     <p className="font-medium">
                                                         {question.question_text || <span className="text-muted-foreground italic">Click to add question text...</span>}
                                                     </p>

                                                     {/* MCQ/MULTIPLE PREVIEW */}
                                                     {(question.type === 'MCQ' || question.type === 'MULTIPLE') && question.options && question.options.some(o => o) && (
                                                         <div className="mt-2 space-y-1">
                                                             {question.options.filter(o => o).map((option, i) => {
                                                                 const isCorrect = question.type === 'MCQ'
                                                                     ? question.correct_answer === option
                                                                     : question.correct_answers?.includes(option);
                                                                 return (
                                                                     <div key={i} className="flex items-center gap-2 text-sm">
                                                                         {isCorrect ? (
                                                                             <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                                         ) : (
                                                                             <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                                                                         )}
                                                                         <span className={cn(isCorrect && "font-medium text-green-700")}>{option}</span>
                                                                     </div>
                                                                 );
                                                             })}
                                                         </div>
                                                     )}

                                                     {/* TRUE_FALSE PREVIEW */}
                                                     {question.type === 'TRUE_FALSE' && (
                                                         <div className="mt-2 text-sm">
                                                             Correct Answer: <span className="font-semibold text-green-600 capitalize">{question.correct_answer}</span>
                                                         </div>
                                                     )}

                                                     {/* FILL_BLANK PREVIEW */}
                                                     {question.type === 'FILL_BLANK' && (
                                                         <div className="mt-2 text-sm text-muted-foreground">
                                                             {(() => {
                                                                 const parts = question.question_text.split('[blank]');
                                                                 const answers = question.correct_answers || [];
                                                                 return (
                                                                     <p>
                                                                         {parts.map((part, i) => (
                                                                             <span key={i}>
                                                                                 {part}
                                                                                 {i < parts.length - 1 && (
                                                                                     <span className="underline font-semibold text-green-600 px-1">
                                                                                         [ {answers[i] || 'blank'} ]
                                                                                     </span>
                                                                                 )}
                                                                             </span>
                                                                         ))}
                                                                         {parts.length === 1 && question.correct_answer && (
                                                                             <span className="font-semibold text-green-600"> (Answer: {question.correct_answer})</span>
                                                                         )}
                                                                     </p>
                                                                 );
                                                             })()}
                                                         </div>
                                                     )}

                                                     {/* SHORT_ANSWER PREVIEW */}
                                                     {question.type === 'SHORT_ANSWER' && (
                                                         <div className="mt-2 text-sm">
                                                             Acceptable Answers: <span className="font-semibold text-green-600">{(question.correct_answers || []).filter(Boolean).join(', ')}</span>
                                                         </div>
                                                     )}

                                                     {/* ESSAY PREVIEW */}
                                                     {question.type === 'ESSAY' && (
                                                         <div className="mt-2 text-sm text-amber-600 font-medium">
                                                             Essay Question (Manual Grading)
                                                         </div>
                                                     )}

                                                     {/* NUMERICAL PREVIEW */}
                                                     {question.type === 'NUMERICAL' && (
                                                         <div className="mt-2 text-sm">
                                                             Correct Answer: <span className="font-semibold text-green-600">{(question.correct_answers || [])[0] || '0'}</span> 
                                                             {parseFloat((question.correct_answers || [])[1]) > 0 && (
                                                                 <span> (with tolerance +/- {(question.correct_answers || [])[1]})</span>
                                                             )}
                                                         </div>
                                                     )}

                                                     {/* MATCHING PREVIEW */}
                                                     {question.type === 'MATCHING' && (
                                                         <div className="mt-2 space-y-1 text-sm border-t pt-2">
                                                             <p className="font-medium text-xs text-muted-foreground">Matching Mappings:</p>
                                                             {(question.options || []).map((left, i) => (
                                                                 <div key={i} className="flex gap-2 items-center">
                                                                     <span className="font-medium">{left}</span>
                                                                     <span className="text-muted-foreground">⇄</span>
                                                                     <span className="text-green-600 font-medium">{(question.correct_answers || [])[i]}</span>
                                                                 </div>
                                                             ))}
                                                         </div>
                                                     )}

                                                     {/* ORDERING PREVIEW */}
                                                     {question.type === 'ORDERING' && (
                                                         <div className="mt-2 space-y-1 text-sm border-t pt-2">
                                                             <p className="font-medium text-xs text-muted-foreground">Correct Sequence:</p>
                                                             {(question.correct_answers || []).map((item, i) => (
                                                                 <div key={i} className="flex gap-2 items-center">
                                                                     <span className="font-semibold text-muted-foreground">{i + 1}.</span>
                                                                     <span>{item}</span>
                                                                 </div>
                                                             ))}
                                                         </div>
                                                     )}

                                                     {/* MATRIX PREVIEW */}
                                                     {question.type === 'MATRIX' && (() => {
                                                         const rows = (question.options || []).filter(o => o.startsWith('row:')).map(o => o.slice(4));
                                                         return (
                                                             <div className="mt-2 space-y-1 text-sm border-t pt-2">
                                                                 <p className="font-medium text-xs text-muted-foreground">Matrix Mappings:</p>
                                                                 {rows.map((row, i) => (
                                                                     <div key={i} className="flex gap-2 items-center">
                                                                         <span className="font-medium">{row}</span>
                                                                         <span className="text-muted-foreground">➔</span>
                                                                         <span className="text-green-600 font-medium">{(question.correct_answers || [])[i]}</span>
                                                                     </div>
                                                                 ))}
                                                             </div>
                                                         );
                                                     })()}

                                                     {/* DRAG_DROP PREVIEW */}
                                                     {question.type === 'DRAG_DROP' && (
                                                         <div className="mt-2 text-sm text-muted-foreground">
                                                             {(() => {
                                                                 const parts = question.question_text.split('[drop]');
                                                                 const answers = question.correct_answers || [];
                                                                 return (
                                                                     <p>
                                                                         {parts.map((part, i) => (
                                                                             <span key={i}>
                                                                                 {part}
                                                                                 {i < parts.length - 1 && (
                                                                                     <span className="border border-dashed border-green-600 bg-green-50 px-1 rounded text-green-700 font-semibold mx-1 text-xs">
                                                                                         [ {answers[i] || 'drop'} ]
                                                                                     </span>
                                                                                 )}
                                                                             </span>
                                                                         ))}
                                                                     </p>
                                                                 );
                                                             })()}
                                                             {question.options && question.options.length > 0 && (
                                                                 <div className="flex flex-wrap gap-1 mt-2">
                                                                     <span className="text-xs text-muted-foreground mr-1 mt-1">Draggables:</span>
                                                                     {question.options.filter(o => o).map((opt, i) => (
                                                                         <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded border">{opt}</span>
                                                                     ))}
                                                                 </div>
                                                             )}
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

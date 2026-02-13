import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    ChevronLeft,
    GripVertical,
    Plus,
    MoreVertical,
    Pencil,
    Trash2,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Section {
    id: string;
    title: string;
    description?: string;
    items: any[];
}

interface CurriculumStepProps {
    sections: Section[];
    onUpdate: (sections: Section[]) => void;
    onBack: () => void;
    onNext: () => void;
}

export function CurriculumStep({ sections = [], onUpdate, onBack, onNext }: CurriculumStepProps) {
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [sectionTitle, setSectionTitle] = useState('');
    const [sectionDesc, setSectionDesc] = useState('');

    const handleAddSection = () => {
        const newSection: Section = {
            id: Date.now().toString(),
            title: 'New Section',
            description: 'Section description...',
            items: [],
        };
        onUpdate([...sections, newSection]);
        setEditingSection(newSection.id);
        setSectionTitle(newSection.title);
        setSectionDesc(newSection.description || '');
    };

    const handleSaveSection = (sectionId: string) => {
        const updated = sections.map((s) =>
            s.id === sectionId ? { ...s, title: sectionTitle, description: sectionDesc } : s
        );
        onUpdate(updated);
        setEditingSection(null);
    };

    const handleDeleteSection = (sectionId: string) => {
        onUpdate(sections.filter((s) => s.id !== sectionId));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="rounded-lg hover:bg-gray-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    Curriculum
                </h2>
            </div>

            {/* Sections List */}
            <div className="space-y-4">
                {sections.map((section) => (
                    <Card key={section.id} className="shadow-sm border-gray-200 hover:shadow-md transition-all overflow-hidden">
                        {editingSection === section.id ? (
                            // EDIT MODE
                            <div className="p-6 space-y-4 bg-gradient-to-br from-blue-50/50 to-transparent">
                                <Input
                                    value={sectionTitle}
                                    onChange={(e) => setSectionTitle(e.target.value)}
                                    placeholder="Section title..."
                                    className="text-lg font-medium h-12 border-gray-300"
                                />
                                <Input
                                    value={sectionDesc}
                                    onChange={(e) => setSectionDesc(e.target.value)}
                                    placeholder="Section description..."
                                    className="text-sm border-gray-300"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleSaveSection(section.id)}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingSection(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // VIEW MODE
                            <>
                                <div className="flex items-start gap-4 p-6">
                                    {/* Drag Handle */}
                                    <button className="mt-1.5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors">
                                        <GripVertical className="h-5 w-5" />
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 space-y-1.5">
                                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                                        {section.description && (
                                            <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingSection(section.id);
                                                    setSectionTitle(section.title);
                                                    setSectionDesc(section.description || '');
                                                }}
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteSection(section.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Add Content Buttons */}
                                <div className="flex items-center gap-3 px-6 pb-6 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="font-medium">Lesson</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-gray-300 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="font-medium">Quiz</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="font-medium">Assignment</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                ))}
            </div>

            {/* Add Topic Button */}
            <Button
                variant="outline"
                onClick={handleAddSection}
                className="gap-2 border-2 border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-500 h-12 font-medium"
            >
                <Plus className="h-5 w-5" />
                Add Topic
            </Button>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t">
                <Button variant="outline" onClick={onBack} className="gap-2 h-11 px-6 hover:bg-gray-50">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="font-medium">Back</span>
                </Button>
                <Button
                    onClick={onNext}
                    className="gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 font-semibold"
                >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

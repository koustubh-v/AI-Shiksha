import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

import { useCourseBuilder } from '@/hooks/useCourseBuilder';
import { SectionItem } from './SectionItem';
import { LessonEditor } from './LessonEditor';
import { QuizModal } from './QuizModal';
import { QuizSelectionModal } from './QuizSelectionModal';
import { AssignmentModal } from './AssignmentModal';
import { FloatingSaveBar } from './wizard/FloatingSaveBar';
import type { SectionItem as ISectionItem, SectionItemType, LectureContentType } from '@/types/courseBuilder';
import api from '@/lib/api';

interface CurriculumBuilderProps {
    courseId: string;
    onNext: () => void;
    onSave?: () => void; // New prop for explicit save without nav
    onBack?: () => void; // New prop for back nav
}

export function CurriculumBuilder({ courseId, onNext, onSave, onBack }: CurriculumBuilderProps) {
    const navigate = useNavigate();
    const {
        sections,
        loading,
        saving,
        createSection,
        updateSection,
        deleteSection,
        reorderSections,
        createItem,
        updateItem,
        deleteItem,
        reorderItems,
        saveLectureContent,
        createAssignment,
        updateAssignment,
    } = useCourseBuilder(courseId);

    // Dialog State
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');

    // Quiz Selection State
    const [isQuizSelectionOpen, setIsQuizSelectionOpen] = useState(false);
    const [activeSectionForQuiz, setActiveSectionForQuiz] = useState<string | null>(null);

    // Editor State (Modals)
    const [activeModal, setActiveModal] = useState<{ type: SectionItemType; item: ISectionItem } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // --- Section Handlers ---

    const handleCreateSection = async () => {
        if (!newSectionTitle.trim()) return;
        try {
            await createSection(newSectionTitle, newSectionDescription);
            setNewSectionTitle('');
            setNewSectionDescription('');
            setIsAddSectionOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDragEndSection = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            const newSections = arrayMove(sections, oldIndex, newIndex);
            reorderSections(newSections);
        }
    };

    // --- Item Handlers ---

    const handleAddItem = async (sectionId: string, type: SectionItemType) => {
        if (type === 'QUIZ') {
            setActiveSectionForQuiz(sectionId);
            setIsQuizSelectionOpen(true);
            return;
        }

        const defaultTitle = `New ${type.charAt(0) + type.slice(1).toLowerCase()}`;
        try {
            const newItem = await createItem(sectionId, {
                title: defaultTitle,
                type: type,
                order_index: 999, // Backend handles
                is_mandatory: false,
                is_preview: false
            });
            // Optionally open modal immediately?
            // For now, let user click edit.
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectQuiz = async (quizId: string) => {
        if (!activeSectionForQuiz) return;

        try {
            // Fetch quiz details to use title
            // Or just use generic title, but better to use real title
            const quizRes = await api.get(`/quizzes/${quizId}`);
            const quizTitle = quizRes.data.title;

            await createItem(activeSectionForQuiz, {
                title: quizTitle,
                type: 'QUIZ',
                order_index: 999,
                is_mandatory: true,
                is_preview: false,
                quiz_id: quizId
            });

            toast.success("Quiz added to curriculum");
        } catch (error) {
            console.error("Failed to add quiz:", error);
            toast.error("Failed to add quiz");
        }
    };

    const handleEditItem = (item: ISectionItem) => {
        if (item.type === 'QUIZ') {
            // Check if we have a linked quiz
            const quizId = item.quiz?.id || item.quiz_id;

            if (quizId) {
                navigate(`/dashboard/quizzes/${quizId}/edit`);
                return;
            } else {
                toast.error("Error: This quiz item is not linked to a quiz entity.");
                return;
            }
        }

        setActiveModal({ type: item.type, item });
    };

    const handleSaveItemContent = async (itemId: string, contentData: any) => {
        try {
            // Direct pass-through of the DTO from LessonEditor
            // The LessonEditor now constructs the full backend payload (video_url, text_content, etc.)
            await saveLectureContent(itemId, contentData);
        } catch (error) {
            console.error('Error saving lecture content:', error);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-24">
            {/* Header / Add Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-white/20 shadow-sm top-20 z-20 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Curriculum</h2>
                    <p className="text-gray-500 font-medium">Design your course structure and content</p>
                </div>
                <Button
                    onClick={() => setIsAddSectionOpen(true)}
                    className="h-12 px-6 gap-2 bg-gray-900 hover:bg-black text-white rounded-full shadow-lg shadow-gray-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-semibold">Add Section</span>
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white/50 rounded-3xl">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                </div>
            ) : sections.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <BookOpen className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Start Adding Content</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
                        Create sections to organize your lessons, quizzes, and assignments into a cohesive learning path.
                    </p>
                    <Button
                        onClick={() => setIsAddSectionOpen(true)}
                        size="lg"
                        className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    >
                        Create First Section
                    </Button>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEndSection}
                >
                    <SortableContext
                        items={sections.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {sections.map((section) => (
                                <SectionItem
                                    key={section.id}
                                    section={section}
                                    onUpdate={(updates) => updateSection(section.id, updates)}
                                    onDelete={() => deleteSection(section.id)}
                                    onAddItem={(type) => handleAddItem(section.id, type)}
                                    // When item is edited, we open the appropriate modal
                                    onEditItem={handleEditItem}
                                    onDeleteItem={(itemId) => deleteItem(section.id, itemId)}
                                    // When items reorder within section
                                    onReorderItems={(items) => reorderItems(section.id, items)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Add Section Dialog */}
            <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                    <DialogHeader>
                        <DialogTitle>Create New Section</DialogTitle>
                        <DialogDescription>
                            Group your lessons into a logical section or chapter.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={newSectionTitle}
                                onChange={(e) => setNewSectionTitle(e.target.value)}
                                placeholder="e.g. Introduction to Design"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description (Optional)</label>
                            <Textarea
                                value={newSectionDescription}
                                onChange={(e) => setNewSectionDescription(e.target.value)}
                                placeholder="What will students learn in this section?"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateSection} disabled={!newSectionTitle.trim() || saving}>
                            {saving ? 'Creating...' : 'Create Section'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Quiz Selection Modal */}
            <QuizSelectionModal
                open={isQuizSelectionOpen}
                onOpenChange={setIsQuizSelectionOpen}
                onSelect={handleSelectQuiz}
            />

            {/* Modals */}
            {activeModal && activeModal.type === 'LECTURE' && (
                <LessonEditor
                    open={!!activeModal}
                    onOpenChange={(open) => !open && setActiveModal(null)}
                    // Derive item from sections to ensure it is always up to date
                    item={sections.flatMap(s => s.items).find(i => i?.id === activeModal.item.id) || activeModal.item}
                    onSave={async (id, updates) => {
                        await updateItem(id, updates);
                    }}
                    onSaveContent={async (id, content) => {
                        await handleSaveItemContent(id, content);
                        // Force a refresh of the sections to ensure we have the latest data
                        // logic inside handleSaveItemContent in useCourseBuilder should ideally handle this, 
                        // but we just added fetchSections() there.
                        // However, useCourseBuilder returns `sections` which should update.
                    }}
                    loading={saving}
                />
            )}

            {activeModal && activeModal.type === 'QUIZ' && (
                <QuizModal
                    open={!!activeModal}
                    onOpenChange={(open) => !open && setActiveModal(null)}
                    item={activeModal.item}
                    onSave={updateItem}
                />
            )}

            {activeModal && activeModal.type === 'ASSIGNMENT' && (
                <AssignmentModal
                    open={!!activeModal}
                    onOpenChange={(open) => !open && setActiveModal(null)}
                    item={activeModal.item}
                    onSave={updateItem}
                    onCreateAssignment={createAssignment}
                    onUpdateAssignment={updateAssignment}
                />
            )}
            {/* Footer Save Button */}
            <FloatingSaveBar
                onSave={onSave || (() => { })}
                onSaveAndContinue={onNext}
                onBack={onBack}
                loading={saving}
                isDirty={true}
                canProceed={sections.length > 0} // Basic validation: must have at least one section
                saveLabel="Save Curriculum"
                saveAndContinueLabel="Next: Settings"
                backLabel="Back to Basic Info"
            />
            <div className="h-12" /> {/* Spacer */}
        </div>
    );
}

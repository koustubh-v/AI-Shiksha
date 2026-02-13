import { useState } from 'react';
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
import { AssignmentModal } from './AssignmentModal';
import type { SectionItem as ISectionItem, SectionItemType } from '@/types/courseBuilder';

interface CurriculumBuilderProps {
    courseId: string;
}

export function CurriculumBuilder({ courseId }: CurriculumBuilderProps) {
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
    } = useCourseBuilder(courseId);

    // Dialog State
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');

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

    const handleEditItem = (item: ISectionItem) => {
        setActiveModal({ type: item.type, item });
    };

    const handleSaveItemContent = async (itemId: string, content: any) => {
        // Delegate to hook
        await saveLectureContent(itemId, content);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header / Add Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Curriculum</h2>
                    <p className="text-gray-500">Design your course structure and content</p>
                </div>
                <Button onClick={() => setIsAddSectionOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Add Section
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : sections.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Adding Content</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        Create sections to organize your lessons, quizzes, and assignments.
                    </p>
                    <Button onClick={() => setIsAddSectionOpen(true)}>
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
                <DialogContent>
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

            {/* Modals */}
            {activeModal && activeModal.type === 'LECTURE' && (
                <LessonEditor
                    open={!!activeModal}
                    onOpenChange={(open) => !open && setActiveModal(null)}
                    item={activeModal.item}
                    onSave={updateItem}
                    onSaveContent={handleSaveItemContent}
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
                />
            )}
        </div>
    );
}

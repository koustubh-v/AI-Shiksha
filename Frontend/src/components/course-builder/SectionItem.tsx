import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    GripVertical,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
    Plus,
    Video,
    HelpCircle,
    ClipboardList,
    MoreVertical
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { LessonItem } from './LessonItem';
import type { CourseSection, SectionItem, SectionItemType } from '@/types/courseBuilder';

interface SectionItemProps {
    section: CourseSection;
    onUpdate: (updates: any) => void;
    onDelete: () => void;
    onAddItem: (type: SectionItemType) => void;
    onEditItem: (item: SectionItem) => void;
    onDeleteItem: (itemId: string) => void;
    onReorderItems: (items: SectionItem[]) => void;
}

export function SectionItem({
    section,
    onUpdate,
    onDelete,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onReorderItems
}: SectionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(section.title);

    // Auto-save on blur or enter? currently manual save button for simplicity
    const saveEdit = () => {
        onUpdate({ title });
        setIsEditing(false);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = section.items.findIndex((item) => item.id === active.id);
            const newIndex = section.items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(section.items, oldIndex, newIndex);
            onReorderItems(newItems);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group/section bg-slate-50 rounded-xl border border-gray-200 overflow-hidden mb-4 transition-all',
                isDragging && 'shadow-xl ring-2 ring-blue-500/20 opacity-80 z-10'
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-2 p-3 bg-white border-b border-gray-100">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-50 bg-transparent transition-colors"
                >
                    <GripVertical className="h-5 w-5" />
                </button>

                <div className="flex-1">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-8 font-medium"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            />
                            <Button size="sm" onClick={saveEdit}>Save</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800 text-lg">{section.title}</h3>
                            <span className="text-xs text-gray-400 font-normal">
                                {section.items.length} lessons
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onUpdate({ is_collapsed: !section.is_collapsed })}
                        className="h-8 w-8 text-gray-500"
                    >
                        {section.is_collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content */}
            {!section.is_collapsed && (
                <div className="p-3">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    // To properly implement onDragEnd here we need arrayMove.
                    // I will pass the event up to parent via a modified handler if needed, 
                    // OR implement arrayMove here. 
                    // For now let's delegate drag end logic to a prop that handles the event directly?
                    // No, DndContext needs to be here for the sortable context.
                    >
                        {/* We need to pass the event handler prop for drag end if we want parent to handle it completely
                            but DndContext triggers onDragEnd.
                            Best practice: Parent handles logic.
                            But we are splitting files.
                            Let's import `arrayMove` in this file.
                        */}
                        <SortableContext
                            items={section.items.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="min-h-[50px]">
                                {section.items.length === 0 && (
                                    <div className="text-center py-6 text-gray-400 bg-white/50 rounded border border-dashed border-gray-200">
                                        <p className="text-sm">Empty section</p>
                                    </div>
                                )}
                                {section.items.map((item) => (
                                    <LessonItem
                                        key={item.id}
                                        item={item}
                                        onEdit={onEditItem}
                                        onDelete={() => onDeleteItem(item.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Add Buttons */}
                    <div className="mt-3 flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 border-dashed border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 bg-white"
                            onClick={() => onAddItem('LECTURE')}
                        >
                            <Video className="h-4 w-4" /> Lecture
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 border-dashed border-gray-300 text-gray-600 hover:text-purple-600 hover:border-purple-300 bg-white"
                            onClick={() => onAddItem('QUIZ')}
                        >
                            <HelpCircle className="h-4 w-4" /> Quiz
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 border-dashed border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-300 bg-white"
                            onClick={() => onAddItem('ASSIGNMENT')}
                        >
                            <ClipboardList className="h-4 w-4" /> Assignment
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

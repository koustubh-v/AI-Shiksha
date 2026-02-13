import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    GripVertical,
    Video,
    FileText,
    HelpCircle,
    ClipboardList,
    Trash2,
    Edit,
    Eye,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SectionItem } from '@/types/courseBuilder';

interface LessonItemProps {
    item: SectionItem;
    onEdit: (item: SectionItem) => void;
    onDelete: () => void;
}

const itemTypeConfig = {
    LECTURE: { icon: Video, label: 'Lecture', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    QUIZ: { icon: HelpCircle, label: 'Quiz', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    ASSIGNMENT: { icon: ClipboardList, label: 'Assignment', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    RESOURCE: { icon: FileText, label: 'Resource', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
};

export function LessonItem({ item, onEdit, onDelete }: LessonItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const config = itemTypeConfig[item.type] || itemTypeConfig.RESOURCE;
    const Icon = config.icon;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative flex items-center gap-3 p-3 mb-2 rounded-lg border bg-white hover:border-blue-400 hover:shadow-sm transition-all duration-200',
                isDragging && 'opacity-50 shadow-lg ring-2 ring-blue-500/20 z-10'
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            {/* Type Icon */}
            <div className={cn('flex items-center justify-center w-8 h-8 rounded-md border', config.color)}>
                <Icon className="h-4 w-4" />
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="font-medium text-gray-900 truncate">{item.title}</span>

                <div className="flex items-center gap-2">
                    {item.is_preview && (
                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <Eye className="h-3 w-3" />
                            Preview
                        </div>
                    )}
                    {item.is_mandatory && (
                        <div className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            <CheckCircle2 className="h-3 w-3" />
                            Required
                        </div>
                    )}
                </div>
            </div>

            {/* Meta & Actions */}
            <div className="flex items-center gap-3">
                {item.duration_minutes !== undefined && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <Clock className="h-3 w-3" />
                        {item.duration_minutes}m
                    </span>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 rounded-full"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onDelete}
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600 rounded-full"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

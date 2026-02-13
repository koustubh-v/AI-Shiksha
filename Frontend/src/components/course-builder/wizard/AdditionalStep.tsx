import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { CourseSettingsForm } from '../CourseSettingsForm';

interface AdditionalStepProps {
    courseId: string;
    course: any;
    onUpdate: () => void;
    onBack: () => void;
    onPublish: () => void;
}

export function AdditionalStep({ courseId, course, onUpdate, onBack, onPublish }: AdditionalStepProps) {
    return (
        <div className="max-w-5xl mx-auto p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="rounded-lg"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-semibold">Additional Settings</h2>
            </div>

            {/* Settings Form */}
            <CourseSettingsForm
                courseId={courseId}
                course={course}
                onUpdate={onUpdate}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button onClick={onPublish} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    Publish Course
                </Button>
            </div>
        </div>
    );
}

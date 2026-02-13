import { cn } from '@/lib/utils';
import { Sparkles, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Step {
    number: number;
    label: string;
    id: string;
}

interface StepNavigationProps {
    currentStep: number;
    onStepChange: (step: number) => void;
    onPreview?: () => void;
    onPublish?: () => void;
    canPublish?: boolean;
}

const STEPS: Step[] = [
    { number: 1, label: 'Basics', id: 'basics' },
    { number: 2, label: 'Curriculum', id: 'curriculum' },
    { number: 3, label: 'Additional', id: 'additional' },
];

export function StepNavigation({
    currentStep,
    onStepChange,
    onPreview,
    onPublish,
    canPublish = false,
}: StepNavigationProps) {
    return (
        <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left: Course Builder + Steps */}
                <div className="flex items-center gap-6">
                    <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                        Course Builder
                    </h1>

                    <div className="flex items-center gap-3">
                        {STEPS.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => onStepChange(step.number)}
                                className={cn(
                                    'flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-200',
                                    currentStep === step.number
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold transition-all',
                                        currentStep === step.number
                                            ? 'bg-white/20 text-white ring-2 ring-white/30'
                                            : 'bg-gray-200 text-gray-600'
                                    )}
                                >
                                    {step.number}
                                </div>
                                <span className="font-medium">{step.label}</span>
                            </button>
                        ))}

                        {/* Generate with AI Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 ml-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span className="font-medium">Generate with AI</span>
                        </Button>
                    </div>
                </div>

                {/* Right: Preview + Publish */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPreview}
                        className="gap-2 hover:bg-gray-50"
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </Button>

                    {canPublish ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30">
                                    Publish
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onPublish}>
                                    Publish Now
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Save as Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Submit for Review
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            size="sm"
                            onClick={onPublish}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                        >
                            Publish
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

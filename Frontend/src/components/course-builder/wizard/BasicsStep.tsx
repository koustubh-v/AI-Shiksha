import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sparkles,
    Image as ImageIcon,
    Video,
    Upload,
    Eye,
    Settings,
    Clock,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BasicsStepProps {
    courseData: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
}

export function BasicsStep({ courseData, onUpdate, onNext }: BasicsStepProps) {
    const [title, setTitle] = useState(courseData?.title || '');
    const [description, setDescription] = useState(courseData?.description || '');
    const [maxStudents, setMaxStudents] = useState(courseData?.max_students || '');
    const [difficulty, setDifficulty] = useState(courseData?.level || '');
    const [isPublic, setIsPublic] = useState(!courseData?.is_private);
    const [visibility, setVisibility] = useState('public');
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [pricingModel, setPricingModel] = useState(courseData?.is_free ? 'free' : 'paid');
    const [regularPrice, setRegularPrice] = useState(courseData?.price || '');
    const [salePrice, setSalePrice] = useState(courseData?.original_price || '');

    const handleSave = () => {
        onUpdate({
            title,
            description,
            max_students: maxStudents ? parseInt(maxStudents) : undefined,
            level: difficulty,
            is_private: !isPublic,
            is_free: pricingModel === 'free',
            price: pricingModel === 'paid' ? parseFloat(regularPrice) : 0,
            original_price: pricingModel === 'paid' && salePrice ? parseFloat(salePrice) : undefined,
        });
        onNext();
    };

    return (
        <div className="flex gap-8 max-w-7xl mx-auto">
            {/* LEFT COLUMN */}
            <div className="flex-1 space-y-6">
                {/* Title */}
                <Card className="p-6 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="course-title" className="text-base font-semibold">Title</Label>
                            <Sparkles className="h-4 w-4 text-pink-500" />
                        </div>
                        <Input
                            id="course-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ceramics 101: Mastering the Art of Clay"
                            className="text-lg h-12 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </Card>

                {/* Description with Rich Text Editor */}
                <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="course-desc" className="text-base font-semibold">Description</Label>
                                <Sparkles className="h-4 w-4 text-pink-500" />
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2 text-sm text-gray-600 hover:text-gray-900">
                                Edit with <span className="text-lg">✍️</span>
                            </Button>
                        </div>

                        {/* Simple rich text toolbar */}
                        <div className="flex items-center gap-2 p-2 border-b bg-gradient-to-r from-gray-50 to-gray-100/50">
                            <Select defaultValue="paragraph">
                                <SelectTrigger className="w-32 h-9 text-sm border-gray-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="paragraph">Paragraph</SelectItem>
                                    <SelectItem value="heading1">Heading 1</SelectItem>
                                    <SelectItem value="heading2">Heading 2</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="h-5 w-px bg-gray-300" />
                            {['B', 'I', 'U'].map((btn) => (
                                <Button
                                    key={btn}
                                    variant="ghost"
                                    size="sm"
                                    className="w-9 h-9 p-0 hover:bg-white hover:shadow-sm"
                                >
                                    <span className={cn('text-sm font-medium', btn === 'B' && 'font-bold')}>
                                        {btn}
                                    </span>
                                </Button>
                            ))}
                        </div>
                        <Textarea
                            id="course-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="This course introduces essential techniques in hand-building, wheel-throwing, and glazing to help beginners create their first unique pottery pieces..."
                            rows={6}
                            className="border-0 resize-none focus-visible:ring-0 text-base"
                        />
                    </div>
                </Card>

                {/* Options Section */}
                <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-6 space-y-4">
                        <Label className="text-base font-semibold">Options</Label>
                        <Tabs defaultValue="general" className="w-full">
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                                <div className="w-48 bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 border-r">
                                    <TabsList className="flex flex-col h-auto w-full gap-2 bg-transparent">
                                        <TabsTrigger
                                            value="general"
                                            className="w-full justify-start gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2"
                                        >
                                            <Settings className="h-4 w-4" />
                                            <span className="font-medium">General</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="drip"
                                            className="w-full justify-start gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2"
                                        >
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">Content Drip</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="flex-1 p-6">
                                    <TabsContent value="general" className="mt-0 space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="max-students" className="font-medium">Maximum Student</Label>
                                            <Input
                                                id="max-students"
                                                type="number"
                                                value={maxStudents}
                                                onChange={(e) => setMaxStudents(e.target.value)}
                                                placeholder="Unlimited"
                                                className="border-gray-300"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="difficulty" className="font-medium">Difficulty Level</Label>
                                            <Select value={difficulty} onValueChange={setDifficulty}>
                                                <SelectTrigger id="difficulty" className="border-gray-300">
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 px-4 py-3 bg-gray-50 rounded-lg">
                                            <Label htmlFor="public-course" className="font-medium">
                                                Public Course
                                            </Label>
                                            <Switch
                                                id="public-course"
                                                checked={isPublic}
                                                onCheckedChange={setIsPublic}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="drip" className="mt-0">
                                        <p className="text-sm text-gray-600">
                                            Configure content drip settings to release course materials gradually over time.
                                        </p>
                                    </TabsContent>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-80 space-y-6">
                {/* Visibility & Schedule */}
                <Card className="p-6 space-y-5 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                        <Label htmlFor="visibility" className="font-semibold">Visibility</Label>
                        <Select value={visibility} onValueChange={setVisibility}>
                            <SelectTrigger id="visibility" className="border-gray-300">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-gray-500" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="password">Password Protected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                        <Label htmlFor="schedule" className="font-medium">Schedule</Label>
                        <Switch
                            id="schedule"
                            checked={scheduleEnabled}
                            onCheckedChange={setScheduleEnabled}
                        />
                    </div>
                </Card>

                {/* Featured Image */}
                <Card className="p-6 space-y-3 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold">Featured Image</Label>
                        <Sparkles className="h-4 w-4 text-pink-500" />
                    </div>
                    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ImageIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <Button variant="link" className="text-blue-600 font-medium">
                                Upload Thumbnail
                            </Button>
                            <p className="text-xs text-gray-500 mt-1">
                                JPEG, PNG, GIF, and WebP formats, up to 50MB
                            </p>
                        </div>
                    </Card>
                </Card>

                {/* Intro Video */}
                <Card className="p-6 space-y-3 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                    <Label className="text-base font-semibold">Intro Video</Label>
                    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Video className="h-8 w-8 text-purple-600" />
                            </div>
                            <Button variant="link" className="text-blue-600 font-medium gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Video
                            </Button>
                            <Button variant="link" className="text-sm text-gray-600">
                                Add from URL
                            </Button>
                            <p className="text-xs text-gray-500 mt-1">
                                MP4, and WebM formats, up to 50MB
                            </p>
                        </div>
                    </Card>
                </Card>

                {/* Pricing Model */}
                <Card className="p-6 space-y-4 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                    <Label className="text-base font-semibold">Pricing Model</Label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setPricingModel('free')}
                            className={cn(
                                'flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all',
                                pricingModel === 'free'
                                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            )}
                        >
                            <div className={cn(
                                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                pricingModel === 'free' ? 'border-blue-600' : 'border-gray-400'
                            )}>
                                {pricingModel === 'free' && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                            </div>
                            <span className="text-sm font-semibold">Free</span>
                        </button>
                        <button
                            onClick={() => setPricingModel('paid')}
                            className={cn(
                                'flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all',
                                pricingModel === 'paid'
                                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            )}
                        >
                            <div className={cn(
                                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                pricingModel === 'paid' ? 'border-blue-600' : 'border-gray-400'
                            )}>
                                {pricingModel === 'paid' && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                            </div>
                            <span className="text-sm font-semibold">Paid</span>
                        </button>
                    </div>

                    {pricingModel === 'paid' && (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="regular-price" className="text-sm font-medium">Regular Price</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <Input
                                        id="regular-price"
                                        type="number"
                                        value={regularPrice}
                                        onChange={(e) => setRegularPrice(e.target.value)}
                                        className="pl-7 border-gray-300"
                                        placeholder="59"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sale-price" className="text-sm font-medium">Sale Price</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <Input
                                        id="sale-price"
                                        type="number"
                                        value={salePrice}
                                        onChange={(e) => setSalePrice(e.target.value)}
                                        className="pl-7 border-gray-300"
                                        placeholder="44"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Next Button */}
                <Button
                    onClick={handleSave}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 font-semibold gap-2"
                >
                    Next
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

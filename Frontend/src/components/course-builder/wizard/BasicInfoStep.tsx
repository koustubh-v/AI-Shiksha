import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ChevronsUpDown, X, Loader2, Link as LinkIcon, UploadCloud, Plus, Sparkles, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Categories, Tags, Upload } from '@/lib/api';
import { useUsers } from '@/hooks/useUsers';
import { RichTextEditor } from '@/components/editors/RichTextEditor';
import { ImageUpload, VideoUpload } from '@/components/editors/FileUpload';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FloatingSaveBar } from './FloatingSaveBar';
import { toast } from 'sonner';

const formSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    slug: z.string().min(5, 'Slug must be at least 5 characters').optional().or(z.literal('')),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    level: z.string().optional(),
    language: z.string().optional(),
    category_id: z.string().optional(),
    tag_ids: z.array(z.string()).default([]),
    thumbnail_url: z.string().optional(),
    intro_video_url: z.string().optional(),
    learning_outcomes: z.array(z.string()).default([]),
    author_id: z.string().optional(),
});

interface BasicInfoStepProps {
    courseId: string;
    initialData?: any;
    onSave: (data: z.infer<typeof formSchema>) => Promise<void>;
    onSaveAndContinue: (data: z.infer<typeof formSchema>) => Promise<void>;
}

export function BasicInfoStep({ courseId, initialData, onSave, onSaveAndContinue }: BasicInfoStepProps) {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Media Toggles
    const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('upload');
    const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');

    // Creation States
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddTagOpen, setIsAddTagOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [creatingMeta, setCreatingMeta] = useState(false);
    const [newOutcome, setNewOutcome] = useState('');

    const { users: allUsers } = useUsers(); // Fetch all users to filter for authors
    // Filter likely authors (Admins & Instructors)
    const authors = allUsers.filter(u =>
        u.role === 'ADMIN' ||
        u.role === 'INSTRUCTOR' ||
        u.role === 'TEACHER' ||
        u.role === 'SUPER_ADMIN' ||
        u.role === 'FRANCHISE_ADMIN' ||
        u.role === 'admin' ||
        u.role === 'instructor' ||
        u.role === 'teacher' ||
        u.role === 'super_admin' ||
        u.role === 'franchise_admin'
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: {
            title: initialData?.title === 'Untitled Course' ? '' : (initialData?.title || ''),
            slug: initialData?.slug || '',
            subtitle: initialData?.subtitle || '',
            description: initialData?.description || '',
            level: initialData?.level || '',
            language: initialData?.language || '',
            category_id: initialData?.category_id || '',
            tag_ids: initialData?.tags?.map((t: any) => t.tag_id) || [],
            thumbnail_url: initialData?.thumbnail_url || '',
            intro_video_url: initialData?.intro_video_url || '',
            learning_outcomes: initialData?.learning_outcomes || [],
            author_id: initialData?.instructor?.user?.id || '',
        },
    });

    // Auto-generate slug from title
    const title = form.watch('title');
    useEffect(() => {
        if (title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            form.setValue('slug', slug, { shouldValidate: true, shouldDirty: true });
        }
    }, [title, form]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cats, tags] = await Promise.all([
                    Categories.getAll(),
                    Tags.getAll()
                ]);
                setCategories(cats);
                setAvailableTags(tags);
            } catch (error) {
                console.error('Failed to fetch metadata', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Effect to switch mode if initial data implies URL
    useEffect(() => {
        if (initialData?.thumbnail_url && initialData.thumbnail_url.startsWith('http')) {
            setThumbnailMode('url');
        }
        if (initialData?.intro_video_url) {
            setVideoMode('url');
        }
    }, [initialData]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setSaving(true);
        try {
            await onSave(values);
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (files: File[]): Promise<string[]> => {
        const uploadedUrls = await Promise.all(
            files.map(async (file) => {
                try {
                    const response = await Upload.uploadFile(file);
                    return `http://localhost:3000${response.url}`; // prepend backend URL
                } catch (error) {
                    console.error('Upload failed', error);
                    toast.error(`Failed to upload ${file.name}`);
                    return '';
                }
            })
        );
        return uploadedUrls.filter(url => url !== '');
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setCreatingMeta(true);
        try {
            const newCat = await Categories.create({ name: newCategoryName });
            setCategories([...categories, newCat]);
            form.setValue('category_id', newCat.id);
            setIsAddCategoryOpen(false);
            setNewCategoryName('');
            toast.success('Category created');
        } catch (error) {
            toast.error('Failed to create category');
        } finally {
            setCreatingMeta(false);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;
        setCreatingMeta(true);
        try {
            const newTag = await Tags.create({ name: newTagName });
            setAvailableTags([...availableTags, newTag]);

            // Auto select
            const current = form.getValues('tag_ids') || [];
            form.setValue('tag_ids', [...current, newTag.id]);

            setIsAddTagOpen(false);
            setNewTagName('');
            toast.success('Tag created');
        } catch (error) {
            toast.error('Failed to create tag');
        } finally {
            setCreatingMeta(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-h-[calc(100vh-16rem)] w-full space-y-8">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
                            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100 p-6">
                                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-8 p-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">
                                                Course Title <span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Advanced Web Development"
                                                    className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl h-12 text-base shadow-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Author Selection */}
                                <FormField
                                    control={form.control}
                                    name="author_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">Author (Instructor)</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!authors.length}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 rounded-xl h-12 shadow-sm focus:ring-0 focus:ring-offset-0">
                                                        <SelectValue placeholder="Select Course Author" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl max-h-60">
                                                    {authors.map((author) => (
                                                        <SelectItem key={author.id} value={author.id} className="cursor-pointer py-3 focus:bg-purple-50">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                                                                    {author.name.charAt(0)}
                                                                </div>
                                                                <span className="font-medium text-gray-700">{author.name}</span>
                                                                <span className="text-xs text-gray-400 ml-2">({author.role})</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-xs text-gray-400">
                                                Assign an instructor to manage this course.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">
                                                Course Slug <span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. advanced-web-development"
                                                    className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-0 transition-all rounded-xl h-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>Leave empty to auto-generate from title</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subtitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">Subtitle</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your course..."
                                                    className="h-24 bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-none rounded-xl p-4"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Difficulty Level</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl h-12">
                                                            <SelectValue placeholder="Select Level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                                        <SelectItem value="All Levels">All Levels</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Language</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. English"
                                                        className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-0 transition-all rounded-xl h-12"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">Category</FormLabel>
                                            <div className="flex gap-2">
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl h-12 flex-1">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all">
                                                            <Plus className="h-5 w-5" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Add Category</DialogTitle>
                                                            <DialogDescription>
                                                                Create a new category for your courses.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid gap-2">
                                                                <FormLabel>Name</FormLabel>
                                                                <Input
                                                                    id="name"
                                                                    value={newCategoryName}
                                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                                    className="col-span-3 rounded-xl"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="button" onClick={handleCreateCategory} disabled={creatingMeta} className="rounded-xl">
                                                                {creatingMeta && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Create Category
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tag_ids"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-grey-700 font-medium">Tags</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between bg-gray-50/50 border-gray-200 bg-white hover:bg-gray-100 hover:text-black transition-all rounded-xl h-12 font-normal",
                                                                !field.value?.length && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value?.length
                                                                ? `${field.value.length} selected`
                                                                : "Select tags"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[400px] p-0 rounded-xl shadow-xl border-gray-100">
                                                    <Command className="rounded-xl">
                                                        <CommandInput placeholder="Search tags..." className="h-12" />
                                                        <CommandList>
                                                            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                                                <p>No tag found.</p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="mt-4 rounded-lg"
                                                                    onClick={() => setIsAddTagOpen(true)}
                                                                >
                                                                    <Plus className="mr-2 h-3 w-3" /> Create new tag
                                                                </Button>
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {availableTags.map((tag) => (
                                                                    <CommandItem
                                                                        value={tag.name}
                                                                        key={tag.id}
                                                                        onSelect={() => {
                                                                            const current = field.value || [];
                                                                            const updated = current.includes(tag.id)
                                                                                ? current.filter((id) => id !== tag.id)
                                                                                : [...current, tag.id];
                                                                            field.onChange(updated);
                                                                        }}
                                                                        className="cursor-pointer py-2.5 px-3 rounded-lg mx-1 my-0.5 hover:bg-gray-100 hover:text-gray-900 aria-selected:bg-gray-200 aria-selected:text-gray-900"
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4 text-blue-600",
                                                                                field.value?.includes(tag.id) ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {tag.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                            <div className="p-2 border-t border-gray-50">
                                                                <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                                                                            <Plus className="mr-2 h-4 w-4" /> Create new tag
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="sm:max-w-[425px]">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Add Tag</DialogTitle>
                                                                            <DialogDescription>
                                                                                Create a new tag for better discoverability.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="grid gap-4 py-4">
                                                                            <div className="grid gap-2">
                                                                                <FormLabel>Name</FormLabel>
                                                                                <Input
                                                                                    id="tag-name"
                                                                                    value={newTagName}
                                                                                    onChange={(e) => setNewTagName(e.target.value)}
                                                                                    className="col-span-3 rounded-xl"
                                                                                    placeholder="e.g. React, Marketing"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <DialogFooter>
                                                                            <Button type="button" onClick={handleCreateTag} disabled={creatingMeta} className="rounded-xl">
                                                                                {creatingMeta && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                                Create Tag
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {field.value?.map((tagId) => {
                                                    const tag = availableTags.find(t => t.id === tagId);
                                                    return tag ? (
                                                        <Badge key={tagId} variant="secondary" className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors">
                                                            {tag.name}
                                                            <X
                                                                className="ml-2 h-3 w-3 cursor-pointer hover:text-blue-900"
                                                                onClick={() => {
                                                                    field.onChange(field.value?.filter((id) => id !== tagId));
                                                                }}
                                                            />
                                                        </Badge>
                                                    ) : null;
                                                })}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* What You'll Learn Section */}
                        <FormField
                            control={form.control}
                            name="learning_outcomes"
                            render={({ field }) => (
                                <FormItem>
                                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
                                        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-gray-100 p-6">
                                            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                                    <Sparkles className="h-5 w-5" />
                                                </div>
                                                What You'll Learn
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-8 p-6 space-y-4">
                                            <FormDescription className="text-gray-600 mb-6 bg-purple-50/50 p-4 rounded-xl text-sm border border-purple-100 flex gap-2">
                                                <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                                                Add 3-5 clear learning outcomes to help students understand the value of your course.
                                            </FormDescription>

                                            {/* List of existing outcomes */}
                                            {field.value && field.value.length > 0 && (
                                                <div className="space-y-3 mb-6">
                                                    {field.value.map((outcome, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-2xl group hover:border-purple-200 hover:shadow-sm transition-all shadow-sm/50"
                                                        >
                                                            <div className="min-w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 text-green-700">
                                                                <Check className="h-3.5 w-3.5" />
                                                            </div>
                                                            <p className="flex-1 text-base text-gray-700 leading-relaxed">{outcome}</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = field.value?.filter((_, i) => i !== index);
                                                                    field.onChange(updated);
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add new outcome */}
                                            <div className="flex gap-3">
                                                <Input
                                                    placeholder="e.g. Master React fundamentals and advanced patterns"
                                                    value={newOutcome}
                                                    onChange={(e) => setNewOutcome(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (newOutcome.trim()) {
                                                                field.onChange([...(field.value || []), newOutcome.trim()]);
                                                                setNewOutcome('');
                                                            }
                                                        }
                                                    }}
                                                    className="flex-1 bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-0 transition-all rounded-xl h-12 text-base"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        if (newOutcome.trim()) {
                                                            field.onChange([...(field.value || []), newOutcome.trim()]);
                                                            setNewOutcome('');
                                                        }
                                                    }}
                                                    disabled={!newOutcome.trim()}
                                                    className="rounded-xl bg-gray-900 hover:bg-black text-white px-6 h-12 shadow-lg shadow-gray-200/50 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:opacity-50"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            {(!field.value || field.value.length === 0) && (
                                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/30 mt-6">
                                                    <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 text-gray-400">
                                                        <Sparkles className="h-6 w-6" />
                                                    </div>
                                                    <p className="text-base text-gray-600 font-medium">Start adding outcomes!</p>
                                                    <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">What will students be able to do after this course?</p>
                                                </div>
                                            )}

                                            <FormMessage />
                                        </CardContent>
                                    </Card>
                                </FormItem>
                            )}
                        />

                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
                                <CardTitle className="text-xl font-semibold text-gray-800">Description</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 p-6">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                                    <RichTextEditor
                                                        content={field.value || ''}
                                                        onChange={field.onChange}
                                                        placeholder="Describe what students will learn, prerequisites, and course outcomes..."
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Media */}
                    <div className="space-y-8">
                        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                                <CardTitle className="text-lg font-medium text-gray-800">Course Thumbnail</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <Tabs value={thumbnailMode} onValueChange={(v) => setThumbnailMode(v as any)} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50 p-1 rounded-xl">
                                        <TabsTrigger value="upload" className="flex gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <UploadCloud className="w-4 h-4" /> Upload
                                        </TabsTrigger>
                                        <TabsTrigger value="url" className="flex gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <LinkIcon className="w-4 h-4" /> URL
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload">
                                        <div className="rounded-xl border-dashed border-2 border-gray-200 p-4 hover:bg-gray-50/50 transition-colors">
                                            <ImageUpload
                                                onUpload={handleFileUpload}
                                                value={form.watch('thumbnail_url')}
                                                onChange={(url) => form.setValue('thumbnail_url', url as string)}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="url">
                                        <FormField
                                            control={form.control}
                                            name="thumbnail_url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="https://..." {...field} className="rounded-xl bg-gray-50/50 border-gray-200" />
                                                    </FormControl>
                                                    {field.value && (
                                                        <div className="mt-2 relative aspect-video rounded-xl overflow-hidden bg-muted border border-gray-100">
                                                            <img
                                                                src={field.value}
                                                                alt="Preview"
                                                                className="object-cover w-full h-full"
                                                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image')}
                                                            />
                                                        </div>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                                <CardTitle className="text-lg font-medium text-gray-800">Intro Video</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <Tabs value={videoMode} onValueChange={(v) => setVideoMode(v as any)} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50 p-1 rounded-xl">
                                        <TabsTrigger value="upload" className="flex gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <UploadCloud className="w-4 h-4" /> Upload
                                        </TabsTrigger>
                                        <TabsTrigger value="url" className="flex gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <LinkIcon className="w-4 h-4" /> URL
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload">
                                        <div className="rounded-xl border-dashed border-2 border-gray-200 p-4 hover:bg-gray-50/50 transition-colors">
                                            <VideoUpload
                                                onUpload={handleFileUpload}
                                                value={form.watch('intro_video_url')}
                                                onChange={(url) => form.setValue('intro_video_url', url as string)}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="url">
                                        <FormField
                                            control={form.control}
                                            name="intro_video_url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="https://youtube.com/..." {...field} className="rounded-xl bg-gray-50/50 border-gray-200" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Floating Save Bar */}
                {/* Floating Save Bar - Manually trigger form submit handlers */}
                <FloatingSaveBar
                    onSave={() => form.handleSubmit(async (data) => {
                        setSaving(true);
                        try {
                            await onSave(data);
                        } finally {
                            setSaving(false);
                        }
                    })()}
                    onSaveAndContinue={() => form.handleSubmit(async (data) => {
                        setSaving(true);
                        try {
                            await onSaveAndContinue(data);
                        } finally {
                            setSaving(false);
                        }
                    })()}
                    loading={saving || loading}
                    isDirty={form.formState.isDirty}
                    canProceed={form.formState.isValid}
                    saveLabel="Save Changes"
                    saveAndContinueLabel="Next: Curriculum"
                    onCancel={() => window.location.href = '/dashboard/courses'}
                    cancelLabel="Exit Wizard"
                />

                <div className="h-12" /> {/* Spacer */}
            </form>
        </Form>
    );
}


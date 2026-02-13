import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import { Categories, Tags, Courses } from '@/lib/api';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    description?: string;
}

interface Tag {
    id: string;
    name: string;
}

interface CourseDetailsFormProps {
    courseId: string;
    course: any;
    onUpdate: () => void;
}

export function CourseDetailsForm({ courseId, course, onUpdate }: CourseDetailsFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState(course?.title || '');
    const [subtitle, setSubtitle] = useState(course?.subtitle || '');
    const [description, setDescription] = useState(course?.description || '');
    const [categoryId, setCategoryId] = useState(course?.category_id || '');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [price, setPrice] = useState(course?.price || 0);
    const [isFree, setIsFree] = useState(course?.is_free || false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (course) {
            setTitle(course.title || '');
            setSubtitle(course.subtitle || '');
            setDescription(course.description || '');
            setCategoryId(course.category_id || '');
            setPrice(course.price || 0);
            setIsFree(course.is_free || false);

            // Load course tags
            if (course.course_tags) {
                setSelectedTags(course.course_tags.map((ct: any) => ct.tag));
            }
        }
    }, [course]);

    const loadData = async () => {
        try {
            const [categoriesData, tagsData] = await Promise.all([
                Categories.getAll(),
                Tags.getAll(),
            ]);
            setCategories(categoriesData);
            setAllTags(tagsData);
        } catch (error) {
            console.error('Failed to load categories/tags:', error);
            toast.error('Failed to load categories and tags');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = (tag: Tag) => {
        if (!selectedTags.find(t => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleRemoveTag = (tagId: string) => {
        setSelectedTags(selectedTags.filter(t => t.id !== tagId));
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const newTag = await Tags.create({ name: newTagName.trim() });
            setAllTags([...allTags, newTag]);
            handleAddTag(newTag);
            setNewTagName('');
            toast.success(`Tag "${newTag.name}" created`);
        } catch (error: any) {
            console.error('Failed to create tag:', error);
            toast.error(error.response?.data?.message || 'Failed to create tag');
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error('Course title is required');
            return;
        }

        setSaving(true);
        try {
            await Courses.update(courseId, {
                title: title.trim(),
                subtitle: subtitle.trim() || undefined,
                description: description.trim() || undefined,
                category_id: categoryId || undefined,
                price: isFree ? 0 : price,
                is_free: isFree,
                tag_ids: selectedTags.map(t => t.id),
            });

            toast.success('Course details updated successfully!');
            onUpdate();
        } catch (error: any) {
            console.error('Failed to update course:', error);
            toast.error(error.response?.data?.message || 'Failed to update course');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>

                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Course Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Introduction to React Development"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                            id="subtitle"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Learn React from scratch with hands-on projects"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what students will learn in this course..."
                            rows={5}
                        />
                    </div>
                </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Category & Tags</h3>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Tag Selection */}
                <div className="space-y-2">
                    <Label>Tags</Label>

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                            {selectedTags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    className="gap-1 pl-3 pr-1 py-1"
                                >
                                    {tag.name}
                                    <button
                                        onClick={() => handleRemoveTag(tag.id)}
                                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Create New Tag */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Add Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Create tag input */}
                            <div className="flex gap-2">
                                <Input
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="Create new tag..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                                />
                                <Button
                                    onClick={handleCreateTag}
                                    disabled={!newTagName.trim()}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create
                                </Button>
                            </div>

                            {/* Existing tags */}
                            <div className="flex flex-wrap gap-2">
                                {allTags
                                    .filter(tag => !selectedTags.find(t => t.id === tag.id))
                                    .map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                            onClick={() => handleAddTag(tag)}
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Pricing</h3>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isFree}
                            onChange={(e) => setIsFree(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm">This course is free</span>
                    </label>
                </div>

                {!isFree && (
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                            placeholder="49.99"
                        />
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

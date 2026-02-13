import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Image as ImageIcon, Video, DollarSign, Plus, X, Tag, FolderPlus } from "lucide-react";
import type { CourseData } from "@/pages/dashboard/CourseBuilder";
import { useState, useEffect } from "react";
import { Categories, Tags } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CourseBasicInfoProps {
  data: CourseData;
  onUpdate: (updates: Partial<CourseData>) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface TagItem {
  id: string;
  name: string;
}

const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all", label: "All Levels" },
];

const languages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "hindi", label: "Hindi" },
  { value: "chinese", label: "Chinese" },
];

export function CourseBasicInfo({ data, onUpdate }: CourseBasicInfoProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Category dialog state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  useEffect(() => {
    // Update selected tags when data.tags changes
    if (data.tags && data.tags.length > 0) {
      const selected = tags.filter(tag => data.tags.includes(tag.id));
      setSelectedTags(selected);
    }
  }, [data.tags, tags]);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await Categories.getAll();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadTags = async () => {
    try {
      const fetchedTags = await Tags.getAll();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "create_new") {
      setShowCategoryDialog(true);
      return;
    }

    const category = categories.find(c => c.id === categoryId);
    onUpdate({
      categoryId: categoryId,
      category: category?.slug || "",
    });
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCategory(true);
    try {
      const newCategory = await Categories.create({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      });

      setCategories([...categories, newCategory]);
      onUpdate({
        categoryId: newCategory.id,
        category: newCategory.slug,
      });

      setShowCategoryDialog(false);
      setNewCategoryName("");
      setNewCategoryDescription("");

      toast({
        title: "Success",
        description: "Category created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create category",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleAddTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag && !selectedTags.find(t => t.id === tagId)) {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      onUpdate({ tags: newSelectedTags.map(t => t.id) });
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const newSelectedTags = selectedTags.filter(t => t.id !== tagId);
    setSelectedTags(newSelectedTags);
    onUpdate({ tags: newSelectedTags.map(t => t.id) });
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name is required",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingTag(true);
    try {
      const newTag = await Tags.create({ name: newTagName.trim() });
      setTags([...tags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      onUpdate({ tags: [...selectedTags.map(t => t.id), newTag.id] });
      setNewTagName("");
      toast({ title: "Success", description: "Tag created successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create tag",
        variant: "destructive"
      });
    } finally {
      setIsCreatingTag(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete Web Development Bootcamp"
                  value={data.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Course Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="A brief tagline for your course"
                  value={data.subtitle}
                  onChange={(e) => onUpdate({ subtitle: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn, prerequisites, and course outcomes..."
                  value={data.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={6}
                  className="rounded-xl resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Category *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCategoryDialog(true)}
                      className="h-auto p-1 text-xs"
                    >
                      <FolderPlus className="h-3 w-3 mr-1" />
                      New
                    </Button>
                  </div>
                  <Select value={data.categoryId} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="create_new" className="text-primary font-medium">
                        <div className="flex items-center">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Category
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Level *</Label>
                  <Select value={data.level} onValueChange={(value) => onUpdate({ level: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language *</Label>
                  <Select value={data.language} onValueChange={(value) => onUpdate({ language: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </Label>

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="rounded-full">
                        {tag.name}
                        <button
                          onClick={() => handleRemoveTag(tag.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Tag Dropdown */}
                <Select onValueChange={handleAddTag}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Add tags..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.filter(tag => !selectedTags.find(st => st.id === tag.id)).map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Create New Tag */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Create new tag..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                    className="rounded-xl"
                  />
                  <Button
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || isCreatingTag}
                    className="rounded-xl shrink-0"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isCreatingTag ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
              <CardDescription>Set your course price</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="99.00"
                    value={data.price || ""}
                    onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="49.00"
                    value={data.salePrice || ""}
                    onChange={(e) => onUpdate({ salePrice: parseFloat(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for no discount</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Course Thumbnail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-lms-blue/50 transition-colors cursor-pointer bg-muted/30">
                {data.thumbnail ? (
                  <img
                    src={data.thumbnail}
                    alt="Thumbnail"
                    className="w-full aspect-video object-cover rounded-xl"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload thumbnail</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recommended: 1280x720 (16:9)</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Promo Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-lms-blue/50 transition-colors cursor-pointer bg-muted/30">
                <div className="space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                    <Video className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upload promo video</p>
                    <p className="text-xs text-muted-foreground">MP4 up to 500MB</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Optional but recommended</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for your course. This will be available for all courses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                placeholder="e.g., Web Development"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description (Optional)</Label>
              <Textarea
                id="category-description"
                placeholder="Brief description of this category..."
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCategoryDialog(false);
                setNewCategoryName("");
                setNewCategoryDescription("");
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || isCreatingCategory}
              className="rounded-xl"
            >
              {isCreatingCategory ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

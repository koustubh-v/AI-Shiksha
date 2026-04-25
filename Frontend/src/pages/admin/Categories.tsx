import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2, Tags, Layers, Trash2, Edit } from "lucide-react";
import { Categories, Tags as TagsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Category } from "./components/CategoryColumns";
import { Tag } from "./components/TagColumns";
import { IconPicker } from "@/components/common/IconPicker";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Category dialog state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "",
  });
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // Tag dialog state
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);

  const [activeTab, setActiveTab] = useState<"CATEGORIES" | "TAGS">("CATEGORIES");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await Categories.getAll();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadTags = async () => {
    setIsLoadingTags(true);
    try {
      const data = await TagsApi.getAll();
      setTags(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tags",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }

    setIsSubmittingCategory(true);
    try {
      if (isEditMode && editingCategory) {
        await Categories.update(editingCategory.id, categoryForm);
        toast({ title: "Success", description: "Category updated successfully" });
      } else {
        await Categories.create(categoryForm);
        toast({ title: "Success", description: "Category created successfully" });
      }

      await loadCategories();
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to save category", variant: "destructive" });
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
    setIsEditMode(true);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await Categories.delete(category.id);
      toast({ title: "Success", description: "Category deleted successfully" });
      await loadCategories();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to delete category", variant: "destructive" });
    }
  };

  const handleBulkDeleteCategories = async () => {
    if (!selectedCategories.length) return;
    if (!confirm(`Delete ${selectedCategories.length} categories?`)) return;
    try {
      await Promise.all(selectedCategories.map(id => Categories.delete(id)));
      toast({ title: "Success", description: `Deleted ${selectedCategories.length} categories` });
      setSelectedCategories([]);
      loadCategories();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete some categories", variant: "destructive" });
    }
  };

  const handleCreateTag = async () => {
    if (!tagName.trim()) {
      toast({ title: "Error", description: "Tag name is required", variant: "destructive" });
      return;
    }
    setIsSubmittingTag(true);
    try {
      await TagsApi.create({ name: tagName.trim() });
      toast({ title: "Success", description: "Tag created successfully" });
      await loadTags();
      setIsTagDialogOpen(false);
      setTagName("");
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create tag", variant: "destructive" });
    } finally {
      setIsSubmittingTag(false);
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      await TagsApi.delete(tag.id);
      toast({ title: "Success", description: "Tag deleted successfully" });
      await loadTags();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to delete tag", variant: "destructive" });
    }
  };

  const handleBulkDeleteTags = async () => {
    if (!selectedTags.length) return;
    if (!confirm(`Delete ${selectedTags.length} tags?`)) return;
    try {
      await Promise.all(selectedTags.map(id => TagsApi.delete(id)));
      toast({ title: "Success", description: `Deleted ${selectedTags.length} tags` });
      setSelectedTags([]);
      loadTags();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete some tags", variant: "destructive" });
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "", icon: "" });
    setIsEditMode(false);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTags = tags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AdminDashboardLayout title="Categories & Tags" subtitle="Manage course organization and taxonomy">
      <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">

        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-8 shadow-2xl border border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-sky-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
            
            <div className="relative z-10 space-y-2">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                    Taxonomy
                </h2>
                <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                    Organize courses into categories and assign descriptive skill tags.
                </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0">
                {activeTab === "CATEGORIES" ? (
                    <Button className="h-12 bg-white hover:bg-zinc-200 text-zinc-900 rounded-none font-bold uppercase tracking-widest px-6 w-full sm:w-auto" onClick={() => setIsCategoryDialogOpen(true)}>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Category
                    </Button>
                ) : (
                    <Button className="h-12 bg-white hover:bg-zinc-200 text-zinc-900 rounded-none font-bold uppercase tracking-widest px-6 w-full sm:w-auto" onClick={() => setIsTagDialogOpen(true)}>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Tag
                    </Button>
                )}
            </div>
        </div>

        {/* Brutalist Toggle */}
        <div className="flex justify-center">
            <div className="inline-flex bg-white/40 dark:bg-zinc-900/40 p-1 rounded-none border border-black/10 dark:border-white/10 shadow-sm backdrop-blur-md">
                <button
                    onClick={() => setActiveTab("CATEGORIES")}
                    className={`flex items-center gap-2 px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all ${
                        activeTab === "CATEGORIES"
                            ? "bg-indigo-600 text-white shadow-md border border-indigo-500/20"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50"
                    }`}
                >
                    <Layers className="h-4 w-4" />
                    Categories ({categories.length})
                </button>
                <button
                    onClick={() => setActiveTab("TAGS")}
                    className={`flex items-center gap-2 px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all ${
                        activeTab === "TAGS"
                            ? "bg-indigo-600 text-white shadow-md border border-indigo-500/20"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50"
                    }`}
                >
                    <Tags className="h-4 w-4" />
                    Tags ({tags.length})
                </button>
            </div>
        </div>

        {/* Ledger */}
        <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="border-b border-black/5 dark:border-white/5 p-6 bg-white/40 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Input
                        className="pl-4 h-10 rounded-none border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 font-medium"
                        placeholder={`Search ${activeTab.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Bulk Actions */}
            {activeTab === "CATEGORIES" && selectedCategories.length > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-900/50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                            onCheckedChange={() => {
                                if (selectedCategories.length === filteredCategories.length) setSelectedCategories([]);
                                else setSelectedCategories(filteredCategories.map(c => c.id));
                            }}
                            className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white rounded-none"
                        />
                        <span className="text-sm font-bold text-red-900 dark:text-red-200 uppercase tracking-widest">
                            {selectedCategories.length} Selected
                        </span>
                    </div>
                    <Button variant="destructive" size="sm" className="rounded-none text-xs font-bold uppercase tracking-widest gap-2" onClick={handleBulkDeleteCategories}>
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </Button>
                </div>
            )}

            {activeTab === "TAGS" && selectedTags.length > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-900/50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={selectedTags.length === filteredTags.length && filteredTags.length > 0}
                            onCheckedChange={() => {
                                if (selectedTags.length === filteredTags.length) setSelectedTags([]);
                                else setSelectedTags(filteredTags.map(t => t.id));
                            }}
                            className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white rounded-none"
                        />
                        <span className="text-sm font-bold text-red-900 dark:text-red-200 uppercase tracking-widest">
                            {selectedTags.length} Selected
                        </span>
                    </div>
                    <Button variant="destructive" size="sm" className="rounded-none text-xs font-bold uppercase tracking-widest gap-2" onClick={handleBulkDeleteTags}>
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </Button>
                </div>
            )}

            <div className="p-0">
                {activeTab === "CATEGORIES" ? (
                    isLoadingCategories ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Categories...</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                <Layers className="h-8 w-8 text-zinc-400" />
                            </div>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white">No categories found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-black/5 dark:divide-white/5">
                            {filteredCategories.map((category) => (
                                <div key={category.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Checkbox
                                            checked={selectedCategories.includes(category.id)}
                                            onCheckedChange={() => {
                                                if (selectedCategories.includes(category.id)) setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                                                else setSelectedCategories([...selectedCategories, category.id]);
                                            }}
                                            className="rounded-none"
                                        />
                                        <div className="h-10 w-10 shrink-0 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-none flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-black">
                                            {category.icon || "📁"}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                                                {category.name}
                                            </h4>
                                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                                {category.description || "No description"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 shrink-0">
                                        <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border border-zinc-500/30 text-zinc-600 dark:text-zinc-300 bg-zinc-500/5 mr-4">
                                            {category._count?.courses || 0} Courses
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-none border border-transparent hover:border-black/10 dark:hover:border-white/10 shrink-0 h-9 w-9">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-black/10 dark:border-white/10">
                                                <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-bold uppercase tracking-widest" onClick={() => handleEditCategory(category)}>
                                                    <Edit className="h-3 w-3" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-bold uppercase tracking-widest text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-500/10" onClick={() => handleDeleteCategory(category)}>
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    isLoadingTags ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Loading Tags...</p>
                        </div>
                    ) : filteredTags.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center px-4">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-none flex items-center justify-center mb-2">
                                <Tags className="h-8 w-8 text-zinc-400" />
                            </div>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white">No tags found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-black/5 dark:divide-white/5">
                            {filteredTags.map((tag) => (
                                <div key={tag.id} className="group p-4 md:p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Checkbox
                                            checked={selectedTags.includes(tag.id)}
                                            onCheckedChange={() => {
                                                if (selectedTags.includes(tag.id)) setSelectedTags(selectedTags.filter(id => id !== tag.id));
                                                else setSelectedTags([...selectedTags, tag.id]);
                                            }}
                                            className="rounded-none"
                                        />
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-none border border-black/10 dark:border-white/10">
                                            #{tag.name}
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 shrink-0">
                                        <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-2 py-1 border border-zinc-500/30 text-zinc-600 dark:text-zinc-300 bg-zinc-500/5 mr-4">
                                            {tag._count?.courses || 0} Courses
                                        </Badge>
                                        <Button variant="ghost" size="icon" className="rounded-none border border-transparent hover:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0 h-9 w-9 text-red-600" onClick={() => handleDeleteTag(tag)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
        setIsCategoryDialogOpen(open);
        if (!open) resetCategoryForm();
      }}>
        <DialogContent className="rounded-none border border-black/10 dark:border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl uppercase tracking-widest">{isEditMode ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Name *</Label>
              <Input
                placeholder="e.g. Web Development"
                className="rounded-none border-black/10 dark:border-white/10 h-12"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</Label>
              <Textarea
                placeholder="Category description..."
                className="rounded-none border-black/10 dark:border-white/10 min-h-[100px] resize-none"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Emoji Icon</Label>
              <div className="border border-black/10 dark:border-white/10 p-2">
                  <IconPicker
                    value={categoryForm.icon || ""}
                    onChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
                  />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest text-xs" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
            <Button className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold uppercase tracking-widest text-xs" onClick={handleCreateCategory} disabled={isSubmittingCategory}>
              {isSubmittingCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="rounded-none border border-black/10 dark:border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-xl uppercase tracking-widest">Add New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tag Name *</Label>
              <Input
                placeholder="e.g. React.js"
                className="rounded-none border-black/10 dark:border-white/10 h-12"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest text-xs" onClick={() => setIsTagDialogOpen(false)}>Cancel</Button>
            <Button className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold uppercase tracking-widest text-xs" onClick={handleCreateTag} disabled={isSubmittingTag}>
              {isSubmittingTag ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
}

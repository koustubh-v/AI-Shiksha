
import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import { Categories, Tags } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { createCategoryColumns, Category } from "./components/CategoryColumns";
import { createTagColumns, Tag } from "./components/TagColumns";
import { IconPicker } from "@/components/common/IconPicker";

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
      console.error("Failed to load categories:", error);
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
      const data = await Tags.getAll();
      setTags(data);
    } catch (error) {
      console.error("Failed to load tags:", error);
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
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingCategory(true);
    try {
      if (isEditMode && editingCategory) {
        await Categories.update(editingCategory.id, categoryForm);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await Categories.create(categoryForm);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      await loadCategories();
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save category",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      await loadCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeleteCategories = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => Categories.delete(id)));
      toast({
        title: "Success",
        description: `Deleted ${ids.length} categories`,
      });
      loadCategories();
    } catch (error) {
      console.error("Failed to bulk delete", error);
      toast({
        title: "Error",
        description: "Failed to delete some categories",
        variant: "destructive",
      });
    }
  };


  const handleCreateTag = async () => {
    if (!tagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingTag(true);
    try {
      await Tags.create({ name: tagName.trim() });
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
      await loadTags();
      setIsTagDialogOpen(false);
      setTagName("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create tag",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingTag(false);
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      await Tags.delete(tag.id);
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      await loadTags();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeleteTags = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => Tags.delete(id)));
      toast({
        title: "Success",
        description: `Deleted ${ids.length} tags`,
      });
      loadTags();
    } catch (error) {
      console.error("Failed to bulk delete", error);
      toast({
        title: "Error",
        description: "Failed to delete some tags",
        variant: "destructive",
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "", icon: "" });
    setIsEditMode(false);
    setEditingCategory(null);
  };

  const categoryColumns = createCategoryColumns({
    onEdit: handleEditCategory,
    onDelete: handleDeleteCategory
  });

  const tagColumns = createTagColumns({
    onDelete: handleDeleteTag
  });


  return (
    <AdminDashboardLayout title="Categories & Tags" subtitle="Manage course organization variables">
      <div className="space-y-6">
        <Tabs defaultValue="categories" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="tags">Skill Tags</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
                setIsCategoryDialogOpen(open);
                if (!open) resetCategoryForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl">
                    <Plus className="h-4 w-4" /> Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
                    <DialogDescription>
                      {isEditMode ? "Update the category details." : "Create a new category to organize courses."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cat-title">Name *</Label>
                      <Input
                        id="cat-title"
                        placeholder="e.g. Web Development"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cat-desc">Description</Label>
                      <Textarea
                        id="cat-desc"
                        placeholder="Category description..."
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Icon</Label>
                      <IconPicker
                        value={categoryForm.icon || ""}
                        onChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCategoryDialogOpen(false);
                        resetCategoryForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleCreateCategory}
                      disabled={isSubmittingCategory}
                    >
                      {isSubmittingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditMode ? "Update Category" : "Create Category"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <DataTable
              columns={categoryColumns}
              data={categories}
              filterColumn="name"
              onDeleteSelected={handleBulkDeleteCategories}
              isLoading={isLoadingCategories}
            />
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div className="flex justify-end">

              <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl">
                    <Plus className="h-4 w-4" /> Add Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Tag</DialogTitle>
                    <DialogDescription>Create a new skill tag for courses.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tag-name">Tag Name *</Label>
                      <Input
                        id="tag-name"
                        placeholder="e.g. React.js"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsTagDialogOpen(false);
                        setTagName("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleCreateTag}
                      disabled={isSubmittingTag}
                    >
                      {isSubmittingTag && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Tag
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <DataTable
              columns={tagColumns}
              data={tags}
              filterColumn="name"
              onDeleteSelected={handleBulkDeleteTags}
              isLoading={isLoadingTags}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

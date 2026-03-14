import { useState, useEffect } from "react";
import { pagesService, Page } from "@/lib/api/pagesService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editors/RichTextEditor";
import { ArrowLeft, Save, Loader2, Edit2, Globe, EyeOff, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";

const PREDEFINED_PAGES = [
  { slug: "privacy-policy", defaultTitle: "Privacy Policy" },
  { slug: "terms-and-condition", defaultTitle: "Terms and Condition" },
  { slug: "about-us", defaultTitle: "About Us" },
  { slug: "contact-us", defaultTitle: "Contact Us" },
  { slug: "refund-policy", defaultTitle: "Refund Policy" },
  { slug: "careers", defaultTitle: "Careers" },
];

export default function PolicyPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Partial<Page> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await pagesService.getPages();
      setPages(data);
    } catch (error) {
      toast.error("Failed to load pages");
    } finally {
      setIsLoading(false);
    }
  };

  const getPageData = (slug: string, defaultTitle: string) => {
    return pages.find((p) => p.slug === slug) || {
      slug,
      title: defaultTitle,
      content: "",
      is_published: false,
    };
  };

  const handleEdit = (slug: string, defaultTitle: string) => {
    setEditingPage(getPageData(slug, defaultTitle));
  };

  const handleSave = async () => {
    if (!editingPage?.slug) return;
    try {
      setIsSaving(true);
      await pagesService.upsertPage(editingPage.slug, {
        title: editingPage.title || "",
        content: editingPage.content || "",
        is_published: !!editingPage.is_published,
      });
      toast.success("Page updated successfully");
      await fetchPages();
      setEditingPage(null);
    } catch (error) {
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublishStatus = async (slug: string, currentStatus: boolean, defaultTitle: string) => {
    try {
      const existing = getPageData(slug, defaultTitle);
      await pagesService.upsertPage(slug, {
        title: existing.title,
        content: existing.content,
        is_published: !currentStatus,
      });
      toast.success(currentStatus ? "Page unpublished" : "Page published");
      fetchPages();
    } catch (error) {
      toast.error("Failed to toggle publish status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (editingPage) {
    return (
      <AdminDashboardLayout title="Policy Pages" subtitle="Manage your standard policy and informational pages.">
        <div className="max-w-5xl space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setEditingPage(null)} className="rounded-full hover:bg-slate-100 h-10 w-10">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Page</h1>
              <p className="text-sm text-slate-500 font-medium tracking-wide">Editing /{editingPage.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Published</span>
              <Switch
                checked={editingPage.is_published}
                onCheckedChange={(c) => setEditingPage({ ...editingPage, is_published: c })}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-full px-6 shadow-sm">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Page Title</label>
              <Input
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                placeholder="Enter page title..."
                className="rounded-2xl h-12 px-4 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 text-base"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Content Editor</label>
              <RichTextEditor
                content={editingPage.content || ""}
                onChange={(html) => setEditingPage({ ...editingPage, content: html })}
                placeholder="Write your page content here..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Policy Pages" subtitle="Manage your standard policy and informational pages.">
      <div className="max-w-6xl space-y-10 animate-in fade-in duration-500">

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PREDEFINED_PAGES.map(({ slug, defaultTitle }) => {
          const page = pages.find((p) => p.slug === slug);
          const isPublished = page?.is_published || false;

          return (
            <Card key={slug} className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-3xl group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                    <FileText className="h-5 w-5" />
                  </div>
                  {isPublished ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 rounded-full font-medium text-xs">
                      <Globe className="mr-1.5 h-3.5 w-3.5" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-3 py-1 rounded-full font-medium text-xs">
                      <EyeOff className="mr-1.5 h-3.5 w-3.5" /> Draft
                    </Badge>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800">{page?.title || defaultTitle}</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1 truncate">/{slug}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-2">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isPublished}
                      onCheckedChange={() => togglePublishStatus(slug, isPublished, defaultTitle)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm font-semibold text-slate-600">
                      {isPublished ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(slug, defaultTitle)} className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold px-4 transition-colors">
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
    </AdminDashboardLayout>
  );
}

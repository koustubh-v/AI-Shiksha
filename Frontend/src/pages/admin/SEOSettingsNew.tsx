import { useState, useEffect, useRef } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, Share2, Code, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { Settings as PlatformSettingsAPI, Upload as UploadAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useFranchise } from "@/contexts/FranchiseContext";
import { getImageUrl } from "@/lib/utils";

export default function SEOSettingsPage() {
  const { toast } = useToast();
  const { refresh: refreshFranchise } = useFranchise();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // General SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Social / Open Graph
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterHandle, setTwitterHandle] = useState("");

  // Technical SEO
  const [generateSitemap, setGenerateSitemap] = useState(true);
  const [robotsTxt, setRobotsTxt] = useState(true);
  const [schemaMarkup, setSchemaMarkup] = useState(true);
  const [canonicalTags, setCanonicalTags] = useState(true);
  const [customHeadScripts, setCustomHeadScripts] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    try {
      const data = await PlatformSettingsAPI.getPlatformSettings();
      setSeoTitle(data.seo_title || "");
      setSeoDescription(data.seo_description || "");
      setSeoKeywords(data.seo_keywords || "");
      
      setOgTitle(data.seo_og_title || "");
      setOgDescription(data.seo_og_description || "");
      setOgImage(data.seo_og_image || "");
      setTwitterCard(data.seo_twitter_card || "summary_large_image");
      setTwitterHandle(data.seo_twitter_handle || "");
      
      setGenerateSitemap(data.seo_technical_sitemap ?? true);
      setRobotsTxt(data.seo_technical_robots_txt ?? true);
      setSchemaMarkup(data.seo_technical_schema_markup ?? true);
      setCanonicalTags(data.seo_technical_canonical_tags ?? true);
      setCustomHeadScripts(data.seo_custom_head_scripts || "");
    } catch (error) {
      toast({ title: "Error", description: "Failed to load SEO settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSaveSEO = async () => {
    setSaving(true);
    try {
      await PlatformSettingsAPI.updatePlatformSettings({
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        seo_og_title: ogTitle,
        seo_og_description: ogDescription,
        seo_og_image: ogImage,
        seo_twitter_card: twitterCard,
        seo_twitter_handle: twitterHandle,
        seo_technical_sitemap: generateSitemap,
        seo_technical_robots_txt: robotsTxt,
        seo_technical_schema_markup: schemaMarkup,
        seo_technical_canonical_tags: canonicalTags,
        seo_custom_head_scripts: customHeadScripts,
      });
      await refreshFranchise();
      toast({ title: "Success", description: "SEO settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update SEO settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await UploadAPI.uploadFile(file);
      setOgImage(result.url);
      toast({ title: "Success", description: "OG Image uploaded successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout title="SEO Settings" subtitle="Optimize your platform for search engines">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="SEO Settings" subtitle="Optimize your platform for search engines">
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General SEO</TabsTrigger>
            <TabsTrigger value="social">Social / Open Graph</TabsTrigger>
            <TabsTrigger value="technical">Technical SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  General SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Site Title</Label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. LearnAI - AI-Powered Learning Platform"
                    disabled={loading || saving}
                  />
                  <p className="text-sm text-muted-foreground">Recommended: 50-60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Brief description of your platform for search engines..."
                    rows={3}
                    disabled={loading || saving}
                  />
                  <p className="text-sm text-muted-foreground">Recommended: 150-160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <Input
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="online learning, AI courses, e-learning platform"
                    disabled={loading || saving}
                  />
                  <p className="text-sm text-muted-foreground">Separate keywords with commas</p>
                </div>
                <Button onClick={handleSaveSEO} disabled={loading || saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Open Graph Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>OG Title</Label>
                  <Input 
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder="Will fallback to General Site Title if empty" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Description</Label>
                  <Textarea
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    placeholder="Will fallback to General Meta Description if empty"
                    rows={2}
                  />
                </div>
                <div className="space-y-4">
                  <Label>OG Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center">
                    {ogImage ? (
                      <div className="mb-4 relative group w-full max-w-sm rounded overflow-hidden">
                        <img src={getImageUrl(ogImage)} alt="OG Preview" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                             Change Image
                           </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground mb-2">Recommended: 1200x630 pixels</p>
                      </>
                    )}
                    
                    {!ogImage && (
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                        {uploadingImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Upload Image"}
                      </Button>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Twitter Card Type</Label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value)}
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                      <option value="app">app</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter Handle</Label>
                    <Input 
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      placeholder="@yourhandle" 
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSEO} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Social Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technical SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Generate Sitemap</Label>
                    <p className="text-sm text-muted-foreground">Automatically generate and update sitemap.xml</p>
                  </div>
                  <Switch checked={generateSitemap} onCheckedChange={setGenerateSitemap} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Robots.txt</Label>
                    <p className="text-sm text-muted-foreground">Allow search engines to index your site</p>
                  </div>
                  <Switch checked={robotsTxt} onCheckedChange={setRobotsTxt} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Schema Markup</Label>
                    <p className="text-sm text-muted-foreground">Add structured data for rich snippets</p>
                  </div>
                  <Switch checked={schemaMarkup} onCheckedChange={setSchemaMarkup} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Canonical Tags</Label>
                    <p className="text-sm text-muted-foreground">Prevent duplicate content issues</p>
                  </div>
                  <Switch checked={canonicalTags} onCheckedChange={setCanonicalTags} />
                </div>
                <div className="space-y-2">
                  <Label>Custom Head Scripts</Label>
                  <Textarea
                    placeholder="<!-- Add custom scripts like Google Analytics, etc. -->"
                    rows={4}
                    className="font-mono text-sm"
                    value={customHeadScripts}
                    onChange={(e) => setCustomHeadScripts(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveSEO} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Technical Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

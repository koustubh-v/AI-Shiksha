import { useState, useEffect } from "react";
import { footerSettingsService, FooterSetting, MenuItem, SocialLink } from "@/lib/api/footerSettingsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";

export default function FooterSettings() {
  const [settings, setSettings] = useState<FooterSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await footerSettingsService.getSettings();
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load footer settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      await footerSettingsService.updateSettings(settings);
      toast.success("Footer settings saved successfully");
    } catch (error) {
      toast.error("Failed to save footer settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof FooterSetting, value: any) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Menu Items Management
  const addMenu = () => {
    if (!settings) return;
    updateField("menus", [...settings.menus, { label: "", url: "" }]);
  };

  const updateMenu = (index: number, field: keyof MenuItem, value: string) => {
    if (!settings) return;
    const newMenus = [...settings.menus];
    newMenus[index] = { ...newMenus[index], [field]: value };
    updateField("menus", newMenus);
  };

  const removeMenu = (index: number) => {
    if (!settings) return;
    updateField(
      "menus",
      settings.menus.filter((_, i) => i !== index)
    );
  };

  // Social Links Management
  const addSocial = () => {
    if (!settings) return;
    updateField("social_links", [...settings.social_links, { platform: "", url: "" }]);
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    if (!settings) return;
    const newSocials = [...settings.social_links];
    newSocials[index] = { ...newSocials[index], [field]: value };
    updateField("social_links", newSocials);
  };

  const removeSocial = (index: number) => {
    if (!settings) return;
    updateField(
      "social_links",
      settings.social_links.filter((_, i) => i !== index)
    );
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AdminDashboardLayout title="Footer Settings" subtitle="Customize your public unified footer.">
      <div className="max-w-5xl space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-end bg-white/50 backdrop-blur top-0 sticky z-10 py-4 -my-4 mb-4">
          <Button onClick={handleSave} disabled={isSaving} className="rounded-full px-6 shadow-sm">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Settings
          </Button>
        </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 pt-8 px-8">
            <CardTitle className="text-2xl text-slate-800">Branding & Details</CardTitle>
            <CardDescription className="text-sm font-medium mt-2">Primary branding details displayed in the footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 px-8 pb-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 ml-1">Site Title</label>
                <Input
                  value={settings.site_title || ""}
                  onChange={(e) => updateField("site_title", e.target.value)}
                  placeholder="e.g. My Custom LMS"
                  className="rounded-2xl h-12 px-4 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 ml-1">Copyright Text</label>
                <Input
                  value={settings.copyright_text || ""}
                  onChange={(e) => updateField("copyright_text", e.target.value)}
                  placeholder="e.g. © 2026 My LMS. All rights reserved."
                  className="rounded-2xl h-12 px-4 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 text-base"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Footer Logo URL</label>
              <Input
                value={settings.logo_url || ""}
                onChange={(e) => updateField("logo_url", e.target.value)}
                placeholder="https://example.com/logo-light.png"
                className="rounded-2xl h-12 px-4 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 text-base"
              />
              <p className="text-xs font-medium text-slate-500 ml-2">Optional. Displays above the site title if provided.</p>
            </div>
            
            <div className="flex items-center justify-between p-6 border border-slate-100 rounded-3xl bg-slate-50/80 mt-8 transition-colors hover:bg-slate-50">
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-slate-800">Support Section Visibility</h4>
                <p className="text-sm font-medium text-slate-500">
                  Displays standard policy pages like Privacy, Terms, dynamically.
                </p>
              </div>
              <Switch
                checked={settings.show_support_section}
                onCheckedChange={(c) => updateField("show_support_section", c)}
                className="data-[state=checked]:bg-blue-600 scale-110"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 pt-8 px-8 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl text-slate-800">Custom Menu Links</CardTitle>
              <CardDescription className="text-sm font-medium mt-1">Add custom links to display in the footer navigation.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addMenu} className="rounded-full shadow-sm hover:bg-slate-100 mt-0">
              <Plus className="h-4 w-4 mr-2" /> Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 px-8 pb-8">
            {settings.menus.length === 0 && (
              <div className="text-center py-10 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-500">No custom menu links added.</p>
              </div>
            )}
            {settings.menus.map((menu, index) => (
              <div key={index} className="flex gap-4 items-start group">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Link Label (e.g. Courses)"
                    value={menu.label}
                    onChange={(e) => updateMenu(index, "label", e.target.value)}
                    className="rounded-2xl h-12 bg-white border-slate-200 focus-visible:ring-blue-500/20"
                  />
                </div>
                <div className="flex-[1.5] space-y-2">
                  <Input
                    placeholder="URL (e.g. /courses or https://...)"
                    value={menu.url}
                    onChange={(e) => updateMenu(index, "url", e.target.value)}
                    className="rounded-2xl h-12 bg-white border-slate-200 focus-visible:ring-blue-500/20"
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeMenu(index)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden mb-10">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 pt-8 px-8 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl text-slate-800">Social Links</CardTitle>
              <CardDescription className="text-sm font-medium mt-1">Links to your social media profiles.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addSocial} className="rounded-full shadow-sm hover:bg-slate-100 mt-0">
              <Plus className="h-4 w-4 mr-2" /> Add Social
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 px-8 pb-8">
            {settings.social_links.length === 0 && (
              <div className="text-center py-10 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-500">No social media links added.</p>
              </div>
            )}
            {settings.social_links.map((social, index) => (
              <div key={index} className="flex gap-4 items-start group">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Platform (e.g. twitter, facebook, linkedin, youtube)"
                    value={social.platform}
                    onChange={(e) => updateSocial(index, "platform", e.target.value)}
                    className="rounded-2xl h-12 bg-white border-slate-200 focus-visible:ring-blue-500/20"
                  />
                </div>
                <div className="flex-[1.5] space-y-2">
                  <Input
                    placeholder="URL Address"
                    value={social.url}
                    onChange={(e) => updateSocial(index, "url", e.target.value)}
                    className="rounded-2xl h-12 bg-white border-slate-200 focus-visible:ring-blue-500/20"
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSocial(index)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      </div>
    </AdminDashboardLayout>
  );
}

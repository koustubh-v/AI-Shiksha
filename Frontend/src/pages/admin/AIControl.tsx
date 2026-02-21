import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, Smartphone, Zap, ExternalLink, Key, Plus, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AdminSettings } from "@/lib/api";

type BotStatus = "active" | "inactive";

interface Chatbot {
  id: string;
  name: string;
  role: string;
  status: BotStatus;
}

export default function AIControlPage() {
  const { toast } = useToast();
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    { id: "1", name: "Support Assistant", role: "Customer Support", status: "active" },
    { id: "2", name: "Course Advisor", role: "Sales", status: "inactive" },
  ]);
  const [whatsappBots, setWhatsappBots] = useState<Chatbot[]>([
    { id: "1", name: "Enrollment Helper", role: "Onboarding", status: "active" },
  ]);

  useEffect(() => {
    fetchAiSettings();
  }, []);

  const fetchAiSettings = async () => {
    setIsLoading(true);
    try {
      const data = await AdminSettings.getAiSettings();
      setIsAiEnabled(data.global_ai_control ?? true);
      setApiKey(data.gemini_api_key ?? "");
    } catch (error) {
      console.error("Failed to fetch AI settings", error);
      toast({
        title: "Error",
        description: "Failed to load AI settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (updates: {
    gemini_api_key?: string;
    global_ai_control?: boolean;
  }) => {
    setIsSaving(true);
    try {
      await AdminSettings.updateAiSettings(updates);
      return true;
    } catch (error) {
      console.error("Error saving AI settings", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApiKey = async () => {
    const success = await saveSettings({ gemini_api_key: apiKey });
    if (success) {
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been securely stored.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save API key.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAi = async (enabled: boolean) => {
    const previousState = isAiEnabled;
    setIsAiEnabled(enabled); // Optimistic update

    const success = await saveSettings({ global_ai_control: enabled });
    if (success) {
      toast({
        title: enabled ? "AI Enabled" : "AI Disabled",
        description: `Artificial Intelligence features are now ${enabled ? "active" : "disabled"} across the platform.`,
        variant: enabled ? "default" : "destructive",
      });
    } else {
      setIsAiEnabled(previousState); // Revert on failure
      toast({
        title: "Error",
        description: "Failed to update AI control setting.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminDashboardLayout title="Ai Control Center" subtitle="Manage your AI integrations and automated agents">
      <div className="space-y-6 max-w-6xl mx-auto pb-10">

        {/* Global Control & API Key Section */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Global AI Switch */}
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Global AI Control</CardTitle>
                <CardDescription>Master switch for all AI features</CardDescription>
              </div>
              <Zap className={`h-8 w-8 ${isAiEnabled ? "text-primary fill-primary/20" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable AI Features</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on/off AI generation, chatbots, and automation across the entire website.
                  </p>
                </div>
                <Switch
                  checked={isAiEnabled}
                  onCheckedChange={handleToggleAi}
                  disabled={isLoading || isSaving}
                  className="scale-125"
                />
              </div>
            </CardContent>
          </Card>

          {/* Gemini API Key */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Key className="h-5 w-5 text-yellow-500" />
                Gemini API Configuration
              </CardTitle>
              <CardDescription>Enter your Google Gemini API key to power the AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Gemini API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isLoading || isSaving}
                      className="font-mono"
                    />
                    <Button onClick={handleSaveApiKey} disabled={isLoading || isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Don't have an API key?</p>
                    <p>
                      Get your free Gemini API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-200">Google AI Studio</a>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bots Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Automated Agents</h2>
          </div>

          <Tabs defaultValue="chatbots" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="chatbots" className="flex items-center gap-2">
                <Bot className="h-4 w-4" /> Web Chatbots
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> WhatsApp Bots
              </TabsTrigger>
            </TabsList>

            {/* Web Chatbots Content */}
            <TabsContent value="chatbots" className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Manage Web Chatbots</h3>
                  <p className="text-sm text-muted-foreground">Configure AI assistants deployed on your website.</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Bot
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chatbots.map((bot) => (
                  <Card key={bot.id} className="overflow-hidden border-t-4 border-t-purple-500">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          {bot.name}
                        </CardTitle>
                        <CardDescription>{bot.role}</CardDescription>
                      </div>
                      <Badge variant={bot.status === "active" ? "default" : "secondary"}>
                        {bot.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-3 w-3 mr-2" /> Configure
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Card Placeholder */}
                <Button variant="outline" className="h-[140px] flex flex-col items-center justify-center border-dashed gap-2 hover:bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="font-medium">Add Chatbot</span>
                </Button>
              </div>
            </TabsContent>

            {/* WhatsApp Bots Content */}
            <TabsContent value="whatsapp" className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Manage WhatsApp Bots</h3>
                  <p className="text-sm text-muted-foreground">Automate conversations on WhatsApp Business API.</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Link WhatsApp Number
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {whatsappBots.map((bot) => (
                  <Card key={bot.id} className="overflow-hidden border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          {bot.name}
                        </CardTitle>
                        <CardDescription>{bot.role}</CardDescription>
                      </div>
                      <Badge variant={bot.status === "active" ? "default" : "secondary"} className="bg-green-600 hover:bg-green-700">
                        {bot.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-3 w-3 mr-2" /> Configure
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Card Placeholder */}
                <Button variant="outline" className="h-[140px] flex flex-col items-center justify-center border-dashed gap-2 hover:bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="font-medium">Connect Number</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

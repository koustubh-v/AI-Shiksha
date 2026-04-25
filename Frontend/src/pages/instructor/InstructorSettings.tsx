import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  Bell,
  Sparkles,
  Save,
  Upload,
} from "lucide-react";

export default function InstructorSettings() {
  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="page-container max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="payout" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Payout
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Public Profile</CardTitle>
                <CardDescription>This information will be displayed on your instructor page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-lms-blue flex items-center justify-center text-white text-2xl font-semibold">
                    J
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Smith" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="john.smith@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Professional Title</Label>
                  <Input defaultValue="Senior Software Engineer & Instructor" />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    defaultValue="Passionate educator with 10+ years of experience in software development. I specialize in React, TypeScript, and modern web technologies."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input defaultValue="https://johnsmith.dev" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payout Settings</CardTitle>
                <CardDescription>Configure how you receive your earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Available Balance</span>
                    <span className="text-2xl font-bold">₹4,250.00</span>
                  </div>
                  <Button size="sm" className="bg-lms-emerald hover:bg-lms-emerald/90">
                    Request Payout
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Payout Method</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-4 rounded-lg border-2 border-lms-blue bg-lms-blue/5 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-lms-blue" />
                        <div>
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-xs text-muted-foreground">•••• 4242</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border cursor-pointer hover:border-muted-foreground transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-xs text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Payout Amount</Label>
                  <Input type="number" defaultValue="50" />
                  <p className="text-xs text-muted-foreground">Minimum amount before automatic payout</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Enrollments</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a student enrolls</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Reviews</Label>
                    <p className="text-sm text-muted-foreground">Get notified when you receive a review</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Student Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified for new messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly earnings and stats summary</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Insights</Label>
                    <p className="text-sm text-muted-foreground">Get AI-generated suggestions and insights</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-lms-purple" />
                  AI Preferences
                </CardTitle>
                <CardDescription>Configure AI-powered features for your courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Course Assistant</Label>
                    <p className="text-sm text-muted-foreground">Help with course creation and content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Quiz Generation</Label>
                    <p className="text-sm text-muted-foreground">Auto-generate quiz questions from lessons</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Message Suggestions</Label>
                    <p className="text-sm text-muted-foreground">Get AI-suggested replies for student messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Analytics Insights</Label>
                    <p className="text-sm text-muted-foreground">Receive AI-powered course improvement suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Content Optimization</Label>
                    <p className="text-sm text-muted-foreground">Suggestions to improve lesson engagement</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button className="gap-2 bg-lms-blue hover:bg-lms-blue/90">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

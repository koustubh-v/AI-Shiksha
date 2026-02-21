import { useState, useEffect } from "react";
import { Users, Uploads } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import {
  User,
  Bell,
  Shield,
  Brain,
  CreditCard,
  Camera,
  Save,
  Sparkles,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  const isAdminRole = ["admin", "super_admin", "franchise_admin"].includes(user?.role?.toLowerCase() || "");

  if (isAdminRole) {
    return (
      <AdminDashboardLayout title="Settings" subtitle="Manage your account and preferences">
        <SettingsContent />
      </AdminDashboardLayout>
    );
  }

  return (
    <UnifiedDashboard title="Settings" subtitle="Manage your account and preferences">
      <SettingsContent />
    </UnifiedDashboard>
  );
}

function SettingsContent() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      await Users.updateProfile(profileData);
      // We manually update the local state with the data we verified
      // This prevents issues where backend might return enum Role (UPPERCASE) 
      // which conflicts with frontend role logic (lowercase)
      updateUser(profileData);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match" });
      return;
    }
    setIsLoading(true);
    try {
      await Users.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast({ title: "Success", description: "Password changed successfully" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Failed to change password" });
    } finally {
      setIsLoading(false);
    }
  };

  // Utility to resize and crop image to a square
  const centerCropImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate square crop
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        // Set canvas to square size (max 500x500 for avatar)
        const maxSize = 500;
        const finalSize = Math.min(size, maxSize);

        canvas.width = finalSize;
        canvas.height = finalSize;

        // Draw cropped and resized image
        ctx.drawImage(img, x, y, size, size, 0, 0, finalSize, finalSize);

        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { type: file.type });
            resolve(newFile);
          } else {
            reject(new Error('Could not crop image'));
          }
        }, file.type);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // Increased limit to 5MB to allow for cropping high-res uploads
      toast({ variant: "destructive", title: "Error", description: "Image size must be less than 5MB" });
      return;
    }

    setUploading(true);
    try {
      // Auto-crop to square before uploading
      const croppedFile = await centerCropImage(file);

      const { url } = await Uploads.upload(croppedFile);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const fullUrl = `${API_URL}${url}`;
      await Users.updateProfile({ avatar_url: fullUrl });
      updateUser({ avatar_url: fullUrl });
      toast({ title: "Success", description: "Profile picture updated" });
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to upload image" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-slate-100">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-slate-100">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="relative overflow-hidden rounded-full" disabled={uploading}>
                      <Camera className="mr-2 h-4 w-4" />
                      {uploading ? "Uploading..." : "Change Photo"}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 rounded-full"
                      onClick={async () => {
                        try {
                          await Users.deleteAvatar();
                          updateUser({ avatar_url: undefined }); // Clear avatar in context
                          toast({ title: "Success", description: "Profile picture removed" });
                        } catch (error) {
                          toast({ variant: "destructive", title: "Error", description: "Failed to remove profile picture" });
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 5MB max.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="rounded-lg border-slate-200 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email} disabled className="bg-slate-50 border-slate-200 rounded-lg text-slate-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <CardDescription className="pb-2">
                    This will be displayed on your public profile and course landing pages.
                  </CardDescription>
                  <Textarea
                    id="bio"
                    placeholder="Tell students about your professional background and expertise..."
                    className="min-h-[120px] rounded-lg border-slate-200 focus:ring-primary resize-none"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="rounded-full px-8 bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your password and account security settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit" disabled={isLoading} className="rounded-full px-8 bg-primary hover:bg-primary/90">
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

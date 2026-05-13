import React, { useState } from 'react';
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { 
  ShieldAlert, ShieldCheck, Key, Users, Globe, Lock, 
  Smartphone, Clock, Eye, AlertTriangle, Fingerprint, Database, 
  Server, HardDrive, CheckCircle2, History, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SecurityPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Mock settings state
  const [settings, setSettings] = useState({
    // Auth
    require2FA: true,
    passwordExpiration: "90",
    sessionTimeout: "30",
    concurrentLogins: false,
    
    // Access
    ipAllowlist: "192.168.1.1, 10.0.0.0/24",
    restrictAdminIPs: true,
    geoBlocking: true,
    
    // Protection
    rateLimiting: true,
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    captchaEnabled: true,
    
    // Privacy
    auditLogging: true,
    dataRetentionDays: "365",
    anonymizeDeletedUsers: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Security settings updated successfully", {
        description: "Your platform's security policies have been enforced."
      });
    }, 1200);
  };

  return (
    <AdminDashboardLayout title="Security & Privacy" subtitle="Manage advanced security policies, access controls, and threat protection">
      <div className="p-3 md:p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-5 md:p-8 shadow-2xl border border-white/10 group mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-violet-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2 text-center xl:text-left flex items-center xl:items-start flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-blue-400 hidden md:block" /> Security Operations
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl">
                Configure Zero-Trust architecture, identity management, and automated threat responses.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="h-12 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest w-full px-8"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Enforcing..." : "Enforce Policies"}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-none">
          <Tabs defaultValue="authentication" className="w-full">
            <div className="border-b border-slate-200 dark:border-slate-800 px-4">
              <TabsList className="h-14 bg-transparent w-full justify-start overflow-x-auto flex-nowrap hide-scrollbar">
                <TabsTrigger value="authentication" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-6 font-semibold">
                  <Key className="w-4 h-4 mr-2" /> Authentication
                </TabsTrigger>
                <TabsTrigger value="access" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-6 font-semibold">
                  <Globe className="w-4 h-4 mr-2" /> Access Control
                </TabsTrigger>
                <TabsTrigger value="protection" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-6 font-semibold">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Threat Protection
                </TabsTrigger>
                <TabsTrigger value="privacy" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-14 px-6 font-semibold">
                  <Database className="w-4 h-4 mr-2" /> Data & Privacy
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 md:p-8">
              {/* AUTHENTICATION TAB */}
              <TabsContent value="authentication" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Identity & Access Management</h3>
                  
                  <div className="grid gap-6 max-w-3xl">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold flex items-center gap-2"><Smartphone className="w-4 h-4 text-blue-500"/> Require Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enforce 2FA for all administrative and instructor accounts.</p>
                      </div>
                      <Switch checked={settings.require2FA} onCheckedChange={() => handleToggle('require2FA')} />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold flex items-center gap-2"><Users className="w-4 h-4 text-blue-500"/> Allow Concurrent Logins</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow users to be logged in from multiple devices simultaneously.</p>
                      </div>
                      <Switch checked={settings.concurrentLogins} onCheckedChange={() => handleToggle('concurrentLogins')} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold">Session Timeout (Minutes)</Label>
                        <Select value={settings.sessionTimeout} onValueChange={(val) => handleChange('sessionTimeout', val)}>
                          <SelectTrigger className="h-12 bg-white dark:bg-slate-900">
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 Minutes</SelectItem>
                            <SelectItem value="30">30 Minutes</SelectItem>
                            <SelectItem value="60">1 Hour</SelectItem>
                            <SelectItem value="240">4 Hours</SelectItem>
                            <SelectItem value="1440">24 Hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">Automatically log out idle users.</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-bold">Password Expiration (Days)</Label>
                        <Select value={settings.passwordExpiration} onValueChange={(val) => handleChange('passwordExpiration', val)}>
                          <SelectTrigger className="h-12 bg-white dark:bg-slate-900">
                            <SelectValue placeholder="Select expiration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="60">60 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                            <SelectItem value="180">180 Days</SelectItem>
                            <SelectItem value="never">Never Expire</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">Force users to change passwords periodically.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ACCESS CONTROL TAB */}
              <TabsContent value="access" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Network Restrictions</h3>
                  
                  <div className="grid gap-6 max-w-3xl">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold flex items-center gap-2"><Server className="w-4 h-4 text-emerald-500"/> Restrict Admin Access by IP</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Only allow dashboard access from trusted IP networks.</p>
                      </div>
                      <Switch checked={settings.restrictAdminIPs} onCheckedChange={() => handleToggle('restrictAdminIPs')} />
                    </div>

                    {settings.restrictAdminIPs && (
                      <div className="space-y-2 p-4 border border-slate-200 dark:border-slate-800 border-t-0 -mt-6 pt-6 bg-white dark:bg-slate-900">
                        <Label className="font-bold">Trusted IP Addresses (CIDR Notation)</Label>
                        <Input 
                          value={settings.ipAllowlist} 
                          onChange={(e) => handleChange('ipAllowlist', e.target.value)}
                          className="h-12 font-mono"
                          placeholder="e.g., 192.168.1.1, 10.0.0.0/24"
                        />
                        <p className="text-xs text-slate-500">Comma-separated list of IPv4/IPv6 addresses or CIDR blocks.</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-500"/> Geo-Blocking</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Block registration and access from high-risk countries automatically.</p>
                      </div>
                      <Switch checked={settings.geoBlocking} onCheckedChange={() => handleToggle('geoBlocking')} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* THREAT PROTECTION TAB */}
              <TabsContent value="protection" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Bot & Brute-Force Protection</h3>
                  
                  <div className="grid gap-6 max-w-3xl">
                    <div className="flex items-center justify-between p-4 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold text-rose-900 dark:text-rose-400 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Adaptive Rate Limiting</Label>
                        <p className="text-sm text-rose-700 dark:text-rose-500">Automatically throttle requests from suspicious IPs to prevent DDoS.</p>
                      </div>
                      <Switch checked={settings.rateLimiting} onCheckedChange={() => handleToggle('rateLimiting')} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold">Max Login Attempts</Label>
                        <Input 
                          type="number"
                          value={settings.maxLoginAttempts} 
                          onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
                          className="h-12"
                        />
                        <p className="text-xs text-slate-500">Failed attempts before account lockout.</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-bold">Lockout Duration (Minutes)</Label>
                        <Input 
                          type="number"
                          value={settings.lockoutDuration} 
                          onChange={(e) => handleChange('lockoutDuration', e.target.value)}
                          className="h-12"
                        />
                        <p className="text-xs text-slate-500">Time until lockout is automatically lifted.</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold flex items-center gap-2"><Fingerprint className="w-4 h-4 text-indigo-500"/> Enable reCAPTCHA v3</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Invisible bot protection on all public forms (Login, Registration, Contact).</p>
                      </div>
                      <Switch checked={settings.captchaEnabled} onCheckedChange={() => handleToggle('captchaEnabled')} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* DATA & PRIVACY TAB */}
              <TabsContent value="privacy" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Compliance & Logging</h3>
                  
                  <div className="grid gap-6 max-w-3xl">
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold flex items-center gap-2"><History className="w-4 h-4 text-amber-500"/> Strict Audit Logging</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Record all actions performed by Admins and Instructors securely.</p>
                      </div>
                      <Switch checked={settings.auditLogging} onCheckedChange={() => handleToggle('auditLogging')} />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold flex items-center gap-2"><Eye className="w-4 h-4 text-amber-500"/> Anonymize Deleted Users (GDPR)</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Scrub PII (Personally Identifiable Information) when an account is deleted.</p>
                      </div>
                      <Switch checked={settings.anonymizeDeletedUsers} onCheckedChange={() => handleToggle('anonymizeDeletedUsers')} />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold">Activity Log Retention (Days)</Label>
                      <Select value={settings.dataRetentionDays} onValueChange={(val) => handleChange('dataRetentionDays', val)}>
                        <SelectTrigger className="h-12 bg-white dark:bg-slate-900">
                          <SelectValue placeholder="Select retention" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="90">90 Days</SelectItem>
                          <SelectItem value="180">6 Months</SelectItem>
                          <SelectItem value="365">1 Year</SelectItem>
                          <SelectItem value="1825">5 Years (Compliance Mode)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">How long system and security logs are kept before being automatically purged.</p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-4 flex gap-3 items-start mt-4">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-amber-800 dark:text-amber-400">Data Subject Requests (DSR)</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                          If a user requests their data under GDPR/CCPA, you can export their records from the User Management module. Enabling anonymization above ensures you stay compliant when executing "Right to be Forgotten" requests.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

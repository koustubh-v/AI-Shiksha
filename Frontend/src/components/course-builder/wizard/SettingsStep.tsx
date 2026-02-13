import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, DollarSign, Users, Lock, Award, Clock, Search, Globe } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
    is_free: z.boolean().default(false),
    price: z.coerce.number().min(0, 'Price must be positive'),
    original_price: z.coerce.number().min(0).optional(),
    discount_percentage: z.coerce.number().min(0).max(100).optional(),
    is_private: z.boolean().default(false),
    password: z.string().optional(),
    max_students: z.coerce.number().min(0).optional(),
    drip_enabled: z.boolean().default(false),
    certificate_enabled: z.boolean().default(false),
    // SEO Settings
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_keywords: z.string().optional(),
});

interface SettingsStepProps {
    courseId: string;
    initialData?: any;
    onSave: (data: z.infer<typeof formSchema>) => Promise<void>;
}

export function SettingsStep({ initialData, onSave }: SettingsStepProps) {
    const [saving, setSaving] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            is_free: initialData?.is_free || false,
            price: initialData?.price || 0,
            original_price: initialData?.original_price || 0,
            discount_percentage: initialData?.discount_percentage || 0,
            is_private: initialData?.is_private || false,
            password: initialData?.password || '',
            max_students: initialData?.max_students || 0,
            drip_enabled: initialData?.drip_enabled || false,
            certificate_enabled: initialData?.certificate_enabled || false,
            meta_title: initialData?.meta_title || '',
            meta_description: initialData?.meta_description || '',
            meta_keywords: initialData?.meta_keywords || '',
        },
    });

    const isFree = form.watch('is_free');
    const isPrivate = form.watch('is_private');

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setSaving(true);
        try {
            await onSave(values);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Pricing Section */}
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-medium text-gray-800">
                                    <DollarSign className="h-5 w-5 text-green-600" /> Pricing & Monetization
                                </CardTitle>
                                <CardDescription>Configure how students pay for this course.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="is_free"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-100 bg-white/50 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium text-gray-700">Free Course</FormLabel>
                                                <FormDescription>Check this if the course is free for everyone.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {!isFree && (
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-600">Current Price ($)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="0" step="0.01" className="bg-white/70" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="original_price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-600">Original Price ($)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="0" step="0.01" className="bg-white/70" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="discount_percentage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-600">Discount Percentage (%)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="0" max="100" className="bg-white/70" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Auto-calculated if both prices are set.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* SEO Section */}
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-medium text-gray-800">
                                    <Search className="h-5 w-5 text-purple-600" /> SEO & Discovery
                                </CardTitle>
                                <CardDescription>Optimize your course for search engines.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="meta_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-600">Meta Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SEO Optimized Title" className="bg-white/70" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="meta_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-600">Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Brief summary for search results..." className="h-24 bg-white/70 resize-none" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="meta_keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-600">Keywords</FormLabel>
                                            <FormControl>
                                                <Input placeholder="react, web development, javascript" className="bg-white/70" {...field} />
                                            </FormControl>
                                            <FormDescription>Comma-separated keywords.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Access Control */}
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-medium text-gray-800">
                                    <Lock className="h-5 w-5 text-blue-600" /> Access Control
                                </CardTitle>
                                <CardDescription>Manage who can access your course.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="is_private"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-100 bg-white/50 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium text-gray-700">Private Course</FormLabel>
                                                <FormDescription>Only accessible via password.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {isPrivate && (
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-600">Course Password</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="SecretPassword123" className="bg-white/70" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="max_students"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-gray-600">
                                                <Users className="h-4 w-4" /> Max Students
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0 for unlimited" className="bg-white/70" {...field} />
                                            </FormControl>
                                            <FormDescription>Leave 0 for unlimited enrollments.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Content Settings */}
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-medium text-gray-800">
                                    <Globe className="h-5 w-5 text-orange-600" /> Content Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="drip_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-100 bg-white/50 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium text-gray-700">Content Drip</FormLabel>
                                                <FormDescription>Schedule content release over time.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="certificate_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-100 bg-white/50 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base flex items-center gap-2 font-medium text-gray-700">
                                                    <Award className="h-4 w-4" /> Completion Certificate
                                                </FormLabel>
                                                <FormDescription>Award a certificate upon completion.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer Save Button */}
                <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-6 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-end gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-20 mt-8">
                    <Button variant="outline" type="button" className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300 px-8"
                    >
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Settings
                    </Button>
                </div>
            </form>
        </Form>
    );
}

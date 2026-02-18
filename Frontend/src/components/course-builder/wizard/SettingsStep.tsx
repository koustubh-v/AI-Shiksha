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
import { Loader2, DollarSign, Users, Lock, Award, Clock, Search, Globe, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { FloatingSaveBar } from './FloatingSaveBar';

const formSchema = z.object({
    is_free: z.boolean().default(false),
    price: z.coerce.number().min(0, 'Price must be positive'),
    original_price: z.coerce.number().min(0).optional(),
    discount_percentage: z.coerce.number().min(0).max(100).optional(),
    is_private: z.boolean().default(false),
    password: z.string().optional(),
    max_students: z.coerce.number().min(0).optional(),
    access_days_limit: z.coerce.number().min(0).optional(),
    estimated_duration: z.coerce.number().min(0).optional(),
    drip_enabled: z.boolean().default(false),
    certificate_enabled: z.boolean().default(false),
    // SEO Settings
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_keywords: z.string().optional(),
    // Course Features
    course_features: z.object({
        downloadable_resources: z.boolean().default(true),
        lifetime_access: z.boolean().default(true),
        mobile_tv_access: z.boolean().default(true),
        assignments: z.boolean().default(false),
        quizzes: z.boolean().default(false),
        coding_exercises: z.boolean().default(false),
        articles: z.boolean().default(false),
        discussion_forum: z.boolean().default(false),
    }).optional(),
});

interface SettingsStepProps {
    courseId: string;
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    onSaveAndContinue: (data: any) => Promise<void>;
    onBack?: () => void;
}

export function SettingsStep({ courseId, initialData, onSave, onSaveAndContinue, onBack }: SettingsStepProps) {
    const [saving, setSaving] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            is_free: initialData?.is_free || false,
            price: initialData?.price || 0,
            original_price: initialData?.original_price || '',
            discount_percentage: initialData?.discount_percentage || '',
            is_private: initialData?.is_private || false,
            password: initialData?.password || '',
            max_students: initialData?.max_students || '',
            access_days_limit: initialData?.access_days_limit || '',
            estimated_duration: initialData?.estimated_duration || '',
            drip_enabled: initialData?.drip_enabled || false,
            certificate_enabled: initialData?.certificate_enabled || false,
            meta_title: initialData?.meta_title || '',
            meta_description: initialData?.meta_description || '',
            meta_keywords: initialData?.meta_keywords || '',
            course_features: {
                downloadable_resources: initialData?.course_features?.downloadable_resources ?? true,
                lifetime_access: initialData?.course_features?.lifetime_access ?? true,
                mobile_tv_access: initialData?.course_features?.mobile_tv_access ?? true,
                assignments: initialData?.course_features?.assignments ?? false,
                quizzes: initialData?.course_features?.quizzes ?? false,
                coding_exercises: initialData?.course_features?.coding_exercises ?? false,
                articles: initialData?.course_features?.articles ?? false,
                discussion_forum: initialData?.course_features?.discussion_forum ?? false,
            },
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-24">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Pricing Section */}
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardHeader className="p-6 border-b border-gray-50 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm group-hover:scale-105 transition-transform">
                                        <DollarSign className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-semibold text-gray-900">Pricing & Monetization</CardTitle>
                                        <CardDescription className="text-sm text-gray-500">Set your course price and validation</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="is_free"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-green-100 hover:shadow-sm transition-all cursor-pointer">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-semibold text-gray-800">Free Course</FormLabel>
                                                <FormDescription className="text-gray-500">Make this course available for free to everyone</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {!isFree && (
                                    <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-gray-700 ml-1">Current Price ($)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-3.5 text-gray-400 font-medium">$</span>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="h-12 pl-8 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 font-medium text-lg shadow-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    {...field}
                                                                />
                                                            </div>
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
                                                        <FormLabel className="text-sm font-medium text-gray-700 ml-1">Original Price ($)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-3.5 text-gray-400 font-medium">$</span>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="h-12 pl-8 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-300 font-medium text-lg text-gray-500 shadow-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    {...field}
                                                                />
                                                            </div>
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
                                                    <FormLabel className="text-sm font-medium text-gray-700 ml-1">Discount Percentage (%)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-green-500 font-medium shadow-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                {...field}
                                                            />
                                                            <span className="absolute right-4 top-3.5 text-gray-400 font-medium">%</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* SEO Section */}
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardHeader className="p-6 border-b border-gray-50 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-105 transition-transform">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-semibold text-gray-900">SEO & Discovery</CardTitle>
                                        <CardDescription className="text-sm text-gray-500">Optimize for search engines</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="meta_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 ml-1">Meta Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="SEO Optimized Title"
                                                    className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 transition-all"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-sm font-medium text-gray-700 ml-1">Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief summary for search results..."
                                                    className="min-h-[100px] rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 transition-all resize-none p-4"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-sm font-medium text-gray-700 ml-1">Keywords</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="react, web development, javascript"
                                                    className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="ml-1 text-xs text-gray-400">Comma-separated keywords.</FormDescription>
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
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardHeader className="p-6 border-b border-gray-50 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-semibold text-gray-900">Access Control</CardTitle>
                                        <CardDescription className="text-sm text-gray-500">Manage visibility and access</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="is_private"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all cursor-pointer">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-semibold text-gray-800">Private Course</FormLabel>
                                                <FormDescription className="text-gray-500">Only accessible via password</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-blue-600"
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
                                            <FormItem className="animate-in slide-in-from-top-2 fade-in">
                                                <FormLabel className="text-sm font-medium text-gray-700 ml-1">Course Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="SecretPassword123"
                                                        className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 transition-all"
                                                        {...field}
                                                    />
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
                                            <FormLabel className="text-sm font-medium text-gray-700 ml-1">Max Students</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0 for unlimited"
                                                    className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="ml-1 text-xs text-gray-400">Leave 0 for unlimited enrollments.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="access_days_limit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 ml-1">Access Duration (Days)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0 for lifetime"
                                                    className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="ml-1 text-xs text-gray-400">Leave 0/Empty for lifetime access.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Content Settings */}
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardHeader className="p-6 border-b border-gray-50 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-105 transition-transform">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-semibold text-gray-900">Content Settings</CardTitle>
                                        <CardDescription className="text-sm text-gray-500">Delivery and certification</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="estimated_duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 ml-1">Estimated Duration (Minutes)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 120"
                                                    className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-0 transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="ml-1 text-xs text-gray-400">Total time displayed on certificate.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="drip_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-orange-100 hover:shadow-sm transition-all cursor-pointer">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-semibold text-gray-800">Content Drip</FormLabel>
                                                <FormDescription className="text-gray-500">Schedule content release over time</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-orange-600"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="certificate_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-orange-100 hover:shadow-sm transition-all cursor-pointer">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-semibold text-gray-800">Completion Certificate</FormLabel>
                                                <FormDescription className="text-gray-500">Award a certificate automatically</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-orange-600"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Course Features */}
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardHeader className="p-6 border-b border-gray-50 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-105 transition-transform">
                                        <CheckSquare className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-semibold text-gray-900">Course Features</CardTitle>
                                        <CardDescription className="text-sm text-gray-500">What's included in this course</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 gap-3">
                                {[
                                    { name: 'downloadable_resources', label: 'Downloadable Resources', desc: 'Files & PDFs' },
                                    { name: 'lifetime_access', label: 'Full Lifetime Access', desc: 'No expiration' },
                                    { name: 'mobile_tv_access', label: 'Mobile & TV Access', desc: 'Any device' },
                                    { name: 'assignments', label: 'Assignments', desc: 'Homework tasks' },
                                    { name: 'quizzes', label: 'Quizzes', desc: 'Knowledge checks' },
                                    { name: 'coding_exercises', label: 'Coding Exercises', desc: 'Practice code' },
                                    { name: 'articles', label: 'Articles', desc: 'Reading material' },
                                    { name: 'discussion_forum', label: 'Discussion Forum', desc: 'Community QA' },
                                ].map((feature) => (
                                    <FormField
                                        key={feature.name}
                                        control={form.control}
                                        name={`course_features.${feature.name}` as any}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between p-3 rounded-2xl hover:bg-indigo-50/50 hover:pl-4 transition-all cursor-pointer group/item">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm font-semibold text-gray-700 group-hover/item:text-indigo-700 transition-colors">{feature.label}</FormLabel>
                                                    <FormDescription className="text-xs text-gray-400 group-hover/item:text-indigo-400">{feature.desc}</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-indigo-600 scale-90"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <FloatingSaveBar
                    onSave={() => form.handleSubmit(async (data) => {
                        setSaving(true);
                        try {
                            await onSave(data);
                        } finally {
                            setSaving(false);
                        }
                    })()}
                    onSaveAndContinue={() => form.handleSubmit(async (data) => {
                        setSaving(true);
                        try {
                            await onSaveAndContinue(data);
                        } finally {
                            setSaving(false);
                        }
                    })()}
                    onBack={onBack}
                    backLabel="Back to Curriculum"
                    loading={saving}
                    isDirty={form.formState.isDirty}
                    canProceed={form.formState.isValid}
                    saveLabel="Save Settings"
                    saveAndContinueLabel="Next: Certificate"
                />
                <div className="h-24" /> {/* Spacer */}

            </form>
        </Form>
    );

}

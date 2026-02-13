import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CourseBuilderContainer } from './CourseBuilderContainer';
import { CourseBuilderLayout } from '../CourseBuilderLayout';
import { CurriculumBuilder } from '../CurriculumBuilder';
import { BasicInfoStep } from './BasicInfoStep';
import { SettingsStep } from './SettingsStep';
import { CertificateStep } from './CertificateStep';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Courses } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function CourseBuilderWizard() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('basic');
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const data = await Courses.getOne(courseId!);
            setCourse(data);
        } catch (error) {
            console.error('Failed to fetch course', error);
            toast.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBasicInfo = async (data: any) => {
        try {
            await Courses.update(courseId!, data);
            setCourse({ ...course, ...data });
            toast.success("Basic info saved");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save basic info");
        }
    };

    const handleSaveSettings = async (data: any) => {
        try {
            await Courses.update(courseId!, data);
            setCourse({ ...course, ...data });
            toast.success("Settings saved");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save settings");
        }
    };

    const handleSaveCertificate = async (data: any) => {
        try {
            await Courses.update(courseId!, data);
            setCourse({ ...course, ...data });
            toast.success("Certificate settings saved");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save certificate settings");
        }
    };

    const canPublish = () => {
        if (!course) return false;
        return !!(
            course.title &&
            course.description &&
            course.category_id &&
            course.slug
        );
    };

    const handlePublish = async () => {
        if (!canPublish()) {
            toast.error("Please complete all required fields before publishing");
            return;
        }

        setPublishing(true);
        try {
            await Courses.update(courseId!, { status: 'PUBLISHED' });
            toast.success("Course published successfully!");
            navigate('/dashboard/courses');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to publish course");
        } finally {
            setPublishing(false);
        }
    };

    if (!courseId) return null;

    if (loading) {
        return (
            <CourseBuilderContainer>
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </CourseBuilderContainer>
        );
    }

    return (
        <CourseBuilderContainer>
            <CourseBuilderLayout
                title={course?.title || "Course Builder"}
                onSave={handlePublish}
                saving={publishing}
                onBack={() => navigate('/instructor/courses')}
                onPreview={() => window.open(`/courses/${course?.slug || courseId}`, '_blank')}
            >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b bg-white px-4">
                        <TabsList className="h-12 w-full justify-start gap-4 bg-transparent p-0">
                            <TabsTrigger
                                value="basic"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-2 pt-3"
                            >
                                Basic Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="curriculum"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-2 pt-3"
                            >
                                Curriculum
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-2 pt-3"
                            >
                                Settings
                            </TabsTrigger>
                            <TabsTrigger
                                value="certificate"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-2 pt-3"
                            >
                                Certificate
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6 bg-slate-50/50 min-h-[calc(100vh-180px)]">
                        <TabsContent value="basic" className="m-0 outline-none">
                            <BasicInfoStep
                                courseId={courseId}
                                initialData={course}
                                onSave={handleSaveBasicInfo}
                            />
                        </TabsContent>

                        <TabsContent value="curriculum" className="m-0 outline-none">
                            <CurriculumBuilder courseId={courseId} />
                        </TabsContent>

                        <TabsContent value="settings" className="m-0 outline-none">
                            <SettingsStep
                                courseId={courseId}
                                initialData={course}
                                onSave={handleSaveSettings}
                            />
                        </TabsContent>

                        <TabsContent value="certificate" className="m-0 outline-none">
                            <CertificateStep
                                courseId={courseId}
                                initialData={course}
                                onSave={handleSaveCertificate}
                            />
                        </TabsContent>
                    </div>
                </Tabs>
            </CourseBuilderLayout>
        </CourseBuilderContainer>
    );
}

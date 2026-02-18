import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, Trophy, Download } from "lucide-react";
import { enrollmentService, EnrolledCourse } from "@/lib/api/enrollmentService";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function CompletedCourses() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const allEnrollments = await enrollmentService.getMyEnrollments();
            // Show only completed courses (100% progress)
            const completedCourses = allEnrollments.filter(c => c.progress === 100);
            setCourses(completedCourses);
        } catch (error) {
            console.error('Error loading completed courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCertificate = async (courseId: string, courseTitle: string) => {
        try {
            const response = await api.get(`/certificates/course/${courseId}/download`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate-${courseTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Error downloading certificate:', error);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-[#E1E1E1] shadow-sm rounded-md h-48 flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Completed Courses</h2>
                </div>
                <div className="bg-white border border-[#E1E1E1] shadow-sm rounded-md p-8 text-center">
                    <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No completed courses yet.</p>
                    <Link to="/courses" className="text-lms-blue hover:underline font-medium">
                        Start Learning
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Completed Courses</h2>
                <Link to="/dashboard/my-courses?tab=completed" className="text-lms-blue text-sm font-semibold hover:underline">
                    See all
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((enrollment) => (
                    <div
                        key={enrollment.id}
                        className="bg-white border-2 border-green-100 shadow-sm group cursor-pointer hover:border-green-300 transition-all rounded-md overflow-hidden flex flex-col"
                    >
                        <div
                            className="h-32 bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${(enrollment.course.thumbnail_url && !enrollment.course.thumbnail_url.startsWith('blob:')) ? enrollment.course.thumbnail_url : 'https://via.placeholder.com/1280x720?text=Course+Thumbnail'})` }}
                        >
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                <Trophy className="h-3 w-3" /> Completed
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                {enrollment.course.instructor.name} • Course
                            </p>
                            <h4 className="font-bold text-base mb-2 text-[#1F1F1F] group-hover:text-lms-blue transition-colors line-clamp-2">
                                {enrollment.course.title}
                            </h4>
                            {enrollment.completionDate && (
                                <p className="text-xs text-gray-500 mb-3">
                                    Completed on {new Date(enrollment.completionDate).toLocaleDateString()}
                                </p>
                            )}
                            <div className="flex items-center justify-between mt-auto gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-full border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDownloadCertificate(enrollment.course.id, enrollment.course.title);
                                    }}
                                >
                                    <Download className="h-3.5 w-3.5 mr-2" />
                                    Get Certificate
                                </Button>
                                <Link to={`/course/${enrollment.course.slug}/view`}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-lms-blue hover:text-lms-blue/80"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

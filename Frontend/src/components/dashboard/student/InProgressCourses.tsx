import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { enrollmentService, EnrolledCourse } from "@/lib/api/enrollmentService";

export function InProgressCourses() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const allEnrollments = await enrollmentService.getMyEnrollments();
            // Show all courses that are not completed (active or in_progress, and progress < 100)
            const activeCourses = allEnrollments.filter(c => c.status !== 'completed' && c.progress < 100);
            setCourses(activeCourses.slice(0, 4)); // Show up to 4 inline
        } catch (error) {
            console.error('Error loading in-progress courses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#1F1F1F]">In Progress</h2>
                </div>
                <div className="bg-white border rounded-xl p-10 text-center shadow-sm flex flex-col items-center justify-center min-h-[250px]">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F1F1F] mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        You don't have any courses in progress right now. Ready to learn something new?
                    </p>
                    <Link to="/dashboard/courses/explore">
                        <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-6">
                            Browse Courses
                        </span>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1F1F1F]">Continue Learning</h2>
                <Link to="/dashboard/my-courses" className="text-lms-blue text-sm font-semibold hover:underline">
                    See all your courses
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((enrollment) => (
                    <div
                        key={enrollment.id}
                        className="bg-white border border-[#E1E1E1] shadow-sm group cursor-pointer hover:border-lms-blue transition-all rounded-md overflow-hidden flex flex-col"
                    >
                        <div
                            className="h-32 bg-cover bg-center"
                            style={{ backgroundImage: `url(${(enrollment.course.thumbnail_url && !enrollment.course.thumbnail_url.startsWith('blob:')) ? enrollment.course.thumbnail_url : 'https://via.placeholder.com/1280x720?text=Course+Thumbnail'})` }}
                        ></div>
                        <div className="p-4 flex flex-col flex-1">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                {enrollment.course.instructor.name} • Course
                            </p>
                            <h4 className="font-bold text-base mb-4 text-[#1F1F1F] group-hover:text-lms-blue transition-colors line-clamp-1">
                                {enrollment.course.title}
                            </h4>
                            <Progress value={enrollment.progress} className="h-1 bg-gray-100 mb-3" />
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-[#555555] font-medium">{enrollment.progress}% Completed</span>
                                <Link to={`/course/${enrollment.course.slug}/view`}>
                                    {enrollment.progress === 0 ? (
                                        <span className="text-lms-blue text-xs font-bold uppercase border border-lms-blue px-2 py-1 rounded-sm hover:bg-lms-blue hover:text-white transition-colors">Start Learning</span>
                                    ) : (
                                        <ChevronRight className="text-lms-blue h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}


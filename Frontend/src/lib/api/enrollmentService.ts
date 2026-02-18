import api from '@/lib/api';

export interface EnrolledCourse {
    id: string;
    courseId: string;
    userId: string;
    course: {
        id: string;
        slug: string;
        title: string;
        description: string;
        thumbnail_url: string | null;
        instructor: {
            name: string;
        };
        totalLessons: number;
        duration: string;
    };
    progress: number;
    completedLessons: number;
    lastAccessedAt: string | null;
    enrollmentDate: string;
    completionDate: string | null;
    status: 'not_started' | 'in_progress' | 'completed';
}

export const enrollmentService = {
    async getMyEnrollments(): Promise<EnrolledCourse[]> {
        const response = await api.get('/enrollments/my');
        // Map backend response to EnrolledCourse interface
        return response.data.map((enrollment: any) => ({
            id: enrollment.id,
            courseId: enrollment.course_id,
            userId: enrollment.student_id,
            course: {
                id: enrollment.course.id,
                slug: enrollment.course.slug || enrollment.course.id, // Fallback if slug is missing
                title: enrollment.course.title,
                description: enrollment.course.description || '',
                thumbnail_url: enrollment.course.thumbnail_url,
                instructor: {
                    name: enrollment.course.instructor?.user?.name || 'Unknown Instructor',
                },
                totalLessons: enrollment.course.lessons_count || 0, // Assuming this field exists or needs calculation
                duration: enrollment.course.duration || '0h',
            },
            progress: enrollment.progress_percentage || 0,
            completedLessons: 0, // Backend doesn't seem to return this directly in simple query
            lastAccessedAt: enrollment.last_activity_at,
            enrollmentDate: enrollment.enrolled_at,
            completionDate: enrollment.completed_at,
            status: enrollment.status,
        }));
    },
};


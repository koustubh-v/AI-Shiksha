import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function CreateCourseRedirect() {
    const navigate = useNavigate();
    const hasCreated = useRef(false);

    useEffect(() => {
        const createCourse = async () => {
            if (hasCreated.current) return;
            hasCreated.current = true;

            try {
                // Generate unique slug from timestamp
                const timestamp = Date.now();

                const response = await api.post('/courses', {
                    title: 'Untitled Course',
                    slug: `untitled-course-${timestamp}`,
                    description: '',
                    price: 0,
                    is_free: true,
                });

                toast.success('Course created! Redirecting to Course Builder...');
                navigate(`/dashboard/courses/${response.data.id}/edit`);
            } catch (error) {
                console.error('Failed to create course:', error);
                toast.error('Failed to create course. Please try again.');
                navigate('/dashboard/courses');
            }
        };

        createCourse();
    }, [navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground font-medium">Creating your new course...</p>
            </div>
        </div>
    );
}

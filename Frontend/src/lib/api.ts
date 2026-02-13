import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Adjust if backend port differs
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('lms_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const Courses = {
    getAll: async (params?: any) => {
        const { data } = await api.get("/courses", { params });
        return data;
    },
    getOne: async (id: string) => {
        const { data } = await api.get(`/courses/${id}`);
        return data;
    },
    create: async (courseData: any) => {
        const { data } = await api.post("/courses", courseData);
        return data;
    },
    update: async (id: string, courseData: any) => {
        const { data } = await api.patch(`/courses/${id}`, courseData);
        return data;
    },
    getMyCourses: async () => {
        const { data } = await api.get("/courses/my");
        return data;
    },
    delete: async (id: string) => {
        const { data } = await api.delete(`/courses/${id}`);
        return data;
    },
};

export const Categories = {
    getAll: async () => {
        const { data } = await api.get("/categories");
        return data;
    },
    create: async (categoryData: { name: string; description?: string; icon?: string }) => {
        const { data } = await api.post("/categories", categoryData);
        return data;
    },
    update: async (id: string, categoryData: { name: string; description?: string }) => {
        const { data } = await api.put(`/categories/${id}`, categoryData);
        return data;
    },
    delete: async (id: string) => {
        const { data } = await api.delete(`/categories/${id}`);
        return data;
    },
};

export const Tags = {
    getAll: async () => {
        const { data } = await api.get("/tags");
        return data;
    },
    create: async (tagData: { name: string }) => {
        const { data } = await api.post("/tags", tagData);
        return data;
    },
    delete: async (id: string) => {
        const { data } = await api.delete(`/tags/${id}`);
        return data;
    },
};

export const Enrollments = {
    getAll: async (search?: string, status?: string) => {
        const { data } = await api.get("/enrollments", { params: { search, status } });
        return data;
    },
    getStats: async () => {
        const { data } = await api.get("/enrollments/stats");
        return data;
    },
    adminEnroll: async (studentEmail: string, courseId: string) => {
        const { data } = await api.post("/enrollments/admin/enroll", { studentEmail, courseId });
        return data;
    },
    updateStatus: async (id: string, status: string) => {
        const { data } = await api.patch(`/enrollments/${id}/status`, { status });
        return data;
    },
    delete: async (id: string) => {
        const { data } = await api.delete(`/enrollments/${id}`);
        return data;
    },
};

export const Users = {
    getAll: async (role?: string) => {
        // Add timestamp to prevent caching
        const { data } = await api.get("/users", {
            params: { role, _t: Date.now() }
        });
        return data;
    },
    create: async (userData: any) => {
        const { data } = await api.post("/users", userData);
        return data;
    },
    delete: async (id: string) => {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    },
    getStudentStats: async () => {
        const { data } = await api.get("/users/stats/students");
        return data;
    },
    getTeacherStats: async () => {
        const { data } = await api.get("/users/stats/teachers");
        return data;
    },
};

// ============================================
// COURSE BUILDER APIs
// ============================================

// Approval Workflow
export const CourseApproval = {
    submitForApproval: async (courseId: string) => {
        const { data } = await api.post(`/courses/${courseId}/submit-approval`);
        return data;
    },
    approve: async (courseId: string) => {
        const { data } = await api.post(`/courses/${courseId}/approve`);
        return data;
    },
    reject: async (courseId: string, reason: string) => {
        const { data } = await api.post(`/courses/${courseId}/reject`, { rejection_reason: reason });
        return data;
    },
    publish: async (courseId: string) => {
        const { data } = await api.post(`/courses/${courseId}/publish`);
        return data;
    },
    getPending: async () => {
        const { data } = await api.get('/courses/pending-approval/list');
        return data;
    },
};

// Sections Management
export const Sections = {
    getByCourse: async (courseId: string) => {
        const { data } = await api.get(`/courses/${courseId}/sections`);
        return data;
    },
    create: async (courseId: string, sectionData: any) => {
        const { data } = await api.post(`/courses/${courseId}/sections`, sectionData);
        return data;
    },
    update: async (sectionId: string, sectionData: any) => {
        const { data } = await api.patch(`/sections/${sectionId}`, sectionData);
        return data;
    },
    delete: async (sectionId: string) => {
        const { data } = await api.delete(`/sections/${sectionId}`);
        return data;
    },
    reorder: async (courseId: string, orders: { id: string; order_index: number }[]) => {
        const { data } = await api.post(`/courses/${courseId}/sections/reorder`, { section_orders: orders });
        return data;
    },
};

// Section Items (Lectures, Quizzes, Assignments)
export const SectionItems = {
    create: async (sectionId: string, itemData: any) => {
        const { data } = await api.post(`/sections/${sectionId}/items`, itemData);
        return data;
    },
    update: async (itemId: string, itemData: any) => {
        const { data } = await api.patch(`/items/${itemId}`, itemData);
        return data;
    },
    delete: async (itemId: string) => {
        const { data } = await api.delete(`/items/${itemId}`);
        return data;
    },
    reorder: async (orders: { id: string; order_index: number }[]) => {
        const { data } = await api.post('/items/reorder', { item_orders: orders });
        return data;
    },
};

// Lecture Content
export const LectureContent = {
    create: async (itemId: string, contentData: any) => {
        const { data } = await api.post(`/items/${itemId}/content`, contentData);
        return data;
    },
    update: async (itemId: string, contentData: any) => {
        const { data } = await api.patch(`/items/${itemId}/content`, contentData);
        return data;
    },
    get: async (itemId: string) => {
        const { data } = await api.get(`/items/${itemId}/content`);
        return data;
    },
};

// Quizzes
export const Quizzes = {
    create: async (itemId: string, quizData: any) => {
        const { data } = await api.post(`/items/${itemId}/quiz`, quizData);
        return data;
    },
    update: async (quizId: string, quizData: any) => {
        const { data } = await api.patch(`/quizzes/${quizId}`, quizData);
        return data;
    },
    get: async (quizId: string) => {
        const { data } = await api.get(`/quizzes/${quizId}`);
        return data;
    },
    // Questions
    addQuestion: async (quizId: string, questionData: any) => {
        const { data } = await api.post(`/quizzes/${quizId}/questions`, questionData);
        return data;
    },
    updateQuestion: async (questionId: string, questionData: any) => {
        const { data } = await api.patch(`/questions/${questionId}`, questionData);
        return data;
    },
    deleteQuestion: async (questionId: string) => {
        const { data } = await api.delete(`/questions/${questionId}`);
        return data;
    },
    reorderQuestions: async (quizId: string, orders: { id: string; order_index: number }[]) => {
        const { data } = await api.post(`/quizzes/${quizId}/questions/reorder`, { question_orders: orders });
        return data;
    },
    // Submissions
    submit: async (quizId: string, answers: any, timeTaken?: number) => {
        const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers, time_taken_minutes: timeTaken });
        return data;
    },
    getSubmissions: async (quizId: string) => {
        const { data } = await api.get(`/quizzes/${quizId}/submissions`);
        return data;
    },
    getMySubmissions: async (quizId: string) => {
        const { data } = await api.get(`/quizzes/${quizId}/my-submissions`);
        return data;
    },
};

// Assignments
export const Assignments = {
    create: async (itemId: string, assignmentData: any) => {
        const { data } = await api.post(`/items/${itemId}/assignment`, assignmentData);
        return data;
    },
    update: async (assignmentId: string, assignmentData: any) => {
        const { data } = await api.patch(`/assignments/${assignmentId}`, assignmentData);
        return data;
    },
    get: async (assignmentId: string) => {
        const { data } = await api.get(`/assignments/${assignmentId}`);
        return data;
    },
    // Submissions
    submit: async (assignmentId: string, submissionData: any) => {
        const { data } = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
        return data;
    },
    grade: async (submissionId: string, grade: number, feedback?: string) => {
        const { data } = await api.post(`/submissions/${submissionId}/grade`, { grade, feedback });
        return data;
    },
    getSubmissions: async (assignmentId: string) => {
        const { data } = await api.get(`/assignments/${assignmentId}/submissions`);
        return data;
    },
    getMySubmissions: async (assignmentId: string) => {
        const { data } = await api.get(`/assignments/${assignmentId}/my-submissions`);
        return data;
    },
    getSubmission: async (submissionId: string) => {
        const { data } = await api.get(`/submissions/${submissionId}`);
        return data;
    },
};

// Course Completions
export const Completions = {
    getAll: async (search?: string) => {
        const { data } = await api.get("/completions", { params: { search } });
        return data;
    },
    getStats: async () => {
        const { data } = await api.get("/completions/stats");
        return data;
    },
    markComplete: async (studentId: string, courseId: string) => {
        const { data } = await api.post("/completions/manual", {
            student_id: studentId,
            course_id: courseId,
        });
        return data;
    },
    issueCertificate: async (studentId: string, courseId: string) => {
        const { data } = await api.post("/completions/issue-certificate", {
            student_id: studentId,
            course_id: courseId,
        });
        return data;
    },
};

// Certificate Templates
export const CertificateTemplates = {
    getAll: async () => {
        const { data } = await api.get("/certificate-templates");
        return data;
    },
    getOne: async (id: string) => {
        const { data } = await api.get(`/certificate-templates/${id}`);
        return data;
    },
    getDefault: async () => {
        const { data } = await api.get("/certificate-templates/default");
        return data;
    },
    create: async (templateData: any) => {
        const { data } = await api.post("/certificate-templates", templateData);
        return data;
    },
    update: async (id: string, templateData: any) => {
        const { data } = await api.patch(`/certificate-templates/${id}`, templateData);
        return data;
    },
    delete: async (id: string) => {
        const { data } = await api.delete(`/certificate-templates/${id}`);
        return data;
    },
    setDefault: async (id: string) => {
        const { data } = await api.post(`/certificate-templates/${id}/set-default`);
        return data;
    },
};

export const AI = {
    generateText: async (prompt: string, context?: string) => {
        // Mock implementation for now
        // const { data } = await api.post('/ai/generate', { prompt, context });
        // return data;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    text: `[AI Generated Content for "${prompt}"]\n\nHere is a detailed explanation based on your request. This content is generated to demonstrate the AI capabilities of the platform.`
                });
            }, 1500);
        });
    }
};

export default api;

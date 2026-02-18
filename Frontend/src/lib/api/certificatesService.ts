import api from '@/lib/api';

export interface Certificate {
    id: string;
    courseId: string;
    courseName: string;
    courseSlug: string;
    instructor: string;
    completedDate: Date;
    credentialId: string;
    thumbnail: string;
    issueDate: Date;
    certificateUrl?: string;
    qrValidationUrl?: string;
    studentName?: string;
}

export const getMyCertificates = async (): Promise<Certificate[]> => {
    try {
        const response = await api.get('/certificates');
        return response.data;
    } catch (error) {
        console.error('Error fetching certificates:', error);
        throw error;
    }
};

export const getCertificateForCourse = async (courseId: string): Promise<Certificate | null> => {
    try {
        const allCertificates = await getMyCertificates();
        // Find certificate for the specified course
        return allCertificates.find(cert => cert.courseId === courseId) || null;
    } catch (error) {
        console.error('Error fetching certificate for course:', error);
        return null;
    }
};

export const getCertificateById = async (id: string): Promise<Certificate> => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
};

export const downloadCertificate = async (id: string): Promise<any> => {
    const response = await api.get(`/certificates/${id}/download`, {
        responseType: 'blob',
    });
    return response.data;
};

export const validateCertificate = async (userId: string, courseSlug: string) => {
    try {
        const response = await api.get(`/certificates/validate/${userId}/${courseSlug}`);
        return response.data;
    } catch (error) {
        console.error('Error validating certificate:', error);
        throw error;
    }
};

export const certificatesService = {
    getMyCertificates,
    getCertificateForCourse,
    getCertificateById,
    downloadCertificate,
    validateCertificate,
};

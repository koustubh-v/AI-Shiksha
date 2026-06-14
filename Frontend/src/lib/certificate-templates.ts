import { CertificateTemplateConfig } from '@/types/certificate';

export const COURSERA_TEMPLATE: CertificateTemplateConfig = {
    canvas: {
        width: 1122,
        height: 794,
        backgroundColor: '#ffffff',
        borderColor: '#1a365d',
        borderWidth: 12,
        borderStyle: 'double',
        orientation: 'landscape',
    },
    elements: [
        {
            id: 'coursera-cert-title',
            type: 'text',
            content: 'CERTIFICATE OF COMPLETION',
            x: 561 - 400,
            y: 150,
            width: 800,
            height: 60,
            zIndex: 1,
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 48,
                fontWeight: 'bold',
                color: '#1a365d',
                textAlign: 'center',
            }
        },
        {
            id: 'coursera-student-name',
            type: 'variable',
            content: '{student_name}',
            x: 120,
            y: 350,
            width: 800,
            height: 60,
            zIndex: 2,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 54,
                fontWeight: 'normal',
                color: '#000000',
                textAlign: 'left',
            }
        },
        {
            id: 'coursera-desc',
            type: 'text',
            content: 'has successfully completed the online, non-credit course',
            x: 120,
            y: 430,
            width: 800,
            height: 30,
            zIndex: 3,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 18,
                fontWeight: 'normal',
                color: '#475569',
                textAlign: 'left',
            }
        },
        {
            id: 'coursera-course-name',
            type: 'variable',
            content: '{course_name}',
            x: 120,
            y: 480,
            width: 800,
            height: 60,
            zIndex: 4,
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 36,
                fontWeight: 'bold',
                color: '#000000',
                textAlign: 'left',
            }
        },
        {
            id: 'coursera-instructor-name',
            type: 'variable',
            content: '{instructor_name}',
            x: 120,
            y: 630,
            width: 300,
            height: 30,
            zIndex: 5,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 18,
                fontWeight: 'bold',
                color: '#1a365d',
                textAlign: 'left',
            }
        },
        {
            id: 'coursera-instructor-label',
            type: 'text',
            content: 'Instructor',
            x: 120,
            y: 660,
            width: 300,
            height: 20,
            zIndex: 6,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                fontWeight: 'normal',
                color: '#64748b',
                textAlign: 'left',
            }
        },
        {
            id: 'coursera-qr',
            type: 'qrcode',
            content: 'https://example.com/verify/{certificate_id}',
            x: 820,
            y: 530,
            width: 120,
            height: 120,
            zIndex: 7,
            style: {
                opacity: 1,
            }
        },
        {
            id: 'coursera-issue-date',
            type: 'variable',
            content: 'Issued: {issue_date}',
            x: 780,
            y: 660,
            width: 200,
            height: 30,
            zIndex: 8,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 12,
                fontWeight: 'normal',
                color: '#64748b',
                textAlign: 'center',
            }
        }
    ]
};

export const UDEMY_TEMPLATE: CertificateTemplateConfig = {
    canvas: {
        width: 1122,
        height: 794,
        backgroundColor: '#f7f9fa',
        borderColor: '#a435f0',
        borderWidth: 12,
        borderStyle: 'solid',
        orientation: 'landscape',
    },
    elements: [
        {
            id: 'udemy-logo',
            type: 'text',
            content: 'Institution Name',
            x: 80,
            y: 80,
            width: 300,
            height: 50,
            zIndex: 1,
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#1c1d1f',
                textAlign: 'left',
            }
        },
        {
            id: 'udemy-cert-label',
            type: 'text',
            content: 'CERTIFICATE OF COMPLETION',
            x: 80,
            y: 180,
            width: 600,
            height: 30,
            zIndex: 2,
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#6a6f73',
                textAlign: 'left',
                textTransform: 'uppercase',
                letterSpacing: 2
            }
        },
        {
            id: 'udemy-course-name',
            type: 'variable',
            content: '{course_name}',
            x: 80,
            y: 240,
            width: 900,
            height: 100,
            zIndex: 3,
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 42,
                fontWeight: 'bold',
                color: '#1c1d1f',
                textAlign: 'left',
                lineHeight: 1.2
            }
        },
        {
            id: 'udemy-student-name-label',
            type: 'text',
            content: 'Awarded to',
            x: 80,
            y: 400,
            width: 200,
            height: 20,
            zIndex: 4,
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 16,
                fontWeight: 'normal',
                color: '#6a6f73',
                textAlign: 'left',
            }
        },
        {
            id: 'udemy-student-name',
            type: 'variable',
            content: '{student_name}',
            x: 80,
            y: 430,
            width: 600,
            height: 60,
            zIndex: 5,
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 48,
                fontWeight: 'normal',
                color: '#1c1d1f',
                textAlign: 'left',
            }
        },
        {
            id: 'udemy-date',
            type: 'variable',
            content: 'Date: {issue_date}',
            x: 80,
            y: 560,
            width: 300,
            height: 20,
            zIndex: 6,
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 14,
                fontWeight: 'normal',
                color: '#6a6f73',
                textAlign: 'left',
            }
        },
        {
            id: 'udemy-length',
            type: 'variable',
            content: 'Length: {duration_completed}',
            x: 80,
            y: 590,
            width: 300,
            height: 20,
            zIndex: 7,
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 14,
                fontWeight: 'normal',
                color: '#6a6f73',
                textAlign: 'left',
            }
        },
        {
            id: 'udemy-cert-id',
            type: 'variable',
            content: 'Certificate no: {certificate_id}',
            x: 80,
            y: 650,
            width: 400,
            height: 20,
            zIndex: 8,
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 12,
                fontWeight: 'normal',
                color: '#6a6f73',
                textAlign: 'left',
            }
        }
    ]
};

export const CISCO_TEMPLATE: CertificateTemplateConfig = {
    canvas: {
        width: 1122,
        height: 794,
        backgroundColor: '#ffffff',
        borderColor: '#005073',
        borderWidth: 20,
        borderStyle: 'double',
        orientation: 'landscape',
    },
    elements: [
        {
            id: 'cisco-logo-text',
            type: 'text',
            content: 'Institution Name',
            x: 561 - 250,
            y: 80,
            width: 500,
            height: 40,
            zIndex: 1,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#005073',
                textAlign: 'center',
            }
        },
        {
            id: 'cisco-cert-title',
            type: 'text',
            content: 'Certificate of Course Completion',
            x: 561 - 300,
            y: 160,
            width: 600,
            height: 50,
            zIndex: 2,
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 36,
                fontWeight: 'bold',
                color: '#333333',
                textAlign: 'center',
            }
        },
        {
            id: 'cisco-student',
            type: 'variable',
            content: '{student_name}',
            x: 561 - 300,
            y: 280,
            width: 600,
            height: 60,
            zIndex: 3,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 42,
                fontWeight: 'bold',
                color: '#000000',
                textAlign: 'center',
            }
        },
        {
            id: 'cisco-course-text',
            type: 'text',
            content: 'has successfully completed the course:',
            x: 561 - 400,
            y: 360,
            width: 800,
            height: 30,
            zIndex: 4,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 16,
                fontWeight: 'normal',
                color: '#555555',
                textAlign: 'center',
            }
        },
        {
            id: 'cisco-course-name',
            type: 'variable',
            content: '{course_name}',
            x: 561 - 350,
            y: 420,
            width: 700,
            height: 50,
            zIndex: 5,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#005073',
                textAlign: 'center',
            }
        },
        {
            id: 'cisco-date',
            type: 'variable',
            content: '{issue_date}',
            x: 561 - 125,
            y: 600,
            width: 250,
            height: 30,
            zIndex: 6,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 16,
                fontWeight: 'normal',
                color: '#333333',
                textAlign: 'center',
            }
        },
        {
            id: 'cisco-date-line',
            type: 'shape',
            content: '',
            shapeType: 'line',
            x: 561 - 125,
            y: 590,
            width: 250,
            height: 2,
            zIndex: 7,
            style: {
                backgroundColor: '#333333',
                borderWidth: 0,
            }
        },
        {
            id: 'cisco-date-label',
            type: 'text',
            content: 'Date of Issue',
            x: 561 - 75,
            y: 630,
            width: 150,
            height: 20,
            zIndex: 8,
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                fontWeight: 'normal',
                color: '#777777',
                textAlign: 'center',
            }
        }
    ]
};

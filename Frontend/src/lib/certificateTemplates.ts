import { CertificateTemplateConfig } from '@/types/certificate';

/**
 * Professional Certificate Templates
 * Ready-to-use certificate designs with pre-positioned elements
 */

export const CLASSIC_ELEGANCE: CertificateTemplateConfig = {
    canvas: {
        width: 1122, // A4 landscape in pixels at 96 DPI (11.7" x 8.3")
        height: 793,
        backgroundColor: '#FFFFFF',
        backgroundImage: '', // Can be set to a decorative border image URL
        orientation: 'landscape',
    },
    elements: [
        // Decorative border frame
        {
            id: 'border-1',
            type: 'image',
            x: 561,
            y: 396,
            width: 1100,
            height: 770,
            content: '/templates/classic-border.png', // Ornate gold frame
            style: {
                opacity: 0.15,
            },
        },
        // Header - "Certificate of Achievement"
        {
            id: 'title-1',
            type: 'text',
            x: 561,
            y: 120,
            content: 'Certificate of Achievement',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 48,
                fontWeight: 'bold',
                color: '#1a1a1a',
                textAlign: 'center',
                letterSpacing: 2,
                textTransform: 'uppercase',
            },
        },
        // Subtitle
        {
            id: 'subtitle-1',
            type: 'text',
            x: 561,
            y: 180,
            content: 'This certifies that',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#666666',
                textAlign: 'center',
            },
        },
        // Student Name (Dynamic)
        {
            id: 'student-name',
            type: 'variable',
            x: 561,
            y: 280,
            content: '{student_name}',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 56,
                fontWeight: 'bold',
                color: '#D4AF37', // Gold
                textAlign: 'center',
                letterSpacing: 1,
            },
        },
        // Underline decoration
        {
            id: 'underline-1',
            type: 'text',
            x: 561,
            y: 310,
            content: '─────────────────────',
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 24,
                color: '#D4AF37',
                textAlign: 'center',
            },
        },
        // Body text
        {
            id: 'body-text',
            type: 'text',
            x: 561,
            y: 370,
            content: 'has successfully completed the course',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 18,
                color: '#333333',
                textAlign: 'center',
            },
        },
        // Course Name (Dynamic)
        {
            id: 'course-name',
            type: 'variable',
            x: 561,
            y: 430,
            content: '{course_name}',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#1a1a1a',
                textAlign: 'center',
            },
        },
        // Completion Date Label
        {
            id: 'date-label',
            type: 'text',
            x: 280,
            y: 620,
            content: 'Date of Completion',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 14,
                color: '#666666',
                textAlign: 'center',
            },
        },
        // Completion Date (Dynamic)
        {
            id: 'completion-date',
            type: 'variable',
            x: 280,
            y: 650,
            content: '{completion_date}',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1a1a1a',
                textAlign: 'center',
            },
        },
        // Instructor Signature Label
        {
            id: 'instructor-label',
            type: 'text',
            x: 561,
            y: 620,
            content: 'Instructor',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 14,
                color: '#666666',
                textAlign: 'center',
            },
        },
        // Instructor Name (Dynamic)
        {
            id: 'instructor-name',
            type: 'variable',
            x: 561,
            y: 650,
            content: '{instructor_name}',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1a1a1a',
                textAlign: 'center',
            },
        },
        // Certificate Number Label
        {
            id: 'cert-number-label',
            type: 'text',
            x: 840,
            y: 620,
            content: 'Certificate Number',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 14,
                color: '#666666',
                textAlign: 'center',
            },
        },
        // Certificate Number (Dynamic)
        {
            id: 'cert-number',
            type: 'variable',
            x: 840,
            y: 650,
            content: '{certificate_number}',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 14,
                fontWeight: 'bold',
                color: '#1a1a1a',
                textAlign: 'center',
            },
        },
        // QR Code
        {
            id: 'qr-code',
            type: 'qrcode',
            x: 950,
            y: 700,
            width: 120,
            height: 120,
            content: '{qr_validation_url}',
            style: {
                opacity: 1,
            },
        },
        // QR Label
        {
            id: 'qr-label',
            type: 'text',
            x: 950,
            y: 750,
            content: 'Scan to Verify',
            style: {
                fontFamily: 'Georgia, serif',
                fontSize: 10,
                color: '#666666',
                textAlign: 'center',
            },
        },
    ],
};

export const MODERN_MINIMALIST: CertificateTemplateConfig = {
    canvas: {
        width: 1122,
        height: 793,
        backgroundColor: '#FFFFFF',
        orientation: 'landscape',
    },
    elements: [
        // Top accent bar
        {
            id: 'accent-bar',
            type: 'image',
            x: 561,
            y: 30,
            width: 1122,
            height: 8,
            content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyMiIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMTIyIiBoZWlnaHQ9IjgiIGZpbGw9IiMwODkxQjIiLz48L3N2Zz4=',
            style: {
                opacity: 1,
            },
        },
        // Title
        {
            id: 'title',
            type: 'text',
            x: 100,
            y: 120,
            content: 'CERTIFICATE',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 42,
                fontWeight: 'bold',
                color: '#0891B2',
                textAlign: 'left',
                letterSpacing: 4,
                textTransform: 'uppercase',
            },
        },
        // Subtitle
        {
            id: 'subtitle',
            type: 'text',
            x: 100,
            y: 170,
            content: 'OF COMPLETION',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 24,
                fontWeight: 'normal',
                color: '#475569',
                textAlign: 'left',
                letterSpacing: 2,
            },
        },
        // Presented to label
        {
            id: 'presented-label',
            type: 'text',
            x: 100,
            y: 260,
            content: 'Presented to',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                color: '#64748B',
                textAlign: 'left',
            },
        },
        // Student Name
        {
            id: 'student-name',
            type: 'variable',
            x: 100,
            y: 320,
            content: '{student_name}',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 48,
                fontWeight: 'bold',
                color: '#0F172A',
                textAlign: 'left',
            },
        },
        // For completing
        {
            id: 'for-completing',
            type: 'text',
            x: 100,
            y: 400,
            content: 'For successfully completing',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                color: '#64748B',
                textAlign: 'left',
            },
        },
        // Course Name
        {
            id: 'course-name',
            type: 'variable',
            x: 100,
            y: 450,
            content: '{course_name}',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#1E293B',
                textAlign: 'left',
            },
        },
        // Date and Instructor Footer
        {
            id: 'completion-date-label',
            type: 'text',
            x: 100,
            y: 650,
            content: 'Completed on {completion_date}',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: '#64748B',
                textAlign: 'left',
            },
        },
        {
            id: 'instructor-label',
            type: 'text',
            x: 100,
            y: 680,
            content: 'Instructor: {instructor_name}',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: '#64748B',
                textAlign: 'left',
            },
        },
        {
            id: 'cert-number',
            type: 'variable',
            x: 100,
            y: 710,
            content: 'Certificate #: {certificate_number}',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                color: '#94A3B8',
                textAlign: 'left',
            },
        },
        // QR Code (right side)
        {
            id: 'qr-code',
            type: 'qrcode',
            x: 950,
            y: 400,
            width: 140,
            height: 140,
            content: '{qr_validation_url}',
            style: {
                opacity: 1,
            },
        },
        {
            id: 'qr-label',
            type: 'text',
            x: 950,
            y: 490,
            content: 'SCAN TO VERIFY',
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                fontWeight: 'bold',
                color: '#0891B2',
                textAlign: 'center',
                letterSpacing: 1,
            },
        },
    ],
};

export const CORPORATE_PROFESSIONAL: CertificateTemplateConfig = {
    canvas: {
        width: 1122,
        height: 793,
        backgroundColor: '#F8FAFC',
        orientation: 'landscape',
    },
    elements: [
        // Header Block
        {
            id: 'header-bg',
            type: 'image',
            x: 561,
            y: 80,
            width: 1122,
            height: 140,
            content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyMiIgaGVpZ2h0PSIxNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjExMjIiIGhlaWdodD0iMTQwIiBmaWxsPSIjMUU0MEJGII8vc3ZnPg==',
            style: {
                opacity: 0.95,
            },
        },
        {
            id: 'title',
            type: 'text',
            x: 561,
            y: 100,
            content: 'CERTIFICATE OF COMPLETION',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 36,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
                letterSpacing: 3,
            },
        },
        // Logo placeholder
        {
            id: 'logo',
            type: 'text',
            x: 561,
            y: 150,
            content: '🎓',
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 32,
                color: '#FFFFFF',
                textAlign: 'center',
            },
        },
        // Main content
        {
            id: 'presented-to',
            type: 'text',
            x: 561,
            y: 260,
            content: 'This certificate is proudly presented to',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 18,
                color: '#475569',
                textAlign: 'center',
            },
        },
        {
            id: 'student-name',
            type: 'variable',
            x: 561,
            y: 340,
            content: '{student_name}',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 48,
                fontWeight: 'bold',
                color: '#1E40AF',
                textAlign: 'center',
            },
        },
        // Divider
        {
            id: 'divider',
            type: 'text',
            x: 561,
            y: 375,
            content: '━━━━━━━━━━━',
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 20,
                color: '#CBD5E1',
                textAlign: 'center',
            },
        },
        {
            id: 'completion-text',
            type: 'text',
            x: 561,
            y: 430,
            content: 'For successful completion of',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 16,
                color: '#64748B',
                textAlign: 'center',
            },
        },
        {
            id: 'course-name',
            type: 'variable',
            x: 561,
            y: 480,
            content: '{course_name}',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 30,
                fontWeight: 'bold',
                color: '#0F172A',
                textAlign: 'center',
            },
        },
        // Footer section
        {
            id: 'completion-date',
            type: 'variable',
            x: 300,
            y: 620,
            content: '{completion_date}',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 14,
                color: '#475569',
                textAlign: 'center',
            },
        },
        {
            id: 'date-label',
            type: 'text',
            x: 300,
            y: 645,
            content: 'Date',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 11,
                color: '#94A3B8',
                textAlign: 'center',
                textTransform: 'uppercase',
            },
        },
        {
            id: 'instructor-name',
            type: 'variable',
            x: 561,
            y: 620,
            content: '{instructor_name}',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 14,
                fontWeight: 'bold',
                color: '#475569',
                textAlign: 'center',
            },
        },
        {
            id: 'instructor-label',
            type: 'text',
            x: 561,
            y: 645,
            content: 'Authorized Instructor',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 11,
                color: '#94A3B8',
                textAlign: 'center',
                textTransform: 'uppercase',
            },
        },
        {
            id: 'cert-number',
            type: 'variable',
            x: 822,
            y: 620,
            content: '{certificate_number}',
            style: {
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#64748B',
                textAlign: 'center',
            },
        },
        {
            id: 'cert-label',
            type: 'text',
            x: 822,
            y: 645,
            content: 'Certificate Number',
            style: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 11,
                color: '#94A3B8',
                textAlign: 'center',
                textTransform: 'uppercase',
            },
        },
        // QR Code (bottom left)
        {
            id: 'qr-code',
            type: 'qrcode',
            x: 140,
            y: 680,
            width: 90,
            height: 90,
            content: '{qr_validation_url}',
            style: {
                opacity: 1,
            },
        },
    ],
};

export const ACADEMIC_TRADITIONAL: CertificateTemplateConfig = {
    canvas: {
        width: 1122,
        height: 793,
        backgroundColor: '#FFF8F0',
        orientation: 'landscape',
    },
    elements: [
        // University seal/emblem placeholder
        {
            id: 'seal',
            type: 'text',
            x: 561,
            y: 80,
            content: '🎖️',
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 56,
                color: '#991B1B',
                textAlign: 'center',
            },
        },
        // Main title
        {
            id: 'title',
            type: 'text',
            x: 561,
            y: 160,
            content: 'Certificate of Achievement',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 42,
                fontWeight: 'bold',
                color: '#7C2D12',
                textAlign: 'center',
                letterSpacing: 1,
            },
        },
        // Decorative line
        {
            id: 'decorative-line',
            type: 'text',
            x: 561,
            y: 195,
            content: '✦ ━━━━━━━━━━ ✦',
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 18,
                color: '#F59E0B',
                textAlign: 'center',
            },
        },
        // Formal body text
        {
            id: 'formal-text-1',
            type: 'text',
            x: 561,
            y: 250,
            content: 'This is to certify that',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 18,
                fontStyle: 'italic',
                color: '#78350F',
                textAlign: 'center',
            },
        },
        // Student Name
        {
            id: 'student-name',
            type: 'variable',
            x: 561,
            y: 330,
            content: '{student_name}',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 52,
                fontWeight: 'bold',
                color: '#991B1B',
                textAlign: 'center',
                letterSpacing: 1,
            },
        },
        // Underline
        {
            id: 'name-underline',
            type: 'text',
            x: 561,
            y: 360,
            content: '═══════════════════════',
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 18,
                color: '#F59E0B',
                textAlign: 'center',
            },
        },
        // Middle section
        {
            id: 'completion-text',
            type: 'text',
            x: 561,
            y: 420,
            content: 'has satisfactorily completed the required coursework in',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 16,
                color: '#78350F',
                textAlign: 'center',
            },
        },
        // Course Name
        {
            id: 'course-name',
            type: 'variable',
            x: 561,
            y: 475,
            content: '{course_name}',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 30,
                fontWeight: 'bold',
                color: '#1C1917',
                textAlign: 'center',
            },
        },
        // Bottom section - Date
        {
            id: 'date-preamble',
            type: 'text',
            x: 561,
            y: 550,
            content: 'Given this {completion_date}',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 14,
                fontStyle: 'italic',
                color: '#57534E',
                textAlign: 'center',
            },
        },
        // Signature section
        {
            id: 'signature-line-left',
            type: 'text',
            x: 350,
            y: 650,
            content: '___________________________',
            style: {
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                color: '#78350F',
                textAlign: 'center',
            },
        },
        {
            id: 'instructor-name',
            type: 'variable',
            x: 350,
            y: 680,
            content: '{instructor_name}',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 14,
                fontWeight: 'bold',
                color: '#292524',
                textAlign: 'center',
            },
        },
        {
            id: 'instructor-title',
            type: 'text',
            x: 350,
            y: 705,
            content: 'Course Instructor',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 12,
                fontStyle: 'italic',
                color: '#78350F',
                textAlign: 'center',
            },
        },
        // Certificate number section (right)
        {
            id: 'cert-number-label',
            type: 'text',
            x: 772,
            y: 665,
            content: 'Certificate No.',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 12,
                color: '#78350F',
                textAlign: 'center',
            },
        },
        {
            id: 'cert-number',
            type: 'variable',
            x: 772,
            y: 690,
            content: '{certificate_number}',
            style: {
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 'bold',
                color: '#292524',
                textAlign: 'center',
            },
        },
        // QR Code (centered bottom)
        {
            id: 'qr-code',
            type: 'qrcode',
            x: 561,
            y: 705,
            width: 100,
            height: 100,
            content: '{qr_validation_url}',
            style: {
                opacity: 1,
            },
        },
        {
            id: 'qr-label',
            type: 'text',
            x: 561,
            y: 760,
            content: 'Scan for Verification',
            style: {
                fontFamily: '"Times New Roman", serif',
                fontSize: 9,
                color: '#78350F',
                textAlign: 'center',
            },
        },
    ],
};

// Export all templates as an array for easy iteration
export const DEFAULT_TEMPLATES = [
    {
        name: 'Classic Elegance',
        description: 'Traditional certificate with ornate styling and gold accents',
        config: CLASSIC_ELEGANCE,
        is_default: true,
    },
    {
        name: 'Modern Minimalist',
        description: 'Clean, contemporary design with geometric elements',
        config: MODERN_MINIMALIST,
        is_default: true,
    },
    {
        name: 'Corporate Professional',
        description: 'Professional business-style certificate',
        config: CORPORATE_PROFESSIONAL,
        is_default: true,
    },
    {
        name: 'Academic Traditional',
        description: 'Formal university-style certificate with ceremonial layout',
        config: ACADEMIC_TRADITIONAL,
        is_default: true,
    },
];

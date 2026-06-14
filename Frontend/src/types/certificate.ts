export type CertificateElementType = 'text' | 'image' | 'variable' | 'qrcode' | 'shape';

export interface CertificateElement {
    id: string;
    type: CertificateElementType;
    content: string; // Text content or Image URL or QR Code data
    x: number;
    y: number;
    width?: number;
    height?: number;
    zIndex?: number;
    shapeType?: 'rectangle' | 'circle' | 'line' | 'star' | 'badge';
    style: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
        color?: string;
        textAlign?: 'left' | 'center' | 'right';
        opacity?: number;
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
        letterSpacing?: number;
        lineHeight?: number;
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        borderRadius?: number;
        textShadow?: string;
        boxShadow?: string;
    };
}

export interface CertificateTemplateConfig {
    canvas: {
        width: number;
        height: number;
        backgroundColor: string;
        backgroundImage?: string;
        borderColor?: string;
        borderWidth?: number;
        borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
        orientation: 'landscape' | 'portrait';
    };
    elements: CertificateElement[];
}

export const PLACEHOLDERS = [
    { label: 'Student Name', value: '{student_name}' },
    { label: 'Course Name', value: '{course_name}' },
    { label: 'Completion Date', value: '{completion_date}' },
    { label: 'Instructor Name', value: '{instructor_name}' },
    { label: 'Certificate ID', value: '{certificate_id}' },
    { label: 'Issue Date', value: '{issue_date}' },
    { label: 'Grade Average', value: '{grade_average}' },
    { label: 'Duration Completed', value: '{duration_completed}' },
];

export const FONTS = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Impact', value: 'Impact, sans-serif' },
    { label: 'Great Vibes', value: '"Great Vibes", cursive' }, // Need to ensure this is loaded or available
    { label: 'Roboto', value: 'Roboto, sans-serif' },
];

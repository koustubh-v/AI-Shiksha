import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Upload,
    File,
    Image as ImageIcon,
    Video,
    FileText,
    X,
    Check,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    accept?: Record<string, string[]>;
    maxSize?: number; // in bytes
    multiple?: boolean;
    onUpload: (files: File[]) => Promise<string[]>; // Returns URLs
    value?: string | string[];
    onChange?: (urls: string | string[]) => void;
}

export function FileUpload({
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        'video/*': ['.mp4', '.webm', '.mov'],
        'application/pdf': ['.pdf'],
    },
    maxSize = 100 * 1024 * 1024, // 100MB default
    multiple = false,
    onUpload,
    value,
    onChange,
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; type: string }[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const urls = await onUpload(acceptedFiles);

            clearInterval(progressInterval);
            setUploadProgress(100);

            const newFiles = acceptedFiles.map((file, index) => ({
                name: file.name,
                url: urls[index],
                type: file.type,
            }));

            setUploadedFiles(multiple ? [...uploadedFiles, ...newFiles] : newFiles);

            if (onChange) {
                onChange(multiple ? [...(Array.isArray(value) ? value : []), ...urls] : urls[0]);
            }

            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
            }, 500);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
            setUploadProgress(0);
        }
    }, [onUpload, onChange, multiple, value, uploadedFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple,
        disabled: uploading,
    });

    const removeFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);

        if (onChange) {
            onChange(multiple ? newFiles.map(f => f.url) : '');
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
        if (type.startsWith('video/')) return <Video className="h-8 w-8" />;
        if (type === 'application/pdf') return <FileText className="h-8 w-8" />;
        return <File className="h-8 w-8" />;
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <Card
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed cursor-pointer transition-colors',
                    isDragActive && 'border-primary bg-primary/5',
                    uploading && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
                <div className="p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    {uploading ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Uploading...</p>
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                        </div>
                    ) : isDragActive ? (
                        <p className="text-sm font-medium">Drop files here...</p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Drag & drop {multiple ? 'files' : 'a file'} here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Uploaded {multiple ? 'Files' : 'File'}
                    </p>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-muted-foreground">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {file.url}
                                        </p>
                                    </div>
                                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Existing Files (from value prop) */}
            {value && !uploadedFiles.length && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Current File(s)</p>
                    <div className="space-y-2">
                        {(Array.isArray(value) ? value : [value]).map((url, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-center gap-3">
                                    <File className="h-8 w-8 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground truncate">{url}</p>
                                    </div>
                                    <Check className="h-5 w-5 text-green-500" />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Specialized upload components

export function VideoUpload(props: Omit<FileUploadProps, 'accept'>) {
    return (
        <FileUpload
            {...props}
            accept={{
                'video/*': ['.mp4', '.webm', '.mov', '.avi'],
            }}
        />
    );
}

export function ImageUpload(props: Omit<FileUploadProps, 'accept' | 'multiple'>) {
    return (
        <FileUpload
            {...props}
            accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
            }}
            multiple={false}
        />
    );
}

export function DocumentUpload(props: Omit<FileUploadProps, 'accept'>) {
    return (
        <FileUpload
            {...props}
            accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/vnd.ms-powerpoint': ['.ppt'],
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
                'application/zip': ['.zip'],
            }}
        />
    );
}

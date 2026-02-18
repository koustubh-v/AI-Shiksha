import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Award, QrCode as QrCodeIcon } from 'lucide-react';
import { certificatesService } from '@/lib/api/certificatesService';

interface CertificateViewModalProps {
    open: boolean;
    onClose: () => void;
    courseId: string;
    courseTitle: string;
}

export function CertificateViewModal({ open, onClose, courseId, courseTitle }: CertificateViewModalProps) {
    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && courseId) {
            loadCertificate();
        }
    }, [open, courseId]);

    const loadCertificate = async () => {
        try {
            setLoading(true);
            setError(null);
            const cert = await certificatesService.getCertificateForCourse(courseId);
            if (cert) {
                setCertificate(cert);
            } else {
                setError('Certificate not found. Please contact support if you believe this is an error.');
            }
        } catch (err: any) {
            console.error('Error loading certificate:', err);
            setError('Failed to load certificate. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!certificate) return;

        try {
            // Download PDF from backend
            const blob = await certificatesService.downloadCertificate(certificate.id);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificate-${courseTitle.replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading certificate:', err);
            alert('Failed to download certificate. Please try again.');
        }
    };

    // Construct preview URL with auth token
    const token = localStorage.getItem('lms_token');
    const previewUrl = certificate ? `http://localhost:3000/certificates/${certificate.id}/download?token=${token}` : '';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Award className="h-6 w-6 text-yellow-500" />
                        Certificate of Completion
                    </DialogTitle>
                    <DialogDescription>
                        View and download your certificate of completion below.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={loadCertificate} variant="outline">
                            Try Again
                        </Button>
                    </div>
                ) : certificate ? (
                    <div className="space-y-6">
                        {/* Certificate Preview */}
                        <div className="w-full h-[600px] border-2 border-primary/20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                            <iframe
                                src={previewUrl}
                                className="w-full h-full"
                                title="Certificate Preview"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={handleDownload} className="w-full sm:w-auto gap-2">
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => window.open(certificate.qrValidationUrl, '_blank')} className="w-full sm:w-auto gap-2">
                                <QrCodeIcon className="h-4 w-4" />
                                Verify Certificate
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

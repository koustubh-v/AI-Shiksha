import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ShieldCheck, Clock, Calendar, User, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { certificatesService } from '@/lib/api/certificatesService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function CertificateValidation() {
    const { courseSlug, userId } = useParams<{ courseSlug: string; userId: string }>();
    const [loading, setLoading] = useState(true);
    const [validation, setValidation] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId && courseSlug) {
            validateCertificate();
        }
    }, [userId, courseSlug]);

    const validateCertificate = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await certificatesService.validateCertificate(userId!, courseSlug!);
            setValidation(result);
        } catch (err: any) {
            console.error('Validation error:', err);
            if (err.response?.status === 404) {
                setError('Certificate not found');
            } else {
                setError('Unable to validate certificate. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes: number) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
        }
        return `${mins}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#1a73e8]" />
                    <p className="text-[#5f6368] font-medium text-lg">Verifying authenticity...</p>
                </div>
            </div>
        );
    }

    if (error || !validation) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 font-sans">
                <Card className="max-w-md w-full border-0 shadow-lg rounded-[28px] overflow-hidden bg-white">
                    <div className="bg-[#fce8e6] p-8 flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-[#ea4335] flex items-center justify-center shadow-sm">
                            <XCircle className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <CardContent className="p-8 text-center pt-6">
                        <h1 className="text-2xl font-normal text-[#202124] mb-3 font-google-sans">
                            Certificate Not Found
                        </h1>
                        <p className="text-[#5f6368] mb-8 leading-relaxed">
                            {error || 'The certificate you are trying to validate could not be found or has been revoked.'}
                        </p>

                        <div className="space-y-3">
                            <Button onClick={validateCertificate} variant="outline" className="w-full rounded-full h-12 border-[#dadce0] text-[#1a73e8] hover:bg-[#f6fafe] hover:text-[#174ea6] font-medium">
                                Try Again
                            </Button>
                            <Link to="/">
                                <Button className="w-full rounded-full h-12 bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-md font-medium">
                                    Go to Homepage
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#f1f3f4]">
                            <div className="flex bg-[#fef7e0] p-4 rounded-xl items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-[#f9ab00] shrink-0 mt-0.5" />
                                <p className="text-xs text-left text-[#3c4043] leading-5">
                                    <span className="font-semibold block mb-1">Verification Notice</span>
                                    Double-check the URL or QR code. If you believe this is an error, please contact support.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 md:p-8 font-sans">
            <Card className="max-w-3xl w-full border-0 shadow-xl rounded-[32px] overflow-hidden bg-white flex flex-col md:flex-row">

                {/* Left Side: Status & Hero */}
                <div className="md:w-2/5 bg-[#e8f0fe] p-8 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-[#d2e3fc] rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-[#aecbfa] rounded-full blur-2xl opacity-40"></div>

                    <div className="z-10 bg-white p-4 rounded-full shadow-sm mb-6">
                        <div className="h-24 w-24 rounded-full bg-[#34a853] flex items-center justify-center shadow-inner">
                            <ShieldCheck className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3 font-google-sans z-10">
                        Verified
                    </h1>
                    <Badge className="bg-[#34a853] hover:bg-[#34a853] text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm mb-4 border-0 z-10">
                        Authentic Certificate
                    </Badge>
                    <p className="text-[#3c4043] text-sm max-w-[200px] leading-relaxed z-10">
                        This credential has been cryptographically verified by the platform.
                    </p>
                </div>

                {/* Right Side: Details */}
                <CardContent className="md:w-3/5 p-8 md:p-10 bg-white">
                    <div className="space-y-8">
                        <div>
                            <p className="textxs font-medium text-[#5f6368] uppercase tracking-wider mb-1 px-1">Detailed Transcript</p>
                            <h2 className="text-2xl font-normal text-[#202124] leading-tight">
                                {validation.courseName}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                            <div className="group">
                                <div className="flex items-center gap-3 mb-2 text-[#5f6368] group-hover:text-[#1a73e8] transition-colors">
                                    <div className="p-2 bg-[#f1f3f4] rounded-full group-hover:bg-[#e8f0fe] transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">Issued To</span>
                                </div>
                                <p className="text-lg text-[#202124] pl-1 font-medium">{validation.studentName}</p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-2 text-[#5f6368] group-hover:text-[#1a73e8] transition-colors">
                                    <div className="p-2 bg-[#f1f3f4] rounded-full group-hover:bg-[#e8f0fe] transition-colors">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">Instructor</span>
                                </div>
                                <p className="text-lg text-[#202124] pl-1">{validation.instructor}</p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-2 text-[#5f6368] group-hover:text-[#1a73e8] transition-colors">
                                    <div className="p-2 bg-[#f1f3f4] rounded-full group-hover:bg-[#e8f0fe] transition-colors">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">Issue Date</span>
                                </div>
                                <p className="text-lg text-[#202124] pl-1">
                                    {new Date(validation.issuedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-2 text-[#5f6368] group-hover:text-[#1a73e8] transition-colors">
                                    <div className="p-2 bg-[#f1f3f4] rounded-full group-hover:bg-[#e8f0fe] transition-colors">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">Total Learning Time</span>
                                </div>
                                <p className="text-lg text-[#202124] pl-1 font-medium font-mono text-[#1a73e8]">
                                    {formatDuration(validation.totalLearningTime)}
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 relative">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#dadce0] to-transparent"></div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                                <div>
                                    <p className="text-xs text-[#5f6368] uppercase tracking-wider mb-1">Certificate ID</p>
                                    <p className="font-mono text-sm text-[#3c4043] bg-[#f8f9fa] px-3 py-1.5 rounded-lg border border-[#dadce0]">
                                        {validation.certificateNumber}
                                    </p>
                                </div>
                                <Link to="/">
                                    <Button variant="ghost" className="text-[#1a73e8] hover:text-[#174ea6] hover:bg-[#f6fafe] rounded-full px-6 font-medium group">
                                        Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
                .font-google-sans {
                    font-family: 'Google Sans', sans-serif;
                }
            `}</style>
        </div>
    );
}

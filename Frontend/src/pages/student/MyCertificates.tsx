import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, Loader2, Calendar, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { certificatesService, Certificate } from "@/lib/api/certificatesService";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";

export default function MyCertificatesPage() {
    const { toast } = useToast();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            setLoading(true);
            const data = await certificatesService.getMyCertificates();
            setCertificates(data);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load certificates",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (certificate: Certificate) => {
        try {
            const data = await certificatesService.downloadCertificate(certificate.id);
            // Expected data is a Blob
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Certificate-${certificate.courseName.replace(/\s+/g, '-')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            toast({
                title: "Download Started",
                description: "Your certificate is downloading",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to download certificate",
                variant: "destructive",
            });
        }
    };

    const handleShare = (certificate: Certificate) => {
        const shareUrl = `${window.location.origin}/certificates/${certificate.id}`;
        navigator.clipboard.writeText(shareUrl);
        toast({
            title: "Link Copied",
            description: "Certificate link copied to clipboard",
        });
    };

    if (loading) {
        return (
            <UnifiedDashboard title="My Certificates" subtitle="Your earned certifications">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </UnifiedDashboard>
        );
    }

    return (
        <UnifiedDashboard title="My Certificates" subtitle="Your earned certifications">
            <div className="p-6 max-w-7xl mx-auto">

                {certificates.length === 0 ? (
                    <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden mt-8">
                        <CardContent className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Award className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">No Certificates Yet</h3>
                            <p className="text-[#555555] max-w-md mx-auto mb-8">
                                Complete courses to earn certificates and showcase your hard-earned achievements to the world.
                            </p>
                            <Link to="/courses">
                                <Button className="bg-[#0056D2] hover:bg-[#00419e] text-white rounded-full px-8 py-6 shadow-md shadow-blue-100 transition-all font-medium">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Browse Courses
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                        {certificates.map((certificate) => (
                            <div
                                key={certificate.id}
                                className="group relative bg-white border border-gray-100/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                                onClick={() => setSelectedCertificate(certificate)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                
                                <div className="p-6 pb-0 mb-4 mt-2">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                                            <Award className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-100/50 uppercase tracking-wider">
                                            Verified
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5 flex-1">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                            Certificate
                                        </p>
                                        <h3 className="font-bold text-xl text-[#1F1F1F] group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                            {certificate.courseName}
                                        </h3>
                                    </div>
                                </div>
                                
                                <div className="mt-auto px-6 pb-6 space-y-5">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50/80 w-fit px-3 py-1.5 rounded-lg">
                                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                        <span>
                                            Issued {new Date(certificate.completedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            className="flex-1 bg-[#f0f4f9] hover:bg-[#e9eef6] text-[#1F1F1F] rounded-full shadow-none font-medium transition-colors h-11"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(certificate);
                                            }}
                                        >
                                            <Download className="h-4 w-4 mr-2 text-gray-500" />
                                            Download
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="h-11 w-11 bg-[#f0f4f9] hover:bg-[#e9eef6] text-gray-600 rounded-full shadow-none transition-colors shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare(certificate);
                                            }}
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </UnifiedDashboard>
    );
}

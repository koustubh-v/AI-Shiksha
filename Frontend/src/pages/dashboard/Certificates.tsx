import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { certificatesService, Certificate } from "@/lib/api/certificatesService";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Award,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  Search,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";

function CertificatesContent() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await certificatesService.getMyCertificates();
      setCertificates(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load certificates", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cert: Certificate) => {
    try {
      const data = await certificatesService.downloadCertificate(cert.id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate-${cert.courseName.replace(/\s+/g, "-")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast({ title: "Download Started", description: "Your certificate PDF is downloading." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download certificate.", variant: "destructive" });
    }
  };

  const handleShare = (cert: Certificate) => {
    const shareUrl = `${window.location.origin}/certificates/${cert.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link Copied", description: "Certificate link copied to clipboard." });
  };

  const filtered = certificates.filter((c) =>
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">

      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1F1F1F]">{certificates.length}</p>
            <p className="text-sm text-gray-500">Certificates Earned</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1F1F1F]">{certificates.length > 0 ? "Active" : "None"}</p>
            <p className="text-sm text-gray-500">Verification Status</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-[#1F1F1F]">My Certificates</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full border-gray-200 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Certificate List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
            <Award className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">
            {searchQuery ? "No matching certificates" : "No Certificates Yet"}
          </h3>
          <p className="text-gray-500 max-w-sm mb-6">
            {searchQuery
              ? "Try a different search term."
              : "Complete courses to earn certificates and showcase your achievements."}
          </p>
          {!searchQuery && (
            <Link to="/courses">
              <Button className="bg-[#0056D2] hover:bg-[#00419e] text-white rounded-full px-8">
                <BookOpen className="h-4 w-4 mr-2" /> Browse Courses
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50/60 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Certificate</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Issued</th>
                  <th className="px-6 py-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-20 rounded-xl overflow-hidden border border-gray-100 bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Award className="h-7 w-7 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#1F1F1F] text-sm mb-0.5 group-hover:text-blue-600 transition-colors">{cert.courseName}</div>
                          {cert.instructor && <div className="text-xs text-gray-500">Instructor: {cert.instructor}</div>}
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {cert.credentialId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(cert.completedDate || cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-9 w-9 p-0 border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                          onClick={() => handleShare(cert)}
                          title="Share"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full h-9 gap-2 bg-[#0056D2] hover:bg-[#00419e] text-white px-4 transition-colors"
                          onClick={() => handleDownload(cert)}
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline text-xs font-medium">PDF</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Certificates() {
  const { user } = useAuth();
  const isAdmin = ["admin", "super_admin", "franchise_admin", "instructor", "teacher"].includes(user?.role?.toLowerCase() || "");

  if (isAdmin) {
    return (
      <AdminDashboardLayout title="Certificates" subtitle="Manage and view certificates">
        <CertificatesContent />
      </AdminDashboardLayout>
    );
  }

  return (
    <UnifiedDashboard title="My Certificates" subtitle="View and share your achievements">
      <CertificatesContent />
    </UnifiedDashboard>
  );
}

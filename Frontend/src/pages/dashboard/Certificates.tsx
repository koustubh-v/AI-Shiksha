import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";

const certificates = [
  {
    id: "1",
    courseName: "Complete Web Development Bootcamp",
    instructor: "John Smith",
    completedDate: "Jan 15, 2024",
    credentialId: "CERT-WD-2024-001",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
  },
  {
    id: "2",
    courseName: "UI/UX Design Fundamentals",
    instructor: "Sarah Johnson",
    completedDate: "Dec 20, 2023",
    credentialId: "CERT-UX-2023-045",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    id: "3",
    courseName: "Python for Data Science",
    instructor: "Mike Chen",
    completedDate: "Nov 10, 2023",
    credentialId: "CERT-DS-2023-089",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
    skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
  },
];

export default function Certificates() {
  const { user } = useAuth();
  const isAdmin = ["admin", "super_admin", "franchise_admin", "instructor", "teacher"].includes(user?.role?.toLowerCase() || "");

  const content = (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">

      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1F1F1F]">{certificates.length}</p>
            <p className="text-sm text-gray-500">Certificates Earned</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1F1F1F]">12</p>
            <p className="text-sm text-gray-500">Skills Verified</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-light text-[#1F1F1F]">My Certificates</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search certificates..." className="pl-10 h-10 rounded-full border-gray-200 bg-white" />
          </div>
          <Button variant="outline" className="rounded-full gap-2 bg-white">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Certificate List View */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-xs text-black uppercase tracking-wider">Certificate</th>
                <th className="px-6 py-4 font-medium text-xs text-black uppercase tracking-wider w-1/3">Skills</th>
                <th className="px-6 py-4 font-medium text-xs text-black uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-4 font-medium text-xs text-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-24 rounded-lg overflow-hidden border border-gray-200 relative flex-shrink-0">
                        <img src={cert.thumbnail} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                          <Award className="h-8 w-8 text-black drop-shadow-sm opacity-80" />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1F1F1F] text-sm md:text-base leading-tight mb-1">{cert.courseName}</div>
                        <div className="text-xs text-gray-500">Instructor: {cert.instructor}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">ID: {cert.credentialId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="secondary" className="font-normal text-xs bg-gray-100 text-gray-600 border border-gray-200">{skill}</Badge>
                      ))}
                      {cert.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs text-gray-400 border-dashed">+{cert.skills.length - 3}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {cert.completedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0 border-gray-200 text-gray-500">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" className="rounded-full h-8 gap-2 bg-[#0056D2] hover:bg-[#00419e] text-white px-4">
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">PDF</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <AdminDashboardLayout title="Certificates" subtitle="Manage and view certificates">
        {content}
      </AdminDashboardLayout>
    );
  }

  return (
    <UnifiedDashboard title="My Certificates" subtitle="View and share your achievements">
      {content}
    </UnifiedDashboard>
  );
}

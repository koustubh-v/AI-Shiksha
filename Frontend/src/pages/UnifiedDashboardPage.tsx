import { useAuth } from "@/contexts/AuthContext";
import { TeacherDashboardContent } from "@/components/dashboard/TeacherDashboardContent";
import { StudentDashboardContent } from "@/components/dashboard/StudentDashboardContent";
import { AdminDashboardContent } from "@/components/dashboard/AdminDashboardContent";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import StudentDashboard from "./student/StudentDashboard";

export default function UnifiedDashboardPage() {
  const { user } = useAuth();

  const getTitle = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case "teacher":
      case "instructor":
        return "Instructor Dashboard";
      case "student":
        return "My Learning Dashboard";
      case "admin":
      case "super_admin":
      case "franchise_admin":
        return "Admin Dashboard";
      default:
        return "Dashboard";
    }
  };

  const getSubtitle = () => {
    return `Welcome back, ${user?.name || "User"}!`;
  };

  const isAdminRole = ["admin", "super_admin", "franchise_admin"].includes(user?.role?.toLowerCase() || "");

  // Admin uses the new AdminDashboardLayout
  if (isAdminRole) {
    return (
      <AdminDashboardLayout title={getTitle()} subtitle={getSubtitle()}>
        <AdminDashboardContent />
      </AdminDashboardLayout>
    );
  }

  // Other roles use UnifiedDashboard
  const renderContent = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case "teacher":
      case "instructor":
        return <TeacherDashboardContent />;
      case "student":
        return <StudentDashboard />;
      default:
        // Fallback for unexpected roles, but unlikely with typical use
        return <div>Invalid role: {user?.role}</div>;
    }
  };

  const isStudent = user?.role === "student";

  return (
    <UnifiedDashboard
      title={isStudent ? undefined : getTitle()}
      subtitle={isStudent ? undefined : getSubtitle()}
    >
      {renderContent()}
    </UnifiedDashboard>
  );
}

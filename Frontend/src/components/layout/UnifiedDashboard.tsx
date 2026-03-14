import { ReactNode, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UnifiedSidebar } from "./UnifiedSidebar";
import { StudentNavbar } from "@/components/dashboard/student/StudentNavbar";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileStudentSidebar } from "./MobileStudentSidebar";

interface UnifiedDashboardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function UnifiedDashboard({ children, title, subtitle }: UnifiedDashboardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { collapsed } = useSidebarContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {/* Desktop Sidebar */}
      <UnifiedSidebar />

      {/* Mobile Sidebar Overlay */}
      <MobileStudentSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0",
          collapsed ? "md:pl-[70px]" : "md:pl-[260px]"
        )}
      >
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 flex-shrink-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <StudentNavbar />
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

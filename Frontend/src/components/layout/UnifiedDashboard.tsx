import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UnifiedSidebar } from "./UnifiedSidebar";
import { UnifiedTopBar } from "./UnifiedTopBar";
import UnifiedNavbar from "./UnifiedNavbar";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface UnifiedDashboardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function UnifiedDashboard({ children, title, subtitle }: UnifiedDashboardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { collapsed } = useSidebarContext();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <UnifiedSidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out pt-16",
          collapsed ? "md:pl-[70px]" : "md:pl-[260px]"
        )}
      >
        <UnifiedNavbar />
        {/* <UnifiedTopBar title={title} subtitle={subtitle} /> */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

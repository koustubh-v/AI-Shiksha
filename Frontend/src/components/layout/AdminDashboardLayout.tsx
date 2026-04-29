import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminDashboardLayout({ children, title, subtitle }: AdminDashboardLayoutProps) {
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
      <AdminSidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 min-w-0 overflow-x-hidden",
          collapsed ? "md:pl-[70px]" : "md:pl-[280px]"
        )}
      >
        <AdminTopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 md:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}

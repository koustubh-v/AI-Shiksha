import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { UnifiedSidebar } from "@/components/layout/UnifiedSidebar";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AdminMobileSidebar } from "@/components/layout/AdminMobileSidebar";
import { UnifiedMobileSidebar } from "@/components/layout/UnifiedMobileSidebar";

interface CourseBuilderContainerProps {
    children: ReactNode;
}

export function CourseBuilderContainer({ children }: CourseBuilderContainerProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { collapsed, mobileOpen, setMobileOpen } = useSidebarContext();

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = ["admin", "super_admin", "franchise_admin"].includes(user.role?.toLowerCase() || "");
    const SidebarComponent = isAdmin ? AdminSidebar : UnifiedSidebar;
    const MobileSidebarComponent = isAdmin ? AdminMobileSidebar : UnifiedMobileSidebar;

    return (
        <div className="flex min-h-screen w-full bg-muted/30">
            <SidebarComponent />

            {/* Mobile Header / Trigger - Only visible on mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-background border-b h-16">
                <div className="flex items-center gap-4">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[280px]">
                            <MobileSidebarComponent />
                        </SheetContent>
                    </Sheet>
                    <span className="font-semibold">Course Builder</span>
                </div>
            </div>

            <div
                className={cn(
                    "flex flex-1 flex-col transition-all duration-300 min-h-screen",
                    collapsed ? "md:pl-[70px]" : !isAdmin ? "md:pl-[260px]" : "md:pl-[280px]",
                    "pt-16 md:pt-0" // Add padding top on mobile for the fixed header
                )}
            >
                <main className="flex-1 w-full relative">
                    {children}
                </main>
            </div>
        </div>
    );
}

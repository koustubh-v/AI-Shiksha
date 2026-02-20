import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, GraduationCap, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminMobileSidebar } from "./AdminMobileSidebar";
import { Badge } from "@/components/ui/badge";
import { useFranchise } from "@/contexts/FranchiseContext";
import { getImageUrl } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";

interface AdminTopBarProps {
  title?: string;
  subtitle?: string;
}

export function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  const { mobileOpen, setMobileOpen } = useSidebarContext();
  const { branding } = useFranchise();
  const navigate = useNavigate();

  // Fetch pending actions for notifications
  const { data: pendingActions = [] } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: adminService.getPendingActions,
    refetchInterval: 60000 // Refetch every minute
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      {/* Mobile Menu & Title */}
      <div className="flex items-center gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <AdminMobileSidebar />
          </SheetContent>
        </Sheet>

        <div className="hidden md:block">
          {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {/* Mobile Center Logo & Title */}
      <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
        <div className="overflow-hidden">
          {branding.favicon_url || branding.logo_url ? (
            <img
              src={getImageUrl((branding.favicon_url || branding.logo_url) as string)}
              alt={branding.lms_name}
              className="h-6 w-6 object-cover rounded-md"
            />
          ) : (
            <GraduationCap className="h-6 w-6 text-primary" />
          )}
        </div>
        <span className="text-base font-bold text-foreground tracking-tight">{branding.lms_name}</span>
      </div>

      {/* Actions (Notifications) */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              {pendingActions.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-2 border-background">
                  {pendingActions.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 shadow-lg rounded-xl border-muted">
            <DropdownMenuLabel className="font-semibold text-sm">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto hidden-scrollbar">
              {pendingActions.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No alerts at this time.
                </div>
              ) : (
                pendingActions.map((action, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    className="flex flex-col items-start p-3 cursor-pointer focus:bg-muted/50 transition-colors"
                    onClick={() => navigate(action.href)}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-medium text-sm text-foreground line-clamp-1">{action.title}</span>
                      {action.priority === 'high' ? (
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 ml-2" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500 shrink-0 ml-2" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Action Required by: {action.user || action.teacher || 'System Administration'}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

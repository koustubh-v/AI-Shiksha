import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  MessageSquare,
  Star,
  Tag,
  Settings,
  HelpCircle,
  GraduationCap,
  BarChart3,
  FileText,
  LogOut,
  ShoppingCart,
  Trophy,
  Target,
  Plus,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const getNavItems = (role: UserRole): NavItem[] => {
  switch (role) {
    case "teacher":
      return [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: BookOpen, label: "My Courses", href: "/dashboard/courses", badge: "12" },
        { icon: Users, label: "Students", href: "/dashboard/students" },
        { icon: DollarSign, label: "Revenue", href: "/dashboard/revenue" },
        { icon: Tag, label: "Promotions", href: "/dashboard/promotions" },
        { icon: Star, label: "Reviews", href: "/dashboard/reviews" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: "3" },
        { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
      ];
    case "student":
      return [
        { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
        { icon: GraduationCap, label: "My Learning", href: "/dashboard/my-courses" },
        { icon: BookOpen, label: "Catalog", href: "/dashboard/catalog" },
        { icon: FileText, label: "Assignments", href: "/dashboard/assignments" },
        { icon: Trophy, label: "My Certificates", href: "/dashboard/my-certificates" },
        { icon: Target, label: "Goals", href: "/dashboard/learning-path" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
        { icon: ShoppingCart, label: "Cart", href: "/dashboard/cart" },
      ];
    case "admin":
      return [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: BookOpen, label: "All Courses", href: "/dashboard/courses" },
        { icon: Users, label: "User Management", href: "/dashboard/users" },
        { icon: DollarSign, label: "Revenue", href: "/dashboard/revenue" },
        { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
        { icon: Settings, label: "Settings", href: "/dashboard/platform-settings" },
      ];
    default:
      return [];
  }
};

const bottomNav: NavItem[] = [
  { icon: Settings, label: "Profile Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Help", href: "/dashboard/help" },
];

export function UnifiedSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { collapsed, setCollapsed } = useSidebarContext();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "teacher": return "Instructor";
      case "student": return "Learner";
      default: return role;
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col max-md:hidden",
        "bg-gradient-to-b from-[hsl(220,50%,15%)] to-[hsl(220,50%,12%)]",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 flex-shrink-0">
        <div className={cn("flex items-center gap-2 overflow-hidden transition-all duration-300", collapsed ? "w-8" : "w-full")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className={cn("text-lg font-bold text-white whitespace-nowrap transition-opacity duration-200", collapsed ? "opacity-0" : "opacity-100")}>
            LearnAI
          </span>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="px-3 py-2 border-b border-white/10 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1 p-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive(item.href)
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white",
                    collapsed ? "justify-center px-2" : ""
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </ScrollArea>

      {/* Create Course Button for Teachers */}
      {!collapsed && user.role === "teacher" && (
        <div className="px-3 pb-3 flex-shrink-0">
          <Link to="/dashboard/courses/new">
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        {bottomNav.map((item) => (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                  collapsed ? "justify-center px-2" : ""
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <div className={cn("flex items-center gap-3 px-2 py-2", collapsed ? "justify-center" : "")}>
          <Avatar className="h-9 w-9 border-2 border-white/20 flex-shrink-0">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-primary text-white text-sm">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user.name}</p>
                <p className="truncate text-xs text-white/50">{getRoleLabel(user.role)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 flex-shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

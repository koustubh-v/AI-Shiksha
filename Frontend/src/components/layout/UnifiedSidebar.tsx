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
  Award,
  ChevronDown,
  ChevronRight,
  Bot,
  Landmark,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarLogo } from "./SidebarLogo";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  children?: NavItem[];
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
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: BookOpen, label: "My Courses", href: "/dashboard/my-courses" },
        { icon: MessageSquare, label: "AI Assistant", href: "/dashboard/ai-assistant" },
        { icon: Trophy, label: "Leaderboard", href: "/dashboard/leaderboard" },
        { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
        { icon: DollarSign, label: "Transactions", href: "/dashboard/transactions" },
        { icon: HelpCircle, label: "Support", href: "/dashboard/support" },
        { icon: Settings, label: "Profile Settings", href: "/dashboard/settings" },
      ];
    case "super_admin":
    case "franchise_admin":
    case "admin":
      const adminItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        {
          icon: BookOpen,
          label: "Course Management",
          href: "#",
          children: [
            { icon: BookOpen, label: "All Courses", href: "/dashboard/courses" },
            { icon: FileText, label: "Assignments", href: "/dashboard/assignments" },
            { icon: FileText, label: "Terms & Conditions", href: "/dashboard/system-settings/terms" },
          ],
        },
        { icon: Users, label: "User Management", href: "/dashboard/users" },
        { icon: Bot, label: "Ai Control Center", href: "/dashboard/ai-control" },
        { icon: DollarSign, label: "Revenue", href: "/dashboard/revenue" },
        { icon: Landmark, label: "Add Bank Details", href: "/dashboard/add-bank-details" },
        { icon: Settings, label: "Settings", href: "/dashboard/platform-settings" },
      ];

      if (role === "super_admin") {
        // Insert Franchise Management after Dashboard
        adminItems.splice(1, 0, { icon: Users, label: "Franchises", href: "/dashboard/franchises" });
      }

      return adminItems;
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
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(["Course Management"]);

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      const isOpen = openSubmenus.includes(item.label);

      if (collapsed) {
        // When collapsed, just show the parent icon but maybe link to first child or show tooltip
        // For simplicity in collapsed mode, we might just show the icon and maybe a popover. 
        // Current implementation simplicity: Link to first child? Or keep it seemingly disabled?
        // Let's just render the parent as a link to # but with tooltip.
        // Better: When collapsed, we can't easily show submenus without a popover. 
        // For now, let's render the children flat or just the parent icon.
        // Actually, user requested submenu. Let's make it work in expanded mode primarily.
        return (
          <Collapsible
            key={item.label}
            open={isOpen}
            onOpenChange={() => toggleSubmenu(item.label)}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between hover:bg-white/10 hover:text-white mb-1",
                  collapsed ? "justify-center px-0" : "px-3"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 flex-shrink-0 text-white/60" />
                  {!collapsed && <span className="text-white/60 font-medium">{item.label}</span>}
                </div>
                {!collapsed && (
                  isOpen ? <ChevronDown className="h-4 w-4 text-white/60" /> : <ChevronRight className="h-4 w-4 text-white/60" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  className={cn(
                    "flex items-center gap-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ml-9", // Indented
                    isActive(child.href)
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {!collapsed && <span className="flex-1">{child.label}</span>}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      }

      return (
        <Collapsible
          key={item.label}
          open={isOpen}
          onOpenChange={() => toggleSubmenu(item.label)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <div
              className={cn(
                "flex items-center cursor-pointer justify-between gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-white/60 hover:bg-white/10 hover:text-white",
                collapsed ? "justify-center px-2" : ""
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              </div>
              {!collapsed && (
                isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {item.children.map(child => (
              <Link
                key={child.href}
                to={child.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ml-4 border-l border-white/10",
                  isActive(child.href)
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                <span className="flex-1">{child.label}</span>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
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
    );
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
        <SidebarLogo collapsed={collapsed} />
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
          {navItems.map(renderNavItem)}
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

      {/* Bottom Navigation - Hide for Students */}
      {user.role !== "student" && (
        <div className="border-t border-white/10 p-3 flex-shrink-0">
          {bottomNav.map(renderNavItem)}
        </div>
      )}

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

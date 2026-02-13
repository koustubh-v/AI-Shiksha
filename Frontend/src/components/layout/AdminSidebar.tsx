import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Brain,
  DollarSign,
  BarChart3,
  MessageSquare,
  Shield,
  Settings,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  HelpCircle,
  Activity,
  UserCheck,
  UserCog,
  Lock,
  Folder,
  FileCheck,
  AlertCircle,
  Bot,
  Sparkles,
  Zap,
  TrendingUp,
  CreditCard,
  Receipt,
  Wallet,
  Tag,
  Crown,
  FileText,
  Download,
  Building2,
  Globe,
  Megaphone,
  Ticket,
  MessagesSquare,
  History,
  AlertTriangle,
  Database,
  Palette,
  Mail,
  Link2,
  Bell,
  Key,
  Webhook,
  ScrollText,
  Flag,
  Server,
  HardDrive,
  User,
  Search,
  Plus,
  Award,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
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
  href?: string;
  children?: NavItem[];
  badge?: string;
  badgeColor?: string;
}

const adminNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Users,
    label: "User Management",
    children: [
      { icon: Users, label: "All Users", href: "/dashboard/users" },
      { icon: GraduationCap, label: "Students", href: "/dashboard/students" },
      { icon: UserCheck, label: "Teachers", href: "/dashboard/teachers" },
      { icon: Lock, label: "Roles & Permissions", href: "/dashboard/roles" },
    ],
  },
  {
    icon: BookOpen,
    label: "Course Management",
    children: [
      { icon: BookOpen, label: "All Courses", href: "/dashboard/courses" },
      { icon: Plus, label: "Add Course", href: "/dashboard/courses/new" },
      { icon: Folder, label: "Categories", href: "/dashboard/categories" },
      { icon: UserCog, label: "Enrollment", href: "/dashboard/enrollment" },
      { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
      { icon: CheckSquare, label: "Completion", href: "/dashboard/completion" },
      { icon: FileCheck, label: "Course Approval", href: "/dashboard/course-approval", badge: "5", badgeColor: "bg-destructive" },
    ],
  },
  {
    icon: Brain,
    label: "AI & Automation",
    children: [
      { icon: Bot, label: "AI Control Center", href: "/dashboard/ai-control" },
      { icon: Sparkles, label: "AI Tutor Settings", href: "/dashboard/ai-tutor" },
      { icon: AlertCircle, label: "AI Moderation", href: "/dashboard/ai-moderation" },
      { icon: Zap, label: "AI Insights", href: "/dashboard/ai-insights" },
    ],
  },
  {
    icon: DollarSign,
    label: "Revenue",
    children: [
      { icon: TrendingUp, label: "Overview", href: "/dashboard/revenue" },
      { icon: CreditCard, label: "Transactions", href: "/dashboard/transactions" },
      { icon: Wallet, label: "Payouts", href: "/dashboard/payouts", badge: "12" },
      { icon: Tag, label: "Coupons", href: "/dashboard/coupons" },
      { icon: Crown, label: "Subscriptions", href: "/dashboard/subscriptions" },
    ],
  },
  {
    icon: BarChart3,
    label: "Analytics",
    children: [
      { icon: BarChart3, label: "Overview", href: "/dashboard/analytics" },
      { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    icon: Building2,
    label: "Franchise",
    children: [
      { icon: Building2, label: "All Franchises", href: "/dashboard/franchises" },
      { icon: Globe, label: "Institutions", href: "/dashboard/institutions" },
    ],
  },
  {
    icon: MessageSquare,
    label: "Communication",
    children: [
      { icon: Megaphone, label: "Announcements", href: "/dashboard/announcements" },
      { icon: Ticket, label: "Support Tickets", href: "/dashboard/tickets", badge: "8" },
      { icon: MessagesSquare, label: "Community", href: "/dashboard/community" },
    ],
  },
  {
    icon: Shield,
    label: "Security",
    children: [
      { icon: Shield, label: "Overview", href: "/dashboard/security" },
      { icon: History, label: "Audit Logs", href: "/dashboard/audit-logs" },
      { icon: Database, label: "Data Privacy", href: "/dashboard/data-privacy" },
    ],
  },
  {
    icon: Settings,
    label: "Settings",
    children: [
      { icon: Palette, label: "Platform", href: "/dashboard/platform-settings" },
      { icon: Search, label: "SEO Settings", href: "/dashboard/seo-settings" },
      { icon: Link2, label: "Integrations", href: "/dashboard/integrations" },
      { icon: Bell, label: "Notifications", href: "/dashboard/notification-settings" },
    ],
  },
  {
    icon: Key,
    label: "Developer",
    children: [
      { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
      { icon: Webhook, label: "Webhooks", href: "/dashboard/webhooks" },
      { icon: Flag, label: "Feature Flags", href: "/dashboard/feature-flags" },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { icon: HelpCircle, label: "Help & Docs", href: "/dashboard/help" },
  { icon: Server, label: "System Status", href: "/dashboard/system-status" },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { collapsed, setCollapsed } = useSidebarContext();

  // Determine which group contains the active route
  const getActiveGroups = (): string[] => {
    const active: string[] = [];
    adminNavItems.forEach((item) => {
      if (item.children?.some((child) => {
        if (!child.href) return false;
        if (child.href === "/dashboard") return location.pathname === child.href;
        return location.pathname.startsWith(child.href);
      })) {
        active.push(item.label);
      }
    });
    return active;
  };

  const [openGroups, setOpenGroups] = useState<string[]>(getActiveGroups);

  // Update open groups when route changes to include the active group
  useEffect(() => {
    const activeGroups = getActiveGroups();
    setOpenGroups((prev) => {
      const merged = new Set([...prev, ...activeGroups]);
      return Array.from(merged);
    });
  }, [location.pathname]);

  if (!user) return null;

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return location.pathname === href;

    // Special case for "Add Course" - highlight when in course builder (edit mode)
    if (href === "/dashboard/courses/new" && location.pathname.match(/\/dashboard\/courses\/[^/]+\/edit/)) {
      return true;
    }

    // Prevent "All Courses" from being active when "Add Course" is active
    if (href === "/dashboard/courses" && (location.pathname === "/dashboard/courses/new" || location.pathname.match(/\/dashboard\/courses\/[^/]+\/edit/))) {
      return false;
    }

    return location.pathname.startsWith(href);
  };

  const isGroupActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some((child) => isActive(child.href));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openGroups.includes(item.label);
    const active = isGroupActive(item);

    if (collapsed && depth === 0) {
      return (
        <Tooltip key={item.label} delayDuration={0}>
          <TooltipTrigger asChild>
            {item.href ? (
              <Link
                to={item.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 mx-auto",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            ) : (
              <button
                onClick={() => {
                  setCollapsed(false);
                  setTimeout(() => toggleGroup(item.label), 300);
                }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 mx-auto",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleGroup(item.label)}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
              active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="flex-1 text-left truncate">{item.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                isOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-in-out",
              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="pl-4 mt-0.5 space-y-0.5 py-0.5">
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.href || "#"}
        className={cn(
          "flex items-center gap-3 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-200",
          isActive(item.href)
            ? "bg-white/15 text-white"
            : "text-white/60 hover:bg-white/10 hover:text-white"
        )}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && (
          <span className={cn("px-1.5 py-0.5 text-[10px] rounded-full text-white", item.badgeColor || "bg-primary")}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col max-md:hidden",
        "bg-gradient-to-b from-[hsl(220,50%,15%)] to-[hsl(220,50%,12%)]",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[280px]"
      )}
      style={{ overflow: "hidden" }}
    >
      {/* Logo & Collapse */}
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 flex-shrink-0">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", collapsed ? "w-9" : "w-full")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className={cn("whitespace-nowrap transition-opacity duration-200", collapsed ? "opacity-0" : "opacity-100")}>
            <span className="font-bold text-white">LearnAI</span>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Collapse Toggle Button */}
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
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-0.5">
          {adminNavItems.map((item) => renderNavItem(item))}
        </nav>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t border-white/10 px-3 py-2 space-y-0.5 flex-shrink-0">
        {bottomNavItems.map((item) => (
          <Tooltip key={item.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={item.href || "#"}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                  collapsed ? "justify-center" : ""
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
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-2",
            collapsed ? "justify-center" : ""
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-white/20 flex-shrink-0">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary text-white text-sm">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user.name}</p>
                <p className="truncate text-xs text-white/50">Administrator</p>
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

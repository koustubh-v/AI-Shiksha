import { useState } from "react";
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
  LogOut,
  HelpCircle,
  Server,
  Bot,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SheetClose } from "@/components/ui/sheet";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: { icon: React.ElementType; label: string; href: string }[];
}

const mobileNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: Users,
    label: "Users",
    children: [
      { icon: Users, label: "All Users", href: "/dashboard/users" },
      { icon: GraduationCap, label: "Students", href: "/dashboard/students" },
      { icon: Users, label: "Teachers", href: "/dashboard/teachers" },
      { icon: Shield, label: "Roles", href: "/dashboard/roles" },
    ],
  },
  {
    icon: BookOpen,
    label: "Courses",
    children: [
      { icon: BookOpen, label: "All Courses", href: "/dashboard/courses" },
      { icon: BookOpen, label: "Add Course", href: "/dashboard/courses/new" },
      { icon: BookOpen, label: "Categories", href: "/dashboard/categories" },
      { icon: Users, label: "Enrollment", href: "/dashboard/enrollment" },
      { icon: BookOpen, label: "Certificates", href: "/dashboard/certificates" },
      { icon: BookOpen, label: "Completion", href: "/dashboard/completion" },
      { icon: BookOpen, label: "Approval", href: "/dashboard/course-approval" },
    ],
  },
  { icon: Bot, label: "Ai Control Center", href: "/dashboard/ai-control" },
  { icon: DollarSign, label: "Revenue", href: "/dashboard/revenue" },
  { icon: Landmark, label: "Add Bank Details", href: "/dashboard/add-bank-details" },
  { icon: MessageSquare, label: "Communication", href: "/dashboard/announcements" },
  { icon: Shield, label: "Security", href: "/dashboard/security" },
  { icon: Settings, label: "Settings", href: "/dashboard/platform-settings" },
];

export function AdminMobileSidebar() {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setMobileOpen } = useSidebarContext();

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

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[hsl(220,50%,15%)] to-[hsl(220,50%,12%)]">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-white">LearnAI</span>
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {mobileNavItems.map((item) => {
            if (item.children) {
              const isOpen = openGroups.includes(item.label);
              return (
                <Collapsible key={item.label} open={isOpen} onOpenChange={() => toggleGroup(item.label)}>
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <SheetClose asChild key={child.href}>
                        <Link
                          to={child.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                            isActive(child.href)
                              ? "bg-white/15 text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <child.icon className="h-4 w-4" />
                          <span>{child.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <SheetClose asChild key={item.label}>
                <Link
                  to={item.href || "#"}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <SheetClose asChild>
          <Link
            to="/dashboard/help"
            className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/dashboard/system-status"
            className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          >
            <Server className="h-5 w-5" />
            <span>System Status</span>
          </Link>
        </SheetClose>
      </div>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-9 w-9 border-2 border-white/20">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-primary text-white text-sm">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-white/50">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, Users, Video, CreditCard, Mail, Bot,
  Settings, BarChart, HelpCircle, AlertTriangle, ChevronRight,
  ChevronDown, Rocket, LayoutTemplate, UserCog, Briefcase,
  ShieldAlert, PlayCircle, MessageSquare, Monitor, CheckCircle2,
  XCircle, Zap, LayoutDashboard
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

interface HelpSectionData {
  id: string;
  title: string;
  icon: React.ElementType;
  shortDesc: string;
  featureCount: number;
  overview: string;
  features: string[];
  workflow: string[];
  commonIssues: string[];
  bestPractices: string[];
  keywords: string[];
  lastUpdated: string;
}

interface FAQData {
  id: string;
  question: string;
  answer: string;
}

interface TroubleshootingData {
  category: string;
  items: {
    problem: string;
    cause: string;
    solution: string;
  }[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const SECTIONS: HelpSectionData[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    shortDesc: "Introduction to the LMS portal and role-based workflows.",
    featureCount: 8,
    overview: "Introduce the LMS Admin Dashboard and explain the role based system.",
    features: [
      "Portal overview",
      "Login process",
      "Dashboard navigation",
      "Role based access",
      "Sidebar overview",
      "Admin workflow",
      "Instructor workflow",
      "Student workflow"
    ],
    workflow: [
      "Open LMS portal",
      "Login with credentials",
      "Access dashboard",
      "Navigate modules using sidebar",
      "Manage users/courses/settings"
    ],
    commonIssues: [
      "Invalid login credentials",
      "Session expired",
      "Dashboard not loading"
    ],
    bestPractices: [
      "Use secure passwords",
      "Logout after use",
      "Maintain role permissions properly"
    ],
    keywords: ["login", "roles", "dashboard", "overview", "start"],
    lastUpdated: "Updated 2 days ago"
  },
  {
    id: "franchise-setup",
    title: "Franchise Setup",
    icon: Briefcase,
    shortDesc: "Manage franchise level configuration and setup.",
    featureCount: 5,
    overview: "Manage franchise level configuration and setup.",
    features: [
      "Create franchise",
      "Configure franchise details",
      "Assign franchise managers",
      "Manage branding",
      "Configure permissions"
    ],
    workflow: [
      "Open Franchise Setup",
      "Add franchise information",
      "Configure branding/settings",
      "Assign managers",
      "Save configuration"
    ],
    commonIssues: [
      "Missing required fields",
      "Permission denied",
      "Duplicate franchise name"
    ],
    bestPractices: [
      "Use consistent naming",
      "Verify admin permissions",
      "Review branding before publishing"
    ],
    keywords: ["franchise", "managers", "branches", "setup"],
    lastUpdated: "Updated 1 week ago"
  },
  {
    id: "basic-website-setup",
    title: "Basic Website Setup",
    icon: LayoutTemplate,
    shortDesc: "Configure website branding and LMS platform settings.",
    featureCount: 6,
    overview: "Configure website branding and LMS platform settings.",
    features: [
      "Logo upload",
      "Theme customization",
      "Homepage configuration",
      "Contact information",
      "Website branding",
      "SEO/basic settings"
    ],
    workflow: [
      "Open Website Setup",
      "Upload logo/favicon",
      "Configure branding",
      "Save settings",
      "Preview changes"
    ],
    commonIssues: [
      "Invalid image format",
      "Theme changes not updating",
      "Homepage settings not saving"
    ],
    bestPractices: [
      "Use optimized images",
      "Keep branding consistent",
      "Preview before publishing"
    ],
    keywords: ["branding", "logo", "theme", "seo", "contact"],
    lastUpdated: "Updated 3 days ago"
  },
  {
    id: "user-management",
    title: "User Management",
    icon: Users,
    shortDesc: "Manage users, permissions, and account access.",
    featureCount: 6,
    overview: "Manage users, permissions, and account access. Roles include: Admin, Instructor, Student, Franchise Manager.",
    features: [
      "Add users",
      "Edit users",
      "Delete users",
      "Assign roles",
      "Activate/deactivate accounts",
      "Manage permissions"
    ],
    workflow: [
      "Open User Management",
      "Click Add User",
      "Enter details",
      "Assign role",
      "Save user"
    ],
    commonIssues: [
      "Duplicate email",
      "User not receiving credentials",
      "Permission denied",
      "Login access failed"
    ],
    bestPractices: [
      "Verify email addresses",
      "Assign minimum required permissions",
      "Disable inactive accounts"
    ],
    keywords: ["users", "roles", "permissions", "students", "instructors"],
    lastUpdated: "Updated yesterday"
  },
  {
    id: "course-management",
    title: "Course Management",
    icon: BookOpen,
    shortDesc: "Create and manage LMS courses and educational content.",
    featureCount: 10,
    overview: "Create and manage LMS courses and educational content.",
    features: [
      "Create course",
      "Edit course",
      "Add modules",
      "Upload videos",
      "Upload resources",
      "Add quizzes",
      "Publish/unpublish courses",
      "Course categories",
      "Student enrollment",
      "Progress tracking"
    ],
    workflow: [
      "Open Course Management",
      "Create new course",
      "Add title/description",
      "Upload lessons/resources",
      "Configure quizzes",
      "Publish course"
    ],
    commonIssues: [
      "Video upload failed",
      "Course not visible",
      "Resource attachment failed",
      "Publish action failed"
    ],
    bestPractices: [
      "Use structured course modules",
      "Optimize video sizes",
      "Add clear descriptions"
    ],
    keywords: ["courses", "lessons", "modules", "video", "quiz"],
    lastUpdated: "Updated 5 days ago"
  },
  {
    id: "razorpay-setup",
    title: "Razorpay Setup",
    icon: CreditCard,
    shortDesc: "Configure Razorpay payment gateway integration.",
    featureCount: 5,
    overview: "Configure Razorpay payment gateway integration.",
    features: [
      "API key configuration",
      "Test/live mode",
      "Payment verification",
      "Transaction tracking",
      "Webhook configuration"
    ],
    workflow: [
      "Open Razorpay Setup",
      "Enter API keys",
      "Configure environment",
      "Save settings",
      "Test payment flow"
    ],
    commonIssues: [
      "Invalid API key",
      "Webhook failure",
      "Payment pending",
      "Currency mismatch"
    ],
    bestPractices: [
      "Use test mode before production",
      "Verify webhook URLs",
      "Secure API credentials"
    ],
    keywords: ["payments", "razorpay", "checkout", "transactions", "gateway"],
    lastUpdated: "Updated 2 weeks ago"
  },
  {
    id: "communication-module",
    title: "Communication Module",
    icon: MessageSquare,
    shortDesc: "Manage notifications and communication workflows.",
    featureCount: 5,
    overview: "Manage notifications and communication workflows.",
    features: [
      "Email notifications",
      "Broadcast messaging",
      "Student announcements",
      "Instructor communication",
      "Notification management"
    ],
    workflow: [
      "Open Communication Module",
      "Select audience",
      "Compose message",
      "Send notification"
    ],
    commonIssues: [
      "Emails not sending",
      "Notification delay",
      "Wrong recipient selection"
    ],
    bestPractices: [
      "Review recipients carefully",
      "Use professional messaging",
      "Avoid excessive notifications"
    ],
    keywords: ["email", "messages", "announcements", "notifications"],
    lastUpdated: "Updated 1 month ago"
  },
  {
    id: "ai-features",
    title: "AI Features",
    icon: Bot,
    shortDesc: "AI powered tools and smart LMS workflows.",
    featureCount: 5,
    overview: "AI powered tools and smart LMS workflows.",
    features: [
      "AI content generation",
      "AI assistance",
      "Smart recommendations",
      "Workflow automation",
      "AI enhancement tools"
    ],
    workflow: [
      "Open AI Features",
      "Select AI tool",
      "Enter prompt/input",
      "Generate result",
      "Review output"
    ],
    commonIssues: [
      "AI timeout",
      "Invalid prompt",
      "Response generation failed"
    ],
    bestPractices: [
      "Use clear prompts",
      "Review generated content",
      "Avoid sensitive data input"
    ],
    keywords: ["ai", "artificial intelligence", "generator", "smart"],
    lastUpdated: "Updated 3 days ago"
  },
  {
    id: "maintenance-mode",
    title: "Maintenance Mode",
    icon: ShieldAlert,
    shortDesc: "Control LMS maintenance state and access restrictions.",
    featureCount: 4,
    overview: "Control LMS maintenance state and access restrictions.",
    features: [
      "Enable maintenance mode",
      "Disable maintenance mode",
      "Configure maintenance message",
      "Restrict user access"
    ],
    workflow: [
      "Open Maintenance Mode",
      "Toggle status",
      "Add maintenance message",
      "Save changes"
    ],
    commonIssues: [
      "Users still accessing portal",
      "Maintenance page not displaying"
    ],
    bestPractices: [
      "Notify users before maintenance",
      "Keep maintenance duration minimal"
    ],
    keywords: ["maintenance", "offline", "downtime", "status"],
    lastUpdated: "Updated 2 months ago"
  },
  {
    id: "analytics-setup",
    title: "Analytics Setup",
    icon: BarChart,
    shortDesc: "Manage analytics dashboards and reporting configuration.",
    featureCount: 6,
    overview: "Manage analytics dashboards and reporting configuration.",
    features: [
      "User analytics",
      "Revenue analytics",
      "Engagement analytics",
      "Course analytics",
      "Reporting dashboards",
      "Completion tracking"
    ],
    workflow: [
      "Open Analytics Setup",
      "Configure metrics",
      "Save settings",
      "View dashboards/reports"
    ],
    commonIssues: [
      "Reports missing",
      "Dashboard not updating",
      "Analytics mismatch"
    ],
    bestPractices: [
      "Review analytics regularly",
      "Monitor course completion trends",
      "Track engagement metrics"
    ],
    keywords: ["analytics", "charts", "reports", "metrics", "data"],
    lastUpdated: "Updated 4 days ago"
  }
];

const FAQS: FAQData[] = [
  { id: "faq-1", question: "How do I reset my password?", answer: "Go to the login screen, click 'Forgot Password', enter your registered email address, and follow the instructions sent to your inbox to securely reset your password." },
  { id: "faq-2", question: "How do I create a course?", answer: "Navigate to the 'Course Management' module from the sidebar, click the 'Create Course' button, fill in the course details, upload your lessons, and finally click 'Publish' to make it live." },
  { id: "faq-3", question: "Why are payments failing?", answer: "Payment failures often occur due to incorrect Razorpay API keys, switching to 'Test Mode' in a production environment, or mismatched webhook configurations. Please verify your keys in the 'Razorpay Setup' section." },
  { id: "faq-4", question: "How do I assign roles?", answer: "Go to 'User Management', edit an existing user or create a new one, and select the desired role (Admin, Instructor, Student, or Franchise Manager) from the role dropdown menu. Save your changes." },
  { id: "faq-5", question: "Why are emails not sending?", answer: "Check your SMTP configuration in the 'Communication Module'. Ensure that your email credentials are correct and that your provider hasn't blocked the outbound connection due to suspicious activity." },
  { id: "faq-6", question: "How do I enable maintenance mode?", answer: "Access the 'Maintenance Mode' module from the sidebar, toggle the status switch to 'Enable', provide an optional custom maintenance message for your users, and click 'Save Changes'." },
  { id: "faq-7", question: "How do I configure analytics?", answer: "In the 'Analytics Setup' section, you can configure your tracking metrics, connect third-party analytics scripts if needed, and verify that user engagement tracking is toggled on." },
  { id: "faq-8", question: "How do I publish a course?", answer: "Within 'Course Management', open the course you wish to publish. Ensure all required modules and videos are uploaded successfully, then change the course status from 'Draft' to 'Published'." }
];

const TROUBLESHOOTING: TroubleshootingData[] = [
  {
    category: "Authentication Issues",
    items: [
      { problem: "Invalid login credentials", cause: "Incorrect password or misspelled email address.", solution: "Use the 'Forgot Password' workflow to reset credentials. Verify the exact email format." },
      { problem: "Session expired", cause: "User inactive for too long or server restarted.", solution: "Log in again. If persistent, check your browser's cookie settings." }
    ]
  },
  {
    category: "Course Issues",
    items: [
      { problem: "Video upload failed", cause: "File size exceeds the server limit or format is unsupported.", solution: "Compress the video to under the maximum allowed size (e.g., 500MB) and use standard MP4 format." },
      { problem: "Course not visible", cause: "Course status is set to 'Draft' instead of 'Published'.", solution: "Go to Course Management and update the course status to 'Published'." }
    ]
  },
  {
    category: "Payment Issues",
    items: [
      { problem: "Payment pending", cause: "Webhook notification from Razorpay was delayed or blocked.", solution: "Verify webhook URLs in the Razorpay dashboard and ensure your server can receive POST requests." },
      { problem: "Invalid API key", cause: "API keys were copied with trailing spaces or are from the wrong environment.", solution: "Regenerate the keys in Razorpay and paste them exactly into the Razorpay Setup module." }
    ]
  },
  {
    category: "Communication Issues",
    items: [
      { problem: "Notification delay", cause: "High volume of messages in the background queue.", solution: "Wait a few minutes. Check the system logs to ensure the queue worker is running." },
      { problem: "Wrong recipient selection", cause: "Incorrect user group selected during broadcast creation.", solution: "Always review the target audience count before hitting 'Send Notification'." }
    ]
  },
  {
    category: "Analytics Issues",
    items: [
      { problem: "Reports missing", cause: "Data processing script runs nightly and hasn't compiled yet.", solution: "Wait for the 24-hour cycle to complete, or manually trigger the analytics build if permitted." },
      { problem: "Dashboard not updating", cause: "Browser caching old data.", solution: "Clear your browser cache or perform a hard refresh (Ctrl/Cmd + Shift + R)." }
    ]
  }
];


// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

const Accordion = ({ title, children, icon: Icon, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg mb-3 overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickAccessCard = ({ title, icon: Icon, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-1 group"
  >
    <div className="bg-white/20 p-2 rounded-lg text-white group-hover:bg-white/30 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <span className="font-medium text-white">{title}</span>
  </button>
);


// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search Filtering
  const filteredSections = useMemo(() => {
    if (!searchQuery) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.overview.toLowerCase().includes(q) ||
      s.features.some(f => f.toLowerCase().includes(q)) ||
      s.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(faq =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // ScrollSpy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(`section-${s.id}`));
      const faqElement = document.getElementById('section-faq');
      const troubleshootingElement = document.getElementById('section-troubleshooting');

      const allElements = [...sectionElements, faqElement, troubleshootingElement].filter(Boolean) as HTMLElement[];

      let currentSectionId = '';
      let minDistance = Infinity;

      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Check distance from top of viewport, offset by a header margin
        const distance = Math.abs(rect.top - 100); 
        
        if (rect.top < window.innerHeight / 2 && distance < minDistance) {
          minDistance = distance;
          currentSectionId = el.id.replace('section-', '');
        }
      });

      if (currentSectionId && currentSectionId !== activeSection) {
        setActiveSection(currentSectionId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-800 to-purple-900 text-white pb-16 pt-24 px-6 sm:px-12 lg:px-24">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-indigo-300" />
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Help & Documentation</h1>
            </div>
            <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mb-10 leading-relaxed">
              Guides, workflows, troubleshooting, setup instructions, and platform management documentation for the LMS Admin Dashboard.
            </p>

            {/* 3. SEARCH FUNCTIONALITY */}
            <div className="relative max-w-2xl mb-12">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-indigo-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-sm text-lg shadow-xl"
                placeholder="Search articles, features, workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <QuickAccessCard title="Getting Started" icon={Rocket} onClick={() => scrollToSection('getting-started')} />
              <QuickAccessCard title="Course Mgmt" icon={BookOpen} onClick={() => scrollToSection('course-management')} />
              <QuickAccessCard title="User Mgmt" icon={Users} onClick={() => scrollToSection('user-management')} />
              <QuickAccessCard title="Razorpay Setup" icon={CreditCard} onClick={() => scrollToSection('razorpay-setup')} />
              <QuickAccessCard title="Analytics Setup" icon={BarChart} onClick={() => scrollToSection('analytics-setup')} />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* 2. STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              <span>Menu Navigation</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Navigation</h3>
            </div>
            <nav className="p-3 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
              <ul className="space-y-1">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === section.id 
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span className="truncate">{section.title}</span>
                    </button>
                  </li>
                ))}
                <li className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => scrollToSection('faq')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === 'faq' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('troubleshooting')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === 'troubleshooting' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Troubleshooting
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 space-y-16">
          
          {searchQuery && filteredSections.length === 0 && filteredFaqs.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No help articles found.</h2>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms or keywords.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              {/* 4. CATEGORY CARDS GRID */}
              {!searchQuery && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-indigo-500" />
                    Module Directory
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {SECTIONS.map((section) => (
                      <div 
                        key={`card-${section.id}`}
                        onClick={() => scrollToSection(section.id)}
                        className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <section.icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
                            {section.featureCount} Features
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow">
                          {section.shortDesc}
                        </p>
                        <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          View Documentation <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. HELP ARTICLE STRUCTURE & 6. LMS MODULE CONTENT */}
              <div className="space-y-16">
                {filteredSections.map((section) => (
                  <motion.div 
                    key={section.id}
                    id={`section-${section.id}`}
                    className="scroll-mt-24"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      {/* Section Header */}
                      <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            <section.icon className="w-8 h-8" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{section.title}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{section.lastUpdated}</p>
                          </div>
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-4xl">
                          {section.overview}
                        </p>
                      </div>

                      {/* Section Content */}
                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          
                          {/* Features */}
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                              <Zap className="w-5 h-5 text-amber-500" />
                              Key Features
                            </h3>
                            <ul className="space-y-3">
                              {section.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Workflow */}
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                              <PlayCircle className="w-5 h-5 text-blue-500" />
                              Step-by-Step Workflow
                            </h3>
                            <div className="space-y-4">
                              {section.workflow.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                  </div>
                                  <div className="pt-1 text-slate-600 dark:text-slate-400 font-medium">
                                    {step}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Accordions for Issues & Best Practices */}
                        <div className="mt-8 space-y-4">
                          <Accordion title="Common Issues & Solutions" icon={AlertTriangle}>
                            <ul className="list-disc pl-5 space-y-2">
                              {section.commonIssues.map((issue, idx) => (
                                <li key={idx}>{issue}</li>
                              ))}
                            </ul>
                          </Accordion>
                          <Accordion title="Best Practices" icon={CheckCircle2}>
                            <ul className="list-disc pl-5 space-y-2">
                              {section.bestPractices.map((bp, idx) => (
                                <li key={idx}>{bp}</li>
                              ))}
                            </ul>
                          </Accordion>
                        </div>

                        {/* Keywords Tags */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                          {section.keywords.map((kw, idx) => (
                            <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-full">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 7. FAQ SECTION */}
              {filteredFaqs.length > 0 && (
                <div id="section-faq" className="scroll-mt-24 pt-8">
                  <div className="flex items-center gap-3 mb-8">
                    <HelpCircle className="w-8 h-8 text-indigo-500" />
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFaqs.map((faq) => (
                      <Accordion key={faq.id} title={faq.question} icon={MessageSquare}>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </Accordion>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. TROUBLESHOOTING SECTION */}
              {!searchQuery && (
                <div id="section-troubleshooting" className="scroll-mt-24 pt-8 pb-24">
                  <div className="flex items-center gap-3 mb-8">
                    <Monitor className="w-8 h-8 text-rose-500" />
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Troubleshooting Guide</h2>
                  </div>
                  
                  <div className="space-y-8">
                    {TROUBLESHOOTING.map((category, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <Settings className="w-6 h-6 text-slate-400" />
                          {category.category}
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {category.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50">
                              <div className="flex items-start gap-3 mb-3">
                                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.problem}</h4>
                              </div>
                              <div className="pl-8 space-y-3 text-sm">
                                <div>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">Cause:</span>
                                  <p className="text-slate-600 dark:text-slate-400 mt-1">{item.cause}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Solution:</span>
                                  <p className="text-slate-600 dark:text-slate-400 mt-1">{item.solution}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}

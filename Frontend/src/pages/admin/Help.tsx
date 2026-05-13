import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Link } from 'react-router-dom';
import {
  Search, BookOpen, Users, Video, CreditCard, Mail, Bot,
  Settings, BarChart, HelpCircle, AlertTriangle, ChevronRight,
  ChevronDown, Rocket, LayoutTemplate, UserCog, Briefcase,
  ShieldAlert, PlayCircle, MessageSquare, Monitor, CheckCircle2,
  XCircle, Zap, LayoutDashboard, Bug, ExternalLink
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  workflow: {
    title: string;
    detail: string;
    link?: string;
    linkText?: string;
  }[];
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
      "Sidebar overview"
    ],
    workflow: [
      {
        title: "Platform Overview",
        detail: "The Admin Dashboard is your central hub for managing the entire LMS platform. Here you can see key metrics, manage users, and configure settings. The navigation sidebar on the left gives you quick access to all modules.",
        link: "/dashboard",
        linkText: "Go to Dashboard"
      },
      {
        title: "Understanding Roles",
        detail: "The platform has three main roles: Students (learners), Teachers (course creators/instructors), and Admins (platform managers). Ensure you assign the correct role when creating a new user.",
        link: "/dashboard/users",
        linkText: "Manage Users"
      }
    ],
    commonIssues: ["Invalid login credentials", "Session expired", "Dashboard not loading"],
    bestPractices: ["Use secure passwords", "Logout after use", "Maintain role permissions properly"],
    keywords: ["login", "roles", "dashboard", "overview", "start"],
    lastUpdated: "Updated 2 days ago"
  },
  {
    id: "user-management",
    title: "User Management",
    icon: Users,
    shortDesc: "Manage users, permissions, and account access.",
    featureCount: 6,
    overview: "Manage users, permissions, and account access. Roles include: Admin, Instructor, Student, Franchise Manager.",
    features: ["Add users", "Edit users", "Delete users", "Assign roles", "Activate/deactivate accounts", "Manage permissions"],
    workflow: [
      {
        title: "Adding a New User",
        detail: "To add a new user, navigate to the Users page, click the 'Add User' button, and fill in their name, email, role, and a secure password. They can use these credentials to log in.",
        link: "/dashboard/users",
        linkText: "Open Users Page"
      },
      {
        title: "Bulk Importing Users",
        detail: "If you have a large list of students or teachers, you can import them using a CSV file. Make sure your CSV has the columns: name, email, role, password. The maximum limit is 500 users per upload.",
        link: "/dashboard/users",
        linkText: "Import Users via CSV"
      },
      {
        title: "Changing Roles & Deleting",
        detail: "You can change a user's role or delete their account permanently using the action menu (three dots) next to their name in the user list. Be careful, as deleting an account cannot be undone.",
        link: "/dashboard/users",
        linkText: "Manage Roles"
      }
    ],
    commonIssues: ["Duplicate email", "User not receiving credentials", "Permission denied", "Login access failed"],
    bestPractices: ["Verify email addresses", "Assign minimum required permissions", "Disable inactive accounts"],
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
    features: ["Create course", "Edit course", "Add modules", "Upload videos", "Upload resources", "Add quizzes", "Publish/unpublish courses", "Course categories", "Student enrollment", "Progress tracking"],
    workflow: [
      {
        title: "Creating a New Course",
        detail: "Go to Course Management and click 'Create Course'. You will need to provide a title, description, category, and pricing. You can also set a course thumbnail and promotional video.",
        link: "/dashboard/courses",
        linkText: "Go to Courses"
      },
      {
        title: "Building the Curriculum",
        detail: "A course is divided into Sections (Modules) and Items (Lessons, Quizzes, Assignments). Use the Course Builder to drag-and-drop content. Ensure you add at least one section before publishing.",
        link: "/dashboard/courses",
        linkText: "Open Course Builder"
      },
      {
        title: "Approving Courses",
        detail: "If an instructor creates a course, it might require Admin approval before it goes live. Check the Course Approval page to review and publish pending courses.",
        link: "/dashboard/course-approval",
        linkText: "Review Pending Courses"
      }
    ],
    commonIssues: ["Video upload failed", "Course not visible", "Resource attachment failed", "Publish action failed"],
    bestPractices: ["Use structured course modules", "Optimize video sizes", "Add clear descriptions"],
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
    features: ["API key configuration", "Test/live mode", "Payment verification", "Transaction tracking", "Webhook configuration"],
    workflow: [
      {
        title: "Razorpay Setup (Payments)",
        detail: "To accept payments for your courses, you must configure Razorpay. Go to Platform Settings > Payments, and enter your Razorpay Key ID and Key Secret. Ensure you test this in Sandbox mode before going live.",
        link: "/dashboard/settings",
        linkText: "Configure Payments"
      },
      {
        title: "Testing Transactions",
        detail: "Once configured, use Razorpay test cards to simulate a purchase. Ensure the webhook successfully updates the order status to 'Completed'.",
        link: "/dashboard/transactions",
        linkText: "View Transactions"
      }
    ],
    commonIssues: ["Invalid API key", "Webhook failure", "Payment pending", "Currency mismatch"],
    bestPractices: ["Use test mode before production", "Verify webhook URLs", "Secure API credentials"],
    keywords: ["payments", "razorpay", "checkout", "transactions", "gateway"],
    lastUpdated: "Updated 2 weeks ago"
  },
  {
    id: "analytics-setup",
    title: "Analytics Setup",
    icon: BarChart,
    shortDesc: "Manage analytics dashboards and reporting configuration.",
    featureCount: 6,
    overview: "Manage analytics dashboards and reporting configuration.",
    features: ["User analytics", "Revenue analytics", "Engagement analytics", "Course analytics", "Reporting dashboards", "Completion tracking"],
    workflow: [
      {
        title: "Google Analytics (Traffic)",
        detail: "Track your website visitors and student activity by entering your Google Analytics 4 (GA4) Measurement ID in the Analytics settings.",
        link: "/dashboard/analytics",
        linkText: "Configure Analytics"
      },
      {
        title: "Viewing Reports",
        detail: "Once setup, you can monitor user enrollments, revenue trends, and platform engagement directly from the Analytics Dashboard.",
        link: "/dashboard/analytics",
        linkText: "View Reports"
      }
    ],
    commonIssues: ["Reports missing", "Dashboard not updating", "Analytics mismatch"],
    bestPractices: ["Review analytics regularly", "Monitor course completion trends", "Track engagement metrics"],
    keywords: ["analytics", "charts", "reports", "metrics", "data"],
    lastUpdated: "Updated 4 days ago"
  },
  {
    id: "basic-website-setup",
    title: "Basic Website Setup",
    icon: LayoutTemplate,
    shortDesc: "Configure website branding and LMS platform settings.",
    featureCount: 6,
    overview: "Configure website branding and LMS platform settings.",
    features: ["Logo upload", "Theme customization", "Homepage configuration", "Contact information", "Website branding", "SEO/basic settings"],
    workflow: [
      {
        title: "Updating Logos & Branding",
        detail: "Make the platform your own by uploading your custom Logo and Favicon. Navigate to Platform Settings to update these images and adjust your brand colors.",
        link: "/dashboard/settings",
        linkText: "Platform Settings"
      },
      {
        title: "SEO & Meta Tags",
        detail: "Improve your search engine ranking by adding relevant SEO titles, descriptions, and keywords. This helps students find your courses on Google.",
        link: "/dashboard/settings",
        linkText: "Configure SEO"
      }
    ],
    commonIssues: ["Invalid image format", "Theme changes not updating", "Homepage settings not saving"],
    bestPractices: ["Use optimized images", "Keep branding consistent", "Preview before publishing"],
    keywords: ["branding", "logo", "theme", "seo", "contact"],
    lastUpdated: "Updated 3 days ago"
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
    <AdminDashboardLayout title="Help & Documentation" subtitle="Comprehensive documentation and support for administrators">
      {/* Dynamic Header */}
      <div className="p-3 md:p-8 max-w-[1600px] mx-auto">
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-5 md:p-8 shadow-2xl border border-white/10 group mb-8 transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-blue-500/20 opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2 text-center xl:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3">
                <HelpCircle className="w-10 h-10 text-indigo-400 hidden md:block" /> Help Center
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl mx-auto xl:mx-0">
                Detailed documentation, guides, and troubleshooting for the Admin Dashboard.
              </p>
            </div>
            
            {/* Actions Container */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full xl:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search articles, workflows..."
                  className="pl-9 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none focus-visible:ring-indigo-500 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md font-medium w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Bug Report Button */}
              <a href="mailto:hp.koustubh@gmail.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button className="h-12 rounded-none bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest w-full">
                  <Bug className="h-4 w-4 mr-2" />
                  Report a Bug
                </Button>
              </a>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-start gap-10">
        
        {/* 2. STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:w-72 flex-shrink-0 lg:sticky lg:top-24 h-auto lg:h-[calc(100vh-7rem)] z-10 flex flex-col">
          <div className="lg:hidden mb-4 flex-shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              <span>Menu Navigation</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col ${isMobileMenuOpen ? 'block' : 'hidden lg:flex'}`}>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Navigation</h3>
            </div>
            <nav className="p-3 flex-1 overflow-y-auto custom-scrollbar">
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
                                <div key={idx} className="flex items-start gap-4 mb-6">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm mt-1">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-grow">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{step.title}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{step.detail}</p>
                                    {step.link && (
                                      <a 
                                        href={step.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                      >
                                        {step.linkText} <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
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
    </AdminDashboardLayout>
  );
}

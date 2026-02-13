import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

// Marketing Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

// Unified Dashboard
import UnifiedDashboardPage from "./pages/UnifiedDashboardPage";

// Dashboard Sub-pages
import MyCourses from "./pages/dashboard/MyCourses";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import Messages from "./pages/dashboard/Messages";
import Certificates from "./pages/dashboard/Certificates";
import CourseManagement from "./pages/dashboard/CourseManagement";
import CreateCourseRedirect from "./pages/dashboard/CreateCourseRedirect";
import CourseBuilder from "./pages/dashboard/CourseBuilder";
import UsersPage from "./pages/dashboard/Users";
import Moderation from "./pages/dashboard/Moderation";

// Admin Pages
import StudentsPage from "./pages/admin/Students";
import TeachersPage from "./pages/admin/Teachers";
import RolesPage from "./pages/admin/Roles";
import CategoriesPage from "./pages/admin/Categories";
import CourseApprovalPage from "./pages/admin/CourseApproval";
import AIControlPage from "./pages/admin/AIControl";
import RevenuePage from "./pages/admin/Revenue";
import PayoutsPage from "./pages/admin/Payouts";
import CouponsPage from "./pages/admin/Coupons";
import TicketsPage from "./pages/admin/Tickets";
import PlatformSettingsPage from "./pages/admin/PlatformSettings";
import IntegrationsPage from "./pages/admin/Integrations";
import SecurityPage from "./pages/admin/Security";
import SystemStatusPage from "./pages/admin/SystemStatus";
import SEOSettingsPage from "./pages/admin/SEOSettingsNew";
import AnnouncementsPage from "./pages/admin/Announcements";
import HelpPage from "./pages/admin/Help";
import EnrollmentPage from "./pages/admin/Enrollment";
import CompletionPage from "./pages/admin/Completion";
import FranchisesPage from "./pages/admin/Franchises";
import CertificateTemplatesPage from "./pages/admin/CertificateTemplates";

// Student Pages
import MyCertificatesPage from "./pages/student/MyCertificates";

// Course Pages
import CourseDetailPage from "./pages/course/CourseDetail";
import LessonPlayer from "./pages/learn/LessonPlayer";

// Course Learning (legacy)
import CourseLearn from "./pages/course/CourseLearn";
import CoursePreview from "./pages/course/CoursePreview";

// E-commerce
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

// Other
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Marketing Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Unified Dashboard - Main */}
              <Route path="/dashboard" element={<UnifiedDashboardPage />} />

              {/* Dashboard Sub-routes (shared + role-specific) */}
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/courses" element={<CourseManagement />} />
              <Route path="/dashboard/courses/new" element={<CreateCourseRedirect />} />
              <Route path="/dashboard/courses/:courseId/edit" element={<CourseBuilder />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/messages" element={<Messages />} />
              <Route path="/dashboard/certificates" element={<Certificates />} />
              <Route path="/dashboard/users" element={<UsersPage />} />
              <Route path="/dashboard/moderation" element={<Moderation />} />

              {/* Admin Routes */}
              <Route path="/dashboard/students" element={<StudentsPage />} />
              <Route path="/dashboard/teachers" element={<TeachersPage />} />
              <Route path="/dashboard/roles" element={<RolesPage />} />
              <Route path="/dashboard/categories" element={<CategoriesPage />} />
              <Route path="/dashboard/course-approval" element={<CourseApprovalPage />} />
              <Route path="/dashboard/ai-control" element={<AIControlPage />} />
              <Route path="/dashboard/ai-tutor" element={<AIControlPage />} />
              <Route path="/dashboard/ai-moderation" element={<AIControlPage />} />
              <Route path="/dashboard/ai-insights" element={<AIControlPage />} />
              <Route path="/dashboard/revenue" element={<RevenuePage />} />
              <Route path="/dashboard/transactions" element={<RevenuePage />} />
              <Route path="/dashboard/payouts" element={<PayoutsPage />} />
              <Route path="/dashboard/coupons" element={<CouponsPage />} />
              <Route path="/dashboard/subscriptions" element={<RevenuePage />} />
              <Route path="/dashboard/reports" element={<Analytics />} />
              <Route path="/dashboard/enrollment" element={<EnrollmentPage />} />
              <Route path="/dashboard/completion" element={<CompletionPage />} />
              <Route path="/dashboard/franchises" element={<FranchisesPage />} />
              <Route path="/dashboard/institutions" element={<FranchisesPage />} />
              <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
              <Route path="/dashboard/tickets" element={<TicketsPage />} />
              <Route path="/dashboard/community" element={<TicketsPage />} />
              <Route path="/dashboard/security" element={<SecurityPage />} />
              <Route path="/dashboard/audit-logs" element={<SecurityPage />} />
              <Route path="/dashboard/data-privacy" element={<SecurityPage />} />
              <Route path="/dashboard/platform-settings" element={<PlatformSettingsPage />} />
              <Route path="/dashboard/seo-settings" element={<SEOSettingsPage />} />
              <Route path="/dashboard/integrations" element={<IntegrationsPage />} />
              <Route path="/dashboard/notification-settings" element={<PlatformSettingsPage />} />
              <Route path="/dashboard/api-keys" element={<IntegrationsPage />} />
              <Route path="/dashboard/webhooks" element={<IntegrationsPage />} />
              <Route path="/dashboard/feature-flags" element={<IntegrationsPage />} />
              <Route path="/dashboard/help" element={<HelpPage />} />
              <Route path="/dashboard/system-status" element={<SystemStatusPage />} />
              <Route path="/dashboard/certificate-templates" element={<CertificateTemplatesPage />} />
              <Route path="/dashboard/my-certificates" element={<MyCertificatesPage />} />

              {/* Course Pages (Standalone) */}
              <Route path="/course/:id" element={<CourseDetailPage />} />
              <Route path="/learn/:courseId/lesson/:lessonId" element={<LessonPlayer />} />

              {/* E-commerce */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

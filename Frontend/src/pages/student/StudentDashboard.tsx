import { useAuth } from "@/contexts/AuthContext";
import { StudentMetrics } from "@/components/dashboard/student/StudentMetrics";
import { ResumeCourse } from "@/components/dashboard/student/ResumeCourse";
import { InProgressCourses } from "@/components/dashboard/student/InProgressCourses";
import { CompletedCourses } from "@/components/dashboard/student/CompletedCourses";
import { MilestoneWidget } from "@/components/dashboard/student/MilestoneWidget";
import { WeeklyGoalWidget } from "@/components/dashboard/student/WeeklyGoalWidget";
import { UpcomingMeetingsWidget } from "@/components/dashboard/student/UpcomingMeetingsWidget";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="font-sans text-[#1F1F1F]">

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <header className="mb-8">
            <h1 className="text-3xl font-light text-[#1F1F1F] mb-6">
              Welcome back, <span className="font-semibold">{user?.name || "Student"}</span>
            </h1>
            <StudentMetrics />
          </header>

          <ResumeCourse />
          <InProgressCourses />
          <CompletedCourses />
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
          <MilestoneWidget />
          <WeeklyGoalWidget />
          <UpcomingMeetingsWidget />
        </aside>
      </div>
    </div>
  );
}

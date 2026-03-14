import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Activity } from "lucide-react";

export default function SystemStatusPage() {
  return (
    <AdminDashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <Activity className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">System Status</h1>
        <p className="text-lg text-slate-500 max-w-md">
          Live system monitoring and service health metrics are currently being integrated and will be available here shortly.
        </p>
      </div>
    </AdminDashboardLayout>
  );
}

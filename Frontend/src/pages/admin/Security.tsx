import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { ShieldAlert } from "lucide-react";

export default function SecurityPage() {
  return (
    <AdminDashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Security & Privacy</h1>
        <p className="text-lg text-slate-500 max-w-md">
          This module is currently under active development. Advanced security settings, audit logs, and data privacy controls are coming soon.
        </p>
      </div>
    </AdminDashboardLayout>
  );
}

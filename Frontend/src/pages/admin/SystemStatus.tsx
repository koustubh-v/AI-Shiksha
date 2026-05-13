import React from 'react';
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { 
  Activity, CheckCircle2, AlertTriangle, XCircle, Clock, 
  ExternalLink, RefreshCw, Server, Zap, Globe, ShieldCheck, Database
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface Incident {
  name: string;
  url: string;
  status: string;
  started_at?: string;
}

interface SummaryResponse {
  page_title: string;
  page_url: string;
  ongoing_incidents: Incident[];
  in_progress_maintenances: Incident[];
  scheduled_maintenances: Incident[];
}

export default function SystemStatusPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<SummaryResponse>({
    queryKey: ['system-status'],
    queryFn: async () => {
      const res = await fetch("https://status.iconsafetyinstitute.com/api/v1/summary");
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const hasIncidents = data?.ongoing_incidents && data.ongoing_incidents.length > 0;
  const hasMaintenance = data?.in_progress_maintenances && data.in_progress_maintenances.length > 0;
  const hasScheduled = data?.scheduled_maintenances && data.scheduled_maintenances.length > 0;
  
  const isOperational = !hasIncidents && !hasMaintenance && data;

  return (
    <AdminDashboardLayout title="System Status" subtitle="Real-time monitoring of all franchise servers and API endpoints">
      <div className="p-3 md:p-8 max-w-[1600px] mx-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8">
        
        {/* Dynamic Header */}
        <div className="relative overflow-hidden rounded-none bg-zinc-950 p-5 md:p-8 shadow-2xl border border-white/10 group mb-8">
          {/* Animated Gradients based on status */}
          <div className={`absolute inset-0 opacity-50 transition-all duration-1000 group-hover:opacity-70 ${
            isLoading ? 'bg-gradient-to-br from-slate-500/20 to-slate-800/20' :
            isOperational ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-green-500/20' : 
            hasIncidents ? 'bg-gradient-to-br from-rose-500/20 via-red-500/10 to-orange-500/20' : 
            'bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-500/20'
          }`}></div>
          
          <div className={`absolute -top-24 -right-24 w-96 h-96 blur-3xl transition-transform duration-1000 group-hover:scale-110 ${
            isLoading ? 'bg-slate-500/30' :
            isOperational ? 'bg-emerald-500/30' : 
            hasIncidents ? 'bg-rose-500/30' : 'bg-amber-500/30'
          }`}></div>
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2 text-center xl:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center xl:justify-start gap-3">
                {isLoading ? (
                  <RefreshCw className="w-10 h-10 text-slate-400 animate-spin hidden md:block" />
                ) : isOperational ? (
                  <ShieldCheck className="w-10 h-10 text-emerald-400 hidden md:block" />
                ) : hasIncidents ? (
                  <AlertTriangle className="w-10 h-10 text-rose-400 hidden md:block" />
                ) : (
                  <Clock className="w-10 h-10 text-amber-400 hidden md:block" />
                )}
                Platform Status
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium max-w-xl mx-auto xl:mx-0">
                {isLoading ? "Fetching latest status metrics..." : 
                 isOperational ? "All Systems Operational. No active incidents across any franchises." : 
                 hasIncidents ? "Active Incidents Detected. Engineers are investigating." : 
                 "System Maintenance in Progress."}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Button 
                onClick={() => refetch()}
                disabled={isFetching}
                variant="outline" 
                className="h-12 rounded-none bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold uppercase tracking-widest w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {data?.page_url && (
                <a href={data.page_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button className="h-12 rounded-none bg-white hover:bg-slate-200 text-zinc-900 font-bold uppercase tracking-widest w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Full Status Page
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-none"></div>
             ))}
          </div>
        ) : isError ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 p-8 text-center">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Failed to load status</h3>
            <p className="text-slate-500 dark:text-slate-400">Could not connect to the status monitoring API. Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* BIG STATUS CARD */}
            <div className={`p-8 border-l-4 rounded-none shadow-sm flex flex-col md:flex-row items-center gap-6 ${
              isOperational ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-950/20' :
              hasIncidents ? 'bg-rose-50 border-rose-500 dark:bg-rose-950/20' :
              'bg-amber-50 border-amber-500 dark:bg-amber-950/20'
            }`}>
              <div className={`p-4 rounded-full flex-shrink-0 ${
                isOperational ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' :
                hasIncidents ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400' :
                'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
              }`}>
                {isOperational ? <CheckCircle2 className="w-12 h-12" /> :
                 hasIncidents ? <AlertTriangle className="w-12 h-12" /> :
                 <Clock className="w-12 h-12" />}
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className={`text-2xl md:text-3xl font-black mb-2 tracking-tight ${
                  isOperational ? 'text-emerald-700 dark:text-emerald-400' :
                  hasIncidents ? 'text-rose-700 dark:text-rose-400' :
                  'text-amber-700 dark:text-amber-400'
                }`}>
                  {isOperational ? 'All Systems Operational' :
                   hasIncidents ? 'Degraded Performance' :
                   'Active Maintenance'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
                  {isOperational ? 'No issues detected across the core platform, franchise endpoints, or integrated services.' :
                   hasIncidents ? 'We are currently investigating issues impacting some platform services.' :
                   'Routine maintenance is currently being performed on some systems.'}
                </p>
              </div>
            </div>

            {/* INCIDENTS LIST */}
            {hasIncidents && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Activity className="w-5 h-5 text-rose-500" /> Active Incidents
                </h3>
                <div className="grid gap-4">
                  {data.ongoing_incidents.map((incident, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{incident.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
                              {incident.status}
                            </span>
                          </div>
                        </div>
                        {incident.url && (
                          <a href={incident.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded">
                            Updates <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MAINTENANCE LIST */}
            {(hasMaintenance || hasScheduled) && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Clock className="w-5 h-5 text-amber-500" /> Maintenance
                </h3>
                <div className="grid gap-4">
                  {data.in_progress_maintenances?.map((maint, idx) => (
                    <div key={`ip-${idx}`} className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{maint.name}</h4>
                          <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                            In Progress
                          </span>
                        </div>
                        {maint.url && (
                          <a href={maint.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded">
                            Details <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {data.scheduled_maintenances?.map((maint, idx) => (
                    <div key={`sm-${idx}`} className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{maint.name}</h4>
                          <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Scheduled
                          </span>
                        </div>
                        {maint.url && (
                          <a href={maint.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded">
                            Details <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICES GRID */}
            {isOperational && (
              <div className="pt-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  Service Components
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Core API Server', icon: Server },
                    { name: 'Franchise Portals', icon: Globe },
                    { name: 'Database Clusters', icon: Database },
                    { name: 'Real-time WebSockets', icon: Zap }
                  ].map((service, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 p-5 border border-black/5 dark:border-white/5 flex items-center gap-4 hover:border-emerald-500/50 transition-colors group">
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <service.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{service.name}</p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          Operational
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

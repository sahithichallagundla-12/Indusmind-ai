import React from 'react';
import { useApp } from '../context/AppContext';
import type { ActiveTab } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Wrench, 
  FileCheck, 
  History, 
  Network, 
  LineChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Radio
} from 'lucide-react';

interface SidebarItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<any>;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, settings } = useApp();

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Document Center', icon: FileText },
    { id: 'copilot', label: 'AI Copilot Chat', icon: MessageSquare },
    { id: 'maintenance', label: 'Maintenance Intel', icon: Wrench },
    { id: 'compliance', label: 'Compliance Intel', icon: FileCheck },
    { id: 'lessons', label: 'Lessons Learned', icon: History },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'analytics', label: 'Predictive Analytics', icon: LineChart },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`glass-panel border-r border-slate-800/80 flex flex-col justify-between shrink-0 relative transition-all duration-300 ease-in-out z-30 bg-slate-950/80 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Sidebar Header */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-650 shadow-md shadow-indigo-500/20 shrink-0">
              <Database className="w-5 h-5 text-white animate-pulse-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col select-none">
                <span className="font-bold tracking-wider text-slate-200 font-sans text-sm">
                  INDUSMIND AI
                </span>
                <span className="text-[10px] text-slate-500 tracking-wider font-semibold">
                  WAREHOUSE BRAIN
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex absolute top-5 -right-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-450 hover:text-slate-200 p-1 rounded-full shadow-md z-50 cursor-pointer"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* System Health Check Indicator */}
        {sidebarOpen && (
          <div className="mx-4 mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-semibold font-sans">Edge Nodes Status</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ONLINE
            </span>
          </div>
        )}

        {/* Sidebar Menu Items */}
        <nav className="p-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all duration-200 group cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className={`relative ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-350'}`}>
                  <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                  {isActive && (
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-indigo-500"></span>
                  )}
                </div>
                {sidebarOpen && (
                  <span className="text-[13px] font-sans truncate tracking-wide">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-900/40 transition-colors">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-650 flex items-center justify-center font-bold text-white shadow-md">
              WM
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-300 truncate font-sans">
                {settings.userRole}
              </h4>
              <p className="text-[10px] text-slate-500 truncate font-medium">
                Admin Console
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

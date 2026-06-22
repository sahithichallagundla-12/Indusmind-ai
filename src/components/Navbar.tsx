import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Bell, 
  Settings, 
  Compass, 
  Check, 
  Terminal,
  Cpu,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setCommandPaletteOpen, 
    notificationsOpen, 
    setNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setNotificationsOpen]);

  // Breadcrumbs text mapper
  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'dashboard': return ['Operations', 'Executive Dashboard'];
      case 'documents': return ['Knowledge Base', 'Document Center'];
      case 'copilot': return ['AI Engine', 'Copilot Chat'];
      case 'maintenance': return ['Asset Health', 'Maintenance Intel'];
      case 'compliance': return ['Regulations', 'Compliance Intel'];
      case 'lessons': return ['Historical Records', 'Lessons Learned'];
      case 'graph': return ['Visualization', 'Knowledge Graph'];
      case 'analytics': return ['Predictive Model', 'Analytics Dashboard'];
      case 'settings': return ['System', 'Settings'];
      default: return ['Operations', 'Brain'];
    }
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="glass-panel border-b border-slate-800/80 h-16 px-6 flex items-center justify-between shrink-0 z-20 relative bg-slate-950/40 backdrop-blur">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold select-none">
        <Compass className="w-4 h-4 text-indigo-400" />
        <span className="text-slate-400 font-sans">{breadcrumbs[0]}</span>
        <span className="text-slate-350">/</span>
        <span className="text-slate-200 font-sans tracking-wide">{breadcrumbs[1]}</span>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex max-w-md w-full mx-4">
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-450 text-xs transition-all duration-200 shadow-md group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            <span className="font-sans text-slate-400">Search assets, documents, failure logs, audits...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded shadow-sm">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Controls & Notification & Profile */}
      <div className="flex items-center gap-3">
        {/* AI Command Bar Direct Access */}
        <button 
          onClick={() => setActiveTab('copilot')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all shadow-sm select-none cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-sans tracking-wide">Copilot Command</span>
        </button>

        {/* Notifications Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all relative cursor-pointer ${
              notificationsOpen 
                ? 'bg-slate-800 border-slate-700 text-slate-200' 
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-450 hover:text-slate-250'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel shadow-2xl border border-slate-800 shadow-black/50 p-2 flex flex-col z-50 overflow-hidden bg-slate-900/95">
              <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-250 font-sans tracking-wide">System Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((not) => (
                    <div 
                      key={not.id}
                      onClick={() => {
                        markNotificationRead(not.id);
                        if (not.tabRedirect) {
                          setActiveTab(not.tabRedirect);
                        }
                        setNotificationsOpen(false);
                      }}
                      className={`p-3 rounded-xl hover:bg-slate-800/80 transition-colors flex gap-2.5 items-start cursor-pointer border border-transparent hover:border-slate-800 my-0.5 ${
                        !not.read ? 'bg-indigo-500/5 border-l-indigo-500 border-l-2' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {not.priority === 'high' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        ) : not.tabRedirect === 'documents' ? (
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        ) : (
                          <Cpu className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h5 className="text-xs font-bold text-slate-250 truncate font-sans">{not.title}</h5>
                          <span className="text-[9px] text-slate-500 font-mono tracking-wider shrink-0">{not.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{not.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Settings Shortcut */}
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
            activeTab === 'settings' 
              ? 'bg-slate-800 border-slate-700 text-slate-200' 
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-450 hover:text-slate-250'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

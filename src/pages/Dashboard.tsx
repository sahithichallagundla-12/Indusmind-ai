import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Wrench, 
  FileCheck, 
  Cpu, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  Gauge,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Recharts chart mock data
const chartData = [
  { name: 'Jan', documents: 1400, connections: 8200 },
  { name: 'Feb', documents: 1650, connections: 9100 },
  { name: 'Mar', documents: 1800, connections: 10400 },
  { name: 'Apr', documents: 2100, connections: 11800 },
  { name: 'May', documents: 2320, connections: 13100 },
  { name: 'Jun', documents: 2482, connections: 14208 },
];

const riskData = [
  { name: 'Conveyor B-04', stress: 92, speed: 85 },
  { name: 'Packaging A', stress: 88, speed: 90 },
  { name: 'Scanner Net', stress: 68, speed: 70 },
  { name: 'Forklift FL-12', stress: 62, speed: 50 },
  { name: 'Dock Gate', stress: 24, speed: 30 },
];

export const Dashboard: React.FC = () => {
  const { 
    setActiveTab, 
    documents, 
    maintenanceAlerts, 
    complianceRisks,
    addChatMessage
  } = useApp();

  const totalDocs = documents.length + 2475; // base offset to equal 2,482
  const openAlerts = maintenanceAlerts.filter(a => a.status !== 'Resolved').length;
  const criticalAlerts = maintenanceAlerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const pendingAudits = complianceRisks.filter(r => r.status !== 'Compliant').length;

  const stats = [
    {
      id: 'docs',
      label: 'Documents Processed',
      value: totalDocs.toLocaleString(),
      change: 'SOPs & Manuals',
      trend: 'up',
      subtitle: 'Guidelines, logs & spec files',
      icon: FileText,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/30 border-indigo-900/40',
      action: () => setActiveTab('documents')
    },
    {
      id: 'nodes',
      label: 'Knowledge Connections',
      value: '14,208',
      change: 'Active Map',
      trend: 'up',
      subtitle: 'Entity insights established',
      icon: Cpu,
      color: 'text-violet-400',
      bgColor: 'bg-violet-950/30 border-violet-900/40',
      action: () => setActiveTab('graph')
    },
    {
      id: 'alerts',
      label: 'Active Issues',
      value: openAlerts.toString(),
      change: `${criticalAlerts} Critical`,
      trend: 'critical',
      subtitle: 'Sensor anomalies monitored',
      icon: Wrench,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/30 border-amber-900/40',
      action: () => setActiveTab('maintenance')
    },
    {
      id: 'compliance',
      label: 'Pending Audit Tasks',
      value: pendingAudits.toString(),
      change: 'OSHA & Quality Gaps',
      trend: 'warning',
      subtitle: 'Safety check checklists',
      icon: FileCheck,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/30 border-rose-900/40',
      action: () => setActiveTab('compliance')
    },
    {
      id: 'confidence',
      label: 'System Accuracy',
      value: '98.4%',
      change: 'Reliable Recommendations',
      trend: 'steady',
      subtitle: 'Inference match validation rate',
      icon: Gauge,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/30 border-emerald-900/40',
      action: () => setActiveTab('settings')
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Glow backdrop overlay */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-950/40 to-transparent blur-3xl rounded-full z-0 select-none"></div>
        
        <div className="relative z-10 space-y-1.5">
          <h1 className="text-xl md:text-2xl font-bold font-sans tracking-wide text-slate-100 flex items-center gap-2">
            Welcome back, <span className="text-indigo-400">Operations Team</span>
          </h1>
          <div className="text-xs text-slate-400 leading-relaxed font-sans max-w-3xl space-y-1">
            <p className="font-semibold text-slate-350">INDUSMIND AI is actively monitoring warehouse operations.</p>
            <p>
              2,482 operational documents have been processed across inventory procedures, equipment manuals, maintenance records, quality inspections, and safety guidelines. Your warehouse knowledge network contains 14,208 connected insights helping teams reduce downtime and improve efficiency.
            </p>
          </div>
        </div>
        
        <div className="shrink-0 flex gap-2 relative z-10">
          <button 
            onClick={() => setActiveTab('copilot')}
            className="px-4 py-2.5 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 transition-all cursor-pointer flex items-center gap-1.5 border border-indigo-550"
          >
            <Activity className="w-3.5 h-3.5" /> Ask Warehouse Brain
          </button>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id}
              onClick={stat.action}
              className={`glass-panel p-4 rounded-3xl border cursor-pointer glass-panel-hover flex flex-col justify-between h-36 bg-transparent ${stat.bgColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-500 font-sans uppercase">
                  {stat.label}
                </span>
                <div className={`p-1.5 rounded-xl bg-slate-950 border border-slate-850 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-100 font-sans">
                  {stat.value}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span className="text-[10px] font-bold text-indigo-400 font-sans truncate">
                    {stat.change}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-medium font-sans border-t border-slate-850 pt-1.5">
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts & Interactive Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Area Chart */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 font-sans tracking-wide">Operations Knowledge Mapping</h3>
              <p className="text-[10px] text-slate-400 font-sans">Growth of active insights vs uploaded manuals & safety guidelines</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Insights</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> SOP Docs</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNodes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '10px' }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="connections" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNodes)" />
                <Area type="monotone" dataKey="documents" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorDocs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Agent Panel (Warehouse Theme) */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 font-sans tracking-wide">AI Agent Insights</h3>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-955/40 px-2 py-0.5 rounded-full uppercase">Active</span>
            </div>
            
            <div className="mt-3 space-y-3">
              {/* Insight 1 */}
              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded-md uppercase">Equipment Alert</span>
                  <span className="text-[9px] text-slate-500 font-mono">10m ago</span>
                </div>
                <h5 className="text-[11px] font-bold text-slate-200">Conveyor Belt B-04</h5>
                <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                  Repeated vibration anomalies have been detected during peak shift operations.
                </p>
                <div className="flex justify-between items-center pt-1 border-t border-slate-850 mt-1">
                  <span className="text-[9px] font-bold text-slate-550">Maint. recommendation: 72h ticket</span>
                  <button 
                    onClick={() => {
                      setActiveTab('copilot');
                      addChatMessage('Show maintenance history for Conveyor Belt B-04.');
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    RCA Details <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded-md uppercase">Inventory Insight</span>
                  <span className="text-[9px] text-slate-500 font-mono">1h ago</span>
                </div>
                <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                  Barcode scanning delays have increased in Zone C during the last week. Recalibrate sorting stations.
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setActiveTab('copilot');
                      addChatMessage('Find quality reports and scanner scan logs for Zone C.');
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    Query Scanners <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850">
            <button 
              onClick={() => setActiveTab('copilot')}
              className="w-full py-2 rounded-xl bg-slate-955 hover:bg-slate-900 border border-slate-855 text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Consult Copilot Brain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Asset Heatmap & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotspots Heatmap / Stress Radar */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 font-sans tracking-wide">Critical Asset Stress Matrix</h3>
            <p className="text-[10px] text-slate-400 font-sans">Mechanical stress factor index and relative speed profile values</p>
          </div>

          <div className="h-64 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heat Grid */}
            <div className="grid grid-cols-3 gap-2">
              {riskData.map((asset) => {
                const isCritical = asset.stress > 80;
                const isWarning = asset.stress > 65 && asset.stress <= 80;
                
                return (
                  <div 
                    key={asset.name}
                    onClick={() => {
                      setActiveTab('maintenance');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-102 ${
                      isCritical 
                        ? 'bg-rose-950/30 border-rose-900/50 text-rose-200 shadow-sm shadow-rose-955/10'
                        : isWarning
                          ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                          : 'bg-slate-955/40 border-slate-850 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold font-sans truncate">{asset.name}</span>
                    <div className="mt-2">
                      <span className="text-lg font-bold font-mono block">{asset.stress}%</span>
                      <span className="text-[8px] uppercase tracking-wider text-slate-550 font-bold block">Stress index</span>
                    </div>
                  </div>
                );
              })}
              {/* Fill grid item */}
              <div className="p-3 rounded-2xl border border-slate-850 bg-slate-955/40 text-slate-500 flex flex-col justify-between">
                <span className="text-[10px] font-semibold font-sans truncate">Loading Dock A</span>
                <div>
                  <span className="text-lg font-bold font-mono block">12%</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-550 font-bold block">NORMAL</span>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={8} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '10px' }}
                  />
                  <Bar dataKey="stress" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="speed" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Operations Activity Timeline (Warehouse) */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 font-sans tracking-wide">Warehouse Activity Logs</h3>
            <p className="text-[10px] text-slate-400 font-sans">Recent sensor signals, scans and compliance uploads</p>
          </div>

          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {/* Log item 1 */}
            <div className="flex gap-3 text-xs items-start border-l border-slate-800 pb-3 pl-3.5 relative">
              <span className="absolute top-1 -left-1 w-2 h-2 bg-indigo-500 rounded-full shadow shadow-indigo-400"></span>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">14:15 PM</span>
                <p className="text-slate-350 font-sans">
                  User queried Copilot regarding <span className="font-semibold text-slate-200">Conveyor B-04 history</span>.
                </p>
              </div>
            </div>

            {/* Log item 2 */}
            <div className="flex gap-3 text-xs items-start border-l border-slate-800 pb-3 pl-3.5 relative">
              <span className="absolute top-1 -left-1 w-2 h-2 bg-cyan-500 rounded-full shadow shadow-cyan-400"></span>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">12:30 PM</span>
                <p className="text-slate-350 font-sans">
                  Uploaded operations doc <span className="font-semibold text-slate-200">Inventory Handling SOP.pdf</span>.
                </p>
              </div>
            </div>

            {/* Log item 3 */}
            <div className="flex gap-3 text-xs items-start border-l border-slate-800 pb-3 pl-3.5 relative">
              <span className="absolute top-1 -left-1 w-2 h-2 bg-rose-500 rounded-full shadow shadow-rose-450 animate-pulse"></span>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">10:15 AM</span>
                <p className="text-slate-350 font-sans">
                  Asset anomaly triggered for <span className="font-semibold text-slate-200">Conveyor Belt B-04</span>: drive bearing wear limit warning.
                </p>
              </div>
            </div>

            {/* Log item 4 */}
            <div className="flex gap-3 text-xs items-start pl-3.5 relative">
              <span className="absolute top-1 -left-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">Yesterday</span>
                <p className="text-slate-350 font-sans">
                  Scheduled safety revalidation checklist for <span className="font-semibold text-slate-200">Forklift FL-12</span> updated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

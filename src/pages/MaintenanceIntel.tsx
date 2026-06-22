import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { MaintenanceAlert } from '../context/AppContext';
import { 
  AlertOctagon, 
  Wrench, 
  Clock, 
  CheckCircle, 
  Terminal, 
  Search,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip
} from 'recharts';

const failureTrendData = [
  { month: 'Jan', failures: 1, wearIndex: 35 },
  { month: 'Feb', failures: 2, wearIndex: 42 },
  { month: 'Mar', failures: 0, wearIndex: 38 },
  { month: 'Apr', failures: 3, wearIndex: 55 },
  { month: 'May', failures: 1, wearIndex: 48 },
  { month: 'Jun', failures: 4, wearIndex: 78 },
];

export const MaintenanceIntel: React.FC = () => {
  const { maintenanceAlerts, updateAlertStatus, setActiveTab, addChatMessage } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<MaintenanceAlert | null>(maintenanceAlerts[0] || null);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter alerts
  const filteredAlerts = maintenanceAlerts.filter(alert => {
    const matchesSearch = alert.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.problem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || alert.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      {/* Left 2 Columns: Alerts & Failure Timeline Charts */}
      <div className="lg:col-span-2 flex flex-col space-y-6 overflow-y-auto pr-1">
        {/* Chart Panel */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 font-sans">Warehouse Equipment Failure & Wear Projections</h3>
              <p className="text-[10px] text-slate-400 font-sans">Monthly incident rate vs belt tension wear profiling calculations</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-indigo-500 rounded-sm"></span> Wear %</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 bg-amber-500 rounded-sm"></span> Failures</span>
            </div>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={failureTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '11px' }}
                />
                <Bar dataKey="failures" fill="#F59E0B" barSize={16} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="wearIndex" stroke="#4F46E5" strokeWidth={2.5} dot={{ fill: '#4F46E5' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Grid Inspector */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 space-y-4 flex-1 flex flex-col min-h-[300px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200 font-sans">Active Asset Watchlist</h3>
            </div>

            <div className="flex gap-2 w-full sm:max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filter assets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none placeholder-slate-500 font-sans"
                />
              </div>

              {/* Severity Quick Chips */}
              <select 
                value={filterSeverity} 
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-400 px-2 py-1.5 rounded-xl outline-none"
              >
                <option value="All">All Levels</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                  <th className="pb-3 pl-2">Asset Name</th>
                  <th className="pb-3">Anomaly</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Work Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAlerts.map((alert) => {
                  const isSelected = selectedAlert?.id === alert.id;
                  const isCritical = alert.severity === 'Critical';
                  
                  return (
                    <tr 
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-500/5 text-slate-100 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 pl-2 flex items-center gap-2">
                        <AlertOctagon className={`w-4 h-4 shrink-0 ${isCritical ? 'text-rose-500' : 'text-amber-500'}`} />
                        <span className="truncate max-w-xs">{alert.assetName}</span>
                      </td>
                      <td className="py-3 max-w-[180px] truncate text-slate-400 font-sans">{alert.problem}</td>
                      <td className="py-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isCritical ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400' : 'bg-amber-950/40 border border-amber-900/40 text-amber-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold flex items-center gap-1.5 ${
                          alert.status === 'Open' ? 'text-rose-400' : 
                          alert.status === 'Investigating' ? 'text-amber-400' : 
                          alert.status === 'Scheduled' ? 'text-indigo-400' : 'text-emerald-400'
                        }`}>
                          {alert.status === 'Resolved' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Asset Details & Action Dispatcher */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 flex flex-col justify-between h-full overflow-hidden">
        {selectedAlert ? (
          <div className="space-y-4 h-full flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase font-sans ${
                    selectedAlert.severity === 'Critical' ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400' : 'bg-amber-950/40 border border-amber-900/40 text-amber-400'
                  }`}>
                    {selectedAlert.severity} Risk
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {selectedAlert.date}</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-200 mt-2.5 font-sans leading-snug">
                  {selectedAlert.assetName}
                </h4>
              </div>

              {/* Stress Index */}
              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Asset Stress Index</span>
                  <span className="text-xl font-bold font-mono text-slate-200">{selectedAlert.riskScore}%</span>
                </div>
                <div className="h-10 w-20 flex items-end">
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${selectedAlert.riskScore > 80 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                      style={{ width: `${selectedAlert.riskScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Anomaly and RCA */}
              <div className="space-y-3.5 text-xs leading-relaxed font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Anomaly Diagnosis</span>
                  <p className="text-slate-200 font-semibold">{selectedAlert.problem}</p>
                </div>

                <div className="space-y-1 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-900/50">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Root Cause Recommendation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedAlert.recommendation}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Assigned Dispatch Action</span>
                  <p className="text-slate-400 font-medium italic">{selectedAlert.action}</p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Update Subsystem State</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Investigating', 'Scheduled', 'Resolved'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateAlertStatus(selectedAlert.id, status)}
                      className={`py-1.5 rounded-xl text-[10px] font-bold border cursor-pointer transition-all truncate ${
                        selectedAlert.status === status
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm'
                          : 'bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button 
                onClick={() => {
                  setActiveTab('copilot');
                  addChatMessage(`Analyze Conveyor Belt vibration anomaly checks for ${selectedAlert.assetName}: "${selectedAlert.problem}". Provide full corrective action sheets.`);
                }}
                className="w-full py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/25 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Consult Copilot on RCA</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <AlertOctagon className="w-10 h-10 mb-2.5 text-slate-700 animate-pulse" />
            <h4 className="text-xs font-bold text-slate-400 font-sans">No Asset Selected</h4>
            <p className="text-[10px] mt-1 max-w-xs text-slate-500">Select a mechanical log entry from the watch list to view sensor anomaly details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

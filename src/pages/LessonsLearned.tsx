import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, 
  Search, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  Calendar,
  Flame
} from 'lucide-react';

export const LessonsLearned: React.FC = () => {
  const { incidents, setActiveTab, addChatMessage } = useApp();
  const [selectedIncident, setSelectedIncident] = useState(incidents[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Operational bottlenecks', 'Mechanical failures', 'Safety incident'];

  // Filter incidents
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.assetImpacted.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || inc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      {/* Left 2 Columns: Incident Catalog & Vertical Timeline */}
      <div className="lg:col-span-2 flex flex-col space-y-6 overflow-y-auto pr-1">
        {/* Pattern Discovery Banner */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-950/30 to-transparent blur-2xl rounded-full z-0 select-none"></div>
          <div className="relative z-10 space-y-1">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 font-sans">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Operational Failure Pattern Analysis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Algorithms analyzed 3 historical system breakdowns. The primary clusters show scanner drift and motor drive overloading during peak seasonal workflows.
            </p>
          </div>
        </div>

        {/* Incidents Database Directory */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4 flex-1 flex flex-col min-h-[300px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200 font-sans">Historical Incidents (2024-2026)</h3>
            </div>
            
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search incident logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none placeholder-slate-500 font-sans"
              />
            </div>
          </div>

          {/* Categories Chips */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/10 border border-indigo-500/25 text-indigo-400'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Interactive Timeline list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              
              return (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-indigo-500/5 border border-indigo-500/20 text-slate-100 shadow-sm' 
                      : 'bg-slate-950/20 border border-slate-800/80 hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <div className="mt-0.5">
                      <Flame className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold font-sans text-slate-200">{inc.title}</h4>
                      <p className="text-[10px] text-slate-400 font-sans font-semibold">Impacted Asset: {inc.assetImpacted}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md uppercase font-mono border border-slate-800">
                      {inc.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" /> {inc.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Incident RCA Details & Actions */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between h-full overflow-hidden">
        {selectedIncident ? (
          <div className="space-y-4 h-full flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date: {selectedIncident.date}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-450 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-full uppercase">Resolved</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-200 mt-2.5 font-sans leading-snug">
                  {selectedIncident.title}
                </h4>
              </div>

              {/* RCA analysis */}
              <div className="space-y-3.5 text-xs leading-relaxed font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Incident Root Cause</span>
                  <p className="text-slate-300 bg-slate-950 border border-slate-800 p-3 rounded-2xl leading-relaxed font-medium">
                    {selectedIncident.rootCause}
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Permanent Corrective Actions</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedIncident.actionTaken}</p>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-550">Prevented Recurrence?</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded">YES</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              {/* Redirect to Maintenance Page */}
              <button 
                onClick={() => {
                  setActiveTab('maintenance');
                }}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
              >
                <span>Inspect Active Asset Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Consult Copilot on this failure */}
              <button 
                onClick={() => {
                  setActiveTab('copilot');
                  addChatMessage(`Analyze safety procedures from incident "${selectedIncident.title}". Detail what preventive sensors are active on ${selectedIncident.assetImpacted} today.`);
                }}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-indigo-500/25 shadow-sm shadow-indigo-500/10"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Query Incident in Copilot</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <History className="w-10 h-10 mb-2.5 text-slate-700" />
            <h4 className="text-xs font-bold text-slate-400 font-sans">No Incident Selected</h4>
            <p className="text-[10px] mt-1 max-w-xs text-slate-500">Select an incident block from the catalog index to view corrective guidelines.</p>
          </div>
        )}
      </div>
    </div>
  );
};

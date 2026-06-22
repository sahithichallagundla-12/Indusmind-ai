import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileCheck, 
  AlertTriangle, 
  Sparkles, 
  TrendingDown,
  BookOpen,
  FileDown,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ComplianceIntel: React.FC = () => {
  const { complianceRisks, addDocument, setActiveTab, addChatMessage } = useApp();
  const [selectedRisk, setSelectedRisk] = useState(complianceRisks[0] || null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [auditScore, setAuditScore] = useState(82);

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      // Create new document in repository
      addDocument({
        name: `Q2_Warehouse_Safety_Audit_Report_${Date.now().toString().slice(-4)}.pdf`,
        category: 'Compliance Reports',
        size: '1.4 MB',
        author: 'IndusMind Audit Bot'
      });

      // Update audit score slightly to show progress
      setAuditScore(prev => Math.min(prev + 3, 100));
      setGeneratingReport(false);
      
      // Trigger success celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366F1', '#10B981', '#F59E0B']
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      {/* Left 2 Columns: Gaps Catalog & Performance */}
      <div className="lg:col-span-2 flex flex-col space-y-6 overflow-y-auto pr-1">
        {/* Audit Readiness Score Hero */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center shadow-sm">
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200 font-sans">Warehouse Regulatory Audit Index</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Currently cross-referencing floor procedures with OSHA warehouse safety standards, fire system checklist requirements, and certified forklift training protocols.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center shadow-inner">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block mb-1">Audit Readiness</span>
            <span className="text-3xl font-extrabold font-sans text-glow-emerald text-emerald-450">{auditScore}%</span>
            <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-450 font-mono">
              <TrendingDown className="w-3 h-3 rotate-180 text-emerald-450" />
              <span>Optimizing (+3% predicted)</span>
            </div>
          </div>
        </div>

        {/* Regulations Mapping Gaps Table */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4 flex-1 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-bold text-slate-200 font-sans">Identified Operations Safety Gaps</h3>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-extrabold text-slate-550 tracking-wider">
                  <th className="pb-3 pl-2">Regulation Standard</th>
                  <th className="pb-3">Gap Description</th>
                  <th className="pb-3">Risk Level</th>
                  <th className="pb-3">Score Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {complianceRisks.map((risk) => {
                  const isSelected = selectedRisk?.id === risk.id;
                  const isHigh = risk.risk === 'High';
                  
                  return (
                    <tr 
                      key={risk.id}
                      onClick={() => setSelectedRisk(risk)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-500/5 text-slate-100 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 pl-2 flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 shrink-0 ${isHigh ? 'text-rose-500' : 'text-amber-500'}`} />
                        <span>{risk.standard}</span>
                      </td>
                      <td className="py-3.5 max-w-[200px] truncate text-slate-400 font-sans">{risk.gap}</td>
                      <td className="py-3.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isHigh ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400' : 'bg-amber-950/40 border border-amber-900/40 text-amber-400'
                        }`}>
                          {risk.risk}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-rose-400">{risk.scoreImpact}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Gap Inspector and Report Generator */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between h-full overflow-hidden">
        {selectedRisk ? (
          <div className="space-y-4 h-full flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase font-sans ${
                    selectedRisk.risk === 'High' ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400' : 'bg-amber-950/40 border border-amber-900/40 text-amber-400'
                  }`}>
                    {selectedRisk.risk} Priority Gap
                  </span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 border border-rose-900/40 px-2 py-0.5 rounded-md font-mono">{selectedRisk.scoreImpact} Impact</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-200 mt-2.5 font-sans leading-snug">
                  {selectedRisk.standard}
                </h4>
              </div>

              {/* Specific Gap details */}
              <div className="space-y-3.5 text-xs leading-relaxed font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Audited Gap</span>
                  <p className="text-slate-200 font-semibold">{selectedRisk.gap}</p>
                </div>

                <div className="space-y-1 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-900/50">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Resolving Recommendation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedRisk.recommendation}</p>
                </div>

                <div className="space-y-1 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-550 font-medium">Clearance Status</span>
                  <span className={`font-bold ${
                    selectedRisk.status === 'Remediating' ? 'text-amber-400' : 'text-indigo-400'
                  }`}>{selectedRisk.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              {/* Copilot Action Shortcut */}
              <button 
                onClick={() => {
                  setActiveTab('copilot');
                  addChatMessage(`Provide draft documentation for resolving the "${selectedRisk.gap}" gap under standard ${selectedRisk.standard}.`);
                }}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Draft compliance safety manual</span>
              </button>

              {/* Generate Report Action Trigger */}
              <button 
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-indigo-500/25 disabled:opacity-50 shadow-sm shadow-indigo-500/10"
              >
                {generatingReport ? (
                  <>
                    <Database className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Safety Audit Logs...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Compile Compliance Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <FileCheck className="w-10 h-10 mb-2.5 text-slate-650" />
            <h4 className="text-xs font-bold text-slate-400 font-sans">No Risk Selected</h4>
            <p className="text-[10px] mt-1 max-w-xs text-slate-500">Select a compliance checklists gap from the index to run safety validation audits.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, 
  Cpu, 
  Key, 
  UserCheck, 
  Check, 
  Eye, 
  EyeOff, 
  Copy,
  RefreshCw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [testingDb, setTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'idle'>('connected');
  const [revealKey, setRevealKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestConnection = () => {
    setTestingDb(true);
    setDbStatus('idle');
    setTimeout(() => {
      setTestingDb(false);
      setDbStatus('connected');
    }, 1500);
  };

  const handleCopyKey = () => {
    setCopied(true);
    navigator.clipboard.writeText('sk_indus_live_8b5cf610b9814096v35large');
    setTimeout(() => setCopied(false), 2000);
  };

  const models = [
    'IndusMind-Instruct-Large (v3.5-Turbo)',
    'IndusMind-Code-Medium (v2.1)',
    'Claude-3.5-Sonnet (External-Gateway)',
    'GPT-4o-Enterprise (External-Gateway)'
  ];

  const roles = [
    { name: 'Lead Operations Engineer', clearance: 'Level 3 - Administrator' },
    { name: 'Safety Inspector Davis', clearance: 'Level 2 - Dispatcher' },
    { name: 'Logistics Supervisor Miller', clearance: 'Level 2 - Auditor' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      {/* Column 1 & 2: Main Configurations */}
      <div className="lg:col-span-2 space-y-6">
        {/* Model Ingestion Config */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200 font-sans">LLM Inference Tuning</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Primary Model</label>
              <select
                value={settings.llmModel}
                onChange={(e) => updateSettings({ llmModel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">OCR Extraction Engine</label>
              <select
                value={settings.ocrEngine}
                onChange={(e) => updateSettings({ ocrEngine: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="PaddleOCR / Tesseract-Hybrid">PaddleOCR / Tesseract-Hybrid</option>
                <option value="AWS Textract (Cloud-Fallback)">AWS Textract (Cloud-Fallback)</option>
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans font-medium">
                <span className="text-slate-400">LLM Temperature (Creativity)</span>
                <span className="font-mono text-indigo-400 font-bold">{settings.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans font-medium">
                <span className="text-slate-400">Max Token Limit (Context Chunk Window)</span>
                <span className="font-mono text-indigo-400 font-bold">{settings.maxTokens}</span>
              </div>
              <input
                type="range"
                min="1024"
                max="8192"
                step="1024"
                value={settings.maxTokens}
                onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Database & Embedding Node Configuration */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Database className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200 font-sans">Vector DB / Knowledge Store</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">PGVector Database URI</label>
            <input 
              type="text" 
              value={settings.vectorDbUrl}
              onChange={(e) => updateSettings({ vectorDbUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}></span>
              <span className="text-xs font-bold text-slate-400 font-sans">
                {dbStatus === 'connected' ? 'Connected successfully' : 'Testing index link...'}
              </span>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testingDb}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {testingDb ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating schema...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Validate Vector Store</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Column 3: API keys & Users lists */}
      <div className="space-y-6">
        {/* Credentials / API keys panel */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Key className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200 font-sans">Developer Access Keys</h3>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
              <span>Live Console Key</span>
              <span>REST API</span>
            </div>
            
            <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="font-mono text-xs text-slate-350 truncate">
                {revealKey ? 'sk_indus_live_8b5cf610b9814096v35large' : '••••••••••••••••••••••••••••••••'}
              </span>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => setRevealKey(!revealKey)}
                  className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {revealKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={handleCopyKey}
                  className={`p-1 cursor-pointer transition-all ${copied ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User permissions matrix */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200 font-sans">Clearance Hierarchy</h3>
          </div>

          <div className="space-y-2">
            {roles.map((user, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center text-xs font-sans"
              >
                <div>
                  <h4 className="font-semibold text-slate-200">{user.name}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">{user.clearance}</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-full uppercase">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;

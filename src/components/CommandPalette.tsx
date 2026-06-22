import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Terminal, 
  FileText, 
  Wrench, 
  FileCheck, 
  ArrowRight,
  Flame,
  FileUp,
  Cpu
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'Pages' | 'Assets' | 'Quick Actions';
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    setActiveTab, 
    addChatMessage
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  // Listen to keyboard shortcut Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // List of all search targets (Warehouse Context)
  const items: CommandItem[] = [
    // Pages
    { id: 'p-dash', category: 'Pages', title: 'Executive Dashboard', subtitle: 'View warehouse KPIs, order status & anomalies', icon: Cpu, action: () => { setActiveTab('dashboard'); } },
    { id: 'p-docs', category: 'Pages', title: 'Document Center', subtitle: 'Manage training manuals, safety SOPs, and checklists', icon: FileText, action: () => { setActiveTab('documents'); } },
    { id: 'p-copi', category: 'Pages', title: 'AI Copilot Chat', subtitle: 'Query warehouse database logs & technical specs', icon: Terminal, action: () => { setActiveTab('copilot'); } },
    { id: 'p-maint', category: 'Pages', title: 'Maintenance Intelligence', subtitle: 'Monitor sorting machines, conveyor belts, and vehicle health', icon: Wrench, action: () => { setActiveTab('maintenance'); } },
    { id: 'p-compl', category: 'Pages', title: 'Compliance Intelligence', subtitle: 'Check OSHA checklists and safety compliance gaps', icon: FileCheck, action: () => { setActiveTab('compliance'); } },
    { id: 'p-graph', category: 'Pages', title: 'Knowledge Graph Explorer', subtitle: 'Interactive warehouse system node graph representation', icon: Terminal, action: () => { setActiveTab('graph'); } },
    
    // Assets
    { id: 'a-b04', category: 'Assets', title: 'Conveyor Belt B-04', subtitle: 'Asset details: Active vibration warning during peak shifts', icon: Flame, action: () => { setActiveTab('maintenance'); } },
    { id: 'a-fl12', category: 'Assets', title: 'Forklift FL-12', subtitle: 'Asset details: Hydraulic pump warning checks', icon: Wrench, action: () => { setActiveTab('maintenance'); } },
    { id: 'a-packa', category: 'Assets', title: 'Packaging Machine A', subtitle: 'Asset details: Active heat-seal calibration sealing warnings', icon: Wrench, action: () => { setActiveTab('maintenance'); } },
    
    // Quick Actions
    {
      id: 'q-up',
      category: 'Quick Actions',
      title: 'Import Operations SOP',
      subtitle: 'Upload and index an inventory guidelines PDF',
      icon: FileUp,
      action: () => {
        setActiveTab('documents');
      }
    },
    {
      id: 'q-ask-conveyor',
      category: 'Quick Actions',
      title: 'Query AI: Conveyor B-04 status',
      subtitle: 'Ask Copilot to analyze Conveyor Belt B-04 logs',
      icon: Terminal,
      action: () => {
        setActiveTab('copilot');
        addChatMessage('Show maintenance history for Conveyor Belt B-04.');
      }
    }
  ];

  // Filter items based on query
  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setCommandPaletteOpen(false);
      }
    }
  };

  // Close when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] px-4"
    >
      <div 
        ref={containerRef}
        className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/80 overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-800 h-14 shrink-0 bg-slate-950/50">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type page name, machine ID or actions..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none h-full font-sans"
          />
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">ESC</span>
        </div>

        {/* Results List */}
        <div className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-sans">
              No results found matching "{query}"
            </div>
          ) : (
            // Group by category
            ['Pages', 'Assets', 'Quick Actions'].map((cat) => {
              const catItems = filtered.filter(item => item.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                    {cat}
                  </div>
                  {catItems.map((item) => {
                    // Calculate index in flat filtered list
                    const flatIdx = filtered.findIndex(fi => fi.id === item.id);
                    const isSelected = flatIdx === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          item.action();
                          setCommandPaletteOpen(false);
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-md' 
                            : 'bg-transparent border border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-950 border border-slate-850 text-slate-500'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate font-sans text-slate-200">{item.title}</h4>
                            <p className="text-[10px] text-slate-450 truncate font-sans mt-0.5">{item.subtitle}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 font-sans animate-pulse shrink-0">
                            <span>Execute</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between bg-slate-950/40 text-[10px] text-slate-500 select-none">
          <div className="flex gap-3">
            <span><kbd className="font-mono bg-slate-950 px-1 py-0.25 rounded border border-slate-800 text-[9px] shadow-sm">↓↑</kbd> Navigate</span>
            <span><kbd className="font-mono bg-slate-950 px-1 py-0.25 rounded border border-slate-800 text-[9px] shadow-sm">Enter</kbd> Select</span>
          </div>
          <span>INDUSMIND Operations Engine</span>
        </div>
      </div>
    </div>
  );
};

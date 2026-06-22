import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  ShieldAlert,
  FileText,
  User,
  Scale,
  Cpu,
  Database
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'Asset' | 'Document' | 'Regulation' | 'Engineer' | 'Failure';
  x: number;
  y: number;
  size: number;
  color: string;
  details: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export const KnowledgeGraph: React.FC = () => {
  const { setActiveTab, addChatMessage } = useApp();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Filters
  const [activeFilters, setActiveFilters] = useState<Record<GraphNode['type'], boolean>>({
    Asset: true,
    Document: true,
    Regulation: true,
    Engineer: true,
    Failure: true
  });

  const nodes: GraphNode[] = [
    { id: 'n1', label: 'Conveyor Belt B-04', type: 'Asset', x: 200, y: 150, size: 28, color: '#F59E0B', details: 'Primary sorting transport belt in Zone B. Active motor heating and roller vibration alerts.' },
    { id: 'n2', label: 'Forklift FL-12', type: 'Asset', x: 450, y: 120, size: 28, color: '#8B5CF6', details: 'Electric warehouse heavy-duty forklift. Diagnostic telemetry reports hydraulic seal pressure wear.' },
    { id: 'n3', label: 'Barcode Scanner Net', type: 'Asset', x: 300, y: 320, size: 24, color: '#06B6D4', details: 'High-speed scanning gateway in Zone C. Tracking occasional barcode read failure offsets.' },
    { id: 'n4', label: 'Inventory Handling SOP.pdf', type: 'Document', x: 600, y: 220, size: 20, color: '#22D3EE', details: 'Standard operating manual outlining load distribution and conveyor belt capacity thresholds.' },
    { id: 'n5', label: 'OSHA Safety Checklist.pdf', type: 'Regulation', x: 120, y: 280, size: 20, color: '#F43F5E', details: 'OSHA Title 29 standards governing powered industrial truck operations and inspection routines.' },
    { id: 'n6', label: 'Sarah Jenkins', type: 'Engineer', x: 380, y: 220, size: 18, color: '#10B981', details: 'Lead Logistics Operations Engineer responsible for maintenance calibration logs.' },
    { id: 'n7', label: 'Zone C Scanner Drift', type: 'Failure', x: 100, y: 60, size: 22, color: '#FB923C', details: 'Sensor alignment offset anomaly resulting in misread routing barcodes and sort line delays.' },
  ];

  const links: GraphLink[] = [
    { source: 'n3', target: 'n7', label: 'Affected By' },
    { source: 'n3', target: 'n4', label: 'Documented In' },
    { source: 'n2', target: 'n6', label: 'Supervised By' },
    { source: 'n1', target: 'n6', label: 'Inspected By' },
    { source: 'n2', target: 'n5', label: 'Subject To' },
    { source: 'n1', target: 'n4', label: 'Subject To' },
    { source: 'n6', target: 'n4', label: 'Reviewed' }
  ];

  // Mouse Drag Panning handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.4, Math.min(prev * factor, 3)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Filter nodes & links
  const filteredNodes = nodes.filter(n => activeFilters[n.type]);
  const filteredLinks = links.filter(l => {
    const s = nodes.find(n => n.id === l.source);
    const t = nodes.find(n => n.id === l.target);
    return s && t && activeFilters[s.type] && activeFilters[t.type];
  });

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'Asset': return Cpu;
      case 'Document': return FileText;
      case 'Regulation': return Scale;
      case 'Engineer': return User;
      case 'Failure': return ShieldAlert;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      {/* Left Column: Filter Chips & Controls */}
      <div className="hidden lg:flex flex-col space-y-6">
        <div className="glass-panel p-4 rounded-3xl border border-slate-800 flex-1 flex flex-col justify-between overflow-hidden bg-slate-900/50">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800 flex items-center gap-2">
              <Network className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-slate-200 font-sans">Graph Filters</h3>
            </div>

            <div className="space-y-2">
              {(Object.keys(activeFilters) as GraphNode['type'][]).map((type) => (
                <label 
                  key={type}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/40 cursor-pointer border border-transparent hover:border-slate-800/60 transition-all"
                >
                  <input 
                    type="checkbox" 
                    checked={activeFilters[type]}
                    onChange={() => setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }))}
                    className="w-4 h-4 rounded text-indigo-500 bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 font-sans font-medium">{type} Nodes</span>
                </label>
              ))}
            </div>
          </div>

          {/* Graph Legend */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-violet-400" />
                <span className="text-[11px] font-bold text-slate-200 font-sans">Topology Mapping</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                Visualizing connections generated by LangGraph entity extraction. Lines denote direct references inside uploaded specs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Center 2 Columns: SVG Graph Viewport */}
      <div className="lg:col-span-2 flex flex-col glass-panel rounded-3xl border border-slate-800 overflow-hidden bg-slate-950 h-full relative">
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 flex gap-1.5 z-10">
          <button 
            onClick={() => handleZoom(1.2)}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-205 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleZoom(0.8)}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-205 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReset}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-205 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Help Hint */}
        <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 select-none bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-slate-800 font-sans shadow-sm">
          Click and drag to pan. Click nodes to inspect links.
        </div>

        {/* SVG Drawing Canvas */}
        <svg 
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Draw Links/Lines */}
            {filteredLinks.map((link, idx) => {
              const fromNode = nodes.find(n => n.id === link.source);
              const toNode = nodes.find(n => n.id === link.target);
              
              if (!fromNode || !toNode) return null;
              
              return (
                <g key={`l-${idx}`}>
                  <line 
                    x1={fromNode.x} 
                    y1={fromNode.y} 
                    x2={toNode.x} 
                    y2={toNode.y} 
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                  />
                  {/* Glowing core link */}
                  <line 
                    x1={fromNode.x} 
                    y1={fromNode.y} 
                    x2={toNode.x} 
                    y2={toNode.y} 
                    stroke="rgba(139, 92, 246, 0.2)"
                    strokeWidth={4}
                  />
                </g>
              );
            })}

            {/* Draw Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const NodeIcon = getNodeIcon(node.type);

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent resetting drag
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer glow ring on hover/selected */}
                  <circle 
                    r={node.size + (isSelected ? 6 : 4)} 
                    fill="transparent"
                    stroke={node.color}
                    strokeWidth={isSelected ? 2 : 1}
                    className={`transition-all duration-300 opacity-0 ${
                      isSelected ? 'opacity-80' : 'group-hover:opacity-30'
                    }`}
                  />

                  {/* Inner Node Badge */}
                  <circle 
                    r={node.size} 
                    fill="#0f172a" 
                    stroke={isSelected ? node.color : 'rgba(255, 255, 255, 0.08)'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="shadow-sm transition-all duration-300 group-hover:shadow-md"
                  />

                  {/* Icon */}
                  <g transform={`translate(-8, -8)`}>
                    <NodeIcon className="w-4 h-4" style={{ color: node.color }} />
                  </g>

                  {/* Text Label Below Node */}
                  <text
                    y={node.size + 14}
                    textAnchor="middle"
                    fill={isSelected ? '#f8fafc' : '#94a3b8'}
                    fontSize={10}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="font-sans pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Right Column: Node Inspector details */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between h-full bg-slate-900/50 overflow-hidden">
        {selectedNode ? (
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase font-sans" style={{ backgroundColor: `${selectedNode.color}15`, color: selectedNode.color }}>
                  {selectedNode.type} Node
                </span>
                <h4 className="text-sm font-bold text-slate-205 mt-2 font-sans">
                  {selectedNode.label}
                </h4>
              </div>

              {/* Node Relationships details */}
              <div className="space-y-3.5 text-xs leading-relaxed font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Description</span>
                  <p className="text-slate-300">{selectedNode.details}</p>
                </div>

                {/* Related links list */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Connections</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {links
                      .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                      .map((link, idx) => {
                        const targetId = link.source === selectedNode.id ? link.target : link.source;
                        const related = nodes.find(n => n.id === targetId);
                        
                        return (
                          <div 
                            key={idx}
                            onClick={() => { if (related) setSelectedNode(related); }}
                            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 cursor-pointer flex items-center justify-between text-[11px] text-slate-300 transition-colors"
                          >
                            <span className="truncate max-w-[120px] font-medium font-sans">{related?.label}</span>
                            <span className="text-[9px] text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-1.5 py-0.5 rounded font-mono tracking-wider font-semibold uppercase">{link.label}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button 
                onClick={() => {
                  setActiveTab('copilot');
                  addChatMessage(`Explain the node relationships for "${selectedNode.label}" and summarize how it affects warehouse maintenance schedules.`);
                }}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-indigo-500/25 shadow-md shadow-indigo-500/10"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consult Brain on this Node</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <Network className="w-10 h-10 mb-2.5 text-slate-700 animate-pulse" />
            <h4 className="text-xs font-semibold text-slate-400 font-sans">No Node Selected</h4>
            <p className="text-[10px] mt-1 max-w-xs text-slate-500">Select any bubble node inside the canvas space to inspect indexed connections.</p>
          </div>
        )}
      </div>
    </div>
  );
};

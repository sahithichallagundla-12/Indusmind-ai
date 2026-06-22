import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Document } from '../context/AppContext';
import { 
  FileText, 
  Search, 
  FileUp, 
  Tag, 
  Clock, 
  CheckCircle, 
  Loader2, 
  Database,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export const DocumentCenter: React.FC = () => {
  const { documents, addDocument, setActiveTab, addChatMessage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0] || null);
  const [dragActive, setDragActive] = useState(false);
  
  // Simulated upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>('');

  const categories = ['All', 'Technical Specs', 'Operational Guidelines', 'Safety Standards', 'Maintenance Procedures', 'Compliance Reports', 'Quality Records', 'Training Guidelines'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0].name, e.dataTransfer.files[0].size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0].name, e.target.files[0].size);
    }
  };

  const simulateUpload = (name: string, sizeBytes: number) => {
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
    setUploadFileName(name);
    setUploadProgress(10);

    // Increment progress periodically
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            addDocument({
              name,
              category: name.toLowerCase().includes('sop') ? 'Operational Guidelines' : 'Technical Specs',
              size: `${sizeMB} MB`,
              author: 'Warehouse Manager'
            });
            setUploadProgress(null);
          }, 500);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      {/* Left 2 Columns: Directory Explorer and Upload Zone */}
      <div className="lg:col-span-2 flex flex-col space-y-6 overflow-y-auto pr-1">
        {/* Upload Zone */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-3xl border border-dashed p-6 transition-all flex flex-col items-center justify-center min-h-[160px] ${
            dragActive 
              ? 'bg-indigo-950/30 border-indigo-500' 
              : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700'
          }`}
        >
          <input 
            type="file" 
            id="file-upload" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {uploadProgress === null ? (
            <div className="text-center space-y-2 select-none pointer-events-none">
              <div className="mx-auto w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
                <FileUp className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-xs font-bold text-slate-200">
                Drag & drop warehouse documents or <span className="text-indigo-400 underline">browse</span>
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                Supports PDF, DOCX, XLSX (Max 50MB)
              </p>
            </div>
          ) : (
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-200 truncate">{uploadFileName}</span>
                <span className="text-indigo-400 font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 border border-slate-850 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-550 h-full transition-all duration-150" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-sans">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Splitting text headers and creating vector chunks...</span>
              </div>
            </div>
          )}
        </div>

        {/* Directory Explorer Header & Filters */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 space-y-4 flex-1 flex flex-col min-h-[350px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200 font-sans">Knowledge Repository</h3>
            </div>
            
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Filter files..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-955 border border-slate-805 text-xs text-slate-200 focus:outline-none placeholder-slate-500 font-sans"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    : 'bg-slate-955 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredDocs.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  
                  return (
                    <tr 
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-500/5 text-slate-100 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 pl-2 flex items-center gap-2">
                        <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </td>
                      <td className="py-3 font-sans text-slate-400">{doc.category}</td>
                      <td className="py-3 font-mono text-[10px] text-slate-500">{doc.size}</td>
                      <td className="py-3">
                        {doc.status === 'Processing' ? (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-955/40 px-2 py-0.5 rounded-full w-fit font-bold font-sans border border-amber-900/40">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Ingesting
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit font-bold font-sans border border-emerald-500/20">
                            <CheckCircle className="w-2.5 h-2.5" /> Mapped
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Source Document Inspector Panel */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900 flex flex-col justify-between h-full overflow-hidden">
        {selectedDoc ? (
          <div className="space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/40 px-2.5 py-0.5 rounded-md uppercase font-sans">
                  Source Inspector
                </span>
                <h4 className="text-sm font-extrabold text-slate-200 mt-2 font-sans break-all leading-snug">
                  {selectedDoc.name}
                </h4>
              </div>

              {/* Ingestion Data */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-500 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-slate-500" /> Category</span>
                  <span className="font-semibold text-slate-350 font-sans">{selectedDoc.category}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> Ingested</span>
                  <span className="font-semibold text-slate-350 font-sans">{selectedDoc.uploadedAt}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-500 flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-500" /> Vector Nodes</span>
                  <span className="font-semibold text-slate-355 font-mono">
                    {selectedDoc.status === 'Processed' ? '128 Chunks' : 'Generating...'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-500 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-slate-500" /> Version</span>
                  <span className="font-mono text-xs font-semibold text-slate-400">{selectedDoc.version}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-500 flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5 text-slate-500" /> Author</span>
                  <span className="font-semibold text-slate-350 font-sans">{selectedDoc.author}</span>
                </div>
              </div>

              {/* Version Logs / Revisions */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Revision History</h5>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{selectedDoc.version}</span>
                      <span className="text-[9px] text-slate-500 font-mono">Current Ingest</span>
                    </div>
                    <p className="text-slate-400 font-sans leading-relaxed">
                      Updated inventory labels and synchronized with Zone C scanner routers.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-955/20 border border-slate-850 text-[11px] opacity-60">
                    <div className="flex justify-between text-slate-400">
                      <span>v1.0</span>
                      <span className="text-[9px] font-mono text-slate-550">15 Mar 2026</span>
                    </div>
                    <p className="text-slate-450 font-sans leading-relaxed">
                      Original manual load.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button 
                onClick={() => {
                  setActiveTab('copilot');
                  addChatMessage(`Analyze safety procedures and specs inside "${selectedDoc.name}".`);
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-indigo-550 shadow-sm"
              >
                <span>Query Manual with Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
            <FolderOpen className="w-10 h-10 mb-2.5 text-slate-600" />
            <h4 className="text-xs font-bold text-slate-400 font-sans">No Document Selected</h4>
            <p className="text-[10px] mt-1 max-w-xs text-slate-500">Select an operational manual or checklist from the repository to view metadata.</p>
          </div>
        )}
      </div>
    </div>
  );
};

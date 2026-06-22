import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Terminal, 
  Sparkles, 
  Mic, 
  MicOff,
  Pin,
  PinOff,
  BookOpen,
  Database
} from 'lucide-react';

export const AICopilot: React.FC = () => {
  const { 
    chatHistory, 
    addChatMessage, 
    isCopilotTyping, 
    pinnedChats, 
    unpinChat,
    setActiveTab
  } = useApp();

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isCopilotTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    addChatMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Suggested questions (Warehouse context)
  const suggestions = [
    "Show maintenance history for Conveyor Belt B-04.",
    "Which equipment has recurring issues?",
    "Generate a root cause analysis for Packaging Line A.",
    "Show safety inspections completed this month."
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      {/* Left Column: Pinned Conversations & Copilot Agent Status */}
      <div className="hidden lg:flex flex-col space-y-6">
        <div className="glass-panel p-4 rounded-3xl border border-slate-800 bg-slate-900 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4 overflow-hidden flex flex-col">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                <Pin className="w-3.5 h-3.5 text-indigo-400" /> Pinned Brain Threads
              </span>
            </div>

            <div className="space-y-1.5 overflow-y-auto pr-1">
              {pinnedChats.map((chat) => (
                <div 
                  key={chat}
                  onClick={() => addChatMessage(`Search records for: ${chat}`)}
                  className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-850 cursor-pointer border border-transparent hover:border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span className="truncate font-sans font-medium">{chat}</span>
                  <button 
                    onClick={(e) => {
                       e.stopPropagation();
                       unpinChat(chat);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-500 p-0.5"
                  >
                    <PinOff className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-bold text-slate-200 font-sans">Index Synchronization</span>
              </div>
              <p className="text-[10px] text-slate-450 font-sans leading-relaxed">
                Vector database connected to PostgreSQL/pgvector. Layout mapping splits tables and logs into distinct semantic nodes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right 3 Columns: Chat Workspace */}
      <div className="lg:col-span-3 flex flex-col glass-panel rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden h-full">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 font-sans tracking-wide">Unified Warehouse Copilot</h3>
              <p className="text-[9px] text-slate-400 font-sans">Referencing SOP guidelines, forklift logs, sorting networks and compliance audits</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full uppercase font-sans">
            RAG Active
          </span>
        </div>

        {/* Chat Output Message Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            
            return (
              <div 
                key={msg.id}
                className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-indigo-400 shrink-0 select-none">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div 
                    className={`p-4 rounded-3xl text-xs leading-relaxed font-sans ${
                      isUser 
                        ? 'bg-gradient-to-tr from-indigo-600 to-indigo-705 text-white rounded-tr-sm border border-indigo-550 shadow-md shadow-indigo-500/5'
                        : 'bg-slate-800/80 border border-slate-800 text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Message Metadata (Citations and Confidence) */}
                  {!isUser && (msg.citations || msg.confidenceScore) && (
                    <div className="mt-2.5 flex flex-wrap gap-2.5 items-center">
                      {msg.confidenceScore && (
                        <span className="text-[9px] font-bold text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">
                          Match Score: {msg.confidenceScore}%
                        </span>
                      )}

                      {msg.citations && msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => setActiveTab('documents')}
                          className="flex items-center gap-1.5 text-[9px] text-indigo-455 hover:text-indigo-350 bg-indigo-950/40 hover:bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-900/40 cursor-pointer font-sans"
                        >
                          <BookOpen className="w-2.5 h-2.5 text-indigo-400" />
                          <span>{cite.name} {cite.page ? `(Page ${cite.page})` : ''}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-500 mt-1.5 block font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Animation Loader */}
          {isCopilotTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-indigo-400 shrink-0">
                <Terminal className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="flex flex-col">
                <div className="bg-slate-800/80 border border-slate-800 p-4 rounded-3xl rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 block font-sans">Querying vector index chunk nodes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Pills */}
        {chatHistory.length <= 2 && (
          <div className="px-6 py-2.5 shrink-0 border-t border-slate-800">
            <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block mb-2 font-sans">Suggested Questions</span>
            <div className="flex flex-col gap-1.5">
              {suggestions.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-left text-xs text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-900 border border-slate-850 px-3.5 py-1.5 rounded-2xl transition-all truncate max-w-full font-sans cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Box */}
        <div className="p-4 border-t border-slate-800 bg-slate-955/30 shrink-0">
          <div className="relative flex items-center bg-slate-950 border border-slate-855 focus-within:border-slate-750 p-2">
            {/* Mock Recording Button */}
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                isRecording 
                  ? 'bg-rose-950/30 border border-rose-900/50 text-rose-450 hover:bg-rose-900/50' 
                  : 'text-slate-550 hover:text-slate-350 hover:bg-slate-900'
              }`}
            >
              {isRecording ? <Mic className="w-4 h-4 animate-pulse text-rose-500" /> : <MicOff className="w-4 h-4" />}
            </button>

            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening... speak warehouse query..." : "Ask Copilot anything..."}
              disabled={isRecording}
              className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none px-3 font-sans"
            />

            <button 
              onClick={handleSend}
              className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:bg-indigo-800 text-white shadow-md cursor-pointer border border-indigo-550"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 px-3 mt-1.5 select-none font-sans">
            <span>Ask about conveyor maintenance, barcode delays, or training audits.</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

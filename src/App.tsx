import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { DocumentCenter } from './pages/DocumentCenter';
import { AICopilot } from './pages/AICopilot';
import { MaintenanceIntel } from './pages/MaintenanceIntel';
import { ComplianceIntel } from './pages/ComplianceIntel';
import { LessonsLearned } from './pages/LessonsLearned';
import { KnowledgeGraph } from './pages/KnowledgeGraph';
import { Analytics } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'documents':
        return <DocumentCenter />;
      case 'copilot':
        return <AICopilot />;
      case 'maintenance':
        return <MaintenanceIntel />;
      case 'compliance':
        return <ComplianceIntel />;
      case 'lessons':
        return <LessonsLearned />;
      case 'graph':
        return <KnowledgeGraph />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 gradient-mesh font-sans">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          {renderActivePage()}
        </main>
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

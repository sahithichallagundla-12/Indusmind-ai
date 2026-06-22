import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Type definitions
export type ActiveTab = 
  | 'dashboard'
  | 'documents'
  | 'copilot'
  | 'maintenance'
  | 'compliance'
  | 'lessons'
  | 'graph'
  | 'analytics'
  | 'settings';

export interface Document {
  id: string;
  name: string;
  category: string;
  uploadedAt: string;
  size: string;
  status: 'Processing' | 'Processed' | 'Failed';
  version: string;
  author: string;
}

export interface MaintenanceAlert {
  id: string;
  assetName: string;
  problem: string;
  severity: 'Critical' | 'Warning' | 'Healthy';
  date: string;
  status: 'Open' | 'Investigating' | 'Scheduled' | 'Resolved';
  action: string;
  recommendation: string;
  riskScore: number;
}

export interface ComplianceRisk {
  id: string;
  standard: string;
  gap: string;
  risk: 'High' | 'Medium' | 'Low';
  status: 'Remediating' | 'Planned' | 'In Review' | 'Compliant';
  scoreImpact: string;
  recommendation: string;
}

export interface HistoricalIncident {
  id: string;
  title: string;
  category: string;
  date: string;
  rootCause: string;
  actionTaken: string;
  preventedRecurrence: boolean;
  assetImpacted: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: { id: string; name: string; page?: number }[];
  confidenceScore?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  tabRedirect?: ActiveTab;
}

interface AppSettings {
  llmModel: string;
  temperature: number;
  maxTokens: number;
  vectorDbUrl: string;
  ocrEngine: string;
  userRole: string;
}

// AppContext properties
interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  
  // Data lists
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt' | 'status' | 'version'>) => void;
  maintenanceAlerts: MaintenanceAlert[];
  updateAlertStatus: (id: string, status: MaintenanceAlert['status']) => void;
  complianceRisks: ComplianceRisk[];
  incidents: HistoricalIncident[];
  
  // Copilot Chat
  chatHistory: ChatMessage[];
  addChatMessage: (text: string) => void;
  isCopilotTyping: boolean;
  pinnedChats: string[];
  pinChat: (chatTitle: string) => void;
  unpinChat: (chatTitle: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Initial Mock Documents (Warehouse Theme)
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc-1', name: 'Equipment Manual.pdf', category: 'Technical Specs', uploadedAt: '2 hours ago', size: '4.8 MB', status: 'Processed', version: 'v2.1', author: 'Eng. Sarah Jenkins' },
    { id: 'doc-2', name: 'Inventory Handling SOP.pdf', category: 'Operational Guidelines', uploadedAt: '1 day ago', size: '1.2 MB', status: 'Processed', version: 'v1.0', author: 'Ops Supervisor Miller' },
    { id: 'doc-3', name: 'Forklift Maintenance Log.xlsx', category: 'Maintenance Procedures', uploadedAt: '3 days ago', size: '0.8 MB', status: 'Processed', version: 'v1.2', author: 'Maintenance Team' },
    { id: 'doc-4', name: 'Warehouse Safety Checklist.pdf', category: 'Safety Standards', uploadedAt: '1 week ago', size: '2.1 MB', status: 'Processed', version: 'v3.0', author: 'Safety Board' },
    { id: 'doc-5', name: 'Vendor Compliance Report.pdf', category: 'Compliance Reports', uploadedAt: '2 weeks ago', size: '3.4 MB', status: 'Processed', version: 'v1.1', author: 'QC Dept' },
    { id: 'doc-6', name: 'Quality Inspection Report.pdf', category: 'Quality Records', uploadedAt: '3 weeks ago', size: '1.7 MB', status: 'Processed', version: 'v1.0', author: 'Inspector Chen' },
    { id: 'doc-7', name: 'Employee Training Manual.pdf', category: 'Training Guidelines', uploadedAt: '1 month ago', size: '8.5 MB', status: 'Processed', version: 'v2.0', author: 'HR Manager' }
  ]);

  // Initial Mock Alerts (Warehouse Theme)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([
    {
      id: 'alert-1',
      assetName: 'Conveyor Belt B-04',
      problem: 'Repeated vibration anomalies detected during peak shift operations',
      severity: 'Critical',
      date: '22 Jun 2026 10:15 AM',
      status: 'Open',
      action: 'Schedule preventive maintenance within 72 hours',
      recommendation: 'Perform mechanical alignment audit and lubricate drive bearings to minimize peak shift tension wear.',
      riskScore: 92
    },
    {
      id: 'alert-2',
      assetName: 'Barcode Scanner Network',
      problem: 'Zone C handheld scanner communication latency and packet drop',
      severity: 'Warning',
      date: '21 Jun 2026 08:30 AM',
      status: 'Investigating',
      action: 'Inspect firmware versions & WiFi routing channel overlap',
      recommendation: 'Verify handheld scanner firmware version. Calibrate Zone C WiFi channel overlap configurations to reduce package relay latency.',
      riskScore: 68
    },
    {
      id: 'alert-3',
      assetName: 'Packaging Machine A',
      problem: 'Product packaging heat-seal defects increased by 12% on line A',
      severity: 'Critical',
      date: '20 Jun 2026 04:45 PM',
      status: 'Open',
      action: 'Review heat-seal calibration settings & temperature bar',
      recommendation: 'Inspect temperature controller thermal bars. Adjust pressure plate compression rollers for alignment offset.',
      riskScore: 88
    },
    {
      id: 'alert-4',
      assetName: 'Forklift FL-12',
      problem: 'Hydraulic system pressure drop below warnings threshold',
      severity: 'Warning',
      date: '19 Jun 2026 11:20 AM',
      status: 'Resolved',
      action: 'Perform hydraulic seal leak inspection and clean filters',
      recommendation: 'De-pressurize unit and swap hydraulic seals. Refill fluid and update check logs in the system.',
      riskScore: 62
    }
  ]);

  // Initial Mock Compliance Gaps (Warehouse Theme)
  const [complianceRisks] = useState<ComplianceRisk[]>([
    {
      id: 'comp-1',
      standard: 'Safety Inspections',
      gap: 'Monthly warehouse safety inspection for Zone B has not yet been completed',
      risk: 'High',
      status: 'Planned',
      scoreImpact: '-4%',
      recommendation: 'Assign inspection team before Friday to audit fire escapes, clear pathways, and inspect rack netting.'
    },
    {
      id: 'comp-2',
      standard: 'Employee Training Compliance',
      gap: 'OSHA Forklift Operator re-certifications overdue for 3 handlers',
      risk: 'High',
      status: 'Remediating',
      scoreImpact: '-5%',
      recommendation: 'Conduct operator re-certification training using the training manuals located in the Document Center.'
    },
    {
      id: 'comp-3',
      standard: 'Fire Equipment Checks',
      gap: 'Loading Dock Gate annual fire extinguisher inspection tag updates overdue',
      risk: 'Low',
      status: 'In Review',
      scoreImpact: '-1%',
      recommendation: 'Schedule localized inspector audit and label tags. Update logs database schema.'
    }
  ]);

  // Initial Lessons Learned Logs (Warehouse Theme)
  const [incidents] = useState<HistoricalIncident[]>([
    {
      id: 'inc-1',
      title: 'Sorting delays during peak season',
      category: 'Operational bottlenecks',
      date: '14 Aug 2025',
      rootCause: 'Barcode scanner calibration drift and WiFi channel overlap congestion during high-volume shifts.',
      actionTaken: 'Updated scanner firmware, optimized wireless routing channels, and deployed secondary access points.',
      preventedRecurrence: true,
      assetImpacted: 'Barcode Scanner Network'
    },
    {
      id: 'inc-2',
      title: 'Conveyor Belt B-04 Motor Burnout',
      category: 'Mechanical failures',
      date: '10 Feb 2026',
      rootCause: 'Excessive bearing friction and lubrication starvation caused motor overload and subsequent winding stator burnout.',
      actionTaken: 'Upfitted drive motor controllers with thermal overload switches and scheduled weekly bearing grease tasks.',
      preventedRecurrence: true,
      assetImpacted: 'Conveyor Belt B-04'
    },
    {
      id: 'inc-3',
      title: 'Forklift FL-12 Hydraulic Seal Rupture',
      category: 'Safety incident',
      date: '18 Nov 2024',
      rootCause: 'Hydraulic fluid degradation coking and seal wear went undetected due to missing pre-shift check inspections.',
      actionTaken: 'Instituted digital daily inspection checklist forms and automated maintenance ticket scheduling.',
      preventedRecurrence: true,
      assetImpacted: 'Forklift FL-12'
    }
  ]);

  // Initial Notifications (Warehouse Theme)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'not-1', title: 'Critical Alert: Conveyor B-04', description: 'Repeated vibration anomalies detected in drive assembly.', time: '10 mins ago', read: false, priority: 'high', tabRedirect: 'maintenance' },
    { id: 'not-2', title: 'Audit Alert: Safety Inspections', description: 'Monthly inspection checklist for Zone B is overdue.', time: '2 hours ago', read: false, priority: 'high', tabRedirect: 'compliance' },
    { id: 'not-3', title: 'Document Processed', description: 'Inventory Handling SOP.pdf has been mapped to knowledge nodes.', time: '4 hours ago', read: true, priority: 'low', tabRedirect: 'documents' },
    { id: 'not-4', title: 'Report Compiled', description: 'Q2 Compliance Audit Report completed successfully.', time: '1 day ago', read: true, priority: 'medium', tabRedirect: 'compliance' }
  ]);

  // Pinned conversations
  const [pinnedChats, setPinnedChats] = useState<string[]>([
    'Conveyor Belt B-04 vibration analysis',
    'Zone B Safety inspection draft',
    'OSHA operator certifications'
  ]);

  // App settings state
  const [settings, setSettings] = useState<AppSettings>({
    llmModel: 'IndusMind-Instruct-Large (v3.5-Turbo)',
    temperature: 0.2,
    maxTokens: 4096,
    vectorDbUrl: 'postgresql://admin@indusmind-db:5432/vector_db',
    ocrEngine: 'PaddleOCR / Tesseract-Hybrid',
    userRole: 'Warehouse Operations Manager'
  });

  // Copilot state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Welcome. I am the IndusMind Warehouse Brain. I have indexed all standard operating procedures (SOPs), equipment manuals, safety guidelines, and log sheets. Ask me any question about sorting stations, forklift fleets, packaging lines, or compliance audits.',
      timestamp: '2:15 PM'
    }
  ]);
  const [isCopilotTyping, setIsCopilotTyping] = useState<boolean>(false);

  // Actions
  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt' | 'status' | 'version'>) => {
    const newDoc: Document = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: 'Just now',
      status: 'Processing',
      version: 'v1.0'
    };
    setDocuments(prev => [newDoc, ...prev]);

    // Simulate processing completed in 5 seconds
    setTimeout(() => {
      setDocuments(prev =>
        prev.map(d => d.id === newDoc.id ? { ...d, status: 'Processed' } : d)
      );
      // Push notification
      setNotifications(prev => [
        {
          id: `not-${Date.now()}`,
          title: 'File Indexing Finished',
          description: `"${newDoc.name}" has been mapped into the Knowledge Graph.`,
          time: 'Just now',
          read: false,
          priority: 'medium',
          tabRedirect: 'documents'
        },
        ...prev
      ]);
    }, 4500);
  };

  const updateAlertStatus = (id: string, status: MaintenanceAlert['status']) => {
    setMaintenanceAlerts(prev =>
      prev.map(alert => alert.id === id ? { ...alert, status } : alert)
    );
  };

  const pinChat = (chatTitle: string) => {
    if (!pinnedChats.includes(chatTitle)) {
      setPinnedChats(prev => [...prev, chatTitle]);
    }
  };

  const unpinChat = (chatTitle: string) => {
    setPinnedChats(prev => prev.filter(c => c !== chatTitle));
  };

  const addChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsCopilotTyping(true);

    // Simulate response based on keywords (Warehouse Theme)
    setTimeout(() => {
      let reply = "I'm searching the warehouse database. Can you clarify which zone or machine model you are inquiring about?";
      let citations: ChatMessage['citations'] = [];
      let confidenceScore = 85;

      const lowerText = text.toLowerCase();
      if (lowerText.includes('conveyor') || lowerText.includes('b-04')) {
        reply = "For Conveyor Belt B-04: Repeated vibration anomalies have been detected during peak shift operations. Historically, bearing coking and misalignment led to motor burnout on 10 Feb 2026. Corrective measures suggest scheduling a lubrication check and mechanical tension alignment audit within 72 hours.";
        citations = [
          { id: 'doc-1', name: 'Equipment Manual.pdf', page: 12 },
          { id: 'doc-3', name: 'Forklift Maintenance Log.xlsx', page: 2 }
        ];
        confidenceScore = 98.4;
      } else if (lowerText.includes('packaging') || lowerText.includes('packaging machine a') || lowerText.includes('line a')) {
        reply = "Packaging Line A is showing a 12% increase in heat-seal packaging defects. I recommend verifying thermal heating element temperatures and checking compression rollers for alignment offsets as outlined in the operations manuals.";
        citations = [
          { id: 'doc-1', name: 'Equipment Manual.pdf', page: 24 }
        ];
        confidenceScore = 95.1;
      } else if (lowerText.includes('safety') || lowerText.includes('inspection') || lowerText.includes('audit')) {
        reply = "The current audit readiness index stands at 82%. A critical gap is present under Safety Inspections: the Zone B monthly safety walkthrough is overdue. Recommended tasks involve assigning team operators to audit emergency exits, pathways, and rack netting safety compliance.";
        citations = [
          { id: 'doc-4', name: 'Warehouse Safety Checklist.pdf', page: 3 }
        ];
        confidenceScore = 92.6;
      } else if (lowerText.includes('forklift') || lowerText.includes('fl-12')) {
        reply = "Forklift FL-12 hydraulic system checks show pressure levels dropping below threshold parameters. The lessons learned logs note a seal rupture incident on 18 Nov 2024 due to missed checks. Recommended tasks: perform hydraulic seal leak audits and check filter screens.";
        citations = [
          { id: 'doc-3', name: 'Forklift Maintenance Log.xlsx', page: 5 }
        ];
        confidenceScore = 89.8;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        confidenceScore
      };

      setChatHistory(prev => [...prev, assistantMsg]);
      setIsCopilotTyping(false);
    }, 2000);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(not => not.id === id ? { ...not, read: true } : not)
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(not => ({ ...not, read: true })));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notificationsOpen,
        setNotificationsOpen,
        documents,
        addDocument,
        maintenanceAlerts,
        updateAlertStatus,
        complianceRisks,
        incidents,
        chatHistory,
        addChatMessage,
        isCopilotTyping,
        pinnedChats,
        pinChat,
        unpinChat,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        settings,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

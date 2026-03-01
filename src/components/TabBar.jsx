import { FileText, PlusCircle, Calendar, Settings } from 'lucide-react';

const TABS = [
  { id: 'log',      label: 'Trip Log',    icon: <FileText size={16} /> },
  { id: 'manual',   label: 'Add Trip',    icon: <PlusCircle size={16} /> },
  { id: 'calendar', label: 'Calendar',    icon: <Calendar size={16} /> },
  { id: 'settings', label: 'Settings',    icon: <Settings size={16} /> },
];

export function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="tab-bar" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

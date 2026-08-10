import React from 'react';
import { Home, UploadCloud, ShieldAlert, BarChart3, UserCheck, FileText, PlusCircle } from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'upload', label: 'Data Upload Center', icon: UploadCloud },
    { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
    { id: 'analytics', label: 'Risk Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Customer Profile', icon: UserCheck },
    { id: 'reports', label: 'Report Generator', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div style={{ marginBottom: '24px', paddingLeft: '8px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            Navigation Menu
          </p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button className="sidebar-action-btn" onClick={() => setActivePage('upload')}>
          <PlusCircle size={18} />
          <span>Upload CSV Data</span>
        </button>

        <div style={{ marginTop: '16px', padding: '12px', background: '#F3F4F6', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Risk Thresholds</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span>Low: 0.0 - 0.33</span>
            <span style={{ color: '#059669', fontWeight: '600' }}>●</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Med: 0.34 - 0.66</span>
            <span style={{ color: '#F59E0B', fontWeight: '600' }}>●</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>High: 0.67 - 1.00</span>
            <span style={{ color: '#DC2626', fontWeight: '600' }}>●</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

import React from 'react';
import { ShieldAlert, User, Bell } from 'lucide-react';

export default function Navbar({ activePage, customerCount }) {
  const getPageTitle = () => {
    switch (activePage) {
      case 'home': return 'Executive Overview';
      case 'upload': return 'Data Upload & Validation Center';
      case 'risk': return 'Risk Assessment & Portfolio Dashboard';
      case 'analytics': return 'Model Validation & Analytics';
      case 'profile': return 'Individual Customer Risk Profile';
      case 'reports': return 'Report Generator & Audit Export';
      default: return 'Credit Risk Dashboard';
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <ShieldAlert size={28} className="text-white" />
        </div>
        <div>
          <h1 className="brand-title">RiskGuard AI</h1>
          <p className="brand-subtitle">Enterprise Credit Risk & Early-Warning System</p>
        </div>
      </div>

      <div className="hidden md:block text-center">
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.95 }}>{getPageTitle()}</h2>
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Active Portfolio: {customerCount} Evaluated Accounts</span>
      </div>

      <div className="navbar-actions">
        <div className="system-status">
          <span className="status-dot"></span>
          <span>ML Model Online (v2.4)</span>
        </div>

        <button className="btn btn-secondary" style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Bell size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '8px' }}>
          <User size={18} />
          <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Risk Officer</span>
        </div>
      </div>
    </header>
  );
}

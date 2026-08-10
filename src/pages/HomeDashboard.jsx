import React from 'react';
import { Users, AlertTriangle, ShieldAlert, CheckCircle2, UploadCloud, BarChart2, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function HomeDashboard({ predictions, metrics, setActivePage, setSelectedCustomer }) {
  const total = predictions.length;
  const highRiskCount = predictions.filter(p => p.risk_category === 'High').length;
  const mediumRiskCount = predictions.filter(p => p.risk_category === 'Medium').length;
  const lowRiskCount = predictions.filter(p => p.risk_category === 'Low').length;

  const topHighRiskCustomers = predictions
    .filter(p => p.risk_category === 'High')
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  return (
    <div className="home-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1F2937 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '32px 36px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '12px' }}>
            <Sparkles size={14} className="text-yellow-400" /> Automated ML Early-Warning System Active
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px' }}>
            Predict & Mitigate Credit Default Risk in Real Time
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '24px', lineHeight: '1.6' }}>
            Evaluate portfolio risk profiles, run instant ensemble machine learning predictions, identify key risk drivers with SHAP attribution, and generate compliance-ready export reports.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ background: '#2563EB' }} onClick={() => setActivePage('upload')}>
              <UploadCloud size={18} /> Upload Customer Data
            </button>
            <button className="btn btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }} onClick={() => setActivePage('risk')}>
              <BarChart2 size={18} /> View Risk Analysis
            </button>
            <button className="btn btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }} onClick={() => setActivePage('reports')}>
              <FileText size={18} /> Export Reports
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Customers Analyzed</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div className="stat-icon-wrapper" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#DC2626' }}>{highRiskCount}</div>
            <div className="stat-label">High Risk Alerts ({((highRiskCount/total)*100).toFixed(1)}%)</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#D97706' }}>{mediumRiskCount}</div>
            <div className="stat-label">Medium Risk Accounts ({((mediumRiskCount/total)*100).toFixed(1)}%)</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="stat-icon-wrapper" style={{ background: '#D1FAE5', color: '#10B981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#059669' }}>{lowRiskCount}</div>
            <div className="stat-label">Low Risk Accounts ({((lowRiskCount/total)*100).toFixed(1)}%)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent High Risk Alerts & Platform Highlights */}
      <div className="grid-2">
        {/* Left Card: Top High Risk Alerts */}
        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} className="text-red-600" />
              <span>Priority High Risk Alerts</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setActivePage('risk')}>
              View All <ArrowRight size={12} />
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Accounts flagged for immediate credit review and collateral verification.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topHighRiskCustomers.map(c => (
              <div 
                key={c.CustomerID} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#FDF2F2',
                  borderRadius: '8px',
                  border: '1px solid #FCA5A5',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedCustomer(c);
                  setActivePage('profile');
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#991B1B' }}>
                    {c.CustomerID}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Income: ${c.Income.toLocaleString()} | Loan: ${c.LoanAmount.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-high">
                    Risk: {c.risk_score.toFixed(2)}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '2px', fontWeight: '500' }}>
                    Click for Profile →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Feature Highlights */}
        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} className="text-blue-600" />
              <span>System Capabilities</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: '#EFF6FF', borderRadius: '8px', color: 'var(--primary)' }}>
                <UploadCloud size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Data Upload & Automated Cleaning</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Drag & drop CSV data files with automated column validation, type checking, and null value resolution.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: '#FEF3C7', borderRadius: '8px', color: '#D97706' }}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>SHAP Risk Factor Contribution</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Transparent feature attribution breaking down exactly how debt ratios, payment scores, and income impact scores.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: '#D1FAE5', borderRadius: '8px', color: '#059669' }}>
                <BarChart2 size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>ROC-AUC & Confusion Matrix Analytics</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Comprehensive model accuracy evaluation with interactive performance charts and precision-recall metrics.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: '#F3E8FF', borderRadius: '8px', color: '#7E22CE' }}>
                <FileText size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Audit & Compliance PDF / Excel Export</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Generate comprehensive multi-page executive PDF reports and Excel workbooks with custom filtered sections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

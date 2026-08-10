import React from 'react';
import { ShieldAlert, DollarSign, Briefcase, Clock, AlertTriangle, CheckCircle2, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import RiskGauge from '../components/RiskGauge';

export default function CustomerProfile({ customer, allCustomers, onSelectCustomer, setActivePage }) {
  if (!customer) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3>No Customer Account Selected</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 20px' }}>
          Please select a customer from the Risk Assessment table to view their complete credit profile.
        </p>
        <button className="btn btn-primary" onClick={() => setActivePage('risk')}>
          Go to Risk Assessment
        </button>
      </div>
    );
  }

  const {
    CustomerID,
    Income,
    LoanAmount,
    LoanDuration,
    ExistingCredits,
    EmploymentStatus,
    Dependents,
    PaymentHistory,
    DebtRatio,
    risk_score,
    risk_category,
    recommendation,
    badgeColor,
    confidence_level = 0.94,
    feature_contributions = [],
    risk_factors = [],
    derived = {}
  } = customer;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Customer Selector & Back Bar */}
      <div className="card" style={{ background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setActivePage('risk')}>
              <ArrowLeft size={16} /> Back to Table
            </button>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Individual Risk Profile</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deep-dive analysis for account {CustomerID}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Switch Account:</label>
            <select 
              className="form-select"
              value={CustomerID}
              onChange={(e) => {
                const target = allCustomers.find(c => c.CustomerID === e.target.value);
                if (target) onSelectCustomer(target);
              }}
              style={{ width: '180px' }}
            >
              {allCustomers.map(c => (
                <option key={c.CustomerID} value={c.CustomerID}>
                  {c.CustomerID} - {c.risk_category} ({c.risk_score.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customer Header Card */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1F2937 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Account Identifier
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '2px 0 8px' }}>
              {CustomerID}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className={`badge badge-${risk_category.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {risk_category} Risk Category
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                Last Analyzed: {new Date().toLocaleDateString()} | Model Confidence: {(confidence_level * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase' }}>Calculated Risk Score</div>
              <div style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1', color: badgeColor }}>
                {risk_score.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Business Recommendation Box */}
      <div className={`recommendation-box recommendation-${risk_category.toLowerCase()}`}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {risk_category === 'High' && <ShieldAlert size={20} />}
          {risk_category === 'Medium' && <AlertTriangle size={20} />}
          {risk_category === 'Low' && <CheckCircle2 size={20} />}
          Business Action Recommendation: {risk_category} Risk Protocol
        </h3>
        <p style={{ fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>
          {recommendation}
        </p>
      </div>

      {/* 4 Information Cards Grid */}
      <div className="grid-4">
        {/* Card 1: Financial Profile */}
        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={18} className="text-blue-600" />
              <span>1. Financial Profile</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Annual Income:</span>
              <strong>${Number(Income).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Requested Loan:</span>
              <strong>${Number(LoanAmount).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Debt Ratio (DTI):</span>
              <strong style={{ color: derived.dti_ratio > 45 ? '#DC2626' : undefined }}>{derived.dti_ratio || (DebtRatio*100).toFixed(1)}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Existing Credits:</span>
              <strong>{ExistingCredits} active lines</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Employment & Personal */}
        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={18} className="text-purple-600" />
              <span>2. Employment & Personal</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Employment Status:</span>
              <strong>{EmploymentStatus}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Loan Duration:</span>
              <strong>{LoanDuration} Months</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dependents:</span>
              <strong>{Dependents} person(s)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Loan-to-Income (LTI):</span>
              <strong>{derived.lti_ratio}x salary</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Payment History */}
        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} className="text-emerald-600" />
              <span>3. Payment History</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Payment Score:</span>
              <strong style={{ color: PaymentHistory < 60 ? '#DC2626' : '#059669' }}>
                {PaymentHistory}/100
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Monthly:</span>
              <strong>${derived.monthly_payment || Math.round(LoanAmount/LoanDuration)} / mo</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Installment Burden:</span>
              <strong>{derived.installment_burden_pct}% income</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Past Defaults:</span>
              <strong>{PaymentHistory < 50 ? 'Recorded' : 'Clean'}</strong>
            </div>
          </div>
        </div>

        {/* Card 4: Top Risk Factors & Severity */}
        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={18} className="text-amber-600" />
              <span>4. Key Risk Factors</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            {risk_factors.map((rf, idx) => (
              <div 
                key={idx}
                style={{
                  background: rf.severity === 'High' ? '#FEE2E2' : (rf.severity === 'Medium' ? '#FEF3C7' : '#EFF6FF'),
                  color: rf.severity === 'High' ? '#991B1B' : (rf.severity === 'Medium' ? '#92400E' : 'var(--primary)'),
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>{rf.title}</span>
                  <span className="badge" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{rf.severity}</span>
                </div>
                <div style={{ marginTop: '2px', opacity: 0.9 }}>{rf.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

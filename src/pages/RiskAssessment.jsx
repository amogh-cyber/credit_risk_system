import React, { useState, useMemo } from 'react';
import { Filter, Download, ChevronDown, ChevronUp, Search, Info, ShieldAlert, ArrowUpDown, UserCheck } from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import { generatePDFReport, generateExcelReport, exportToCSVFile } from '../services/exportService';

const EMPLOYMENT_OPTIONS = ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Contract'];

export default function RiskAssessment({ predictions, setSelectedCustomer, setActivePage }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [minIncome, setMinIncome] = useState(0);
  const [maxLoan, setMaxLoan] = useState(100000);
  const [selectedEmployment, setSelectedEmployment] = useState(EMPLOYMENT_OPTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table Sorting & Pagination State
  const [sortField, setSortField] = useState('risk_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Filter Logic
  const filteredPredictions = useMemo(() => {
    return predictions.filter(p => {
      if (categoryFilter !== 'All' && p.risk_category !== categoryFilter) return false;
      if (p.Income < minIncome) return false;
      if (p.LoanAmount > maxLoan) return false;
      if (!selectedEmployment.includes(p.EmploymentStatus)) return false;
      if (searchTerm && !p.CustomerID.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [predictions, categoryFilter, minIncome, maxLoan, selectedEmployment, searchTerm]);

  // Sort Logic
  const sortedPredictions = useMemo(() => {
    return [...filteredPredictions].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredPredictions, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedPredictions.length / rowsPerPage) || 1;
  const paginatedPredictions = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedPredictions.slice(start, start + rowsPerPage);
  }, [sortedPredictions, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleEmploymentCheckbox = (emp) => {
    if (selectedEmployment.includes(emp)) {
      setSelectedEmployment(selectedEmployment.filter(e => e !== emp));
    } else {
      setSelectedEmployment([...selectedEmployment, emp]);
    }
  };

  const handleResetFilters = () => {
    setCategoryFilter('All');
    setMinIncome(0);
    setMaxLoan(100000);
    setSelectedEmployment(EMPLOYMENT_OPTIONS);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Quick stats calculations
  const totalCount = filteredPredictions.length || 1;
  const avgRiskScore = (filteredPredictions.reduce((acc, p) => acc + p.risk_score, 0) / totalCount).toFixed(2);
  const highRiskPct = ((filteredPredictions.filter(p => p.risk_category === 'High').length / totalCount) * 100).toFixed(1);
  const medRiskPct = ((filteredPredictions.filter(p => p.risk_category === 'Medium').length / totalCount) * 100).toFixed(1);
  const lowRiskPct = ((filteredPredictions.filter(p => p.risk_category === 'Low').length / totalCount) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="card" style={{ background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)' }}>
              Risk Assessment Dashboard
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Evaluate credit risk scores, inspect feature attributions, and manage mitigation actions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search Customer ID..." 
                className="form-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px', width: '220px' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
            </div>

            <button className="btn btn-primary" onClick={() => generatePDFReport(filteredPredictions, { categoryFilter })}>
              <Download size={14} /> PDF Report
            </button>
            <button className="btn btn-secondary" onClick={() => generateExcelReport(filteredPredictions)}>
              Excel Export
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Main Grid Layout */}
      <div 
        className="risk-assessment-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          gap: '20px'
        }}
      >
        {/* LEFT SIDEBAR (20% width equivalent) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '0.95rem' }}>
              <Filter size={16} /> Filter Portfolio
            </h3>

            {/* Risk Category Dropdown */}
            <div className="form-group">
              <label className="form-label">Risk Category</label>
              <select 
                className="form-select"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Categories</option>
                <option value="Low">Low Risk (Green)</option>
                <option value="Medium">Medium Risk (Amber)</option>
                <option value="High">High Risk (Red)</option>
              </select>
            </div>

            {/* Income Range Slider */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Min Annual Income</span>
                <span>${minIncome.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="5000"
                value={minIncome} 
                onChange={(e) => {
                  setMinIncome(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ width: '100%' }}
              />
            </div>

            {/* Max Loan Amount Slider */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Max Loan Amount</span>
                <span>${maxLoan.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="5000" 
                max="100000" 
                step="5000"
                value={maxLoan} 
                onChange={(e) => {
                  setMaxLoan(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ width: '100%' }}
              />
            </div>

            {/* Employment Status Checkboxes */}
            <div className="form-group">
              <label className="form-label">Employment Status</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                {EMPLOYMENT_OPTIONS.map(emp => (
                  <label key={emp} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedEmployment.includes(emp)}
                      onChange={() => handleEmploymentCheckbox(emp)}
                    />
                    <span>{emp}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }} onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* CENTER SECTION (60% width equivalent) - Predictions Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('CustomerID')}>
                    Customer ID <ArrowUpDown size={12} />
                  </th>
                  <th className="sortable" onClick={() => handleSort('risk_score')}>
                    Risk Score <ArrowUpDown size={12} />
                  </th>
                  <th>Category</th>
                  <th className="sortable" onClick={() => handleSort('Income')}>
                    Income <ArrowUpDown size={12} />
                  </th>
                  <th className="sortable" onClick={() => handleSort('LoanAmount')}>
                    Loan Amount <ArrowUpDown size={12} />
                  </th>
                  <th>Recommendation</th>
                  <th style={{ textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPredictions.map(p => {
                  const isExpanded = expandedRowId === p.CustomerID;
                  return (
                    <React.Fragment key={p.CustomerID}>
                      <tr style={{ background: isExpanded ? '#EFF6FF' : undefined }}>
                        <td>
                          <button 
                            style={{ border: 'none', background: 'none', fontWeight: '700', color: 'var(--primary)', cursor: 'pointer', textAlign: 'left' }}
                            onClick={() => {
                              setSelectedCustomer(p);
                              setActivePage('profile');
                            }}
                          >
                            {p.CustomerID}
                          </button>
                        </td>
                        <td>
                          <strong style={{ 
                            color: p.risk_category === 'High' ? '#DC2626' : (p.risk_category === 'Medium' ? '#D97706' : '#059669'),
                            fontSize: '0.95rem'
                          }}>
                            {p.risk_score.toFixed(2)}
                          </strong>
                        </td>
                        <td>
                          <span className={`badge badge-${p.risk_category.toLowerCase()}`}>
                            {p.risk_category}
                          </span>
                        </td>
                        <td>${Number(p.Income).toLocaleString()}</td>
                        <td>${Number(p.LoanAmount).toLocaleString()}</td>
                        <td style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                          {p.recommendation}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => setExpandedRowId(isExpanded ? null : p.CustomerID)}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row Detail View */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="expanded-row-cell">
                            <div className="detail-grid">
                              {/* Prediction Feature Contribution Breakdown */}
                              <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
                                  Feature Contributions (SHAP Values)
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                                  {p.feature_contributions.map((fc, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                      <span><strong>{fc.feature}:</strong> {fc.value}</span>
                                      <span style={{ fontWeight: '600', color: fc.impact.includes('Risk') ? '#DC2626' : '#059669' }}>
                                        +{fc.score} ({fc.impact})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Historical Payment Behavior */}
                              <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
                                  Payment & Debt Profile
                                </h4>
                                <div style={{ background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                                  <div>Payment Score: <strong>{p.PaymentHistory}/100</strong></div>
                                  <div>Debt Ratio (DTI): <strong>{p.derived.dti_ratio}%</strong></div>
                                  <div>Loan-to-Income (LTI): <strong>{p.derived.lti_ratio}x</strong></div>
                                  <div>Monthly Burden: <strong>${p.derived.monthly_payment}/mo ({p.derived.installment_burden_pct}% income)</strong></div>
                                </div>
                              </div>

                              {/* Risk Mitigations */}
                              <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
                                  Suggested Risk Mitigations
                                </h4>
                                <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', padding: '10px', borderRadius: '4px', fontSize: '0.8rem', color: '#065F46' }}>
                                  {p.risk_category === 'High' && '• Require 20% collateral & guarantor co-signature\n• Verify tax returns for last 2 years'}
                                  {p.risk_category === 'Medium' && '• Verify employer tenure & recent paystubs\n• Set up automatic monthly bank draft'}
                                  {p.risk_category === 'Low' && '• Standard expedited loan approval eligible\n• Annual credit check maintenance'}
                                </div>
                                <button 
                                  className="btn btn-primary" 
                                  style={{ marginTop: '8px', padding: '4px 10px', fontSize: '0.75rem', width: '100%' }}
                                  onClick={() => {
                                    setSelectedCustomer(p);
                                    setActivePage('profile');
                                  }}
                                >
                                  View Full Customer Profile →
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedPredictions.length)} of {sortedPredictions.length} records
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', alignSelf: 'center' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="btn btn-secondary" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (20% width equivalent) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Gauge Widget */}
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '0.95rem' }}>Portfolio Risk Gauge</h3>
            <RiskGauge score={parseFloat(avgRiskScore)} size={170} />
          </div>

          {/* Quick Statistics */}
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '0.95rem' }}>Quick Statistics</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Risk Score:</span>
                <strong>{avgRiskScore}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Default Probability:</span>
                <strong style={{ color: '#DC2626' }}>{highRiskPct}%</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Medium Risk Ratio:</span>
                <strong style={{ color: '#D97706' }}>{medRiskPct}%</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Low Risk Safety:</span>
                <strong style={{ color: '#059669' }}>{lowRiskPct}%</strong>
              </div>
            </div>
          </div>

          {/* Top Risk Factors List */}
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '0.95rem' }}>Top Portfolio Risk Drivers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ background: '#FEE2E2', padding: '8px', borderRadius: '6px', color: '#991B1B' }}>
                <strong>1. Payment Score &lt; 50</strong>
                <p>38% influence on default score</p>
              </div>
              <div style={{ background: '#FEF3C7', padding: '8px', borderRadius: '6px', color: '#92400E' }}>
                <strong>2. Debt Ratio &gt; 45%</strong>
                <p>26% influence on default score</p>
              </div>
              <div style={{ background: '#EFF6FF', padding: '8px', borderRadius: '6px', color: 'var(--primary)' }}>
                <strong>3. Loan-to-Income &gt; 0.6x</strong>
                <p>20% influence on default score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

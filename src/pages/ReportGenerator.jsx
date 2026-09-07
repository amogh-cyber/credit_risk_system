import React, { useState } from 'react';
import { FileText, Download, Eye, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { generatePDFReport, generateExcelReport, exportToCSVFile } from '../services/exportService';

export default function ReportGenerator({ predictions }) {
  const [reportType, setReportType] = useState('PDF'); // 'PDF' | 'Excel' | 'CSV'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const [sections, setSections] = useState({
    summary: true,
    distribution: true,
    predictions: true,
    metrics: true,
    recommendations: true
  });

  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 600);
  };

  const handleDownload = () => {
    const filtered = categoryFilter === 'All' ? predictions : predictions.filter(p => p.risk_category === categoryFilter);

    if (reportType === 'PDF') {
      generatePDFReport(filtered, {
        categoryFilter,
        includeSummary: sections.summary,
        includeMetrics: sections.metrics,
        includePredictions: sections.predictions
      });
    } else if (reportType === 'Excel') {
      generateExcelReport(filtered);
    } else {
      exportToCSVFile(filtered);
    }
  };

  const filteredCount = categoryFilter === 'All' ? predictions.length : predictions.filter(p => p.risk_category === categoryFilter).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className="card" style={{ background: 'white' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)' }}>
            Compliance & Audit Report Generator
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Generate executive-ready PDF audit documents, Excel analytics workbooks, or CSV exports.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Report Options Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 className="card-title">1. Select Report Format</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button 
                className={`btn ${reportType === 'PDF' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setReportType('PDF')}
                style={{ padding: '12px', fontSize: '0.85rem' }}
              >
                <FileText size={16} /> PDF Document
              </button>
              <button 
                className={`btn ${reportType === 'Excel' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setReportType('Excel')}
                style={{ padding: '12px', fontSize: '0.85rem' }}
              >
                <FileSpreadsheet size={16} /> Excel (.xlsx)
              </button>
              <button 
                className={`btn ${reportType === 'CSV' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setReportType('CSV')}
                style={{ padding: '12px', fontSize: '0.85rem' }}
              >
                <Download size={16} /> CSV Raw Data
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">2. Filters & Scope</h3>

            <div className="form-group">
              <label className="form-label">Risk Category Filter</label>
              <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories ({predictions.length} accounts)</option>
                <option value="High">High Risk Only ({predictions.filter(p=>p.risk_category==='High').length} accounts)</option>
                <option value="Medium">Medium Risk Only ({predictions.filter(p=>p.risk_category==='Medium').length} accounts)</option>
                <option value="Low">Low Risk Only ({predictions.filter(p=>p.risk_category==='Low').length} accounts)</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">3. Include Report Sections</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={sections.summary} onChange={() => toggleSection('summary')} />
                <span>Executive Summary & Portfolio Overview</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={sections.distribution} onChange={() => toggleSection('distribution')} />
                <span>Risk Score Distribution Bins & Breakdown</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={sections.predictions} onChange={() => toggleSection('predictions')} />
                <span>Individual Customer Risk Predictions Table</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={sections.metrics} onChange={() => toggleSection('metrics')} />
                <span>Model Validation Performance Metrics (Accuracy, ROC-AUC)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={sections.recommendations} onChange={() => toggleSection('recommendations')} />
                <span>Business Action Guidelines & Mitigation Protocols</span>
              </label>
            </div>
          </div>

          {/* Generate & Download Actions */}
          <div className="card" style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '14px', fontSize: '0.95rem' }} 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Compiling Report...' : 'Generate Report Preview'}
            </button>

            <button 
              className="btn btn-success" 
              style={{ flex: 1, padding: '14px', fontSize: '0.95rem' }} 
              onClick={handleDownload}
            >
              <Download size={18} /> Download {reportType}
            </button>
          </div>
        </div>

        {/* Right Column: Live Report Preview Pane */}
        <div className="card" style={{ background: '#F8FAFC', border: '1px solid var(--border)' }}>
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} className="text-blue-600" />
              <span>Live Report Structure Preview</span>
            </div>
            <span className="badge badge-low">{reportType} Format</span>
          </div>

          <div 
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '24px',
              minHeight: '480px',
              fontSize: '0.85rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Header Mockup */}
            <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1F2937 100%)', color: 'white', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>RISKGUARD AI - CREDIT RISK REPORT</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Generated: {new Date().toLocaleDateString()} | Scope: {categoryFilter} Categories ({filteredCount} records)</div>
            </div>

            {sections.summary && (
              <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>1. Executive Summary</h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Evaluated {filteredCount} customer accounts between {startDate} and {endDate}. Portfolio risk distribution indicates {predictions.filter(p=>p.risk_category==='High').length} high risk flags requiring mandatory collateral verification.
                </p>
              </div>
            )}

            {sections.metrics && (
              <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>2. Model Validation Metrics</h4>
                <div style={{ display: 'flex', gap: '16px', fontWeight: '600' }}>
                  <span>Accuracy: 94.2%</span>
                  <span>Precision: 91.8%</span>
                  <span>Recall: 89.5%</span>
                  <span>AUC: 0.94</span>
                </div>
              </div>
            )}

            {sections.predictions && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>3. Customer Risk Predictions (Sample Table)</h4>
                <div style={{ background: '#F9FAFB', padding: '8px', borderRadius: '4px', border: '1px dashed var(--border)' }}>
                  {predictions.slice(0, 4).map(p => (
                    <div key={p.CustomerID} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', padding: '4px 0', fontSize: '0.75rem' }}>
                      <span>{p.CustomerID} (Inc: ${p.Income.toLocaleString()})</span>
                      <span className={`badge badge-${p.risk_category.toLowerCase()}`}>{p.risk_category} ({p.risk_score.toFixed(2)})</span>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    + {filteredCount - 4} more records included in final export file...
                  </div>
                </div>
              </div>
            )}

            {isGenerated && (
              <div style={{ marginTop: '20px', background: '#D1FAE5', color: '#065F46', padding: '10px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Report ready for download! Click "Download {reportType}" below.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

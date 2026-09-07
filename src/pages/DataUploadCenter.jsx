import React, { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, CheckCircle, XCircle, Download, ArrowRight, RefreshCw } from 'lucide-react';
import { processCustomerBatch } from '../services/mlEngine';
import { getSampleCSVString, generateSampleCustomers } from '../services/sampleData';

const REQUIRED_COLUMNS = [
  'CustomerID', 'Income', 'LoanAmount', 'LoanDuration', 
  'ExistingCredits', 'EmploymentStatus', 'Dependents', 
  'PaymentHistory', 'DebtRatio'
];

export default function DataUploadCenter({ onBatchUpload, setActivePage }) {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [columnsDetected, setColumnsDetected] = useState([]);
  const [missingColumns, setMissingColumns] = useState([]);
  const [typeWarnings, setTypeWarnings] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successSummary, setSuccessSummary] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileParse = (parsedFile) => {
    setFile(parsedFile);
    setSuccessSummary(null);

    Papa.parse(parsedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        if (!rows || rows.length === 0) {
          alert('Uploaded CSV file appears to be empty.');
          return;
        }

        const headers = Object.keys(rows[0] || {}).map(h => h.trim());
        setColumnsDetected(headers);

        // Validate required columns
        const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
        setMissingColumns(missing);

        // Check data types & null warnings on first 20 rows
        const warnings = [];
        rows.slice(0, 20).forEach((row, idx) => {
          if (isNaN(parseFloat(row.Income))) warnings.push(`Row ${idx + 1}: Invalid Income numerical value`);
          if (isNaN(parseFloat(row.LoanAmount))) warnings.push(`Row ${idx + 1}: Invalid LoanAmount numerical value`);
          if (isNaN(parseFloat(row.PaymentHistory))) warnings.push(`Row ${idx + 1}: Invalid PaymentHistory score`);
        });

        setTypeWarnings(warnings.slice(0, 5)); // Cap warnings display
        setPreviewData(rows.slice(0, 10));

        const valid = missing.length === 0;
        setIsValid(valid);
      },
      error: (err) => {
        alert('Failed to parse CSV file: ' + err.message);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileParse(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileParse(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file || !isValid) return;
    setIsProcessing(true);
    setProgress(15);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setProgress(60);
        setTimeout(() => {
          const processed = processCustomerBatch(results.data);
          setProgress(100);
          
          setTimeout(() => {
            setIsProcessing(false);
            onBatchUpload(processed);
            
            const highCount = processed.filter(p => p.risk_category === 'High').length;
            setSuccessSummary({
              total: processed.length,
              high: highCount,
              medium: processed.filter(p => p.risk_category === 'Medium').length,
              low: processed.filter(p => p.risk_category === 'Low').length
            });
          }, 400);
        }, 500);
      }
    });
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = getSampleCSVString();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_credit_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadDemoDataset = () => {
    setIsProcessing(true);
    setProgress(30);
    setTimeout(() => {
      const demoData = generateSampleCustomers(150);
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        onBatchUpload(demoData);
        setSuccessSummary({
          total: demoData.length,
          high: demoData.filter(p => p.risk_category === 'High').length,
          medium: demoData.filter(p => p.risk_category === 'Medium').length,
          low: demoData.filter(p => p.risk_category === 'Low').length
        });
      }, 300);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className="card" style={{ background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)' }}>
              Data Upload & Processing Center
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Upload customer credit portfolio files (CSV format) for automated Machine Learning risk classification.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleDownloadSampleCSV}>
              <Download size={16} /> Download Sample CSV
            </button>
            <button className="btn btn-secondary" onClick={handleLoadDemoDataset}>
              <RefreshCw size={16} /> Load Demo Dataset (150 Accounts)
            </button>
          </div>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div 
        className={`dropzone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csvFileInput').click()}
      >
        <input 
          id="csvFileInput" 
          type="file" 
          accept=".csv" 
          style={{ display: 'none' }} 
          onChange={handleFileInputChange}
        />
        <UploadCloud className="dropzone-icon" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>
          {file ? `Selected File: ${file.name}` : 'Drag & Drop CSV File Here'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          or click to browse your local computer (CSV up to 10,000 rows supported)
        </p>
      </div>

      {/* Upload Progress Bar */}
      {isProcessing && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>
            <span>Processing Credit Risk ML Engine...</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Data Validation Feedback */}
      {file && (
        <div className="grid-2">
          {/* Column Check Card */}
          <div className="card">
            <h3 className="card-title">Schema Validation Feedback</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Required Schema Fields:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {REQUIRED_COLUMNS.map(col => {
                    const isPresent = columnsDetected.includes(col);
                    return (
                      <span 
                        key={col} 
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: isPresent ? '#D1FAE5' : '#FEE2E2',
                          color: isPresent ? '#065F46' : '#991B1B'
                        }}
                      >
                        {isPresent ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {col}
                      </span>
                    );
                  })}
                </div>
              </div>

              {missingColumns.length > 0 && (
                <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <strong>✗ Missing Columns:</strong> {missingColumns.join(', ')}
                </div>
              )}

              {typeWarnings.length > 0 && (
                <div style={{ background: '#FEF3C7', color: '#92400E', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <strong>⚠ Data Warnings:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                    {typeWarnings.map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>
              )}

              {isValid && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={18} /> Schema validated successfully! All 9 required fields present.
                </div>
              )}
            </div>
          </div>

          {/* Submission Control Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="card-title">Batch Processing Action</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Run ensemble random forest predictions across {previewData.length > 0 ? 'all parsed customer records' : '0 records'}.
              </p>
            </div>

            <div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }} 
                disabled={!isValid || isProcessing}
                onClick={handleSubmit}
              >
                {isProcessing ? 'Processing Batch...' : 'Run Credit Risk Prediction Model'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Summary Banner */}
      {successSummary && (
        <div className="card" style={{ background: '#ECFDF5', border: '1px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ color: '#065F46', fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={22} /> Batch Risk Prediction Complete!
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#047857', marginTop: '4px' }}>
                Evaluated {successSummary.total} customer accounts: <strong>{successSummary.high} High Risk</strong>, {successSummary.medium} Medium Risk, {successSummary.low} Low Risk.
              </p>
            </div>

            <button className="btn btn-success" onClick={() => setActivePage('risk')}>
              View Risk Assessment Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* File Preview Table (First 10 Rows) */}
      {previewData.length > 0 && (
        <div className="card">
          <h3 className="card-title">File Data Preview (First 10 Rows)</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  {REQUIRED_COLUMNS.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.CustomerID}</strong></td>
                    <td>${Number(row.Income).toLocaleString()}</td>
                    <td>${Number(row.LoanAmount).toLocaleString()}</td>
                    <td>{row.LoanDuration} mos</td>
                    <td>{row.ExistingCredits}</td>
                    <td>{row.EmploymentStatus}</td>
                    <td>{row.Dependents}</td>
                    <td>{row.PaymentHistory}/100</td>
                    <td>{row.DebtRatio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

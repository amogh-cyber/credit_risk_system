import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomeDashboard from './pages/HomeDashboard';
import DataUploadCenter from './pages/DataUploadCenter';
import RiskAssessment from './pages/RiskAssessment';
import RiskAnalytics from './pages/RiskAnalytics';
import CustomerProfile from './pages/CustomerProfile';
import ReportGenerator from './pages/ReportGenerator';

import { generateSampleCustomers } from './services/sampleData';
import { calculateModelMetrics } from './services/mlEngine';

export default function App() {
  // Initialize with 150 realistic customer records
  const [predictions, setPredictions] = useState(() => generateSampleCustomers(120));
  const [activePage, setActivePage] = useState('home');
  const [selectedCustomer, setSelectedCustomer] = useState(() => predictions[0] || null);

  // Compute live global metrics
  const metrics = useMemo(() => {
    return calculateModelMetrics(predictions);
  }, [predictions]);

  // Handle uploaded batch CSV dataset
  const handleBatchUpload = (newPredictions) => {
    setPredictions(newPredictions);
    if (newPredictions.length > 0) {
      setSelectedCustomer(newPredictions[0]);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content View */}
      <div className="main-content">
        {/* Navbar Header */}
        <Navbar activePage={activePage} customerCount={predictions.length} />

        {/* Page Body View */}
        <main className="page-body">
          {activePage === 'home' && (
            <HomeDashboard 
              predictions={predictions} 
              metrics={metrics} 
              setActivePage={setActivePage} 
              setSelectedCustomer={setSelectedCustomer} 
            />
          )}

          {activePage === 'upload' && (
            <DataUploadCenter 
              onBatchUpload={handleBatchUpload} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === 'risk' && (
            <RiskAssessment 
              predictions={predictions} 
              setSelectedCustomer={setSelectedCustomer} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === 'analytics' && (
            <RiskAnalytics 
              metrics={metrics} 
            />
          )}

          {activePage === 'profile' && (
            <CustomerProfile 
              customer={selectedCustomer} 
              allCustomers={predictions}
              onSelectCustomer={setSelectedCustomer}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'reports' && (
            <ReportGenerator 
              predictions={predictions} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

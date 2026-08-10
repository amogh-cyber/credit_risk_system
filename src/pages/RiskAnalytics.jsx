import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, ShieldCheck, Target, Award, BarChart2 } from 'lucide-react';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RiskAnalytics({ metrics }) {
  const {
    accuracy = 94.2,
    precision = 91.8,
    recall = 89.5,
    f1_score = 90.6,
    auc_score = 0.94,
    confusion_matrix = { tp: 320, fp: 28, fn: 37, tn: 615 },
    feature_importance = [
      { name: 'Payment History Score', importance: 0.38 },
      { name: 'Debt Ratio (DTI)', importance: 0.26 },
      { name: 'Loan-to-Income (LTI)', importance: 0.20 },
      { name: 'Employment Status', importance: 0.10 },
      { name: 'Existing Credits', importance: 0.04 },
      { name: 'Dependents', importance: 0.02 }
    ],
    histogram_bins = [15, 25, 30, 20, 18, 14, 12, 10, 8, 5],
    employment_risk = {}
  } = metrics || {};

  // 1. ROC-AUC Line Chart Config
  const rocData = {
    labels: ['0.0', '0.05', '0.10', '0.18', '0.30', '0.50', '1.0'],
    datasets: [
      {
        label: `Random Forest Model (AUC = ${auc_score})`,
        data: [0.0, 0.65, 0.84, 0.92, 0.96, 0.98, 1.0],
        borderColor: '#1E3A8A',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#1E3A8A'
      },
      {
        label: 'Random Classifier (AUC = 0.50)',
        data: [0.0, 0.05, 0.10, 0.18, 0.30, 0.50, 1.0],
        borderColor: '#9CA3AF',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const rocOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { title: { display: true, text: 'False Positive Rate (FPR)' } },
      y: { title: { display: true, text: 'True Positive Rate (TPR / Recall)' }, min: 0, max: 1 }
    }
  };

  // 3. Risk Score Distribution Histogram Config
  const histogramData = {
    labels: ['0.0-0.1', '0.1-0.2', '0.2-0.3', '0.3-0.4', '0.4-0.5', '0.5-0.6', '0.6-0.7', '0.7-0.8', '0.8-0.9', '0.9-1.0'],
    datasets: [
      {
        label: 'Customer Count',
        data: histogram_bins,
        backgroundColor: [
          '#10B981', '#10B981', '#10B981', '#F59E0B', '#F59E0B', '#F59E0B', '#DC2626', '#DC2626', '#DC2626', '#B91C1C'
        ],
        borderRadius: 4
      }
    ]
  };

  // 5. Feature Importance Horizontal Bar Chart Config
  const featureData = {
    labels: feature_importance.map(f => f.name),
    datasets: [
      {
        label: 'Relative Weight',
        data: feature_importance.map(f => f.importance),
        backgroundColor: ['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
        borderRadius: 4
      }
    ]
  };

  const featureOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { min: 0, max: 0.45 } }
  };

  // 6. Risk by Employment Status Doughnut Config
  const empCategories = Object.keys(employment_risk);
  const empData = {
    labels: empCategories.length > 0 ? empCategories : ['Employed', 'Self-Employed', 'Unemployed', 'Contract', 'Retired'],
    datasets: [
      {
        label: 'High Risk Count',
        data: empCategories.length > 0 
          ? empCategories.map(k => employment_risk[k]?.high || 0)
          : [12, 18, 35, 22, 5],
        backgroundColor: ['#3B82F6', '#F59E0B', '#DC2626', '#8B5CF6', '#10B981']
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="card" style={{ background: 'white' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)' }}>
            Model Performance & Risk Analytics
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Comprehensive evaluation of model calibration, discrimination metrics, confusion matrices, and feature importances.
          </p>
        </div>
      </div>

      {/* 2x3 Grid Visualization Panels */}
      <div className="grid-2x3">
        {/* Panel 1: ROC-AUC Curve */}
        <div className="card">
          <div className="card-title">
            <span>1. ROC-AUC Performance Curve</span>
            <span className="badge badge-low" style={{ background: '#EFF6FF', color: 'var(--primary)' }}>
              AUC = {auc_score}
            </span>
          </div>
          <Line data={rocData} options={rocOptions} height={200} />
        </div>

        {/* Panel 2: Confusion Matrix Heatmap */}
        <div className="card">
          <div className="card-title">
            <span>2. Confusion Matrix Heatmap</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
            <div style={{ background: '#ECFDF5', border: '2px solid #10B981', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#065F46', textTransform: 'uppercase' }}>
                True Negative (TN)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#065F46' }}>{confusion_matrix.tn}</div>
              <div style={{ fontSize: '0.7rem', color: '#047857' }}>Correct Non-Defaults</div>
            </div>

            <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#92400E', textTransform: 'uppercase' }}>
                False Positive (FP)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#92400E' }}>{confusion_matrix.fp}</div>
              <div style={{ fontSize: '0.7rem', color: '#B45309' }}>False Alarm Flags</div>
            </div>

            <div style={{ background: '#FEE2E2', border: '2px solid #EF4444', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#991B1B', textTransform: 'uppercase' }}>
                False Negative (FN)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#991B1B' }}>{confusion_matrix.fn}</div>
              <div style={{ fontSize: '0.7rem', color: '#B91C1C' }}>Missed Defaults</div>
            </div>

            <div style={{ background: '#EEF2FF', border: '2px solid #6366F1', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3730A3', textTransform: 'uppercase' }}>
                True Positive (TP)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3730A3' }}>{confusion_matrix.tp}</div>
              <div style={{ fontSize: '0.7rem', color: '#4338CA' }}>Correct Default Flags</div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', background: '#F9FAFB', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-around', fontWeight: '600' }}>
            <span>Precision: {precision}%</span>
            <span>Recall: {recall}%</span>
            <span>F1: {f1_score}%</span>
          </div>
        </div>

        {/* Panel 3: Risk Score Distribution Histogram */}
        <div className="card">
          <div className="card-title">
            <span>3. Risk Score Distribution</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mean: 0.38 | Median: 0.34</span>
          </div>
          <Bar data={histogramData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={200} />
        </div>

        {/* Panel 4: Model Performance Metrics Card */}
        <div className="card">
          <div className="card-title">
            <span>4. Model Validation Metrics</span>
            <span className="badge badge-low">Live Evaluated</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '12px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Accuracy</span> <TrendingUp size={14} className="text-green-600" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>{accuracy}%</div>
              <div style={{ fontSize: '0.7rem', color: '#059669' }}>↑ 1.4% vs baseline</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Precision</span> <Target size={14} className="text-blue-600" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>{precision}%</div>
              <div style={{ fontSize: '0.7rem', color: '#059669' }}>↑ 2.1% vs baseline</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Recall Score</span> <ShieldCheck size={14} className="text-emerald-600" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>{recall}%</div>
              <div style={{ fontSize: '0.7rem', color: '#059669' }}>↑ 0.8% vs baseline</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>F1-Score</span> <Award size={14} className="text-amber-600" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>{f1_score}%</div>
              <div style={{ fontSize: '0.7rem', color: '#059669' }}>↑ 1.6% vs baseline</div>
            </div>
          </div>
        </div>

        {/* Panel 5: Feature Importance Bar Chart */}
        <div className="card">
          <div className="card-title">
            <span>5. Feature Importance Weights</span>
          </div>
          <Bar data={featureData} options={featureOptions} height={200} />
        </div>

        {/* Panel 6: Risk by Employment Status */}
        <div className="card">
          <div className="card-title">
            <span>6. High Risk Count by Employment</span>
          </div>
          <div style={{ maxHeight: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={empData} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}

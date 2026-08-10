import React from 'react';

export default function RiskGauge({ score = 0.5, size = 180 }) {
  // Angle calculation for SVG arch: 0.0 -> -90 deg, 1.0 -> +90 deg
  const clampedScore = Math.min(Math.max(score, 0), 1);
  const angle = -90 + (clampedScore * 180);

  let category = 'Low Risk';
  let categoryColor = '#10B981';

  if (clampedScore >= 0.67) {
    category = 'High Risk';
    categoryColor = '#DC2626';
  } else if (clampedScore >= 0.34) {
    category = 'Medium Risk';
    categoryColor = '#F59E0B';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size / 1.7} viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>

        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Colored Gradient Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="35" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="100" r="8" fill="#1E293B" />
        </g>
      </svg>

      <div style={{ textAlign: 'center', marginTop: '-10px' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: categoryColor, lineHeight: '1.2' }}>
          {clampedScore.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: categoryColor }}>
          {category}
        </div>
      </div>
    </div>
  );
}

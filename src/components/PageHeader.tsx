/**
 * 页面标题栏（含返回按钮）
 */
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack, right }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              width: '36px', height: '36px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ←
          </button>
        )}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{title}</h2>
          {subtitle && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
        </div>
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  </div>
);

/**
 * 报表页 - 移动端
 */
import React from 'react';
import { PageHeader } from '../components';

interface ReportsPageProps {
  onBack?: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onBack }) => {
  const chartData = [
    { label: '周一', value: 65 },
    { label: '周二', value: 78 },
    { label: '周三', value: 52 },
    { label: '周四', value: 91 },
    { label: '周五', value: 84 },
    { label: '周六', value: 45 },
    { label: '周日', value: 38 },
  ];
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="page">
      <PageHeader title="数据报表" subtitle="近7天业务数据趋势" onBack={onBack} />

      {/* 折线图模拟 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>访问量趋势</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', padding: '0 8px' }}>
          {chartData.map((item) => (
            <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.value}</div>
              <div style={{
                width: '100%', height: `${(item.value / maxValue) * 100}%`,
                background: 'linear-gradient(180deg, #1890ff 0%, #69c0ff 100%)',
                borderRadius: '4px 4px 0 0',
                minHeight: '8px',
              }} />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据汇总 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>数据汇总</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: '今日访问', value: '3,256', change: '+12%', up: true },
            { label: '今日订单', value: '186', change: '+8%', up: true },
            { label: '今日收入', value: '¥4.2万', change: '-3%', up: false },
            { label: '转化率', value: '5.7%', change: '+1.2%', up: true },
          ].map((item) => (
            <div key={item.label} style={{ padding: '12px', background: '#f5f7fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{item.value}</div>
              <div style={{ fontSize: '11px', color: item.up ? '#52c41a' : '#f5222d', marginTop: '2px' }}>
                {item.up ? '↑' : '↓'} {item.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 导出按钮 */}
      <button style={{
        width: '100%', height: '40px',
        background: 'var(--primary)', color: '#fff',
        border: 'none', borderRadius: 'var(--radius)',
        fontSize: '14px', fontWeight: 500, cursor: 'pointer',
      }}>
        📥 导出报表
      </button>
    </div>
  );
};

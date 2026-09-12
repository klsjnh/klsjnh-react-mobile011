/**
 * 首页/仪表盘 - 移动端（完整版）
 */
import React, { useState, useEffect } from 'react';
import { mockApi } from '../mock';
import { useCurrentUser } from '../stores/authStore';

interface HomePageProps {
  onNavigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const user = useCurrentUser();
  const [stats, setStats] = useState<{ totalUsers: number; totalOrders: number; revenue: number; activeRate: number } | null>(null);

  useEffect(() => {
    mockApi.getStats().then(res => {
      if (res.code === 0) setStats(res.data);
    });
  }, []);

  const handleQuickNav = (path: string) => {
    onNavigate?.(path);
  };

  const statItems = [
    { label: '用户总数', value: stats?.totalUsers.toLocaleString() || '-', color: '#1890ff', trend: '+12.5%', up: true },
    { label: '订单总数', value: stats?.totalOrders.toLocaleString() || '-', color: '#52c41a', trend: '+8.3%', up: true },
    { label: '总收入', value: stats ? `¥${(stats.revenue / 10000).toFixed(0)}万` : '-', color: '#faad14', trend: '-2.4%', up: false },
    { label: '活跃率', value: stats ? `${stats.activeRate}%` : '-', color: '#f5222d', trend: '+5.7%', up: true },
  ];

  const quickEntries = [
    { icon: '👥', label: '用户', path: '/users', color: '#e6f7ff', textColor: '#1890ff' },
    { icon: '🛡', label: '角色', path: '/roles', color: '#f6ffed', textColor: '#52c41a' },
    { icon: '🔑', label: '权限', path: '/permissions', color: '#fff7e6', textColor: '#faad14' },
    { icon: '🏢', label: '组织', path: '/departments', color: '#f9f0ff', textColor: '#722ed1' },
    { icon: '📋', label: '菜单', path: '/menus', color: '#e6fffb', textColor: '#13c2c2' },
    { icon: '📊', label: '报表', path: '/reports', color: '#fffbe6', textColor: '#faad14' },
    { icon: '🔔', label: '通知', path: '/notifications', color: '#fff1f0', textColor: '#f5222d' },
    { icon: '📝', label: '日志', path: '/audit', color: '#f5f5f5', textColor: '#8c8c8c' },
  ];

  return (
    <div className="page">
      {/* 欢迎语 */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        color: '#fff',
      }}>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>👋 欢迎回来</div>
        <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
          {user?.realName || '管理员'}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
          今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', padding: '0 2px' }}>数据概览</div>
      <div className="stat-grid">
        {statItems.map((item) => (
          <div key={item.label} className="stat-card">
            <div className="stat-value" style={{ color: item.color }}>{item.value}</div>
            <div className="stat-label">{item.label}</div>
            <div className={`stat-trend ${item.up ? 'up' : 'down'}`}>
              {item.up ? '↑' : '↓'} {item.trend}
            </div>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <div style={{ fontSize: '14px', fontWeight: 600, margin: '16px 0 10px', padding: '0 2px' }}>快捷入口</div>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        padding: '16px 12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {quickEntries.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              onClick={() => handleQuickNav(item.path)}
            >
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '12px',
                background: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px',
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <div style={{ fontSize: '14px', fontWeight: 600, margin: '16px 0 10px', padding: '0 2px' }}>最近活动</div>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        padding: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        {[
          { user: '张三', action: '创建了新角色', target: '财务审核员', time: '5分钟前', icon: '🛡' },
          { user: '李四', action: '修改了用户权限', target: '王五', time: '15分钟前', icon: '🔑' },
          { user: '王五', action: '登录了系统', target: '', time: '30分钟前', icon: '🔓' },
          { user: '赵六', action: '删除了过期日志', target: '128条', time: '1小时前', icon: '🗑' },
        ].map((activity, index) => (
          <div
            key={index}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 0',
              borderBottom: index < 3 ? '1px solid var(--border-light)' : 'none',
            }}
          >
            <div style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              background: '#f5f7fa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>
              {activity.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px' }}>
                <strong>{activity.user}</strong> {activity.action}
                {activity.target && <strong> {activity.target}</strong>}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 业务中心页 - 移动端（3 个分组，20+ 业务入口）
 */
import React from 'react';
import { PageHeader } from '../components';

interface BusinessPageProps {
  onNavigate?: (path: string) => void;
}

interface GroupItem {
  icon: string;
  label: string;
  path: string;
  color: string;
}

interface Group {
  title: string;
  color: string;
  items: GroupItem[];
}

export const BusinessPage: React.FC<BusinessPageProps> = ({ onNavigate }) => {
  const groups: Group[] = [
    {
      title: '📋 配置管理',
      color: '#1890ff',
      items: [
        { icon: '⚙️', label: '配置管理', path: '/business/config', color: '#e6f7ff' },
        { icon: '⏰', label: '定时任务', path: '/business/scheduler', color: '#f6ffed' },
        { icon: '🗄', label: '数据源', path: '/business/datasource', color: '#fff7e6' },
        { icon: '💾', label: '存储中心', path: '/business/storage', color: '#f9f0ff' },
        { icon: '📜', label: '参数设置', path: '/business/params', color: '#e6fffb' },
        { icon: '📖', label: '字典管理', path: '/business/dict', color: '#fff1f0' },
        { icon: '✉️', label: '通知模板', path: '/business/template', color: '#fffbe6' },
        { icon: '📣', label: '消息推送', path: '/business/push', color: '#f0f5ff' },
      ],
    },
    {
      title: '📊 数据分析',
      color: '#52c41a',
      items: [
        { icon: '📈', label: '数据报表', path: '/reports', color: '#f6ffed' },
        { icon: '📊', label: '数据统计', path: '/business/stats', color: '#e6f7ff' },
        { icon: '📈', label: '趋势分析', path: '/business/trend', color: '#fff7e6' },
        { icon: '🎛', label: '图表展示', path: '/business/charts', color: '#f9f0ff' },
        { icon: '📤', label: '数据导出', path: '/business/export', color: '#e6fffb' },
        { icon: '🖥', label: '数据大屏', path: '/business/dashboard', color: '#fff1f0' },
        { icon: '🧮', label: '数据计算', path: '/business/calc', color: '#fffbe6' },
        { icon: '🔍', label: '数据查询', path: '/business/query', color: '#f0f5ff' },
      ],
    },
    {
      title: '🛠 系统工具',
      color: '#faad14',
      items: [
        { icon: '🔔', label: '消息通知', path: '/notifications', color: '#fff7e6' },
        { icon: '📝', label: '审计日志', path: '/audit', color: '#f5f5f5' },
        { icon: '❓', label: '帮助反馈', path: '/help', color: '#e6f7ff' },
        { icon: 'ℹ️', label: '关于系统', path: '/about', color: '#f6ffed' },
        { icon: '📡', label: '系统监控', path: '/business/monitor', color: '#fff1f0' },
        { icon: '👤', label: '在线用户', path: '/business/online', color: '#e6fffb' },
        { icon: '🧹', label: '缓存管理', path: '/business/cache', color: '#fffbe6' },
        { icon: '🔄', label: '服务日志', path: '/business/servicelog', color: '#f0f5ff' },
      ],
    },
  ];

  return (
    <div className="page">
      <PageHeader title="业务中心" subtitle="配置 · 数据 · 工具" />

      {groups.map((group) => (
        <div key={group.title} style={{ marginBottom: '16px' }}>
          {/* 分组标题 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '14px', fontWeight: 600,
            marginBottom: '10px', padding: '0 2px',
            color: group.color,
          }}>
            {group.title}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({group.items.length})
            </span>
          </div>

          {/* 宫格 */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            padding: '16px 8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 8px' }}>
              {group.items.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigate?.(item.path)}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

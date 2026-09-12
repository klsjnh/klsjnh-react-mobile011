/**
 * 系统管理页 - 移动端（十二宫格，由菜单配置驱动）
 */
import React, { useEffect } from 'react';
import { PageHeader } from '../components';
import { menuStore, useChildMenus } from '../stores/menuStore';

interface SystemPageProps {
  onNavigate?: (path: string) => void;
}

export const SystemPage: React.FC<SystemPageProps> = ({ onNavigate }) => {
  // 从 menuStore 获取 /system 的子菜单
  const menus = useChildMenus('/system');

  // 确保菜单已加载
  useEffect(() => {
    menuStore.load();
  }, []);

  return (
    <div className="page">
      <PageHeader title="系统管理" subtitle="核心配置与管理入口" />

      {/* 十二宫格（由菜单配置驱动） */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        padding: '16px 12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        {menus.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">菜单加载中...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 8px' }}>
            {menus.map((item) => (
              <div
                key={item.id}
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
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#f5f7fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 说明 */}
      <div style={{
        background: '#f5f7fa',
        borderRadius: 'var(--radius)',
        padding: '14px',
        marginTop: '16px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        lineHeight: 1.8,
      }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>💡 动态菜单</div>
        此页宫格由「菜单管理」实时配置，增删改菜单立即生效。
      </div>
    </div>
  );
};

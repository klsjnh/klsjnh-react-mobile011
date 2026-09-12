/**
 * 个人中心页 - 移动端（完整版：设置+关于+退出）
 */
import React, { useState } from 'react';
import { useCurrentUser, authStore } from '../stores/authStore';
import { ConfirmDialog } from '../components';

interface ProfilePageProps {
  onNavigate?: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const user = useCurrentUser();
  const [dialog, setDialog] = useState<{ visible: boolean; onConfirm: () => void }>({
    visible: false,
    onConfirm: () => {},
  });
  const [settings, setSettings] = useState({
    notify: true,
    darkMode: false,
  });

  const handleLogout = () => {
    setDialog({
      visible: true,
      onConfirm: () => {
        authStore.logout();
        setDialog(d => ({ ...d, visible: false }));
      },
    });
  };

  const navItems = [
    { icon: '👥', label: '用户管理', path: '/users' },
    { icon: '🛡', label: '角色管理', path: '/roles' },
    { icon: '🔑', label: '权限管理', path: '/permissions' },
    { icon: '🔗', label: '权限关联', path: '/permissions/relation' },
    { icon: '🏢', label: '组织管理', path: '/departments' },
    { icon: '📋', label: '菜单管理', path: '/menus' },
    { icon: '📊', label: '数据报表', path: '/reports' },
    { icon: '🔔', label: '消息通知', path: '/notifications' },
    { icon: '📝', label: '审计日志', path: '/audit' },
    { icon: '⚙️', label: '系统设置', path: '/settings' },
    { icon: '❓', label: '帮助反馈', path: '/help' },
    { icon: 'ℹ️', label: '关于我们', path: '/about' },
  ];

  const settingItems = [
    { icon: '🔔', label: '消息通知', key: 'notify' as const },
    { icon: '🌙', label: '深色模式', key: 'darkMode' as const },
  ];

  return (
    <div className="page">
      {/* 用户信息卡片 */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        borderRadius: '12px',
        padding: '24px 20px',
        marginBottom: '16px',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt=""
            style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}
          />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>{user?.realName || '未登录'}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
              @{user?.username || '-'}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
              {user?.roles?.join(', ') || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* 功能入口 */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        marginBottom: '16px',
      }}>
        {navItems.map((item, index, arr) => (
          <div
            key={item.label}
            onClick={() => onNavigate?.(item.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px',
              borderBottom: index < arr.length - 1 ? '1px solid var(--border-light)' : 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: '14px' }}>{item.label}</span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>›</span>
          </div>
        ))}
      </div>

      {/* 设置项（开关） */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        marginBottom: '16px',
      }}>
        {settingItems.map((item, index, arr) => (
          <div
            key={item.label}
            onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px',
              borderBottom: index < arr.length - 1 ? '1px solid var(--border-light)' : 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: '14px' }}>{item.label}</span>
            <div style={{
              width: '40px', height: '22px', borderRadius: '11px',
              background: settings[item.key] ? 'var(--primary)' : '#d9d9d9',
              position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '2px',
                left: settings[item.key] ? '20px' : '2px',
                transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* 退出登录 */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%', height: '44px',
          background: '#fff', border: '1px solid var(--danger)',
          borderRadius: 'var(--radius)', color: 'var(--danger)',
          fontSize: '15px', fontWeight: 500, cursor: 'pointer',
        }}
      >
        退出登录
      </button>

      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px' }}>
        Mobile Admin v1.0.0
      </div>

      <ConfirmDialog
        visible={dialog.visible}
        title="退出登录"
        content="确定要退出登录吗？"
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog(d => ({ ...d, visible: false }))}
      />
    </div>
  );
};

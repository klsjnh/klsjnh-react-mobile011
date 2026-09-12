/**
 * 主布局组件 - 底部 TabBar 导航
 */
import React from 'react';
import { useCurrentUser, authStore } from '../stores/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

/** TabBar 配置 */
const tabs = [
  { path: '/home', label: '首页', icon: '🏠' },
  { path: '/users', label: '用户', icon: '👥' },
  { path: '/roles', label: '角色', icon: '🛡' },
  { path: '/menus', label: '菜单', icon: '📋' },
  { path: '/profile', label: '我的', icon: '👤' },
];

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const user = useCurrentUser();

  // 获取当前激活的 tab
  const activeTab = tabs.find(t => currentPath === t.path || currentPath.startsWith(t.path + '/'))
    ? tabs.find(t => currentPath === t.path || currentPath.startsWith(t.path + '/'))!.path
    : '/home';

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      authStore.logout();
    }
  };

  return (
    <div className="app-container">
      {/* 内容区 */}
      <div className="app-content">
        {children}
      </div>

      {/* 底部 TabBar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(56px + var(--safe-bottom))',
        background: '#fff',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        zIndex: 100,
        paddingBottom: 'var(--safe-bottom)',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => onNavigate(tab.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '10px',
                padding: '4px 0',
                transition: 'color 0.2s',
              }}
            >
              <span style={{ fontSize: '20px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

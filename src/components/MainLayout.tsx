/**
 * 主布局组件 - 底部 TabBar 导航（由菜单配置驱动）
 */
import React, { useEffect } from 'react';
import { useCurrentUser, authStore } from '../stores/authStore';
import { menuStore, useTabMenus } from '../stores/menuStore';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

/** 系统管理子路径（高亮"系统"Tab） */
const systemPaths = ['/system', '/users', '/roles', '/menus', '/permissions', '/departments', '/role-groups'];

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const user = useCurrentUser();
  const tabMenus = useTabMenus();

  // 初始化菜单
  useEffect(() => {
    menuStore.load();
  }, []);

  // 获取当前激活的 tab（系统管理子页面也高亮"系统"）
  const activeTab = (() => {
    if (systemPaths.some(p => currentPath === p || currentPath.startsWith(p + '/'))) return '/system';
    const match = tabMenus.find(t => currentPath === t.path || currentPath.startsWith(t.path + '/'));
    return match ? match.path : tabMenus[0]?.path || '/home';
  })();

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
        {tabMenus.map((tab) => {
          const isActive = activeTab === tab.path;
          return (
            <button
              key={tab.id}
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
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

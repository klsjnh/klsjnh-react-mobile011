/**
 * 应用根组件（完整路由）
 */
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './components/MainLayout';
import { useIsAuthenticated } from './stores/authStore';
import { menuStore } from './stores/menuStore';

// 懒加载所有页面
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const UserListPage = lazy(() => import('./pages/UserListPage').then(m => ({ default: m.UserListPage })));
const UserDetailPage = lazy(() => import('./pages/UserDetailPage').then(m => ({ default: m.UserDetailPage })));
const UserFormPage = lazy(() => import('./pages/UserFormPage').then(m => ({ default: m.UserFormPage })));
const RoleListPage = lazy(() => import('./pages/RoleListPage').then(m => ({ default: m.RoleListPage })));
const RoleFormPage = lazy(() => import('./pages/RoleFormPage').then(m => ({ default: m.RoleFormPage })));
const MenuListPage = lazy(() => import('./pages/MenuListPage').then(m => ({ default: m.MenuListPage })));
const MenuFormPage = lazy(() => import('./pages/MenuFormPage').then(m => ({ default: m.MenuFormPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const HelpPage = lazy(() => import('./pages/HelpPage').then(m => ({ default: m.HelpPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PermissionsPage = lazy(() => import('./pages/PermissionsPage').then(m => ({ default: m.PermissionsPage })));
const PermissionRelationPage = lazy(() => import('./pages/PermissionRelationPage').then(m => ({ default: m.PermissionRelationPage })));
const DepartmentPage = lazy(() => import('./pages/DepartmentPage').then(m => ({ default: m.DepartmentPage })));
const SystemPage = lazy(() => import('./pages/SystemPage').then(m => ({ default: m.SystemPage })));
const BusinessPage = lazy(() => import('./pages/BusinessPage').then(m => ({ default: m.BusinessPage })));
const BusinessPlaceholderPage = lazy(() => import('./pages/BusinessPlaceholderPage').then(m => ({ default: m.BusinessPlaceholderPage })));

export const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/home';
  });

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', `#${path}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || '/home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    // 用户详情
    if (currentPath.match(/^\/user\/\d+$/)) {
      const id = Number(currentPath.split('/')[2]);
      return <UserDetailPage userId={id} onBack={() => handleNavigate('/users')} onDeleted={() => handleNavigate('/users')} />;
    }
    // 新建用户
    if (currentPath === '/user/create') {
      return <UserFormPage onBack={() => handleNavigate('/users')} onSaved={() => handleNavigate('/users')} />;
    }
    // 编辑用户
    if (currentPath.match(/^\/user\/edit\/\d+$/)) {
      const id = Number(currentPath.split('/')[3]);
      return <UserFormPage userId={id} onBack={() => handleNavigate(`/user/${id}`)} onSaved={() => handleNavigate(`/user/${id}`)} />;
    }
    // 角色编辑
    if (currentPath.match(/^\/role\/\d+$/)) {
      const id = Number(currentPath.split('/')[2]);
      return <RoleFormPage roleId={id} onBack={() => handleNavigate('/roles')} onSaved={() => handleNavigate('/roles')} />;
    }
    // 新建角色
    if (currentPath === '/role/create') {
      return <RoleFormPage onBack={() => handleNavigate('/roles')} onSaved={() => handleNavigate('/roles')} />;
    }
    // 菜单编辑
    if (currentPath.match(/^\/menu\/\d+$/)) {
      const id = Number(currentPath.split('/')[2]);
      return <MenuFormPage menuId={id} onBack={() => handleNavigate('/menus')} onSaved={() => handleNavigate('/menus')} />;
    }
    // 新建菜单
    if (currentPath === '/menu/create') {
      return <MenuFormPage onBack={() => handleNavigate('/menus')} onSaved={() => handleNavigate('/menus')} />;
    }

    // 业务功能占位页（/business/*）
    if (currentPath.startsWith('/business/')) {
      const title = currentPath.split('/')[2] || '';
      const titleMap: Record<string, string> = {
        config: '配置管理', scheduler: '定时任务', datasource: '数据源管理',
        storage: '存储中心', params: '参数设置', dict: '字典管理',
        template: '通知模板', push: '消息推送', stats: '数据统计',
        trend: '趋势分析', charts: '图表展示', export: '数据导出',
        dashboard: '数据大屏', calc: '数据计算', query: '数据查询',
        monitor: '系统监控', online: '在线用户', cache: '缓存管理',
        servicelog: '服务日志',
      };
      return <BusinessPlaceholderPage title={titleMap[title] || '业务功能'} path={currentPath} onBack={() => handleNavigate('/business')} />;
    }

    // 所有页面路由
    const pageMap: Record<string, React.FC<any>> = {
      '/home': HomePage,
      '/system': SystemPage,
      '/business': BusinessPage,
      '/users': UserListPage,
      '/roles': RoleListPage,
      '/menus': MenuListPage,
      '/profile': ProfilePage,
      '/reports': ReportsPage,
      '/notifications': NotificationsPage,
      '/settings': SettingsPage,
      '/audit': AuditLogsPage,
      '/help': HelpPage,
      '/about': AboutPage,
      '/permissions': PermissionsPage,
      '/permissions/relation': PermissionRelationPage,
      '/departments': DepartmentPage,
    };

    const PageComponent = pageMap[currentPath] || HomePage;
    return <PageComponent onBack={() => handleNavigate('/home')} onNavigate={handleNavigate} />;
  };

  return (
    <MainLayout currentPath={currentPath} onNavigate={handleNavigate}>
      <Suspense fallback={<div className="loading-state">加载中...</div>}>
        {renderPage()}
      </Suspense>
    </MainLayout>
  );
};

/**
 * 菜单配置 Mock（动态导航数据源）
 */
import type { MenuConfig } from '../stores/menuStore';

// ==================== 初始菜单配置 ====================

const initialMenuConfig: MenuConfig[] = [
  {
    id: 1, parentId: 0, name: 'TabBar', path: '/tabbar', icon: '', title: '底部导航', type: 'page', sort: 0, visible: false,
    children: [
      { id: 101, parentId: 1, name: 'Home', path: '/home', icon: '🏠', title: '首页', type: 'tab', sort: 1, visible: true },
      { id: 102, parentId: 1, name: 'System', path: '/system', icon: '⚙️', title: '系统', type: 'tab', sort: 2, visible: true },
      { id: 103, parentId: 1, name: 'Business', path: '/business', icon: '💼', title: '业务', type: 'tab', sort: 3, visible: true },
      { id: 104, parentId: 1, name: 'Reports', path: '/reports', icon: '📊', title: '报表', type: 'tab', sort: 4, visible: true },
      { id: 105, parentId: 1, name: 'Profile', path: '/profile', icon: '👤', title: '我的', type: 'tab', sort: 5, visible: true },
    ],
  },
  {
    id: 2, parentId: 0, name: 'SystemChildren', path: '/system', icon: '', title: '系统管理', type: 'page', sort: 1, visible: false,
    children: [
      { id: 201, parentId: 2, name: 'Departments', path: '/departments', icon: '🏢', title: '组织管理', type: 'page', sort: 1, visible: true },
      { id: 202, parentId: 2, name: 'Users', path: '/users', icon: '👥', title: '用户管理', type: 'page', sort: 2, visible: true },
      { id: 203, parentId: 2, name: 'Roles', path: '/roles', icon: '🛡', title: '角色管理', type: 'page', sort: 3, visible: true },
      { id: 204, parentId: 2, name: 'Permissions', path: '/permissions', icon: '🔑', title: '权限管理', type: 'page', sort: 4, visible: true },
      { id: 205, parentId: 2, name: 'Menus', path: '/menus', icon: '📋', title: '菜单管理', type: 'page', sort: 5, visible: true },
      { id: 206, parentId: 2, name: 'PermRelation', path: '/permissions/relation', icon: '🔗', title: '权限关联', type: 'page', sort: 6, visible: true },
      { id: 207, parentId: 2, name: 'Settings', path: '/settings', icon: '⚙️', title: '系统设置', type: 'page', sort: 7, visible: true },
      { id: 208, parentId: 2, name: 'Audit', path: '/audit', icon: '📝', title: '审计日志', type: 'page', sort: 8, visible: true },
    ],
  },
  {
    id: 3, parentId: 0, name: 'BusinessChildren', path: '/business', icon: '', title: '业务中心', type: 'page', sort: 2, visible: false,
    children: [
      { id: 301, parentId: 3, name: 'Config', path: '/business/config', icon: '⚙️', title: '配置管理', type: 'page', sort: 1, visible: true },
      { id: 302, parentId: 3, name: 'Scheduler', path: '/business/scheduler', icon: '⏰', title: '定时任务', type: 'page', sort: 2, visible: true },
      { id: 303, parentId: 3, name: 'Datasource', path: '/business/datasource', icon: '🗄', title: '数据源', type: 'page', sort: 3, visible: true },
      { id: 304, parentId: 3, name: 'Storage', path: '/business/storage', icon: '💾', title: '存储中心', type: 'page', sort: 4, visible: true },
      { id: 305, parentId: 3, name: 'Params', path: '/business/params', icon: '📜', title: '参数设置', type: 'page', sort: 5, visible: true },
      { id: 306, parentId: 3, name: 'Dict', path: '/business/dict', icon: '📖', title: '字典管理', type: 'page', sort: 6, visible: true },
      { id: 307, parentId: 3, name: 'Template', path: '/business/template', icon: '✉️', title: '通知模板', type: 'page', sort: 7, visible: true },
      { id: 308, parentId: 3, name: 'Push', path: '/business/push', icon: '📣', title: '消息推送', type: 'page', sort: 8, visible: true },
      { id: 309, parentId: 3, name: 'Stats', path: '/business/stats', icon: '📊', title: '数据统计', type: 'page', sort: 9, visible: true },
      { id: 310, parentId: 3, name: 'Trend', path: '/business/trend', icon: '📈', title: '趋势分析', type: 'page', sort: 10, visible: true },
      { id: 311, parentId: 3, name: 'Charts', path: '/business/charts', icon: '🎛', title: '图表展示', type: 'page', sort: 11, visible: true },
      { id: 312, parentId: 3, name: 'Export', path: '/business/export', icon: '📤', title: '数据导出', type: 'page', sort: 12, visible: true },
      { id: 313, parentId: 3, name: 'Dashboard', path: '/business/dashboard', icon: '🖥', title: '数据大屏', type: 'page', sort: 13, visible: true },
      { id: 314, parentId: 3, name: 'Calc', path: '/business/calc', icon: '🧮', title: '数据计算', type: 'page', sort: 14, visible: true },
      { id: 315, parentId: 3, name: 'Query', path: '/business/query', icon: '🔍', title: '数据查询', type: 'page', sort: 15, visible: true },
      { id: 316, parentId: 3, name: 'Monitor', path: '/business/monitor', icon: '📡', title: '系统监控', type: 'page', sort: 16, visible: true },
      { id: 317, parentId: 3, name: 'Online', path: '/business/online', icon: '👤', title: '在线用户', type: 'page', sort: 17, visible: true },
      { id: 318, parentId: 3, name: 'Cache', path: '/business/cache', icon: '🧹', title: '缓存管理', type: 'page', sort: 18, visible: true },
      { id: 319, parentId: 3, name: 'ServiceLog', path: '/business/servicelog', icon: '🔄', title: '服务日志', type: 'page', sort: 19, visible: true },
      { id: 320, parentId: 3, name: 'Notifications', path: '/notifications', icon: '🔔', title: '消息通知', type: 'page', sort: 20, visible: true },
    ],
  },
];

// ==================== 内存数据源 ====================

let menuConfigDB = JSON.parse(JSON.stringify(initialMenuConfig)) as MenuConfig[];
let nextMenuId = 1000;

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ==================== Mock API ====================

export const mockApi = {
  /** 获取菜单配置（供 menuStore 加载） */
  getMenuConfig: async () => {
    await delay();
    return { code: 0, data: JSON.parse(JSON.stringify(menuConfigDB)) as MenuConfig[], message: 'success' };
  },

  /** 保存菜单配置 */
  saveMenuConfig: async (menus: MenuConfig[]) => {
    await delay();
    menuConfigDB = JSON.parse(JSON.stringify(menus));
    return { code: 0, data: null, message: 'save success' };
  },

  /** 添加菜单 */
  addMenu: async (menu: Omit<MenuConfig, 'id'>) => {
    await delay(200);
    const maxId = Math.max(0, ...menuConfigDB.map((m) => m.id), ...menuConfigDB.flatMap((m) => (m.children || []).map((c) => c.id)));
    const newMenu: MenuConfig = { ...menu, id: maxId + 1 };
    if (newMenu.parentId === 0) {
      menuConfigDB.push(newMenu);
    } else {
      const addToParent = (items: MenuConfig[]): boolean => {
        for (const item of items) {
          if (item.id === newMenu.parentId) {
            if (!item.children) item.children = [];
            item.children.push(newMenu);
            return true;
          }
          if (item.children && addToParent(item.children)) return true;
        }
        return false;
      };
      addToParent(menuConfigDB);
    }
    return { code: 0, data: newMenu, message: 'insert success' };
  },

  /** 更新菜单 */
  updateMenu: async (id: number, data: Partial<MenuConfig>) => {
    await delay(200);
    const updateRecursive = (items: MenuConfig[]): boolean => {
      for (const item of items) {
        if (item.id === id) { Object.assign(item, data); return true; }
        if (item.children && updateRecursive(item.children)) return true;
      }
      return false;
    };
    updateRecursive(menuConfigDB);
    return { code: 0, data: null, message: 'update success' };
  },

  /** 删除菜单 */
  deleteMenu: async (id: number) => {
    await delay(200);
    const deleteRecursive = (items: MenuConfig[]): MenuConfig[] =>
      items.filter((item) => item.id !== id).map((item) => ({
        ...item,
        children: item.children ? deleteRecursive(item.children) : undefined,
      }));
    menuConfigDB = deleteRecursive(menuConfigDB);
    return { code: 0, data: null, message: 'delete success' };
  },

  /** 切换可见性 */
  toggleVisible: async (id: number) => {
    await delay(100);
    const toggleRecursive = (items: MenuConfig[]): boolean => {
      for (const item of items) {
        if (item.id === id) { item.visible = !item.visible; return true; }
        if (item.children && toggleRecursive(item.children)) return true;
      }
      return false;
    };
    toggleRecursive(menuConfigDB);
    return { code: 0, data: null, message: 'toggle success' };
  },
};

// Re-export types for convenience
export type { MenuItem, MenuConfig };

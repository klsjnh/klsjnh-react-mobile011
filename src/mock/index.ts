/**
 * Mock 数据层
 */

export interface User {
  id: number;
  username: string;
  realName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface Role {
  id: number;
  name: string;
  label: string;
  description: string;
  status: 'active' | 'inactive';
  userCount: number;
  permissions: string[];
  createdAt: string;
}

export interface MenuItem {
  id: number;
  parentId: number;
  name: string;
  path: string;
  icon: string;
  title: string;
  type: 'directory' | 'menu' | 'button';
  sort: number;
  children?: MenuItem[];
}

// ==================== Mock 数据 ====================

const departments = ['技术中心', '产品部', '运营部', '市场部', '财务部', '人力资源部'];
const rolesArr = ['admin', 'manager', 'editor', 'viewer'];

function generateUsers(count: number): User[] {
  const users: User[] = [];
  const statuses: User['status'][] = ['active', 'active', 'active', 'inactive', 'locked'];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      username: `user${String(i).padStart(3, '0')}`,
      realName: `用户${i}`,
      email: `user${i}@enterprise.com`,
      phone: `138${String(i).padStart(8, '0').slice(0, 8)}`,
      department: departments[i % departments.length],
      role: rolesArr[i % rolesArr.length],
      status: statuses[i % statuses.length],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
      createdAt: `2026-${String((i % 9) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      lastLoginAt: `2026-09-${String((i % 12) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
    });
  }
  return users;
}

const mockUsers = generateUsers(56);

const mockRoles: Role[] = [
  { id: 1, name: 'admin', label: '超级管理员', description: '拥有系统全部权限', status: 'active', userCount: 3, permissions: ['system:user:*', 'system:role:*', 'system:menu:*'], createdAt: '2026-01-01' },
  { id: 2, name: 'manager', label: '部门经理', description: '管理部门内用户', status: 'active', userCount: 12, permissions: ['system:user:list', 'system:user:create'], createdAt: '2026-02-15' },
  { id: 3, name: 'editor', label: '编辑人员', description: '负责内容编辑与发布', status: 'active', userCount: 28, permissions: ['system:user:list'], createdAt: '2026-03-01' },
  { id: 4, name: 'viewer', label: '只读用户', description: '仅可查看数据', status: 'active', userCount: 45, permissions: ['dashboard:view'], createdAt: '2026-04-10' },
  { id: 5, name: 'auditor', label: '审计员', description: '查看审计日志', status: 'inactive', userCount: 0, permissions: ['audit:view'], createdAt: '2026-05-20' },
];

const mockMenus: MenuItem[] = [
  { id: 1, parentId: 0, name: 'Dashboard', path: '/home', icon: '📊', title: '仪表盘', type: 'menu', sort: 1 },
  { id: 2, parentId: 0, name: 'System', path: '/system', icon: '⚙️', title: '系统管理', type: 'directory', sort: 2, children: [
    { id: 21, parentId: 2, name: 'UserList', path: '/system/user', icon: '👥', title: '用户管理', type: 'menu', sort: 1 },
    { id: 22, parentId: 2, name: 'RoleList', path: '/system/role', icon: '🛡', title: '角色管理', type: 'menu', sort: 2 },
    { id: 23, parentId: 2, name: 'MenuList', path: '/system/menu', icon: '📋', title: '菜单管理', type: 'menu', sort: 3 },
  ]},
  { id: 3, parentId: 0, name: 'Audit', path: '/audit', icon: '📝', title: '审计日志', type: 'directory', sort: 3, children: [
    { id: 31, parentId: 3, name: 'LoginLog', path: '/audit/login', icon: '🔓', title: '登录日志', type: 'menu', sort: 1 },
    { id: 32, parentId: 3, name: 'OperationLog', path: '/audit/operation', icon: '📋', title: '操作日志', type: 'menu', sort: 2 },
  ]},
];

// ==================== Mock API ====================

function delay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms + Math.random() * 400));
}

export const mockApi = {
  // 登录
  login: async (username: string, password: string) => {
    await delay();
    const users: Record<string, string> = { admin: 'admin123', manager: 'manager123', user: 'user123' };
    if (users[username] && users[username] === password) {
      return { code: 0, data: { token: `mock-${Date.now()}`, user: { id: 1, username, realName: username === 'admin' ? '超级管理员' : username === 'manager' ? '部门经理' : '普通员工', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, roles: [username] } }, message: 'success' };
    }
    return { code: 1, data: null, message: '用户名或密码错误' };
  },

  // 用户列表
  getUserList: async (params: { keyword?: string; status?: string; page?: number; pageSize?: number } = {}) => {
    await delay(400);
    let filtered = [...mockUsers];
    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(u => u.username.includes(kw) || u.realName.includes(kw) || u.email.includes(kw));
    }
    if (params.status) filtered = filtered.filter(u => u.status === params.status);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    return { code: 0, data: { list: filtered.slice(start, start + pageSize), total: filtered.length }, message: 'success' };
  },

  // 用户详情
  getUserDetail: async (id: number) => {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    return { code: 0, data: user || null, message: 'success' };
  },

  // 角色列表
  getRoleList: async () => {
    await delay(400);
    return { code: 0, data: mockRoles, message: 'success' };
  },

  // 菜单树
  getMenuTree: async () => {
    await delay(300);
    return { code: 0, data: mockMenus, message: 'success' };
  },

  // 统计数据
  getStats: async () => {
    await delay(300);
    return { code: 0, data: { totalUsers: 12480, totalOrders: 86532, revenue: 2865000, activeRate: 68.5 }, message: 'success' };
  },
};

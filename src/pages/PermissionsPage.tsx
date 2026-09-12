/**
 * 权限管理页 - 移动端（权限树 + 角色分配）
 */
import React, { useState } from 'react';
import { PageHeader, ConfirmDialog } from '../components';

interface PermissionsPageProps {
  onBack?: () => void;
  onNavigate?: (path: string) => void;
}

interface PermissionNode {
  id: string;
  key: string;
  label: string;
  description: string;
  children?: PermissionNode[];
}

interface RolePermission {
  roleId: number;
  roleName: string;
  permissions: string[];
}

export const PermissionsPage: React.FC<PermissionsPageProps> = ({ onBack, onNavigate }) => {
  void onNavigate;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedRole, setSelectedRole] = useState<number>(1);
  const [dialog, setDialog] = useState({ visible: false });

  const permissionTree: PermissionNode[] = [
    {
      id: 'dashboard',
      key: 'dashboard',
      label: '仪表盘',
      description: '访问仪表盘页面',
      children: [
        { id: 'dashboard-view', key: 'dashboard:view', label: '查看仪表盘', description: '查看统计数据和图表' },
        { id: 'dashboard-export', key: 'dashboard:export', label: '导出报表', description: '导出数据报表' },
      ],
    },
    {
      id: 'system',
      key: 'system',
      label: '系统管理',
      description: '系统管理模块',
      children: [
        {
          id: 'system-user',
          key: 'system:user',
          label: '用户管理',
          description: '管理用户账号',
          children: [
            { id: 'system-user-list', key: 'system:user:list', label: '查看列表', description: '查看用户列表' },
            { id: 'system-user-create', key: 'system:user:create', label: '创建用户', description: '创建新用户' },
            { id: 'system-user-update', key: 'system:user:update', label: '编辑用户', description: '编辑用户信息' },
            { id: 'system-user-delete', key: 'system:user:delete', label: '删除用户', description: '删除用户' },
          ],
        },
        {
          id: 'system-role',
          key: 'system:role',
          label: '角色管理',
          description: '管理系统角色',
          children: [
            { id: 'system-role-list', key: 'system:role:list', label: '查看列表', description: '查看角色列表' },
            { id: 'system-role-create', key: 'system:role:create', label: '创建角色', description: '创建新角色' },
            { id: 'system-role-update', key: 'system:role:update', label: '编辑角色', description: '编辑角色信息' },
            { id: 'system-role-delete', key: 'system:role:delete', label: '删除角色', description: '删除角色' },
          ],
        },
        {
          id: 'system-menu',
          key: 'system:menu',
          label: '菜单管理',
          description: '管理系统菜单',
          children: [
            { id: 'system-menu-list', key: 'system:menu:list', label: '查看列表', description: '查看菜单列表' },
            { id: 'system-menu-create', key: 'system:menu:create', label: '创建菜单', description: '创建新菜单' },
            { id: 'system-menu-update', key: 'system:menu:update', label: '编辑菜单', description: '编辑菜单' },
            { id: 'system-menu-delete', key: 'system:menu:delete', label: '删除菜单', description: '删除菜单' },
          ],
        },
      ],
    },
    {
      id: 'audit',
      key: 'audit',
      label: '审计日志',
      description: '查看系统审计日志',
      children: [
        { id: 'audit-login', key: 'audit:login:view', label: '登录日志', description: '查看用户登录日志' },
        { id: 'audit-operation', key: 'audit:operation:view', label: '操作日志', description: '查看用户操作日志' },
        { id: 'audit-export', key: 'audit:export', label: '导出日志', description: '导出审计日志' },
      ],
    },
    {
      id: 'organization',
      key: 'organization',
      label: '组织管理',
      description: '管理部门和组织架构',
      children: [
        { id: 'organization-view', key: 'organization:view', label: '查看组织', description: '查看组织架构' },
        { id: 'organization-manage', key: 'organization:manage', label: '管理组织', description: '管理部门' },
      ],
    },
  ];

  const roles: RolePermission[] = [
    { roleId: 1, roleName: '超级管理员', permissions: ['dashboard', 'dashboard-view', 'dashboard-export', 'system', 'system-user', 'system-user-list', 'system-user-create', 'system-user-update', 'system-user-delete', 'system-role', 'system-role-list', 'system-role-create', 'system-role-update', 'system-role-delete', 'system-menu', 'system-menu-list', 'system-menu-create', 'system-menu-update', 'system-menu-delete', 'audit', 'audit-login', 'audit-operation', 'audit-export', 'organization', 'organization-view', 'organization-manage'] },
    { roleId: 2, roleName: '部门经理', permissions: ['dashboard', 'dashboard-view', 'dashboard-export', 'system', 'system-user', 'system-user-list', 'system-user-create', 'system-user-update', 'audit', 'audit-login', 'audit-operation', 'organization', 'organization-view'] },
    { roleId: 3, roleName: '编辑人员', permissions: ['dashboard', 'dashboard-view', 'system', 'system-user', 'system-user-list'] },
    { roleId: 4, roleName: '只读用户', permissions: ['dashboard', 'dashboard-view'] },
    { roleId: 5, roleName: '审计员', permissions: ['dashboard', 'dashboard-view', 'audit', 'audit-login', 'audit-operation', 'audit-export'] },
  ];

  const currentRole = roles.find(r => r.roleId === selectedRole)!;

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isPermissionChecked = (key: string) => currentRole.permissions.includes(key);

  const getPermissionCount = (node: PermissionNode): number => {
    if (!node.children) return 1;
    return node.children.reduce((sum, child) => sum + getPermissionCount(child), 0);
  };

  const getCheckedCount = (node: PermissionNode): number => {
    if (!node.children) return isPermissionChecked(node.key) ? 1 : 0;
    return node.children.reduce((sum, child) => sum + getCheckedCount(child), 0);
  };

  const renderPermissionNode = (node: PermissionNode, depth = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const checked = isPermissionChecked(node.key);
    const totalPerms = getPermissionCount(node);
    const checkedPerms = getCheckedCount(node);

    return (
      <React.Fragment key={node.id}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', paddingLeft: `${14 + depth * 16}px`,
            background: depth === 0 ? '#fafafa' : 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(node.id)} style={{ background: 'none', border: 'none', fontSize: '10px', cursor: 'pointer', padding: '0 4px', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▶</button>
          ) : (
            <span style={{ width: '18px' }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: depth === 0 ? 600 : 400 }}>{node.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{node.description}</div>
          </div>
          {hasChildren && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: '#f5f5f5', padding: '2px 8px', borderRadius: '10px' }}>
              {checkedPerms}/{totalPerms}
            </span>
          )}
          <input
            type="checkbox"
            checked={checked}
            readOnly
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
          />
        </div>
        {hasChildren && isExpanded && node.children!.map(child => renderPermissionNode(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="权限管理"
        subtitle="角色权限分配"
        onBack={onBack}
        right={
          <button
            onClick={() => setDialog({ visible: true })}
            style={{
              height: '32px', padding: '0 12px',
              background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)',
              fontSize: '12px', cursor: 'pointer',
            }}
          >
            保存配置
          </button>
        }
      />

      {/* 角色选择 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '14px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>选择角色</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {roles.map((role) => (
            <button
              key={role.roleId}
              onClick={() => setSelectedRole(role.roleId)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '12px',
                border: '1px solid ' + (selectedRole === role.roleId ? 'var(--primary)' : 'var(--border)'),
                background: selectedRole === role.roleId ? '#e6f7ff' : '#fff',
                color: selectedRole === role.roleId ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {role.roleName}
              <span style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.7 }}>
                ({role.permissions.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 权限树 */}
      <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {permissionTree.map(node => renderPermissionNode(node))}
      </div>

      {/* 图例 */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span>✅ 已授权</span>
        <span>⬜ 未授权</span>
        <span>📁 点击展开/折叠</span>
      </div>

      <ConfirmDialog
        visible={dialog.visible}
        title="保存配置"
        content={`确定要保存「${currentRole.roleName}」的权限配置吗？`}
        onConfirm={() => setDialog({ visible: false })}
        onCancel={() => setDialog({ visible: false })}
        confirmText="保存"
      />
    </div>
  );
};

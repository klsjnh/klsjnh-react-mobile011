/**
 * 权限关联总览页 - 移动端
 * 展示：菜单 → 权限 → 角色 → 用户 的完整关联链路
 */
import React, { useState } from 'react';
import { PageHeader } from '../components';

interface PermissionRelationPageProps {
  onBack?: () => void;
  onNavigate?: (path: string) => void;
}

export const PermissionRelationPage: React.FC<PermissionRelationPageProps> = ({ onBack, onNavigate }) => {
  void onNavigate;
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'role' | 'user'>('menu');

  // 菜单 → 权限映射
  const menuPermissions: Record<string, { name: string; icon: string; permissions: { key: string; label: string }[] }> = {
    '仪表盘': {
      name: '仪表盘',
      icon: '📊',
      permissions: [
        { key: 'dashboard:view', label: '查看仪表盘' },
        { key: 'dashboard:export', label: '导出报表' },
      ],
    },
    '用户管理': {
      name: '用户管理',
      icon: '👥',
      permissions: [
        { key: 'system:user:list', label: '查看列表' },
        { key: 'system:user:create', label: '创建用户' },
        { key: 'system:user:update', label: '编辑用户' },
        { key: 'system:user:delete', label: '删除用户' },
      ],
    },
    '角色管理': {
      name: '角色管理',
      icon: '🛡',
      permissions: [
        { key: 'system:role:list', label: '查看列表' },
        { key: 'system:role:create', label: '创建角色' },
        { key: 'system:role:update', label: '编辑角色' },
        { key: 'system:role:delete', label: '删除角色' },
      ],
    },
    '菜单管理': {
      name: '菜单管理',
      icon: '📋',
      permissions: [
        { key: 'system:menu:list', label: '查看列表' },
        { key: 'system:menu:create', label: '创建菜单' },
        { key: 'system:menu:update', label: '编辑菜单' },
        { key: 'system:menu:delete', label: '删除菜单' },
      ],
    },
    '审计日志': {
      name: '审计日志',
      icon: '📝',
      permissions: [
        { key: 'audit:login:view', label: '登录日志' },
        { key: 'audit:operation:view', label: '操作日志' },
        { key: 'audit:export', label: '导出日志' },
      ],
    },
    '部门管理': {
      name: '部门管理',
      icon: '🏢',
      permissions: [
        { key: 'organization:view', label: '查看组织' },
        { key: 'organization:manage', label: '管理部门' },
      ],
    },
  };

  // 角色 → 权限映射
  const rolePermissions: Record<string, { label: string; icon: string; color: string; permissions: string[] }> = {
    '超级管理员': { label: '超级管理员', icon: '👑', color: '#f5222d', permissions: ['dashboard:view', 'dashboard:export', 'system:user:list', 'system:user:create', 'system:user:update', 'system:user:delete', 'system:role:list', 'system:role:create', 'system:role:update', 'system:role:delete', 'system:menu:list', 'system:menu:create', 'system:menu:update', 'system:menu:delete', 'audit:login:view', 'audit:operation:view', 'audit:export', 'organization:view', 'organization:manage'] },
    '部门经理': { label: '部门经理', icon: '🛡', color: '#1890ff', permissions: ['dashboard:view', 'dashboard:export', 'system:user:list', 'system:user:create', 'system:user:update', 'audit:login:view', 'audit:operation:view', 'organization:view'] },
    '编辑人员': { label: '编辑人员', icon: '✏️', color: '#52c41a', permissions: ['dashboard:view', 'system:user:list'] },
    '只读用户': { label: '只读用户', icon: '👁', color: '#8c8c8c', permissions: ['dashboard:view'] },
    '审计员': { label: '审计员', icon: '🔍', color: '#722ed1', permissions: ['dashboard:view', 'audit:login:view', 'audit:operation:view', 'audit:export'] },
  };

  // 用户 → 角色映射
  const userRoles: Record<string, { realName: string; roles: string[] }> = {
    'admin': { realName: '张三', roles: ['超级管理员'] },
    'manager': { realName: '李四', roles: ['部门经理'] },
    'editor01': { realName: '王五', roles: ['编辑人员'] },
    'viewer01': { realName: '赵六', roles: ['只读用户'] },
    'auditor': { realName: '孙七', roles: ['审计员'] },
    'user001': { realName: '周八', roles: ['编辑人员', '审计员'] },
  };

  // 角色组
  const roleGroups = [
    { name: '管理层', roles: ['超级管理员', '部门经理'], color: '#f5222d' },
    { name: '执行层', roles: ['编辑人员', '审计员'], color: '#52c41a' },
    { name: '观察层', roles: ['只读用户'], color: '#8c8c8c' },
  ];

  const selectedPerms = selectedMenu ? menuPermissions[selectedMenu]?.permissions || [] : [];

  return (
    <div className="page">
      <PageHeader title="权限关联" subtitle="菜单-权限-角色-用户 关系总览" onBack={onBack} />

      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {([['menu', '菜单→权限'], ['role', '角色→权限'], ['user', '用户→角色']] as [typeof activeTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1, height: '36px',
              background: activeTab === key ? 'var(--primary)' : 'transparent',
              color: activeTab === key ? '#fff' : 'var(--text-secondary)',
              border: 'none', borderRadius: '6px',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 菜单 → 权限 */}
      {activeTab === 'menu' && (
        <>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-muted)' }}>点击菜单查看关联权限</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {Object.entries(menuPermissions).map(([key, menu]) => (
              <button
                key={key}
                onClick={() => setSelectedMenu(selectedMenu === key ? null : key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  border: '1px solid ' + (selectedMenu === key ? 'var(--primary)' : 'var(--border)'),
                  background: selectedMenu === key ? '#e6f7ff' : '#fff',
                  color: selectedMenu === key ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {menu.icon} {menu.name}
              </button>
            ))}
          </div>

          {selectedMenu && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>{menuPermissions[selectedMenu].icon}</span>
                <span style={{ fontSize: '16px', fontWeight: 600 }}>{selectedMenu}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>关联权限（{selectedPerms.length} 项）</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedPerms.map((perm) => (
                  <span key={perm.key} style={{
                    padding: '6px 12px', background: '#e6f7ff', color: '#1890ff',
                    borderRadius: '16px', fontSize: '12px',
                  }}>
                    {perm.label}
                  </span>
                ))}
              </div>
              {/* 哪些角色拥有这些权限 */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>拥有此菜单权限的角色</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(rolePermissions)
                    .filter(([_, role]) => selectedPerms.some(p => role.permissions.includes(p.key)))
                    .map(([key, role]) => (
                      <span key={key} style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
                        background: role.color + '20', color: role.color,
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        {role.icon} {role.label}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 角色 → 权限 */}
      {activeTab === 'role' && (
        <>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-muted)' }}>点击角色查看关联权限</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(rolePermissions).map(([key, role]) => (
              <div key={key} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{role.icon}</span>
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>{role.label}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: role.color + '20', color: role.color }}>
                    {role.permissions.length} 项权限
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {role.permissions.slice(0, 8).map((perm) => (
                    <span key={perm} style={{ padding: '2px 8px', background: '#f5f7fa', borderRadius: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {perm}
                    </span>
                  ))}
                  {role.permissions.length > 8 && (
                    <span style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--text-muted)' }}>+{role.permissions.length - 8}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 角色组 */}
          <div style={{ fontSize: '13px', fontWeight: 600, margin: '16px 0 10px', color: 'var(--text-muted)' }}>角色组</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {roleGroups.map((group) => (
              <div key={group.name} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: group.color }} />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{group.name}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {group.roles.map((role) => {
                    const r = rolePermissions[role];
                    return r ? (
                      <span key={role} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: r.color + '20', color: r.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {r.icon} {r.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 用户 → 角色 */}
      {activeTab === 'user' && (
        <>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-muted)' }}>用户与角色对应关系</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(userRoles).map(([key, user]) => (
              <div key={key} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: '#e6f7ff', color: '#1890ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 600,
                  }}>
                    {user.realName[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.realName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{key}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {user.roles.map((role) => {
                      const r = rolePermissions[role];
                      return r ? (
                        <span key={role} style={{
                          padding: '3px 8px', borderRadius: '10px', fontSize: '10px',
                          background: r.color + '20', color: r.color,
                        }}>
                          {r.icon} {r.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 关系链路图 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginTop: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>关联链路</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { icon: '📋', label: '菜单', color: '#1890ff' },
            { icon: '→', label: '', color: '' },
            { icon: '🔑', label: '权限', color: '#faad14' },
            { icon: '→', label: '', color: '' },
            { icon: '🛡', label: '角色', color: '#52c41a' },
            { icon: '→', label: '', color: '' },
            { icon: '👤', label: '用户', color: '#722ed1' },
          ].map((item, index) => (
            item.label ? (
              <div key={index} style={{
                padding: '6px 12px', borderRadius: '16px',
                background: item.color + '20', color: item.color,
                fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {item.icon} {item.label}
              </div>
            ) : (
              <span key={index} style={{ fontSize: '16px', color: 'var(--text-muted)' }}>{item.icon}</span>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 角色新建/编辑表单页 - 移动端
 */
import React, { useState, useEffect } from 'react';
import { mockApi, Role } from '../mock';
import { PageHeader } from '../components';

interface RoleFormPageProps {
  roleId?: number;
  onBack: () => void;
  onSaved?: () => void;
}

export const RoleFormPage: React.FC<RoleFormPageProps> = ({ roleId, onBack, onSaved }) => {
  const isEdit = !!roleId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Role>>({ name: '', label: '', description: '', permissions: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (roleId) {
      mockApi.getRoleList().then(res => {
        if (res.code === 0) {
          const role = res.data.find(r => r.id === roleId);
          if (role) setForm(role);
        }
        setLoading(false);
      });
    }
  }, [roleId]);

  const allPermissions = [
    { key: 'dashboard:view', label: '仪表盘' },
    { key: 'system:user:list', label: '查看用户' },
    { key: 'system:user:create', label: '创建用户' },
    { key: 'system:user:update', label: '编辑用户' },
    { key: 'system:user:delete', label: '删除用户' },
    { key: 'system:role:list', label: '查看角色' },
    { key: 'system:role:create', label: '创建角色' },
    { key: 'system:role:update', label: '编辑角色' },
    { key: 'system:role:delete', label: '删除角色' },
    { key: 'system:menu:list', label: '查看菜单' },
    { key: 'audit:login:view', label: '登录日志' },
    { key: 'audit:operation:view', label: '操作日志' },
  ];

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = '请输入角色标识';
    else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(form.name)) e.name = '格式不正确（字母/下划线）';
    if (!form.label?.trim()) e.label = '请输入角色名称';
    if (!form.description?.trim()) e.description = '请输入角色描述';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    if (onSaved) onSaved();
    onBack();
  };

  const togglePermission = (key: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions?.includes(key)
        ? f.permissions.filter(p => p !== key)
        : [...(f.permissions || []), key],
    }));
  };

  if (loading) return <div className="loading-state">加载中...</div>;

  return (
    <div className="page">
      <PageHeader title={isEdit ? '编辑角色' : '新建角色'} onBack={onBack} />

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>角色标识 *</div>
            <input
              style={{ width: '100%', height: '40px', padding: '0 12px', border: errors.name ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none' }}
              placeholder="如：admin, manager"
              value={form.name || ''}
              disabled={isEdit}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            />
            {errors.name && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.name}</div>}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>角色名称 *</div>
            <input
              style={{ width: '100%', height: '40px', padding: '0 12px', border: errors.label ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none' }}
              placeholder="如：超级管理员"
              value={form.label || ''}
              onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
            />
            {errors.label && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.label}</div>}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>角色描述 *</div>
            <textarea
              style={{ width: '100%', height: '80px', padding: '12px', border: errors.description ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none', resize: 'none' }}
              placeholder="请输入角色描述"
              value={form.description || ''}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            />
            {errors.description && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.description}</div>}
          </div>
        </div>
      </div>

      {/* 权限分配 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>权限分配</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allPermissions.map((perm) => {
            const checked = form.permissions?.includes(perm.key);
            return (
              <button
                key={perm.key}
                onClick={() => togglePermission(perm.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  border: '1px solid ' + (checked ? 'var(--primary)' : 'var(--border)'),
                  background: checked ? '#e6f7ff' : '#fff',
                  color: checked ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {perm.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onBack} style={{ flex: 1, height: '40px', background: '#fff', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>取消</button>
        <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '40px', background: saving ? '#a0c4ff' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
};

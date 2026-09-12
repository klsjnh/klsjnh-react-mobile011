/**
 * 菜单新建/编辑表单页 - 移动端
 */
import React, { useState, useEffect } from 'react';
import { mockApi, MenuItem } from '../mock';
import { PageHeader } from '../components';

interface MenuFormPageProps {
  menuId?: number;
  onBack: () => void;
  onSaved?: () => void;
}

export const MenuFormPage: React.FC<MenuFormPageProps> = ({ menuId, onBack, onSaved }) => {
  const isEdit = !!menuId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<MenuItem>>({ title: '', name: '', path: '', icon: '', type: 'menu', sort: 1, parentId: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (menuId) {
      mockApi.getMenuTree().then(res => {
        if (res.code === 0) {
          const findMenu = (items: MenuItem[]): MenuItem | null => {
            for (const item of items) {
              if (item.id === menuId) return item;
              if (item.children) {
                const found = findMenu(item.children);
                if (found) return found;
              }
            }
            return null;
          };
          const menu = findMenu(res.data);
          if (menu) setForm(menu);
        }
        setLoading(false);
      });
    }
  }, [menuId]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = '请输入菜单标题';
    if (!form.name?.trim()) e.name = '请输入路由名称';
    if (form.type === 'menu' && !form.path?.trim()) e.path = '请输入路由路径';
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

  if (loading) return <div className="loading-state">加载中...</div>;

  const iconOptions = ['📊', '👥', '🛡', '📋', '⚙️', '🔔', '📝', '🔑', '🏠', '📦', '💬', '🎯'];

  return (
    <div className="page">
      <PageHeader title={isEdit ? '编辑菜单' : '新建菜单'} onBack={onBack} />

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>菜单类型 *</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {([['directory', '目录'], ['menu', '菜单'], ['button', '按钮']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setForm(f => ({ ...f, type: val }))}
                  style={{
                    flex: 1, height: '36px',
                    background: form.type === val ? '#e6f7ff' : '#fff',
                    border: '1px solid ' + (form.type === val ? 'var(--primary)' : 'var(--border)'),
                    borderRadius: 'var(--radius)', fontSize: '13px',
                    color: form.type === val ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>菜单标题 *</div>
            <input
              style={{ width: '100%', height: '40px', padding: '0 12px', border: errors.title ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none' }}
              placeholder="请输入菜单标题"
              value={form.title || ''}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            />
            {errors.title && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.title}</div>}
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>路由名称 *</div>
            <input
              style={{ width: '100%', height: '40px', padding: '0 12px', border: errors.name ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none' }}
              placeholder="如：UserList"
              value={form.name || ''}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            />
            {errors.name && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.name}</div>}
          </div>

          {form.type === 'menu' && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>路由路径 *</div>
              <input
                style={{ width: '100%', height: '40px', padding: '0 12px', border: errors.path ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none' }}
                placeholder="/system/user"
                value={form.path || ''}
                onChange={(e) => setForm(f => ({ ...f, path: e.target.value }))}
              />
              {errors.path && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.path}</div>}
            </div>
          )}

          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>图标</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setForm(f => ({ ...f, icon }))}
                  style={{
                    width: '36px', height: '36px',
                    background: form.icon === icon ? '#e6f7ff' : '#f5f7fa',
                    border: '1px solid ' + (form.icon === icon ? 'var(--primary)' : 'transparent'),
                    borderRadius: '8px', fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
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

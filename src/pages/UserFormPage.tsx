/**
 * 用户新建/编辑表单页 - 移动端
 */
import React, { useState, useEffect } from 'react';
import { mockApi, User } from '../mock';
import { PageHeader } from '../components';

interface UserFormPageProps {
  userId?: number;
  onBack: () => void;
  onSaved?: () => void;
}

export const UserFormPage: React.FC<UserFormPageProps> = ({ userId, onBack, onSaved }) => {
  const isEdit = !!userId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<User>>({
    realName: '', email: '', phone: '', department: '', role: '', password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userId) {
      mockApi.getUserDetail(userId).then(res => {
        if (res.code === 0 && res.data) {
          setForm(res.data);
        }
        setLoading(false);
      });
    }
  }, [userId]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.realName?.trim()) e.realName = '请输入姓名';
    if (!form.email?.trim()) e.email = '请输入邮箱';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '邮箱格式不正确';
    if (!form.phone?.trim()) e.phone = '请输入手机号';
    else if (!/^1[3-9]\d{9}$/.test(form.phone)) e.phone = '手机号格式不正确';
    if (!form.department?.trim()) e.department = '请选择部门';
    if (!form.role?.trim()) e.role = '请选择角色';
    if (!isEdit && !form.password?.trim()) e.password = '请输入密码';
    else if (!isEdit && form.password && form.password.length < 6) e.password = '密码至少6位';
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

  const departments = ['技术中心', '产品部', '运营部', '市场部', '财务部', '人力资源部'];
  const roles = ['admin', 'manager', 'editor', 'viewer'];

  const inputStyle = (field: string) => ({
    width: '100%', height: '40px', padding: '0 12px',
    border: errors[field] ? '1px solid var(--danger)' : '1px solid var(--border)',
    borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none',
  });

  return (
    <div className="page">
      <PageHeader title={isEdit ? '编辑用户' : '新建用户'} onBack={onBack} />

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 用户名（编辑时只读） */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>用户名</div>
            <input style={inputStyle('username')} value={form.username || ''} disabled placeholder="编辑时不可修改" />
          </div>

          {/* 姓名 */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>姓名 *</div>
            <input style={inputStyle('realName')} value={form.realName || ''} onChange={e => setForm(f => ({ ...f, realName: e.target.value }))} placeholder="请输入姓名" />
            {errors.realName && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.realName}</div>}
          </div>

          {/* 邮箱 */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>邮箱 *</div>
            <input style={inputStyle('email')} value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="请输入邮箱" />
            {errors.email && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.email}</div>}
          </div>

          {/* 手机号 */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>手机号 *</div>
            <input style={inputStyle('phone')} value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="请输入手机号" />
            {errors.phone && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.phone}</div>}
          </div>

          {/* 部门 */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>部门 *</div>
            <select style={inputStyle('department')} value={form.department || ''} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
              <option value="">请选择部门</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.department}</div>}
          </div>

          {/* 角色 */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>角色 *</div>
            <select style={inputStyle('role')} value={form.role || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="">请选择角色</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.role && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.role}</div>}
          </div>

          {/* 密码（仅新建时显示） */}
          {!isEdit && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>密码 *</div>
              <input style={inputStyle('password')} type="password" value={form.password || ''} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="请输入密码（至少6位）" />
              {errors.password && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{errors.password}</div>}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onBack} style={{ flex: 1, height: '40px', background: '#fff', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>取消</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '40px', background: saving ? '#a0c4ff' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

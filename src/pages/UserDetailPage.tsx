/**
 * 用户详情页 - 移动端（完整版：查看+编辑+删除+状态切换）
 */
import React, { useState, useEffect } from 'react';
import { mockApi, User } from '../mock';
import { PageHeader, ConfirmDialog } from '../components';

interface UserDetailPageProps {
  userId: number;
  onBack: () => void;
  onNavigate?: (path: string) => void;
  onDeleted?: () => void;
}

export const UserDetailPage: React.FC<UserDetailPageProps> = ({ userId, onBack, onNavigate, onDeleted }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<User>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState({ visible: false });

  useEffect(() => {
    mockApi.getUserDetail(userId).then(res => {
      if (res.code === 0) {
        setUser(res.data);
        setForm(res.data);
      }
      setLoading(false);
    });
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setUser({ ...user!, ...form });
    setEditing(false);
    setSaving(false);
  };

  const handleDelete = () => {
    setDialog({ visible: true });
  };

  const confirmDelete = () => {
    setDialog({ visible: false });
    if (onDeleted) onDeleted();
    onBack();
  };

  const handleStatusToggle = () => {
    if (!user) return;
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUser({ ...user, status: newStatus });
  };

  if (loading) return <div className="loading-state">加载中...</div>;
  if (!user) return <div className="empty-state"><div className="empty-state-icon">😕</div><div className="empty-state-text">用户不存在</div></div>;

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: '正常', color: '#52c41a' },
    inactive: { label: '停用', color: '#faad14' },
    locked: { label: '锁定', color: '#f5222d' },
  };

  const departments = ['技术中心', '产品部', '运营部', '市场部', '财务部', '人力资源部'];
  const roles = ['admin', 'manager', 'editor', 'viewer'];

  return (
    <div className="page">
      <PageHeader
        title={editing ? '编辑用户' : '用户详情'}
        onBack={onBack}
        right={!editing ? (
          <button onClick={() => setEditing(true)} style={{ height: '32px', padding: '0 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '13px', cursor: 'pointer' }}>编辑</button>
        ) : undefined}
      />

      {/* 头像卡片 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
        <img src={user.avatar} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '12px' }} />
        {editing ? (
          <input style={{ width: '100%', height: '40px', padding: '0 12px', border: errors.realName ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none', textAlign: 'center', marginBottom: '4px' }} value={form.realName || ''} onChange={e => setForm(f => ({ ...f, realName: e.target.value }))} />
        ) : (
          <div style={{ fontSize: '18px', fontWeight: 600 }}>{user.realName}</div>
        )}
        {errors.realName && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.realName}</div>}
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>@{user.username}</div>
        <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', background: statusMap[user.status]?.color + '20', color: statusMap[user.status]?.color }}>
          {statusMap[user.status]?.label}
        </span>
      </div>

      {/* 信息/编辑表单 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>基本信息</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="detail-row"><span className="detail-label">用户ID</span><span className="detail-value">{user.id}</span></div>
          <div className="detail-row"><span className="detail-label">用户名</span><span className="detail-value">{user.username}</span></div>
          <div className="detail-row">
            <span className="detail-label">邮箱</span>
            {editing ? <input style={{ flex: 1, maxWidth: '60%', height: '34px', padding: '0 10px', border: errors.email ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none', textAlign: 'right' }} value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /> : <span className="detail-value">{user.email}</span>}
          </div>
          <div className="detail-row">
            <span className="detail-label">手机号</span>
            {editing ? <input style={{ flex: 1, maxWidth: '60%', height: '34px', padding: '0 10px', border: errors.phone ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none', textAlign: 'right' }} value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /> : <span className="detail-value">{user.phone}</span>}
          </div>
          <div className="detail-row">
            <span className="detail-label">部门</span>
            {editing ? (
              <select style={{ height: '34px', padding: '0 10px', border: errors.department ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff' }} value={form.department || ''} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                <option value="">请选择</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            ) : <span className="detail-value">{user.department}</span>}
          </div>
          <div className="detail-row">
            <span className="detail-label">角色</span>
            {editing ? (
              <select style={{ height: '34px', padding: '0 10px', border: errors.role ? '1px solid var(--danger)' : '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff' }} value={form.role || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="">请选择</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            ) : <span className="detail-value">{user.role}</span>}
          </div>
        </div>
      </div>

      {/* 时间（只读时显示） */}
      {!editing && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>时间记录</div>
          <div className="detail-row"><span className="detail-label">创建时间</span><span className="detail-value">{user.createdAt}</span></div>
          <div className="detail-row"><span className="detail-label">最后登录</span><span className="detail-value">{user.lastLoginAt}</span></div>
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {editing ? (
          <>
            <button onClick={() => { setForm(user); setEditing(false); }} style={{ flex: 1, height: '40px', background: '#fff', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>取消</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '40px', background: saving ? '#a0c4ff' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? '保存中...' : '保存'}</button>
          </>
        ) : (
          <>
            <button onClick={handleStatusToggle} style={{ flex: 1, height: '40px', background: user.status === 'active' ? '#fff7e6' : '#f6ffed', color: user.status === 'active' ? '#faad14' : '#52c41a', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>
              {user.status === 'active' ? '停用' : '启用'}
            </button>
            <button onClick={handleDelete} style={{ flex: 1, height: '40px', background: '#fff', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>删除</button>
          </>
        )}
      </div>

      <ConfirmDialog visible={dialog.visible} title="删除用户" content={`确定删除用户「${user.realName}」吗？删除后不可恢复。`} onConfirm={confirmDelete} onCancel={() => setDialog({ visible: false })} danger />
    </div>
  );
};

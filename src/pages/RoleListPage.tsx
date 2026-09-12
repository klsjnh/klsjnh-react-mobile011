/**
 * 角色列表页 - 移动端（完整版：增删改+权限预览）
 */
import React, { useState, useEffect } from 'react';
import { mockApi, Role } from '../mock';
import { PageHeader, ConfirmDialog } from '../components';

interface RoleListPageProps {
  onNavigate?: (path: string) => void;
}

export const RoleListPage: React.FC<RoleListPageProps> = ({ onNavigate }) => {
  void onNavigate; // used in handlers below
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ visible: boolean; title: string; content: string; onConfirm: () => void }>({
    visible: false, title: '', content: '', onConfirm: () => {},
  });
  const [previewRole, setPreviewRole] = useState<Role | null>(null);

  useEffect(() => {
    setLoading(true);
    mockApi.getRoleList().then(res => {
      if (res.code === 0) setRoles(res.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = (role: Role) => {
    if (role.userCount > 0) {
      alert('该角色下存在用户，无法删除');
      return;
    }
    setDialog({
      visible: true,
      title: '删除角色',
      content: `确定删除角色「${role.label}」吗？`,
      onConfirm: () => {
        setRoles(prev => prev.filter(r => r.id !== role.id));
        setDialog(d => ({ ...d, visible: false }));
      },
    });
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: '启用', color: 'tag-green' },
    inactive: { label: '停用', color: 'tag-orange' },
  };

  return (
    <div className="page">
      <PageHeader
        title="角色管理"
        subtitle={`共 ${roles.length} 个角色`}
        right={
          <button
            onClick={() => onNavigate?.('/role/create')}
            style={{
              height: '32px', padding: '0 14px',
              background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)',
              fontSize: '13px', cursor: 'pointer',
            }}
          >
            + 新建
          </button>
        }
      />

      {loading ? (
        <div className="loading-state">加载中...</div>
      ) : (
        <div className="card-list">
          {roles.map((role) => (
            <div key={role.id} className="card-item">
              <div className="card-item-header">
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '10px',
                  background: '#f0f5ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  🛡
                </div>
                <div className="card-item-info">
                  <div className="card-item-name">{role.label}</div>
                  <div className="card-item-meta">{role.name}</div>
                </div>
                <span className={`card-item-tag ${statusMap[role.status]?.color || ''}`}>
                  {statusMap[role.status]?.label || role.status}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {role.description}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span>👥 {role.userCount} 人</span>
                <span>🔑 {role.permissions.length} 项权限</span>
              </div>
              <div className="card-item-footer">
                <button
                  onClick={() => setPreviewRole(role)}
                  style={{
                    flex: 1, height: '32px', fontSize: '12px',
                    background: '#f0f5ff', color: '#597ef7',
                    border: '1px solid #d6e4ff', borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                  }}
                >
                  权限
                </button>
                <button
                  onClick={() => onNavigate?.(`/role/${role.id}`)}
                  style={{
                    flex: 1, height: '32px', fontSize: '12px',
                    background: '#f6ffed', color: '#52c41a',
                    border: '1px solid #b7eb8f', borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                  }}
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(role)}
                  style={{
                    flex: 1, height: '32px', fontSize: '12px',
                    background: '#fff', color: 'var(--danger)',
                    border: '1px solid var(--danger)', borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 权限预览弹窗 */}
      {previewRole && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setPreviewRole(null)}>
          <div style={{
            width: 'calc(100vw - 64px)',
            maxWidth: '320px',
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              「{previewRole.label}」权限
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {previewRole.permissions.length === 0 ? (
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>暂无权限</span>
              ) : (
                previewRole.permissions.map((key) => (
                  <span key={key} style={{
                    fontSize: '11px', padding: '3px 8px',
                    background: '#f0f5ff', color: '#597ef7',
                    borderRadius: '4px',
                  }}>
                    {key}
                  </span>
                ))
              )}
            </div>
            <button
              onClick={() => setPreviewRole(null)}
              style={{
                width: '100%', height: '36px',
                background: 'var(--primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius)',
                fontSize: '14px', cursor: 'pointer',
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        visible={dialog.visible}
        title={dialog.title}
        content={dialog.content}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog(d => ({ ...d, visible: false }))}
        danger
      />
    </div>
  );
};

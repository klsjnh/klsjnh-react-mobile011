/**
 * 用户列表页 - 移动端（完整版：搜索+筛选+分页+增删改）
 */
import React, { useState, useEffect, useCallback } from 'react';
import { mockApi, User } from '../mock';
import { PageHeader, SearchBar, ConfirmDialog } from '../components';

interface UserListPageProps {
  onNavigate?: (path: string) => void;
}

export const UserListPage: React.FC<UserListPageProps> = ({ onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialog, setDialog] = useState<{ visible: boolean; title: string; content: string; onConfirm: () => void }>({
    visible: false, title: '', content: '', onConfirm: () => {},
  });

  const pageSize = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mockApi.getUserList({ keyword, status: filterStatus || undefined, page, pageSize });
      if (res.code === 0) {
        setUsers(res.data.list);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [keyword, filterStatus, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = (user: User) => {
    setDialog({
      visible: true,
      title: '删除用户',
      content: `确定删除用户「${user.realName}」吗？删除后不可恢复。`,
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        setDialog(d => ({ ...d, visible: false }));
      },
    });
  };

  const handleStatusChange = (user: User, status: string) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: status as User['status'] } : u));
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: '正常', color: 'tag-green' },
    inactive: { label: '停用', color: 'tag-orange' },
    locked: { label: '锁定', color: 'tag-red' },
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="page">
      <PageHeader
        title="用户管理"
        subtitle={`共 ${total} 个用户`}
        right={
          <button
            onClick={() => onNavigate?.('/user/create')}
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

      <SearchBar
        value={keyword}
        onChange={setKeyword}
        placeholder="搜索用户名/姓名/邮箱"
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        filterOptions={[
          { label: '全部状态', value: '' },
          { label: '正常', value: 'active' },
          { label: '停用', value: 'inactive' },
          { label: '锁定', value: 'locked' },
        ]}
      />

      {/* 用户列表 */}
      {loading ? (
        <div className="loading-state">加载中...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">暂无数据</div>
        </div>
      ) : (
        <div className="card-list">
          {users.map((user) => (
            <div
              key={user.id}
              className="card-item"
              onClick={() => onNavigate?.(`/user/${user.id}`)}
            >
              <div className="card-item-header">
                <img className="card-item-avatar" src={user.avatar} alt="" />
                <div className="card-item-info">
                  <div className="card-item-name">{user.realName}</div>
                  <div className="card-item-meta">@{user.username}</div>
                </div>
                <span className={`card-item-tag ${statusMap[user.status]?.color || ''}`}>
                  {statusMap[user.status]?.label || user.status}
                </span>
              </div>
              <div className="card-item-body">
                <span className="card-item-tag">{user.department}</span>
                <span className="card-item-tag">{user.role}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {user.email} · {user.phone}
              </div>
              <div className="card-item-footer">
                <button
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(user, user.status === 'active' ? 'inactive' : 'active'); }}
                  style={{
                    flex: 1, height: '32px', fontSize: '12px',
                    background: user.status === 'active' ? '#fff7e6' : '#f6ffed',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    cursor: 'pointer', color: user.status === 'active' ? '#faad14' : '#52c41a',
                  }}
                >
                  {user.status === 'active' ? '停用' : '启用'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(user); }}
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

      {/* 分页 */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              height: '32px', padding: '0 14px',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: '13px',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.5 : 1,
            }}
          >
            上一页
          </button>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={{
              height: '32px', padding: '0 14px',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: '13px',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.5 : 1,
            }}
          >
            下一页
          </button>
        </div>
      )}

      {/* 确认弹窗 */}
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

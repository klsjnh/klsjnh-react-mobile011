/**
 * 菜单管理页 - 移动端（完整版：树形+增删改）
 */
import React, { useState, useEffect } from 'react';
import { mockApi, MenuItem } from '../mock';
import { PageHeader, ConfirmDialog } from '../components';

interface MenuListPageProps {
  onNavigate?: (path: string) => void;
}

export const MenuListPage: React.FC<MenuListPageProps> = ({ onNavigate }) => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [dialog, setDialog] = useState<{ visible: boolean; title: string; content: string; onConfirm: () => void }>({
    visible: false, title: '', content: '', onConfirm: () => {},
  });
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  useEffect(() => {
    setLoading(true);
    mockApi.getMenuTree().then(res => {
      if (res.code === 0) setMenus(res.data);
      setLoading(false);
    });
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = (menu: MenuItem) => {
    if (menu.children && menu.children.length > 0) {
      alert('该菜单下存在子菜单，无法删除');
      return;
    }
    setDialog({
      visible: true,
      title: '删除菜单',
      content: `确定删除菜单「${menu.title}」吗？`,
      onConfirm: () => {
        const deleteRecursive = (items: MenuItem[]): MenuItem[] =>
          items.filter(item => item.id !== menu.id).map(item => ({
            ...item,
            children: item.children ? deleteRecursive(item.children) : undefined,
          }));
        setMenus(deleteRecursive(menus));
        setDialog(d => ({ ...d, visible: false }));
      },
    });
  };

  const renderMenuItem = (item: MenuItem, depth = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);

    return (
      <React.Fragment key={item.id}>
        <div
          onClick={() => hasChildren && toggleExpand(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            paddingLeft: `${14 + depth * 20}px`,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
            cursor: hasChildren ? 'pointer' : 'default',
          }}
        >
          <span style={{ fontSize: '18px' }}>{item.icon || '📄'}</span>
          <span style={{ flex: 1, fontSize: '14px', fontWeight: depth === 0 ? 600 : 400 }}>
            {item.title}
          </span>
          <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: item.type === 'directory' ? '#e6f7ff' : item.type === 'menu' ? '#f6ffed' : '#fff7e6',
            color: item.type === 'directory' ? '#1890ff' : item.type === 'menu' ? '#52c41a' : '#faad14',
          }}>
            {item.type === 'directory' ? '目录' : item.type === 'menu' ? '菜单' : '按钮'}
          </span>
          {hasChildren && (
            <span style={{ fontSize: '10px', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
              ▶
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <>
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </>
        )}
        {/* 操作按钮 */}
        {depth === 0 && (
          <div style={{
            display: 'flex', gap: '8px',
            padding: '8px 14px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <button
              onClick={() => setSelectedMenu(item)}
              style={{
                flex: 1, height: '30px', fontSize: '12px',
                background: '#f0f5ff', color: '#597ef7',
                border: '1px solid #d6e4ff', borderRadius: 'var(--radius)',
                cursor: 'pointer',
              }}
            >
              编辑
            </button>
            <button
              onClick={() => handleDelete(item)}
              style={{
                flex: 1, height: '30px', fontSize: '12px',
                background: '#fff', color: 'var(--danger)',
                border: '1px solid var(--danger)', borderRadius: 'var(--radius)',
                cursor: 'pointer',
              }}
            >
              删除
            </button>
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="菜单管理"
        subtitle={`共 ${menus.length} 个模块`}
        right={
          <button
            onClick={() => onNavigate?.('/menu/create')}
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
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {menus.map(menu => renderMenuItem(menu))}
        </div>
      )}

      {/* 编辑弹窗 */}
      {selectedMenu && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setSelectedMenu(null)}>
          <div style={{
            width: 'calc(100vw - 64px)',
            maxWidth: '320px',
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>编辑菜单</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>菜单标题</div>
                <input
                  style={{
                    width: '100%', height: '38px', padding: '0 12px',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    fontSize: '14px', outline: 'none',
                  }}
                  defaultValue={selectedMenu.title}
                />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>路由路径</div>
                <input
                  style={{
                    width: '100%', height: '38px', padding: '0 12px',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    fontSize: '14px', outline: 'none',
                  }}
                  defaultValue={selectedMenu.path}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={() => setSelectedMenu(null)}
                style={{
                  flex: 1, height: '36px',
                  background: '#fff', color: 'var(--text-secondary)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  fontSize: '14px', cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={() => setSelectedMenu(null)}
                style={{
                  flex: 1, height: '36px',
                  background: 'var(--primary)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius)',
                  fontSize: '14px', cursor: 'pointer',
                }}
              >
                保存
              </button>
            </div>
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

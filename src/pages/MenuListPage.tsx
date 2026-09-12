/**
 * 菜单管理页 - 移动端（CRUD 实时驱动导航）
 * 增删改菜单 → menuStore 更新 → TabBar / 系统宫格实时变化
 */
import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader, ConfirmDialog } from '../components';
import { menuStore, useMenuState, type MenuConfig } from '../stores/menuStore';

interface MenuListPageProps {
  onNavigate?: (path: string) => void;
}

export const MenuListPage: React.FC<MenuListPageProps> = ({ onNavigate }) => {
  const { menus, loaded } = useMenuState();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1, 2, 3]));
  const [dialog, setDialog] = useState<{ visible: boolean; title: string; content: string; onConfirm: () => void }>({
    visible: false, title: '', content: '', onConfirm: () => {},
  });
  const [editModal, setEditModal] = useState<{ visible: boolean; menu: MenuConfig | null }>({
    visible: false, menu: null,
  });
  const [form, setForm] = useState({ title: '', path: '', icon: '', visible: true });

  // 展开所有顶级节点
  useEffect(() => {
    if (loaded && menus.length > 0) {
      setExpandedIds(new Set(menus.map((m) => m.id)));
    }
  }, [loaded, menus]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** 打开编辑弹窗 */
  const openEdit = (menu: MenuConfig) => {
    setForm({ title: menu.title, path: menu.path, icon: menu.icon, visible: menu.visible });
    setEditModal({ visible: true, menu });
  };

  /** 保存编辑 */
  const handleSaveEdit = () => {
    if (!editModal.menu || !form.title.trim()) return;
    menuStore.update(editModal.menu.id, {
      title: form.title,
      path: form.path,
      icon: form.icon,
      visible: form.visible,
    });
    setEditModal({ visible: false, menu: null });
  };

  /** 删除菜单 */
  const handleDelete = (menu: MenuConfig) => {
    if (menu.children && menu.children.length > 0) {
      alert('该菜单下存在子菜单，无法删除');
      return;
    }
    setDialog({
      visible: true,
      title: '删除菜单',
      content: `确定删除「${menu.title}」吗？删除后导航将实时更新。`,
      onConfirm: () => {
        menuStore.remove(menu.id);
        setDialog(d => ({ ...d, visible: false }));
      },
    });
  };

  /** 切换可见性 */
  const handleToggleVisible = (menu: MenuConfig) => {
    menuStore.toggleVisible(menu.id);
  };

  /** 添加子菜单 */
  const handleAddChild = (parent: MenuConfig) => {
    const title = prompt('请输入菜单标题:');
    if (!title?.trim()) return;
    const path = prompt('请输入路由路径（如 /business/newpage）:');
    if (!path?.trim()) return;
    menuStore.add({
      parentId: parent.id,
      name: path.split('/').pop() || 'NewPage',
      path: path,
      icon: '📄',
      title: title,
      type: 'page',
      sort: (parent.children?.length || 0) + 1,
      visible: true,
    });
  };

  const typeLabels: Record<string, string> = { tab: '导航', page: '页面' };
  const typeColors: Record<string, string> = { tab: '#1890ff', page: '#52c41a' };

  const renderMenuItem = (menu: MenuConfig, depth = 0): React.ReactNode => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedIds.has(menu.id);
    const canEdit = menu.visible && menu.path !== '/tabbar'; // 分组节点不可编辑

    return (
      <React.Fragment key={menu.id}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', paddingLeft: `${14 + depth * 16}px`,
            background: depth === 0 ? '#fafafa' : 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(menu.id)} style={{ background: 'none', border: 'none', fontSize: '10px', cursor: 'pointer', padding: '0 4px', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▶</button>
          ) : (
            <span style={{ width: '18px' }} />
          )}
          <span style={{ fontSize: '16px' }}>{menu.icon || '📄'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: depth === 0 ? 600 : 400 }}>
              {menu.title}
              {!menu.visible && <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>(隐藏)</span>}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{menu.path}</div>
          </div>
          <span style={{
            fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
            background: typeColors[menu.type] + '20', color: typeColors[menu.type] || 'var(--text-muted)',
          }}>
            {typeLabels[menu.type] || menu.type}
          </span>
        </div>

        {/* 操作按钮 */}
        {canEdit && (
          <div style={{
            display: 'flex', gap: '6px', padding: '6px 14px',
            paddingLeft: `${14 + depth * 16 + 24}px`,
            background: depth === 0 ? '#fafafa' : 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <button onClick={() => openEdit(menu)} style={{ height: '26px', fontSize: '11px', padding: '0 10px', background: '#f0f5ff', color: '#597ef7', border: '1px solid #d6e4ff', borderRadius: 'var(--radius)', cursor: 'pointer' }}>编辑</button>
            <button onClick={() => handleToggleVisible(menu)} style={{ height: '26px', fontSize: '11px', padding: '0 10px', background: menu.visible ? '#fff7e6' : '#f6ffed', color: menu.visible ? '#faad14' : '#52c41a', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
              {menu.visible ? '隐藏' : '显示'}
            </button>
            <button onClick={() => handleDelete(menu)} style={{ height: '26px', fontSize: '11px', padding: '0 10px', background: '#fff', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>删除</button>
          </div>
        )}

        {/* 添加子菜单按钮 */}
        {hasChildren && isExpanded && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', padding: '6px 14px',
            background: depth === 0 ? '#fafafa' : 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <button
              onClick={() => handleAddChild(menu)}
              style={{
                height: '26px', fontSize: '11px', padding: '0 12px',
                background: '#f6ffed', color: '#52c41a',
                border: '1px solid #b7eb8f', borderRadius: 'var(--radius)',
                cursor: 'pointer',
              }}
            >
              + 添加子菜单
            </button>
          </div>
        )}

        {/* 子菜单 */}
        {hasChildren && isExpanded && menu.children!.map(child => renderMenuItem(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="菜单管理"
        subtitle="增删改菜单 → 导航实时更新"
        onBack={() => onNavigate?.('/system')}
      />

      {/* 菜单树 */}
      <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
        {menus.map(menu => renderMenuItem(menu))}
      </div>

      {/* 说明 */}
      <div style={{
        background: '#f5f7fa',
        borderRadius: 'var(--radius)',
        padding: '14px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        lineHeight: 1.8,
      }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>💡 动态菜单</div>
        此处增删改菜单会实时影响：<br />
        • 底部 TabBar 导航（type=tab）<br />
        • 系统/业务页宫格（type=page）<br />
        • 隐藏的菜单不出现在导航中
      </div>

      {/* 编辑弹窗 */}
      {editModal.visible && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setEditModal({ visible: false, menu: null })}>
          <div style={{
            width: 'calc(100vw - 48px)', maxWidth: '340px',
            background: '#fff', borderRadius: '12px', padding: '20px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>编辑菜单</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>标题</div>
                <input style={{ width: '100%', height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none' }} value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>路径</div>
                <input style={{ width: '100%', height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none' }} value={form.path} onChange={(e) => setForm(f => ({ ...f, path: e.target.value }))} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>图标（emoji）</div>
                <input style={{ width: '100%', height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none' }} value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px' }}>显示</span>
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm(f => ({ ...f, visible: e.target.checked }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setEditModal({ visible: false, menu: null })} style={{ flex: 1, height: '36px', background: '#fff', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>取消</button>
              <button onClick={handleSaveEdit} style={{ flex: 1, height: '36px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>保存</button>
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

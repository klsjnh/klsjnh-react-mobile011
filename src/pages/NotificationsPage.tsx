/**
 * 消息通知页 - 移动端（完整版：分类筛选+详情+删除+全部已读）
 */
import React, { useState } from 'react';
import { PageHeader, SearchBar, ConfirmDialog } from '../components';

interface NotificationsPageProps {
  onBack?: () => void;
}

type FilterType = 'all' | 'system' | 'user' | 'order';

interface Notification {
  id: number;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: 'system' | 'user' | 'order';
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: '系统更新通知', content: '系统将于今晚 22:00-22:30 进行维护升级，升级期间可能无法正常访问。升级内容：优化系统性能、修复已知问题、新增数据导出功能。请提前做好相关准备。', time: '2026-09-12 09:30:00', read: false, type: 'system' },
    { id: 2, title: '新用户注册审核', content: '用户「张三」已完成注册申请，请前往用户管理页面进行审核。注册时间：2026-09-12 09:25:00，注册邮箱：zhangsan@example.com。', time: '2026-09-12 09:25:00', read: false, type: 'user' },
    { id: 3, title: '订单支付成功', content: '订单 #20260912001 已支付成功，金额 ¥299.00。买家：李四，商品：企业管理系统年度会员。请及时处理订单发货。', time: '2026-09-12 09:00:00', read: true, type: 'order' },
    { id: 4, title: '权限变更提醒', content: '您的角色权限已被修改。变更内容：新增「数据报表」查看权限，移除「菜单管理」编辑权限。当前角色：部门经理。', time: '2026-09-12 08:00:00', read: true, type: 'system' },
    { id: 5, title: '数据备份完成', content: '系统数据已于 2026-09-12 06:00 自动备份完成。备份大小：256MB，备份位置：云端存储，保留天数：30天。', time: '2026-09-12 06:00:00', read: true, type: 'system' },
    { id: 6, title: '新订单提醒', content: '您有 3 个新订单待处理。订单号：#20260911001、#20260911002、#20260911003，总金额 ¥1,256.00。', time: '2026-09-11 17:30:00', read: true, type: 'order' },
    { id: 7, title: '用户反馈', content: '用户「王五」提交了新的反馈：系统登录页面加载速度较慢，建议优化。反馈时间：2026-09-11 16:20:00。', time: '2026-09-11 16:20:00', read: true, type: 'user' },
    { id: 8, title: '安全警告', content: '检测到异常登录尝试。IP：45.33.22.11，地点：美国加利福尼亚州，时间：2026-09-11 14:00:00。如非本人操作请立即修改密码。', time: '2026-09-11 14:00:00', read: false, type: 'system' },
  ]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [dialog, setDialog] = useState({ visible: false });

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedNotif(null);
  };

  const filtered = notifications.filter(n => {
    if (filter !== 'all' && n.type !== filter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeIcon: Record<string, string> = { system: '🔔', user: '👤', order: '📦' };
  const typeLabel: Record<string, string> = { system: '系统', user: '用户', order: '订单' };
  const filterOptions = [
    { label: '全部', value: 'all' },
    { label: '系统', value: 'system' },
    { label: '用户', value: 'user' },
    { label: '订单', value: 'order' },
  ];

  return (
    <div className="page">
      <PageHeader
        title="消息通知"
        subtitle={`${unreadCount} 条未读`}
        onBack={onBack}
        right={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              style={{
                height: '32px', padding: '0 12px',
                background: 'var(--bg-card)', color: 'var(--primary)',
                border: '1px solid var(--primary)', borderRadius: 'var(--radius)',
                fontSize: '12px', cursor: 'pointer',
              }}
            >
              全部已读
            </button>
          ) : undefined
        }
      />

      {/* 分类筛选 */}
      <SearchBar
        value=""
        onChange={() => {}}
        placeholder="搜索通知..."
        filterValue={filter}
        onFilterChange={(v) => setFilter(v as FilterType)}
        filterOptions={filterOptions}
      />

      {/* 通知列表 */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">暂无通知</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => { setSelectedNotif(notif); markAsRead(notif.id); }}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                padding: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                borderLeft: notif.read ? '3px solid transparent' : '3px solid var(--primary)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px' }}>{typeIcon[notif.type]}</span>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: notif.read ? 400 : 600 }}>{notif.title}</span>
                {!notif.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', paddingLeft: '24px' }}>
                {notif.content}
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', paddingLeft: '24px' }}>
                <span style={{ padding: '1px 6px', borderRadius: '4px', background: '#f5f5f5' }}>{typeLabel[notif.type]}</span>
                <span>{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 通知详情弹窗 */}
      {selectedNotif && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setSelectedNotif(null)}>
          <div style={{
            width: 'calc(100vw - 48px)',
            maxWidth: '340px',
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            maxHeight: '70vh',
            overflowY: 'auto',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>{typeIcon[selectedNotif.type]}</span>
              <span style={{ fontSize: '16px', fontWeight: 600, flex: 1 }}>{selectedNotif.title}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px', padding: '12px', background: '#f5f7fa', borderRadius: '8px' }}>
              {selectedNotif.content}
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#f0f5ff', color: '#597ef7' }}>{typeLabel[selectedNotif.type]}</span>
              <span>{selectedNotif.time}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => deleteNotif(selectedNotif.id)}
                style={{
                  flex: 1, height: '36px',
                  background: '#fff', color: 'var(--danger)',
                  border: '1px solid var(--danger)', borderRadius: 'var(--radius)',
                  fontSize: '14px', cursor: 'pointer',
                }}
              >
                删除
              </button>
              <button
                onClick={() => setSelectedNotif(null)}
                style={{
                  flex: 1, height: '36px',
                  background: 'var(--primary)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius)',
                  fontSize: '14px', cursor: 'pointer',
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        visible={dialog.visible}
        title="删除通知"
        content="确定要删除这条通知吗？"
        onConfirm={() => setDialog({ visible: false })}
        onCancel={() => setDialog({ visible: false })}
        danger
      />
    </div>
  );
};

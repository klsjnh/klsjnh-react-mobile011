/**
 * 业务功能页面集合 - 移动端
 * 配置管理 / 定时任务 / 字典管理 / 系统监控 / 在线用户 / 缓存管理
 */
import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader, SearchBar, ConfirmDialog } from '../components';

// ==================== 通用卡片样式 ====================

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)', borderRadius: 'var(--radius)',
  padding: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '10px',
};

const btnStyle = (bg: string, color: string, border?: string): React.CSSProperties => ({
  height: '28px', fontSize: '11px', padding: '0 10px',
  background: bg, color, border: border ? `1px solid ${border}` : 'none',
  borderRadius: 'var(--radius)', cursor: 'pointer',
});

// ==================== 配置管理 ====================

interface ConfigItem {
  id: number;
  key: string;
  value: string;
  group: string;
  remark: string;
  enabled: boolean;
}

export const ConfigPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [configs, setConfigs] = useState<ConfigItem[]>([
    { id: 1, key: 'site.name', value: '企业管理系统', group: '基础', remark: '站点名称', enabled: true },
    { id: 2, key: 'site.url', value: 'https://admin.example.com', group: '基础', remark: '站点地址', enabled: true },
    { id: 3, key: 'upload.maxSize', value: '10MB', group: '上传', remark: '最大上传大小', enabled: true },
    { id: 4, key: 'upload.allowTypes', value: 'jpg,png,pdf,doc', group: '上传', remark: '允许的文件类型', enabled: false },
    { id: 5, key: 'security.passwordMinLength', value: '6', group: '安全', remark: '密码最小长度', enabled: true },
    { id: 6, key: 'security.tokenExpire', value: '30', group: '安全', remark: 'Token 过期时间(分钟)', enabled: true },
    { id: 7, key: 'email.smtp', value: 'smtp.example.com', group: '邮件', remark: 'SMTP 服务器', enabled: false },
    { id: 8, key: 'sms.provider', value: 'aliyun', group: '短信', remark: '短信服务商', enabled: true },
  ]);
  const [keyword, setKeyword] = useState('');
  const [editModal, setEditModal] = useState<{ visible: boolean; config: ConfigItem | null }>({ visible: false, config: null });
  const [form, setForm] = useState({ key: '', value: '', remark: '', group: '' });
  const [dialog, setDialog] = useState({ visible: false, id: 0 });

  const filtered = configs.filter(c =>
    !keyword || c.key.includes(keyword) || c.value.includes(keyword) || c.group.includes(keyword)
  );

  /** 打开编辑弹窗 */
  const openEdit = (config: ConfigItem) => {
    setForm({ key: config.key, value: config.value, remark: config.remark, group: config.group });
    setEditModal({ visible: true, config });
  };

  /** 保存编辑 */
  const handleSaveEdit = () => {
    if (!editModal.config || !form.value.trim()) return;
    setConfigs(prev => prev.map(c =>
      c.id === editModal.config!.id
        ? { ...c, key: form.key, value: form.value, remark: form.remark, group: form.group }
        : c
    ));
    setEditModal({ visible: false, config: null });
  };

  /** 切换启用/禁用 */
  const toggleEnabled = (id: number) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  /** 删除 */
  const handleDelete = (id: number) => {
    setConfigs(prev => prev.filter(c => c.id !== id));
    setDialog({ visible: false, id: 0 });
  };

  const groups = [...new Set(filtered.map(c => c.group))];

  return (
    <div className="page">
      <PageHeader title="配置管理" subtitle={`${configs.filter(c => c.enabled).length}/${configs.length} 已启用`} onBack={onBack} />
      <SearchBar value={keyword} onChange={setKeyword} placeholder="搜索配置键/值/分组" />

      {groups.map(group => (
        <div key={group} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-muted)' }}>{group}</div>
          {filtered.filter(c => c.group === group).map(config => (
            <div key={config.id} style={{
              ...cardStyle,
              borderLeft: config.enabled ? '3px solid #52c41a' : '3px solid #d9d9d9',
              opacity: config.enabled ? 1 : 0.65,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <code style={{ fontSize: '12px', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{config.key}</code>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>{config.remark}</span>
                {/* 启用/禁用开关 */}
                <div
                  onClick={() => toggleEnabled(config.id)}
                  style={{
                    width: '36px', height: '20px', borderRadius: '10px', flexShrink: 0,
                    background: config.enabled ? '#52c41a' : '#d9d9d9',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: '2px',
                    left: config.enabled ? '18px' : '2px',
                    transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ flex: 1, fontSize: '13px', color: config.enabled ? 'var(--text-primary)' : 'var(--text-muted)' }}>{config.value}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEdit(config)} style={{ ...btnStyle('#f0f5ff', '#597ef7'), flex: 1 }}>✏️ 编辑</button>
                <button onClick={() => toggleEnabled(config.id)} style={{ ...btnStyle(config.enabled ? '#fff7e6' : '#f6ffed', config.enabled ? '#faad14' : '#52c41a'), flex: 1 }}>
                  {config.enabled ? '禁用' : '启用'}
                </button>
                <button onClick={() => setDialog({ visible: true, id: config.id })} style={{ ...btnStyle('#fff', 'var(--danger)', 'var(--danger)'), flex: 1 }}>删除</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* 编辑弹窗 */}
      {editModal.visible && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setEditModal({ visible: false, config: null })}>
          <div style={{
            width: 'calc(100vw - 48px)', maxWidth: '340px',
            background: '#fff', borderRadius: '12px', padding: '20px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>编辑配置</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>配置键</div>
                <input
                  style={{ width: '100%', height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none' }}
                  value={form.key}
                  onChange={(e) => setForm(f => ({ ...f, key: e.target.value }))}
                />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>配置值 <span style={{ color: 'var(--danger)' }}>*</span></div>
                <input
                  style={{ width: '100%', height: '38px', padding: '0 12px', border: form.value.trim() ? '1px solid var(--border)' : '1px solid var(--danger)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none' }}
                  value={form.value}
                  onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))}
                  placeholder="请输入配置值"
                />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>备注</div>
                <input
                  style={{ width: '100%', height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none' }}
                  value={form.remark}
                  onChange={(e) => setForm(f => ({ ...f, remark: e.target.value }))}
                />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>分组</div>
                <input
                  style={{ width: '100%', height: '38px', padding: '0 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', outline: 'none' }}
                  value={form.group}
                  onChange={(e) => setForm(f => ({ ...f, group: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setEditModal({ visible: false, config: null })} style={{ flex: 1, height: '38px', background: '#fff', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', cursor: 'pointer' }}>取消</button>
              <button onClick={handleSaveEdit} disabled={!form.value.trim()} style={{ flex: 1, height: '38px', background: form.value.trim() ? 'var(--primary)' : '#d9d9d9', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', cursor: form.value.trim() ? 'pointer' : 'not-allowed' }}>保存</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog visible={dialog.visible} title="删除配置" content="确定删除这条配置吗？删除后不可恢复。" onConfirm={() => handleDelete(dialog.id)} onCancel={() => setDialog({ visible: false, id: 0 })} danger />
    </div>
  );
};

// ==================== 定时任务 ====================

export const SchedulerPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [tasks, setTasks] = useState([
    { id: 1, name: '数据备份', cron: '0 2 * * *', status: true, lastRun: '2026-09-12 02:00', nextRun: '2026-09-13 02:00', desc: '每日凌晨备份数据库', group: '系统' },
    { id: 2, name: '日志清理', cron: '0 3 * * *', status: true, lastRun: '2026-09-12 03:00', nextRun: '2026-09-13 03:00', desc: '清理过期日志', group: '系统' },
    { id: 3, name: '缓存刷新', cron: '*/30 * * * *', status: true, lastRun: '2026-09-12 10:30', nextRun: '2026-09-12 11:00', desc: '每30分钟刷新缓存', group: '系统' },
    { id: 4, name: '报表生成', cron: '0 8 * * 1', status: false, lastRun: '2026-09-08 08:00', nextRun: '-', desc: '每周一生成周报', group: '业务' },
    { id: 5, name: '数据同步', cron: '0 */2 * * *', status: true, lastRun: '2026-09-12 10:00', nextRun: '2026-09-12 12:00', desc: '每2小时同步数据', group: '业务' },
    { id: 6, name: '邮件通知', cron: '0 9 * * 1-5', status: true, lastRun: '2026-09-12 09:00', nextRun: '2026-09-13 09:00', desc: '工作日发送日报', group: '业务' },
  ]);
  const [dialog, setDialog] = useState({ visible: false, id: 0 });

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: !t.status } : t));
  };

  const groups = [...new Set(tasks.map(t => t.group))];

  return (
    <div className="page">
      <PageHeader title="定时任务" subtitle={`${tasks.filter(t => t.status).length}/${tasks.length} 运行中`} onBack={onBack} />

      {groups.map(group => (
        <div key={group} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-muted)' }}>{group}任务</div>
          {tasks.filter(t => t.group === group).map(task => (
            <div key={task.id} style={{ ...cardStyle, borderLeft: task.status ? '3px solid #52c41a' : '3px solid #d9d9d9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px' }}>{task.status ? '🟢' : '⚪'}</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{task.name}</span>
                <code style={{ fontSize: '10px', background: '#f5f5f5', padding: '1px 6px', borderRadius: '4px', marginLeft: 'auto' }}>{task.cron}</code>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{task.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>上次: {task.lastRun}</span>
                <span>下次: {task.nextRun}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => toggleTask(task.id)} style={{ ...btnStyle(task.status ? '#fff7e6' : '#f6ffed', task.status ? '#faad14' : '#52c41a'), flex: 1 }}>
                  {task.status ? '⏸ 暂停' : '▶ 启动'}
                </button>
                <button onClick={() => setDialog({ visible: true, id: task.id })} style={{ ...btnStyle('#fff', 'var(--danger)', 'var(--danger)'), flex: 1 }}>删除</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      <ConfirmDialog visible={dialog.visible} title="删除任务" content="确定删除这个定时任务吗？" onConfirm={() => { setTasks(prev => prev.filter(t => t.id !== dialog.id)); setDialog({ visible: false, id: 0 }); }} onCancel={() => setDialog({ visible: false, id: 0 })} danger />
    </div>
  );
};

// ==================== 字典管理 ====================

export const DictPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [dicts, setDicts] = useState([
    { id: 1, type: 'user_status', label: '用户状态', items: [{ value: 'active', label: '正常' }, { value: 'inactive', label: '停用' }, { value: 'locked', label: '锁定' }] },
    { id: 2, type: 'user_role', label: '用户角色', items: [{ value: 'admin', label: '管理员' }, { value: 'manager', label: '经理' }, { value: 'editor', label: '编辑' }, { value: 'viewer', label: '只读' }] },
    { id: 3, type: 'order_status', label: '订单状态', items: [{ value: 'pending', label: '待支付' }, { value: 'paid', label: '已支付' }, { value: 'shipped', label: '已发货' }, { value: 'done', label: '已完成' }] },
    { id: 4, type: 'notify_type', label: '通知类型', items: [{ value: 'system', label: '系统' }, { value: 'user', label: '用户' }, { value: 'order', label: '订单' }] },
  ]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="page">
      <PageHeader title="字典管理" subtitle={`${dicts.length} 个字典类型`} onBack={onBack} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {dicts.map(dict => (
          <div key={dict.id} style={cardStyle}>
            <div onClick={() => setExpandedId(expandedId === dict.id ? null : dict.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <code style={{ fontSize: '12px', background: '#f0f5ff', color: '#597ef7', padding: '2px 8px', borderRadius: '4px' }}>{dict.type}</code>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{dict.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>{dict.items.length} 项</span>
              <span style={{ fontSize: '10px', transform: expandedId === dict.id ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▶</span>
            </div>
            {expandedId === dict.id && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                {dict.items.map(item => (
                  <div key={item.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                    <code style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '60px' }}>{item.value}</code>
                    <span style={{ fontSize: '13px' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 系统监控 ====================

export const MonitorPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [metrics, setMetrics] = useState({
    cpu: 35, memory: 62, disk: 45, network: 28,
    qps: 156, avgResponse: '23ms', errorRate: '0.1%', uptime: '15天3小时',
    connections: 89, threads: 45, heapUsed: '512MB', heapMax: '1GB',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + Math.floor(Math.random() * 20) - 10)),
        memory: Math.max(30, Math.min(90, prev.memory + Math.floor(Math.random() * 10) - 5)),
        network: Math.max(5, Math.min(80, prev.network + Math.floor(Math.random() * 20) - 10)),
        qps: Math.max(50, Math.min(500, prev.qps + Math.floor(Math.random() * 60) - 30)),
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const gauges = [
    { label: 'CPU 使用率', value: metrics.cpu, unit: '%', color: metrics.cpu > 80 ? '#f5222d' : metrics.cpu > 60 ? '#faad14' : '#52c41a' },
    { label: '内存使用率', value: metrics.memory, unit: '%', color: metrics.memory > 80 ? '#f5222d' : '#1890ff' },
    { label: '磁盘使用率', value: metrics.disk, unit: '%', color: '#722ed1' },
    { label: '网络使用率', value: metrics.network, unit: '%', color: '#13c2c2' },
  ];

  const stats = [
    { label: 'QPS', value: metrics.qps.toString(), icon: '⚡' },
    { label: '平均响应', value: metrics.avgResponse, icon: '⏱' },
    { label: '错误率', value: metrics.errorRate, icon: '❗' },
    { label: '运行时长', value: metrics.uptime, icon: '⏳' },
    { label: '连接数', value: metrics.connections.toString(), icon: '🔗' },
    { label: '线程数', value: metrics.threads.toString(), icon: '🧵' },
    { label: '堆内存', value: metrics.heapUsed, icon: '💾' },
    { label: '最大堆', value: metrics.heapMax, icon: '📊' },
  ];

  return (
    <div className="page">
      <PageHeader title="系统监控" subtitle="实时运行状态" onBack={onBack} />

      {/* 资源仪表 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>资源使用率</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {gauges.map(g => (
            <div key={g.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{g.label}</span>
                <span style={{ fontWeight: 600, color: g.color }}>{g.value}{g.unit}</span>
              </div>
              <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${g.value}%`, height: '100%', background: g.color, borderRadius: '4px', transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 运行指标 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>运行指标</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#f5f7fa', borderRadius: '8px' }}>
              <span style={{ fontSize: '18px' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== 在线用户 ====================

export const OnlineUsersPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', realName: '张三', ip: '192.168.1.100', location: '北京市', loginTime: '09:30', browser: 'Chrome' },
    { id: 2, username: 'manager', realName: '李四', ip: '192.168.1.101', location: '上海市', loginTime: '09:15', browser: 'Safari' },
    { id: 3, username: 'editor01', realName: '王五', ip: '172.16.0.10', location: '深圳市', loginTime: '08:50', browser: 'Edge' },
    { id: 4, username: 'user001', realName: '赵六', ip: '10.0.0.55', location: '广州市', loginTime: '08:30', browser: 'Firefox' },
    { id: 5, username: 'viewer01', realName: '孙七', ip: '192.168.1.200', location: '杭州市', loginTime: '08:00', browser: 'Chrome' },
  ]);
  const [dialog, setDialog] = useState({ visible: false, id: 0, name: '' });

  const forceLogout = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDialog({ visible: false, id: 0, name: '' });
  };

  return (
    <div className="page">
      <PageHeader title="在线用户" subtitle={`${users.length} 人在线`} onBack={onBack} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {users.map(user => (
          <div key={user.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#52c41a' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.realName}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{user.username}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>📍 {user.location}</span>
              <span>🌐 {user.ip}</span>
              <span>🕐 {user.loginTime}</span>
              <span>🖥 {user.browser}</span>
            </div>
            <button
              onClick={() => setDialog({ visible: true, id: user.id, name: user.realName })}
              style={{ ...btnStyle('#fff', 'var(--danger)', 'var(--danger)'), width: '100%' }}
            >
              强制下线
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        visible={dialog.visible} title="强制下线"
        content={`确定将「${dialog.name}」强制下线吗？`}
        onConfirm={() => forceLogout(dialog.id)}
        onCancel={() => setDialog({ visible: false, id: 0, name: '' })}
        danger
      />
    </div>
  );
};

// ==================== 缓存管理 ====================

export const CachePage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [caches, setCaches] = useState([
    { id: 1, name: '用户信息缓存', size: '2.5MB', items: 128, hitRate: '95.2%', ttl: '30分钟' },
    { id: 2, name: '菜单缓存', size: '0.3MB', items: 45, hitRate: '99.8%', ttl: '1小时' },
    { id: 3, name: '权限缓存', size: '1.2MB', items: 86, hitRate: '98.5%', ttl: '15分钟' },
    { id: 4, name: '配置缓存', size: '0.1MB', items: 12, hitRate: '99.9%', ttl: '5分钟' },
    { id: 5, name: '会话缓存', size: '5.8MB', items: 5, hitRate: '-', ttl: '30分钟' },
  ]);
  const [clearing, setClearing] = useState<number | null>(null);

  const totalSize = caches.reduce((sum, c) => sum + parseFloat(c.size), 0).toFixed(1);
  const totalItems = caches.reduce((sum, c) => sum + c.items, 0);

  const clearCache = (id: number) => {
    setClearing(id);
    setTimeout(() => {
      setCaches(prev => prev.map(c => c.id === id ? { ...c, size: '0MB', items: 0, hitRate: '-' } : c));
      setClearing(null);
    }, 800);
  };

  return (
    <div className="page">
      <PageHeader title="缓存管理" subtitle={`${totalSize}MB · ${totalItems} 项`} onBack={onBack} />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1890ff' }}>{totalSize}MB</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>总缓存</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#52c41a' }}>{totalItems}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>缓存项</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#faad14' }}>{caches.length}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>缓存域</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {caches.map(cache => (
          <div key={cache.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px' }}>🧹</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{cache.name}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              <span>大小: <strong>{cache.size}</strong></span>
              <span>条目: <strong>{cache.items}</strong></span>
              <span>命中率: <strong style={{ color: '#52c41a' }}>{cache.hitRate}</strong></span>
              <span>TTL: <strong>{cache.ttl}</strong></span>
            </div>
            <button onClick={() => clearCache(cache.id)} disabled={clearing === cache.id || cache.items === 0}
              style={{ ...btnStyle(clearing === cache.id ? '#d9d9d9' : '#fff7e6', clearing === cache.id ? 'var(--text-muted)' : '#faad14'), width: '100%' }}>
              {clearing === cache.id ? '⏳ 清理中...' : cache.items === 0 ? '✓ 已清空' : '🗑 清除缓存'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 数据源管理 ====================

export const DataSourcePage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [sources, setSources] = useState([
    { id: 1, name: '主数据库', type: 'MySQL', host: '192.168.1.10:3306', database: 'enterprise_main', status: 'connected', latency: '2ms' },
    { id: 2, name: '从数据库', type: 'MySQL', host: '192.168.1.11:3306', database: 'enterprise_slave', status: 'connected', latency: '3ms' },
    { id: 3, name: '缓存数据库', type: 'Redis', host: '192.168.1.12:6379', database: 'db0', status: 'connected', latency: '0.5ms' },
    { id: 4, name: '分析数据库', type: 'PostgreSQL', host: '192.168.1.13:5432', database: 'analytics', status: 'connected', latency: '5ms' },
    { id: 5, name: '测试数据库', type: 'MySQL', host: '10.0.0.20:3306', database: 'test_db', status: 'disconnected', latency: '-' },
  ]);
  const [testing, setTesting] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{ id: number; ok: boolean } | null>(null);

  const testConnection = (id: number) => {
    setTesting(id);
    setTimeout(() => {
      const ok = Math.random() > 0.2;
      setTestResult({ id, ok });
      setTesting(null);
      setTimeout(() => setTestResult(null), 2000);
    }, 1000);
  };

  return (
    <div className="page">
      <PageHeader title="数据源管理" subtitle={`${sources.filter(s => s.status === 'connected').length}/${sources.length} 已连接`} onBack={onBack} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sources.map(source => (
          <div key={source.id} style={{ ...cardStyle, borderLeft: source.status === 'connected' ? '3px solid #52c41a' : '3px solid #f5222d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px' }}>{source.type === 'MySQL' ? '🐬' : source.type === 'Redis' ? '⚡' : '🐘'}</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{source.name}</span>
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: source.status === 'connected' ? '#f6ffed' : '#fff1f0', color: source.status === 'connected' ? '#52c41a' : '#f5222d', marginLeft: 'auto' }}>
                {source.status === 'connected' ? '已连接' : '未连接'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>类型: <strong>{source.type}</strong></span>
              <span>延迟: <strong style={{ color: '#52c41a' }}>{source.latency}</strong></span>
              <span style={{ gridColumn: '1 / -1' }}>地址: <code style={{ fontSize: '11px' }}>{source.host}</code></span>
              <span style={{ gridColumn: '1 / -1' }}>数据库: <code style={{ fontSize: '11px' }}>{source.database}</code></span>
            </div>
            {testResult?.id === source.id && (
              <div style={{ fontSize: '12px', color: testResult.ok ? '#52c41a' : '#f5222d', marginBottom: '6px' }}>
                {testResult.ok ? '✅ 连接成功' : '❌ 连接失败'}
              </div>
            )}
            <button onClick={() => testConnection(source.id)} disabled={testing === source.id}
              style={{ ...btnStyle(testing === source.id ? '#d9d9d9' : '#f0f5ff', testing === source.id ? 'var(--text-muted)' : '#597ef7'), width: '100%' }}>
              {testing === source.id ? '⏳ 测试中...' : '🔗 测试连接'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 存储中心 ====================

export const StoragePage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [files] = useState([
    { id: 1, name: '报表_202609.pdf', size: '2.5MB', type: 'PDF', time: '2026-09-12', path: '/reports/' },
    { id: 2, name: '产品图.png', size: '1.2MB', type: '图片', time: '2026-09-11', path: '/images/' },
    { id: 3, name: '用户数据.xlsx', size: '856KB', type: '表格', time: '2026-09-10', path: '/data/' },
    { id: 4, name: '合同模板.docx', size: '324KB', type: '文档', time: '2026-09-09', path: '/docs/' },
    { id: 5, name: '系统日志.zip', size: '15.8MB', type: '压缩包', time: '2026-09-08', path: '/logs/' },
  ]);
  const [storageInfo] = useState({ used: '20.7GB', total: '100GB', providers: ['本地存储', 'MinIO'] });
  const usagePercent = Math.round((parseFloat(storageInfo.used) / parseFloat(storageInfo.total)) * 100);

  return (
    <div className="page">
      <PageHeader title="存储中心" subtitle={`${storageInfo.used} / ${storageInfo.total}`} onBack={onBack} />
      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>存储使用率</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span>{storageInfo.used}</span><span>{storageInfo.total}</span>
        </div>
        <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ width: `${usagePercent}%`, height: '100%', background: usagePercent > 80 ? '#f5222d' : '#1890ff', borderRadius: '6px' }} />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          适配器: {storageInfo.providers.join(' / ')} · 使用率 {usagePercent}%
        </div>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-muted)' }}>最近文件</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {files.map(file => (
          <div key={file.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{file.type === 'PDF' ? '📄' : file.type === '图片' ? '🖼' : file.type === '表格' ? '📊' : file.type === '文档' ? '📝' : '📦'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{file.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{file.path} · {file.size} · {file.time}</div>
            </div>
            <button style={btnStyle('#f0f5ff', '#597ef7')}>下载</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 参数设置 ====================

export const ParamsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [params, setParams] = useState([
    { id: 1, name: '消息推送', key: 'notify.push', enabled: true, desc: '接收系统推送通知' },
    { id: 2, name: '声音提醒', key: 'notify.sound', enabled: false, desc: '新消息播放提示音' },
    { id: 3, name: '自动登录', key: 'security.autoLogin', enabled: true, desc: '下次打开自动登录' },
    { id: 4, name: '省流模式', key: 'display.dataSaver', enabled: false, desc: '减少图片和数据加载' },
    { id: 5, name: '页面缓存', key: 'display.cache', enabled: true, desc: '缓存已访问页面' },
    { id: 6, name: '错误上报', key: 'system.errorReport', enabled: true, desc: '自动上报错误信息' },
  ]);

  return (
    <div className="page">
      <PageHeader title="参数设置" subtitle="运行参数配置" onBack={onBack} />
      <div style={cardStyle}>
        {params.map((param, index) => (
          <div key={param.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: index < params.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{param.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{param.desc}</div>
              <code style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{param.key}</code>
            </div>
            <div onClick={() => setParams(prev => prev.map(p => p.id === param.id ? { ...p, enabled: !p.enabled } : p))}
              style={{ width: '40px', height: '22px', borderRadius: '11px', background: param.enabled ? 'var(--primary)' : '#d9d9d9', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: param.enabled ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 通知模板 ====================

export const TemplatePage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [templates] = useState([
    { id: 1, name: '用户注册欢迎', channel: '站内信', content: '欢迎 {{realName}} 加入企业管理系统！', updatedAt: '2026-09-10' },
    { id: 2, name: '订单支付成功', channel: '短信', content: '您的订单 {{orderNo}} 已支付成功，金额 ¥{{amount}}。', updatedAt: '2026-09-08' },
    { id: 3, name: '密码重置通知', channel: '邮件', content: '您的密码已重置，新密码：{{tempPassword}}', updatedAt: '2026-09-05' },
    { id: 4, name: '审批提醒', channel: '企微', content: '{{submitter}} 提交了 {{docType}} 审批，请及时处理。', updatedAt: '2026-09-01' },
  ]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const channelIcon: Record<string, string> = { '站内信': '📩', '短信': '📱', '邮件': '📧', '企微': '💬' };

  return (
    <div className="page">
      <PageHeader title="通知模板" subtitle={`${templates.length} 个模板`} onBack={onBack} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {templates.map(t => (
          <div key={t.id} style={cardStyle}>
            <div onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '18px' }}>{channelIcon[t.channel]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.channel} · {t.updatedAt}</div>
              </div>
              <span style={{ fontSize: '10px', transform: expandedId === t.id ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▶</span>
            </div>
            {expandedId === t.id && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#f5f7fa', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 消息推送 ====================

export const PushPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [pushes, setPushes] = useState([
    { id: 1, title: '系统维护通知', channel: '企微', target: '全部用户', status: '已发送', time: '2026-09-12 09:00', opens: 45 },
    { id: 2, title: '新功能上线', channel: '站内信', target: 'VIP用户', status: '已发送', time: '2026-09-11 14:00', opens: 128 },
    { id: 3, title: '活动推广', channel: '短信', target: '活跃用户', status: '已发送', time: '2026-09-10 10:00', opens: 356 },
    { id: 4, title: '安全提醒', channel: '邮件', target: '管理员', status: '草稿', time: '-', opens: 0 },
  ]);
  const [sending, setSending] = useState(false);

  const statusColor: Record<string, string> = { '已发送': '#52c41a', '草稿': '#faad14' };

  return (
    <div className="page">
      <PageHeader title="消息推送" subtitle={`已推送 ${pushes.filter(p => p.status === '已发送').length} 次`} onBack={onBack} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {pushes.map(push => (
          <div key={push.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>{push.title}</span>
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: statusColor[push.status] + '20', color: statusColor[push.status] }}>{push.status}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              渠道: {push.channel} · 目标: {push.target} · 打开: {push.opens}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>时间: {push.time}</div>
            {push.status === '草稿' && (
              <button
                onClick={() => { setSending(true); setTimeout(() => { setPushes(prev => prev.map(p => p.id === push.id ? { ...p, status: '已发送', time: new Date().toLocaleString('zh-CN') } : p)); setSending(false); }, 1000); }}
                disabled={sending}
                style={{ ...btnStyle(sending ? '#d9d9d9' : 'var(--primary)', '#fff'), width: '100%' }}
              >
                {sending ? '⏳ 发送中...' : '📤 立即发送'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 数据统计 ====================

export const StatsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const stats = [
    { label: '今日新增用户', value: '23', change: '+15%', up: true },
    { label: '今日活跃用户', value: '1,256', change: '+8%', up: true },
    { label: '今日订单数', value: '186', change: '+12%', up: true },
    { label: '今日销售额', value: '¥4.2万', change: '-3%', up: false },
    { label: '本周访问量', value: '15,820', change: '+22%', up: true },
    { label: '本周转化率', value: '5.7%', change: '+0.8%', up: true },
    { label: '本月收入', value: '¥28.6万', change: '+5%', up: true },
    { label: '用户总数', value: '12,480', change: '+3%', up: true },
  ];

  return (
    <div className="page">
      <PageHeader title="数据统计" subtitle="核心指标一览" onBack={onBack} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: s.up ? '#52c41a' : '#f5222d' }}>
              {s.up ? '↑' : '↓'} {s.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 趋势分析 ====================

export const TrendPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const data = [65, 78, 52, 91, 84, 45, 38, 72, 88, 95, 62, 75];
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const maxValue = Math.max(...data);

  return (
    <div className="page">
      <PageHeader title="趋势分析" subtitle="月度数据趋势" onBack={onBack} />
      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>访问量趋势</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px' }}>
          {data.map((val, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{val}</div>
              <div style={{ width: '100%', height: `${(val / maxValue) * 100}%`, background: `linear-gradient(180deg, ${i % 2 === 0 ? '#1890ff' : '#69c0ff'} 0%, #bae7ff 100%)`, borderRadius: '3px 3px 0 0', minHeight: '6px' }} />
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', transform: 'scale(0.85)' }}>{labels[i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <div style={{ flex: 1, ...cardStyle, textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>最高月</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#52c41a' }}>95</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10月</div>
        </div>
        <div style={{ flex: 1, ...cardStyle, textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>最低月</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f5222d' }}>38</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>7月</div>
        </div>
        <div style={{ flex: 1, ...cardStyle, textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>平均值</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1890ff' }}>70</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>月均</div>
        </div>
      </div>
    </div>
  );
};

// ==================== 图表展示 ====================

export const ChartsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const pieData = [
    { label: '电子产品', value: 35, color: '#1890ff' },
    { label: '服装配饰', value: 25, color: '#52c41a' },
    { label: '食品饮料', value: 20, color: '#faad14' },
    { label: '家居用品', value: 12, color: '#722ed1' },
    { label: '其他', value: 8, color: '#8c8c8c' },
  ];
  let cumulative = 0;
  const gradient = pieData.map(d => {
    const start = cumulative;
    cumulative += d.value;
    return `${d.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div className="page">
      <PageHeader title="图表展示" subtitle="可视化数据图表" onBack={onBack} />
      {/* 饼图 */}
      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>销售占比</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${gradient})`, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            {pieData.map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: d.color }} />
                <span style={{ flex: 1 }}>{d.label}</span>
                <span style={{ fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 柱状图 */}
      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>周度对比</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
          {[42, 68, 35, 81, 56, 73, 90].map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '100%', height: `${v}%`, background: i === 6 ? '#faad14' : '#1890ff', borderRadius: '4px 4px 0 0', minHeight: '8px' }} />
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== 数据导出 ====================

export const ExportPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [format, setFormat] = useState('CSV');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); }, 1500);
  };

  return (
    <div className="page">
      <PageHeader title="数据导出" subtitle="批量导出业务数据" onBack={onBack} />
      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>导出格式</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['CSV', 'Excel', 'JSON', 'PDF'].map(f => (
            <button key={f} onClick={() => setFormat(f)}
              style={{ ...btnStyle(format === f ? 'var(--primary)' : '#f5f7fa', format === f ? '#fff' : 'var(--text-secondary)'), flex: 1, height: '36px' }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>导出范围</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {['用户数据', '角色数据', '菜单数据', '操作日志'].map(item => (
            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <input type="checkbox" defaultChecked={item === '用户数据'} />
              {item}
            </label>
          ))}
        </div>
        {exported ? (
          <div style={{ textAlign: 'center', padding: '12px', background: '#f6ffed', borderRadius: '8px', color: '#52c41a', fontSize: '13px' }}>
            ✅ 导出成功！文件已下载
          </div>
        ) : (
          <button onClick={handleExport} disabled={exporting}
            style={{ ...btnStyle(exporting ? '#d9d9d9' : 'var(--primary)', '#fff'), width: '100%', height: '40px', fontSize: '14px' }}>
            {exporting ? '⏳ 导出中...' : `📤 导出 ${format}`}
          </button>
        )}
      </div>
    </div>
  );
};

// ==================== 数据大屏 ====================

export const DashboardScreenPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const widgets = [
    { label: '今日访问', value: '3,256', color: '#1890ff', icon: '👁' },
    { label: '今日订单', value: '186', color: '#52c41a', icon: '📦' },
    { label: '今日收入', value: '¥4.2万', color: '#faad14', icon: '💰' },
    { label: '在线用户', value: '89', color: '#f5222d', icon: '👥' },
  ];

  return (
    <div className="page">
      <PageHeader title="数据大屏" subtitle={time.toLocaleTimeString('zh-CN')} onBack={onBack} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {widgets.map(w => (
          <div key={w.label} style={{ ...cardStyle, marginBottom: 0, borderTop: `3px solid ${w.color}`, textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{w.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: w.color }}>{w.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{w.label}</div>
          </div>
        ))}
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>实时数据流</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { time: '10:30:15', event: '用户 admin 登录系统', color: '#52c41a' },
            { time: '10:29:58', event: '新订单 #20260912002 创建', color: '#1890ff' },
            { time: '10:29:42', event: '用户 editor01 更新了数据', color: '#faad14' },
            { time: '10:29:20', event: '系统缓存刷新完成', color: '#722ed1' },
            { time: '10:28:55', event: '新用户注册：user002', color: '#52c41a' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{item.time}</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
              <span>{item.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== 数据计算 ====================

export const CalcPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [op, setOp] = useState('+');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const a = parseFloat(num1), b = parseFloat(num2);
    if (isNaN(a) || isNaN(b)) { setResult('请输入有效数字'); return; }
    const r = op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : op === '÷' ? (b !== 0 ? a / b : NaN) : 0;
    setResult(isNaN(r) ? '除数不能为零' : `= ${r}`);
  };

  return (
    <div className="page">
      <PageHeader title="数据计算" subtitle="快速计算工具" onBack={onBack} />
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
          <input style={{ flex: 1, height: '40px', padding: '0 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none', textAlign: 'center' }} placeholder="数字" value={num1} onChange={e => setNum1(e.target.value)} />
          <select value={op} onChange={e => setOp(e.target.value)} style={{ width: '50px', height: '40px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '18px', textAlign: 'center', outline: 'none' }}>
            <option>+</option><option>-</option><option>×</option><option>÷</option>
          </select>
          <input style={{ flex: 1, height: '40px', padding: '0 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '16px', outline: 'none', textAlign: 'center' }} placeholder="数字" value={num2} onChange={e => setNum2(e.target.value)} />
        </div>
        <button onClick={calculate} style={{ ...btnStyle('var(--primary)', '#fff'), width: '100%', height: '40px', fontSize: '14px' }}>= 计算</button>
        {result && (
          <div style={{ textAlign: 'center', padding: '16px', marginTop: '14px', background: '#f5f7fa', borderRadius: 'var(--radius)', fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== 数据查询 ====================

export const QueryPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState(false);
  const results = [
    { id: 1, name: '用户001', type: '用户', detail: '正常 · 技术中心' },
    { id: 2, name: '订单20260912', type: '订单', detail: '已支付 · ¥299' },
    { id: 3, name: '配置site.name', type: '配置', detail: '企业管理系统' },
  ];

  return (
    <div className="page">
      <PageHeader title="数据查询" subtitle="全局搜索" onBack={onBack} />
      <SearchBar value={keyword} onChange={setKeyword} placeholder="搜索用户/订单/配置..." />
      <button onClick={() => setSearched(true)} style={{ ...btnStyle('var(--primary)', '#fff'), width: '100%', height: '38px', fontSize: '14px', marginBottom: '12px' }}>
        🔍 搜索
      </button>
      {searched && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {results.map(r => (
            <div key={r.id} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#e6f7ff', color: '#1890ff' }}>{r.type}</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{r.name}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{r.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== 服务日志 ====================

export const ServiceLogPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [level, setLevel] = useState('all');
  const logs = [
    { id: 1, time: '10:30:15', level: 'INFO', message: 'Server started on port 11170', source: 'Application' },
    { id: 2, time: '10:30:16', level: 'INFO', message: 'Database connection pool initialized', source: 'DataSource' },
    { id: 3, time: '10:29:58', level: 'WARN', message: 'Cache hit rate below threshold: 85%', source: 'CacheService' },
    { id: 4, time: '10:29:42', level: 'INFO', message: 'User admin logged in from 192.168.1.100', source: 'AuthService' },
    { id: 5, time: '10:28:20', level: 'ERROR', message: 'Failed to connect to test_db: timeout', source: 'DataSource' },
    { id: 6, time: '10:28:15', level: 'INFO', message: 'Scheduled task "数据备份" completed', source: 'Scheduler' },
    { id: 7, time: '10:27:30', level: 'WARN', message: 'Memory usage above 60%', source: 'Monitor' },
  ];
  const filtered = logs.filter(l => level === 'all' || l.level === level);
  const levelColor: Record<string, string> = { INFO: '#52c41a', WARN: '#faad14', ERROR: '#f5222d' };

  return (
    <div className="page">
      <PageHeader title="服务日志" subtitle={`${filtered.length} 条记录`} onBack={onBack} />
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {['all', 'INFO', 'WARN', 'ERROR'].map(l => (
          <button key={l} onClick={() => setLevel(l)}
            style={{ ...btnStyle(level === l ? 'var(--primary)' : '#f5f7fa', level === l ? '#fff' : 'var(--text-secondary)'), flex: 1, height: '30px', fontSize: '11px' }}>
            {l === 'all' ? '全部' : l}
          </button>
        ))}
      </div>
      <div style={{ background: '#1a1a2e', borderRadius: 'var(--radius)', padding: '14px', fontFamily: 'monospace', fontSize: '11px', overflowX: 'auto' }}>
        {filtered.map(log => (
          <div key={log.id} style={{ marginBottom: '6px', lineHeight: 1.5 }}>
            <span style={{ color: '#888' }}>{log.time}</span>
            <span style={{ color: levelColor[log.level], marginLeft: '8px', fontWeight: 600 }}>[{log.level}]</span>
            <span style={{ color: '#aaa', marginLeft: '8px' }}>[{log.source}]</span>
            <div style={{ color: '#ddd', paddingLeft: '60px' }}>{log.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 审计日志页 - 移动端（完整版：搜索+筛选+详情+导出）
 */
import React, { useState, useMemo } from 'react';
import { PageHeader, SearchBar, ConfirmDialog } from '../components';

interface AuditLogsPageProps {
  onBack?: () => void;
}

type TabType = 'login' | 'operation';
type TimeRange = 'today' | 'week' | 'month' | 'all';

interface LoginLog {
  id: number;
  user: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  time: string;
  status: 'success' | 'fail';
  failReason?: string;
}

interface OperationLog {
  id: number;
  user: string;
  action: string;
  target: string;
  module: string;
  time: string;
  ip: string;
  duration: string;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [keyword, setKeyword] = useState('');
  const [dialog, setDialog] = useState({ visible: false });
  const [selectedLog, setSelectedLog] = useState<LoginLog | OperationLog | null>(null);

  const loginLogs: LoginLog[] = [
    { id: 1, user: 'admin', ip: '192.168.1.100', location: '北京市朝阳区', browser: 'Chrome 120', os: 'Windows 11', time: '2026-09-12 09:30:00', status: 'success' },
    { id: 2, user: 'manager', ip: '192.168.1.101', location: '上海市浦东新区', browser: 'Safari 17', os: 'macOS 14', time: '2026-09-12 09:15:00', status: 'success' },
    { id: 3, user: 'user001', ip: '10.0.0.55', location: '广州市天河区', browser: 'Firefox 121', os: 'Windows 10', time: '2026-09-12 08:50:00', status: 'fail', failReason: '密码错误' },
    { id: 4, user: 'admin', ip: '192.168.1.100', location: '北京市朝阳区', browser: 'Chrome 120', os: 'Windows 11', time: '2026-09-12 08:30:00', status: 'success' },
    { id: 5, user: 'editor01', ip: '172.16.0.10', location: '深圳市南山区', browser: 'Edge 120', os: 'Windows 11', time: '2026-09-11 17:45:00', status: 'success' },
    { id: 6, user: 'user002', ip: '192.168.1.200', location: '杭州市西湖区', browser: 'Chrome 119', os: 'macOS 13', time: '2026-09-11 16:20:00', status: 'fail', failReason: '账号已锁定' },
    { id: 7, user: 'viewer01', ip: '10.0.0.88', location: '成都市武侯区', browser: 'Safari 17', os: 'iOS 17', time: '2026-09-11 14:10:00', status: 'success' },
    { id: 8, user: 'admin', ip: '192.168.1.100', location: '北京市朝阳区', browser: 'Chrome 120', os: 'Windows 11', time: '2026-09-11 09:00:00', status: 'success' },
  ];

  const operationLogs: OperationLog[] = [
    { id: 1, user: 'admin', action: '创建角色', target: '财务审核员', module: '角色管理', time: '2026-09-12 09:25:00', ip: '192.168.1.100', duration: '1.2s' },
    { id: 2, user: 'manager', action: '修改用户', target: '王五', module: '用户管理', time: '2026-09-12 09:10:00', ip: '192.168.1.101', duration: '0.8s' },
    { id: 3, user: 'admin', action: '删除日志', target: '128条记录', module: '审计日志', time: '2026-09-12 08:30:00', ip: '192.168.1.100', duration: '0.3s' },
    { id: 4, user: 'editor01', action: '发布内容', target: '新闻公告', module: '内容管理', time: '2026-09-11 16:20:00', ip: '172.16.0.10', duration: '2.1s' },
    { id: 5, user: 'admin', action: '修改配置', target: '系统设置', module: '系统设置', time: '2026-09-11 15:00:00', ip: '192.168.1.100', duration: '0.5s' },
    { id: 6, user: 'manager', action: '导出报表', target: '月度运营数据', module: '数据报表', time: '2026-09-11 14:30:00', ip: '192.168.1.101', duration: '3.5s' },
    { id: 7, user: 'admin', action: '重置密码', target: 'user002', module: '用户管理', time: '2026-09-11 11:00:00', ip: '192.168.1.100', duration: '0.6s' },
    { id: 8, user: 'editor01', action: '编辑菜单', target: '导航配置', module: '菜单管理', time: '2026-09-10 17:45:00', ip: '172.16.0.10', duration: '1.8s' },
  ];

  const filteredLoginLogs = useMemo(() => {
    return loginLogs.filter(log => {
      if (keyword && !log.user.includes(keyword) && !log.ip.includes(keyword) && !log.location.includes(keyword)) return false;
      return true;
    });
  }, [keyword]);

  const filteredOperationLogs = useMemo(() => {
    return operationLogs.filter(log => {
      if (keyword && !log.user.includes(keyword) && !log.action.includes(keyword) && !log.target.includes(keyword)) return false;
      return true;
    });
  }, [keyword]);

  const timeRangeOptions = [
    { label: '全部', value: 'all' },
    { label: '今天', value: 'today' },
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
  ];

  return (
    <div className="page">
      <PageHeader
        title="审计日志"
        subtitle="系统操作记录追踪"
        onBack={onBack}
        right={
          <button
            onClick={() => setDialog({ visible: true })}
            style={{
              height: '32px', padding: '0 12px',
              background: 'var(--bg-card)', color: 'var(--primary)',
              border: '1px solid var(--primary)', borderRadius: 'var(--radius)',
              fontSize: '12px', cursor: 'pointer',
            }}
          >
            📥 导出
          </button>
        }
      />

      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {([['login', '登录日志'], ['operation', '操作日志']] as [TabType, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1, height: '36px',
              background: activeTab === key ? 'var(--primary)' : 'transparent',
              color: activeTab === key ? '#fff' : 'var(--text-secondary)',
              border: 'none', borderRadius: '6px',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {label}
            <span style={{ fontSize: '11px', marginLeft: '4px', opacity: 0.7 }}>
              ({activeTab === key ? (key === 'login' ? filteredLoginLogs.length : filteredOperationLogs.length) : ''})
            </span>
          </button>
        ))}
      </div>

      {/* 搜索 + 时间筛选 */}
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        placeholder={activeTab === 'login' ? '搜索用户/IP/地点' : '搜索用户/操作/目标'}
        filterValue={timeRange}
        onFilterChange={(v) => setTimeRange(v as TimeRange)}
        filterOptions={timeRangeOptions}
      />

      {/* 日志列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {activeTab === 'login' ? (
          filteredLoginLogs.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-text">暂无登录记录</div></div>
          ) : (
            filteredLoginLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer',
                  borderLeft: log.status === 'success' ? '3px solid #52c41a' : '3px solid #f5222d',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{log.status === 'success' ? '✅' : '❌'}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{log.user}</span>
                  <span style={{
                    fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                    background: log.status === 'success' ? '#f6ffed' : '#fff1f0',
                    color: log.status === 'success' ? '#52c41a' : '#f5222d',
                  }}>
                    {log.status === 'success' ? '成功' : '失败'}
                  </span>
                  {log.failReason && (
                    <span style={{ fontSize: '11px', color: 'var(--danger)' }}>({log.failReason})</span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>{log.time.split(' ')[1]}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span>📍 {log.location}</span>
                  <span>🌐 {log.ip}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  🖥 {log.browser} · {log.os}
                </div>
              </div>
            ))
          )
        ) : (
          filteredOperationLogs.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-text">暂无操作记录</div></div>
          ) : (
            filteredOperationLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>📝</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{log.user}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{log.action}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>{log.time.split(' ')[1]}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  目标：<strong>{log.target}</strong> · {log.module}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                  <span>🌐 {log.ip}</span>
                  <span>⏱ {log.duration}</span>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* 日志详情弹窗 */}
      {selectedLog && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setSelectedLog(null)}>
          <div style={{
            width: 'calc(100vw - 48px)',
            maxWidth: '340px',
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            maxHeight: '70vh',
            overflowY: 'auto',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
              {activeTab === 'login' ? '登录详情' : '操作详情'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {'status' in selectedLog ? (
                <>
                  <div className="detail-row"><span className="detail-label">用户</span><span className="detail-value">{selectedLog.user}</span></div>
                  <div className="detail-row"><span className="detail-label">状态</span><span className="detail-value" style={{ color: selectedLog.status === 'success' ? '#52c41a' : '#f5222d' }}>{selectedLog.status === 'success' ? '成功' : '失败'}</span></div>
                  {selectedLog.failReason && <div className="detail-row"><span className="detail-label">失败原因</span><span className="detail-value" style={{ color: '#f5222d' }}>{selectedLog.failReason}</span></div>}
                  <div className="detail-row"><span className="detail-label">IP地址</span><span className="detail-value">{selectedLog.ip}</span></div>
                  <div className="detail-row"><span className="detail-label">地点</span><span className="detail-value">{selectedLog.location}</span></div>
                  <div className="detail-row"><span className="detail-label">浏览器</span><span className="detail-value">{selectedLog.browser}</span></div>
                  <div className="detail-row"><span className="detail-label">操作系统</span><span className="detail-value">{selectedLog.os}</span></div>
                  <div className="detail-row"><span className="detail-label">时间</span><span className="detail-value">{selectedLog.time}</span></div>
                </>
              ) : (
                <>
                  <div className="detail-row"><span className="detail-label">用户</span><span className="detail-value">{selectedLog.user}</span></div>
                  <div className="detail-row"><span className="detail-label">操作</span><span className="detail-value">{selectedLog.action}</span></div>
                  <div className="detail-row"><span className="detail-label">目标</span><span className="detail-value">{selectedLog.target}</span></div>
                  <div className="detail-row"><span className="detail-label">模块</span><span className="detail-value">{selectedLog.module}</span></div>
                  <div className="detail-row"><span className="detail-label">IP地址</span><span className="detail-value">{selectedLog.ip}</span></div>
                  <div className="detail-row"><span className="detail-label">耗时</span><span className="detail-value">{selectedLog.duration}</span></div>
                  <div className="detail-row"><span className="detail-label">时间</span><span className="detail-value">{selectedLog.time}</span></div>
                </>
              )}
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              style={{
                width: '100%', height: '36px', marginTop: '16px',
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

      {/* 导出确认 */}
      <ConfirmDialog
        visible={dialog.visible}
        title="导出日志"
        content="确定要导出当前日志数据吗？导出格式为 CSV。"
        onConfirm={() => setDialog({ visible: false })}
        onCancel={() => setDialog({ visible: false })}
        confirmText="导出"
      />
    </div>
  );
};

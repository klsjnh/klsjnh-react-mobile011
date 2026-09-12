/**
 * 帮助与反馈页 - 移动端（完整版：FAQ+反馈表单+反馈历史+联系）
 */
import React, { useState } from 'react';
import { PageHeader, ConfirmDialog } from '../components';

interface HelpPageProps {
  onBack?: () => void;
}

type FeedbackCategory = 'bug' | 'feature' | 'other';

interface FeedbackItem {
  id: number;
  category: string;
  content: string;
  time: string;
  status: 'pending' | 'replied';
  reply?: string;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>('bug');
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([
    { id: 1, category: '功能建议', content: '希望增加深色模式支持', time: '2026-09-10 14:30', status: 'replied', reply: '感谢您的建议，深色模式已在开发计划中，预计下月上线。' },
    { id: 2, category: '问题反馈', content: '用户列表页面加载较慢', time: '2026-09-08 09:15', status: 'pending' },
  ]);
  const [dialog, setDialog] = useState({ visible: false });
  const [showHistory, setShowHistory] = useState(false);

  const faqs = [
    { q: '如何创建新用户？', a: '点击底部「用户」Tab → 点击右上角「+ 新建」→ 填写表单（用户名、姓名、邮箱、手机号、部门、角色、密码）→ 点击保存。新建用户默认状态为「正常」。' },
    { q: '如何修改用户权限？', a: '进入用户详情 → 点击右上角「编辑」→ 修改角色 → 保存。角色决定了用户的权限范围，不同角色拥有不同的操作权限。' },
    { q: '忘记密码怎么办？', a: '请联系系统管理员重置密码。管理员可在用户详情页直接重置密码，新密码会以邮件形式发送给用户。' },
    { q: '如何分配角色权限？', a: '进入「角色管理」→ 选择角色 → 点击「权限」可查看当前权限 → 点击「编辑」可修改权限。权限以标签形式展示，点击可切换选中状态。' },
    { q: '系统支持哪些浏览器？', a: '推荐使用 Chrome 120+、Safari 17+、Firefox 121+、Edge 120+ 等主流浏览器的最新版本。移动端支持 iOS Safari 和 Android Chrome。' },
    { q: '如何导出数据报表？', a: '进入「数据报表」页面 → 点击底部「导出报表」按钮 → 选择导出格式（CSV/Excel）→ 确认导出。导出文件会自动下载到本地。' },
    { q: '审计日志保留多久？', a: '系统默认保留 90 天的审计日志。超过 90 天的日志会自动归档，如需更长时间保留请联系系统管理员调整配置。' },
    { q: '如何修改个人信息？', a: '点击底部「我的」Tab → 点击右上角设置图标 → 进入个人信息页面 → 修改后保存。可修改的信息包括：头像、手机号、邮箱。' },
  ];

  const categoryOptions: { value: FeedbackCategory; label: string; icon: string }[] = [
    { value: 'bug', label: '问题反馈', icon: '🐛' },
    { value: 'feature', label: '功能建议', icon: '💡' },
    { value: 'other', label: '其他', icon: '💬' },
  ];

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;
    const newFeedback: FeedbackItem = {
      id: Date.now(),
      category: categoryOptions.find(c => c.value === feedbackCategory)?.label || '',
      content: feedback,
      time: new Date().toLocaleString('zh-CN'),
      status: 'pending',
    };
    setFeedbackHistory(prev => [newFeedback, ...prev]);
    setFeedback('');
    setContact('');
    setDialog({ visible: true });
  };

  return (
    <div className="page">
      <PageHeader
        title="帮助与反馈"
        subtitle="常见问题与意见反馈"
        onBack={onBack}
        right={
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              height: '32px', padding: '0 12px',
              background: 'var(--bg-card)', color: 'var(--primary)',
              border: '1px solid var(--primary)', borderRadius: 'var(--radius)',
              fontSize: '12px', cursor: 'pointer',
            }}
          >
            {showHistory ? '💬 反馈' : '📋 历史'}
          </button>
        }
      />

      {!showHistory ? (
        <>
          {/* 常见问题 */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, padding: '14px', borderBottom: '1px solid var(--border-light)' }}>
              常见问题 <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>({faqs.length} 条)</span>
            </div>
            {faqs.map((faq, index) => (
              <div key={index} style={{ borderBottom: index < faqs.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                <div
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px', cursor: 'pointer' }}
                >
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: '#e6f7ff', color: '#1890ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 600, flexShrink: 0,
                  }}>Q</span>
                  <span style={{ flex: 1, fontSize: '14px' }}>{faq.q}</span>
                  <span style={{ fontSize: '12px', transform: expandedFaq === index ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▶</span>
                </div>
                {expandedFaq === index && (
                  <div style={{ padding: '0 14px 14px 42px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 意见反馈 */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>意见反馈</div>

            {/* 分类选择 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFeedbackCategory(cat.value)}
                  style={{
                    flex: 1, height: '36px',
                    background: feedbackCategory === cat.value ? '#e6f7ff' : '#f5f7fa',
                    border: '1px solid ' + (feedbackCategory === cat.value ? '#91d5ff' : 'transparent'),
                    borderRadius: 'var(--radius)', fontSize: '12px',
                    color: feedbackCategory === cat.value ? '#1890ff' : 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* 反馈内容 */}
            <textarea
              style={{
                width: '100%', height: '100px', padding: '12px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                fontSize: '14px', outline: 'none', resize: 'none',
              }}
              placeholder="请详细描述您的问题或建议..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            {/* 联系方式 */}
            <input
              style={{
                width: '100%', height: '38px', padding: '0 12px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                fontSize: '14px', outline: 'none', marginTop: '8px',
              }}
              placeholder="选填：手机号/邮箱，方便我们联系您"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            {/* 提交按钮 */}
            <button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim()}
              style={{
                width: '100%', height: '40px', marginTop: '12px',
                background: feedback.trim() ? 'var(--primary)' : '#d9d9d9',
                color: '#fff', border: 'none', borderRadius: 'var(--radius)',
                fontSize: '14px', fontWeight: 500,
                cursor: feedback.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              提交反馈
            </button>
          </div>

          {/* 联系方式 */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginTop: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>其他联系方式</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '📧', label: '邮箱', value: 'support@enterprise.com' },
                { icon: '📞', label: '电话', value: '400-123-4567' },
                { icon: '💬', label: '微信', value: 'EnterpriseAdmin' },
                { icon: '🕐', label: '服务时间', value: '周一至周五 9:00-18:00' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</div>
                    <div style={{ fontSize: '14px' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* 反馈历史 */
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
            反馈历史 <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>({feedbackHistory.length} 条)</span>
          </div>
          {feedbackHistory.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-text">暂无反馈记录</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {feedbackHistory.map((item) => (
                <div key={item.id} style={{ padding: '12px', background: '#f5f7fa', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: '#e6f7ff', color: '#1890ff' }}>{item.category}</span>
                    <span style={{
                      fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
                      background: item.status === 'replied' ? '#f6ffed' : '#fff7e6',
                      color: item.status === 'replied' ? '#52c41a' : '#faad14',
                    }}>
                      {item.status === 'replied' ? '已回复' : '待处理'}
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.content}</div>
                  {item.reply && (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '8px', background: '#fff', borderRadius: '6px', marginTop: '6px' }}>
                      <span style={{ color: '#52c41a' }}>官方回复：</span>{item.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 提交成功提示 */}
      <ConfirmDialog
        visible={dialog.visible}
        title="提交成功"
        content="您的反馈已提交成功，我们会尽快处理并回复您！"
        onConfirm={() => setDialog({ visible: false })}
        onCancel={() => setDialog({ visible: false })}
        confirmText="好的"
      />
    </div>
  );
};

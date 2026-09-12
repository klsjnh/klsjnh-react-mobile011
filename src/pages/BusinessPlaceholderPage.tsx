/**
 * 业务功能占位页 - 移动端（用于尚未实现的具体功能）
 */
import React from 'react';
import { PageHeader } from '../components';

interface BusinessPlaceholderPageProps {
  title: string;
  path?: string;
  onBack?: () => void;
}

/** 业务名称 → 描述信息映射 */
const businessInfo: Record<string, { desc: string; icon: string; features: string[] }> = {
  '/business/config': { desc: '系统参数配置管理', icon: '⚙️', features: ['参数增删改查', '配置分组', '配置导出'] },
  '/business/scheduler': { desc: '定时任务调度管理', icon: '⏰', features: ['任务启停', 'Cron 表达式', '执行日志'] },
  '/business/datasource': { desc: '动态数据源管理', icon: '🗄', features: ['多数据源注册', '连接测试', '负载路由'] },
  '/business/storage': { desc: '文件存储中心', icon: '💾', features: ['本地上传', 'MinIO 适配', '文件预览'] },
  '/business/params': { desc: '运行参数设置', icon: '📜', features: ['系统参数', '业务参数', '安全参数'] },
  '/business/dict': { desc: '数据字典管理', icon: '📖', features: ['字典分类', '字典项管理', '字典引用'] },
  '/business/template': { desc: '通知消息模板', icon: '✉️', features: ['模板编辑', '变量替换', '发送记录'] },
  '/business/push': { desc: '消息推送服务', icon: '📣', features: ['企微推送', '短信通知', '邮件发送'] },
  '/business/stats': { desc: '业务数据统计', icon: '📊', features: ['维度分析', '指标对比', '汇总报表'] },
  '/business/trend': { desc: '数据趋势分析', icon: '📈', features: ['时间序列', '同比环比', '趋势预测'] },
  '/business/charts': { icon: '🎛', desc: '可视化图表展示', features: ['柱状图', '折线图', '饼图'] },
  '/business/export': { icon: '📤', desc: '数据批量导出', features: ['CSV 导出', 'Excel 导出', '批量下载'] },
  '/business/dashboard': { icon: '🖥', desc: '数据可视化大屏', features: ['实时刷新', '多维展示', '全屏模式'] },
  '/business/calc': { icon: '🧮', desc: '数据计算引擎', features: ['公式计算', '聚合分析', '自定义脚本'] },
  '/business/query': { icon: '🔍', desc: '灵活数据查询', features: ['条件构建', '多表关联', '结果导出'] },
  '/business/monitor': { icon: '📡', desc: '系统运行监控', features: ['CPU/内存', '接口耗时', '告警通知'] },
  '/business/online': { icon: '👤', desc: '在线用户管理', features: ['在线列表', '强制下线', '会话信息'] },
  '/business/cache': { icon: '🧹', desc: '系统缓存管理', features: ['缓存统计', '手动清理', '过期策略'] },
  '/business/servicelog': { icon: '🔄', desc: '服务运行日志', features: ['启动日志', '运行日志', '错误日志'] },
};

export const BusinessPlaceholderPage: React.FC<BusinessPlaceholderPageProps> = ({ title, path, onBack }) => {
  const info = businessInfo[path || ''] || { desc: '业务功能开发中', icon: '🚧', features: [] };

  return (
    <div className="page">
      <PageHeader title={title} subtitle={info.desc} onBack={onBack} />

      {/* 功能图标 */}
      <div style={{ textAlign: 'center', padding: '32px 0 16px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>{info.icon}</div>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{info.desc}</div>
      </div>

      {/* 功能特性 */}
      {info.features.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '12px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>规划功能</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {info.features.map((feature) => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--primary)' }}>✓</span>
                <span style={{ fontSize: '13px' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 开发状态 */}
      <div style={{
        background: '#fffbe6',
        border: '1px solid #ffe58f',
        borderRadius: 'var(--radius)',
        padding: '14px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{ fontSize: '20px' }}>🚧</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>开发计划中</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>该模块正在规划与开发阶段，敬请期待</div>
        </div>
      </div>
    </div>
  );
};

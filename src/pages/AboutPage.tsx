/**
 * 关于我们页 - 移动端
 */
import React from 'react';
import { PageHeader } from '../components';

interface AboutPageProps {
  onBack?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => (
  <div className="page">
    <PageHeader title="关于我们" subtitle="Mobile Admin Framework" onBack={onBack} />

    {/* Logo 和版本 */}
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: '56px', marginBottom: '12px' }}>🏢</div>
      <div style={{ fontSize: '20px', fontWeight: 700 }}>移动管理系统</div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Mobile Admin Framework v1.0.0</div>
    </div>

    {/* 功能特性 */}
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>功能特性</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { icon: '👥', label: '用户管理', desc: '完整的用户账号管理体系' },
          { icon: '🛡', label: '角色权限', desc: '细粒度的角色与权限控制' },
          { icon: '📋', label: '菜单管理', desc: '灵活的导航菜单配置' },
          { icon: '📊', label: '数据报表', desc: '多维度业务数据分析' },
          { icon: '📝', label: '审计日志', desc: '完整的操作记录追踪' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 技术栈 */}
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>技术栈</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['React 18', 'TypeScript', 'Vite 6', 'TDesign Mobile', 'React Router', 'Zustand'].map((tech) => (
          <span key={tech} style={{ padding: '4px 10px', background: '#f0f5ff', color: '#597ef7', borderRadius: '12px', fontSize: '12px' }}>
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* 联系方式 */}
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>联系我们</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <div>📧 support@enterprise.com</div>
        <div>📞 400-123-4567</div>
        <div>🌐 www.enterprise.com</div>
      </div>
    </div>

    {/* 版权 */}
    <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '24px' }}>
      © 2026 Enterprise Admin Framework. All rights reserved.
    </div>
  </div>
);

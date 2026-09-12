/**
 * 系统设置页 - 移动端
 */
import React, { useState } from 'react';
import { PageHeader } from '../components';

interface SettingsPageProps {
  onBack?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    notify: true,
    darkMode: false,
    autoLogin: true,
    sound: false,
    vibration: true,
    language: 'zh',
    cacheSize: '128MB',
  });

  const toggleSetting = (key: 'notify' | 'darkMode' | 'autoLogin' | 'sound' | 'vibration') => {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div className="page">
      <PageHeader title="系统设置" subtitle="个性化配置" onBack={onBack} />

      {/* 通知设置 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, padding: '12px 14px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>通知设置</div>
        {[
          { key: 'notify' as const, icon: '🔔', label: '消息推送', desc: '接收系统通知和消息提醒' },
          { key: 'sound' as const, icon: '🔊', label: '声音提醒', desc: '新消息时播放提示音' },
          { key: 'vibration' as const, icon: '📳', label: '震动反馈', desc: '操作时震动反馈' },
        ].map((item) => (
          <div key={item.key} onClick={() => toggleSetting(item.key)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px' }}>{item.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
            <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: settings[item.key] ? 'var(--primary)' : '#d9d9d9', position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: settings[item.key] ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* 通用设置 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, padding: '12px 14px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>通用设置</div>
        <div onClick={() => toggleSetting('darkMode')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>🌙</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px' }}>深色模式</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>护眼深色主题</div>
          </div>
          <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: settings.darkMode ? 'var(--primary)' : '#d9d9d9', position: 'relative' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: settings.darkMode ? '20px' : '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
        <div onClick={() => toggleSetting('autoLogin')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>🔓</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px' }}>自动登录</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>下次打开自动登录</div>
          </div>
          <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: settings.autoLogin ? 'var(--primary)' : '#d9d9d9', position: 'relative' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: settings.autoLogin ? '20px' : '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>🌐</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px' }}>语言</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>简体中文</div>
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>›</span>
        </div>
      </div>

      {/* 存储 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, padding: '12px 14px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>存储管理</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>💾</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px' }}>清除缓存</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>当前缓存 {settings.cacheSize}</div>
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>›</span>
        </div>
      </div>
    </div>
  );
};

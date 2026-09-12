/**
 * 登录页面 - 移动端
 */
import React, { useState, useCallback } from 'react';
import { mockApi } from '../mock';
import { authStore } from '../stores/authStore';

export const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!form.username.trim()) {
      setError('请输入用户名');
      return false;
    }
    if (!form.password.trim()) {
      setError('请输入密码');
      return false;
    }
    if (form.password.length < 6) {
      setError('密码长度不能少于6位');
      return false;
    }
    return true;
  };

  const handleLogin = useCallback(async () => {
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await mockApi.login(form.username, form.password);
      if (res.code === 0 && res.data) {
        authStore.login(res.data.token, res.data.user);
      } else {
        setError(res.message || '登录失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [form]);

  const fillAccount = (username: string, password: string) => {
    setForm({ username, password });
    setError('');
  };

  return (
    <div className="login-page">
      {/* Logo */}
      <div className="login-logo">
        <div className="logo-icon">🏢</div>
        <h1>移动管理系统</h1>
        <p>Mobile Admin Framework</p>
      </div>

      {/* 登录表单 */}
      <div className="login-form">
        <h2>账号登录</h2>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--danger)',
          }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>用户名</div>
            <input
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '16px',
                outline: 'none',
              }}
              placeholder="请输入用户名"
              value={form.username}
              onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>密码</div>
            <input
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '16px',
                outline: 'none',
              }}
              type="password"
              placeholder="请输入密码"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: '44px',
            background: loading ? '#a0c4ff' : 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: '16px', height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                display: 'inline-block',
              }} />
              登录中...
            </>
          ) : (
            '登 录'
          )}
        </button>
      </div>

      {/* 快速登录 */}
      <div className="quick-login">
        <div className="quick-login-title">快速登录</div>
        <div className="quick-btns">
          <button
            onClick={() => fillAccount('admin', 'admin123')}
            style={{
              height: '36px',
              background: '#f0f5ff',
              border: '1px solid #d6e4ff',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#597ef7',
            }}
          >
            👑 管理员
          </button>
          <button
            onClick={() => fillAccount('manager', 'manager123')}
            style={{
              height: '36px',
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#52c41a',
            }}
          >
            🛡 经理
          </button>
          <button
            onClick={() => fillAccount('user', 'user123')}
            style={{
              height: '36px',
              background: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#faad14',
            }}
          >
            👤 员工
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        © 2026 Mobile Admin Framework
      </div>
    </div>
  );
};

/**
 * 确认弹窗组件
 */
import React from 'react';

interface ConfirmDialogProps {
  visible: boolean;
  title?: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title = '提示',
  content,
  onConfirm,
  onCancel,
  confirmText = '确定',
  cancelText = '取消',
  danger = false,
}) => {
  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: 'calc(100vw - 64px)',
        maxWidth: '320px',
        background: '#fff',
        borderRadius: '12px',
        padding: '24px 20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{title}</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>{content}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, height: '40px',
              background: '#fff', color: 'var(--text-secondary)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              fontSize: '14px', cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, height: '40px',
              background: danger ? 'var(--danger)' : 'var(--primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius)',
              fontSize: '14px', cursor: 'pointer',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

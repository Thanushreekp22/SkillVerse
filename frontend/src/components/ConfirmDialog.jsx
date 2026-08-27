import React, { useEffect } from 'react';

/**
 * In-page confirmation dialog (replaces browser window.confirm alerts).
 * Usage:
 *   <ConfirmDialog open={bool} title="..." message="..." danger
 *     confirmText="Yes, delete" loading={bool}
 *     onConfirm={fn} onCancel={fn} />
 */
const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes, continue',
  cancelText = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => !loading && onCancel?.()} role="dialog" aria-modal="true">
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {message && <p className="confirm-message">{message}</p>}
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onCancel?.()}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
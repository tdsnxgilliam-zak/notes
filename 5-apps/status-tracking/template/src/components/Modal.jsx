/**
 * Generic modal dialog. Children define the form; onSubmit is called when
 * the primary action is clicked. Closes on backdrop click or Escape.
 */
import { useEffect } from 'react';

export default function Modal({ title, submitLabel = 'Add', onSubmit, onClose, children, disableSubmit = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!disableSubmit) onSubmit();
          }}
        >
          {children}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={disableSubmit}>
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="modal-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

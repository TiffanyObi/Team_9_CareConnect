import { useEffect, useRef } from 'react';

export function LogoutDialog({ open, onCancel, onConfirm }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const focusable = dialogRef.current?.querySelectorAll('button:not([disabled])');
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, open]);

  if (!open) return null;
  return (
    <div className="dialog-layer">
      <div className="dialog-backdrop" aria-hidden="true" />
      <section
        ref={dialogRef}
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-description"
      >
        <h2 id="logout-title">Log out of CareConnect?</h2>
        <p id="logout-description">Your information will remain saved to this browser for your next visit.</p>
        <div className="form-actions">
          <button ref={cancelRef} className="button button--secondary" type="button" onClick={onCancel}>Stay logged in</button>
          <button className="button button--primary" type="button" onClick={onConfirm}>Log out</button>
        </div>
      </section>
    </div>
  );
}

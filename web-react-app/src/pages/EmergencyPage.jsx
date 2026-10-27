import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function EmergencyPage() {
  const [noticeOpen, setNoticeOpen] = useState(false);
  const callButtonRef = useRef(null);

  const closeNotice = useCallback(() => {
    callButtonRef.current?.focus();
    setNoticeOpen(false);
  }, []);

  useEffect(() => {
    if (!noticeOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeNotice();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [closeNotice, noticeOpen]);

  return (
    <>
      <div className="page-heading-row">
        <PageHeader title="Emergency assistance" description="Use only when you or someone else may be in danger" />
        <Link className="button button--secondary" to="/care">Back to Care</Link>
      </div>
      <section className="emergency-card" aria-labelledby="location-title">
        <h2 id="location-title">Your location</h2>
        <p>This prototype does not access or share your location.</p>
      </section>
      <section className="emergency-card" aria-labelledby="emergency-options-title">
        <h2 id="emergency-options-title">Urgent options</h2>
        <p>If this were a real emergency, use your phone to contact your local emergency number.</p>
        <button ref={callButtonRef} className="button button--emergency" type="button" onClick={() => setNoticeOpen(true)}>Call emergency services</button>
      </section>
      <section className="emergency-card" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title">What happens in this demo</h2>
        <p>The button opens a static confirmation only. No call is placed, no alert is sent, and no response is recorded.</p>
      </section>
      {noticeOpen && (
        <div className="dialog-layer">
          <div className="dialog-backdrop" aria-hidden="true" />
          <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="emergency-dialog-title" aria-describedby="emergency-dialog-description">
            <h2 id="emergency-dialog-title">Demo only — no call placed</h2>
            <p id="emergency-dialog-description">CareConnect cannot call emergency services. Use your phone to contact your local emergency number.</p>
            <button className="button button--primary" type="button" autoFocus onClick={closeNotice}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

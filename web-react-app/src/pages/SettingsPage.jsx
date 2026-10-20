import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PreferenceFields } from '../components/PreferenceFields';
import { useAuth } from '../state/AuthContext';

export function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [preferences, setPreferences] = useState(user.preferences);
  const [saved, setSaved] = useState(false);

  const updatePreference = (name, value) => {
    setPreferences((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const submit = (event) => {
    event.preventDefault();
    updateProfile({ name: name.trim(), preferences });
    setSaved(true);
  };

  return (
    <>
      <PageHeader title="Settings" description="Personalize your CareConnect web experience" />
      {saved && <p className="settings-status" role="status">Your settings were saved for this account.</p>}
      <form className="settings-form" onSubmit={submit}>
        <section className="settings-card" aria-labelledby="profile-settings-title">
          <h2 id="profile-settings-title">Profile</h2>
          <div className="form-field"><label htmlFor="settings-name">Full name</label><input id="settings-name" required value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} /></div>
          <div className="form-field"><label htmlFor="settings-email">Email</label><input id="settings-email" type="email" value={user.email} readOnly /><p className="field-help">Email changes are not available in this local demo.</p></div>
        </section>

        <section className="settings-card" aria-labelledby="notification-settings-title">
          <h2 id="notification-settings-title">Notifications</h2>
          <label className="toggle-row"><span><strong>Appointment reminders</strong><small>Show reminders for upcoming care visits.</small></span><input type="checkbox" checked={preferences.appointmentReminders} onChange={(event) => updatePreference('appointmentReminders', event.target.checked)} /></label>
          <label className="toggle-row"><span><strong>Email updates</strong><small>Receive non-urgent account updates.</small></span><input type="checkbox" checked={preferences.emailUpdates} onChange={(event) => updatePreference('emailUpdates', event.target.checked)} /></label>
        </section>

        <section className="settings-card" aria-labelledby="display-settings-title">
          <h2 id="display-settings-title">Display preferences</h2>
          <PreferenceFields preferences={preferences} onChange={(next) => { setPreferences(next); setSaved(false); }} compact />
        </section>

        <section className="settings-card" aria-labelledby="accessibility-settings-title">
          <h2 id="accessibility-settings-title">Accessibility</h2>
          <p className="settings-card__description">CareConnect avoids flashing content and autoplay. Status is communicated with text, not color alone.</p>
          <p className="settings-card__description"><strong>Keyboard:</strong> Use Tab and Shift+Tab to move, Enter or Space to activate, and Escape to close dialogs.</p>
        </section>

        <section className="settings-card" aria-labelledby="privacy-settings-title">
          <h2 id="privacy-settings-title">Privacy</h2>
          <label className="toggle-row"><span><strong>Share care notes</strong><small>Allow notes marked for sharing to be visible to a caregiver.</small></span><input type="checkbox" checked={preferences.shareCareNotes} onChange={(event) => updatePreference('shareCareNotes', event.target.checked)} /></label>
          <p className="settings-card__description">Only information you explicitly choose to share should leave your personal view.</p>
        </section>

        <section className="settings-card" aria-labelledby="account-settings-title">
          <h2 id="account-settings-title">Account</h2>
          <p className="settings-card__description">This coursework prototype stores the account locally in this browser. It is not a production health-data service.</p>
          <p className="settings-card__description"><strong>Signed in as:</strong> {user.email}</p>
        </section>

        <div className="settings-actions"><button className="button button--primary" type="submit">Save settings</button></div>
      </form>
    </>
  );
}

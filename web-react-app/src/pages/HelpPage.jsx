import { PageHeader } from '../components/PageHeader';

function isMacPlatform() {
  const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
  return /mac|iphone|ipad|ipod/i.test(platform);
}

export function HelpPage() {
  const isMac = isMacPlatform();
  const modifier = isMac ? '⌘ Command' : 'Ctrl';
  const shortcuts = [
    { action: 'Open Dashboard', keys: `${modifier} + 1` },
    { action: 'Open Appointments', keys: `${modifier} + 2` },
    { action: 'Create a new appointment', keys: `${modifier} + N` },
    { action: 'Find visits', keys: `${modifier} + F` },
    { action: 'Open Settings', keys: isMac ? '⌘ Command + ,' : 'Ctrl + ,' },
    { action: 'Save the new appointment form', keys: `${modifier} + S`, note: 'Available while creating a new appointment.' },
    { action: 'Open Help & shortcuts', keys: 'F1' },
    { action: 'Move between app areas', keys: 'F6 / Shift + F6' },
  ];

  return (
    <>
      <PageHeader title="Help & shortcuts" description="Keyboard shortcuts for your care workspace" />
      <section className="help-shortcuts" aria-labelledby="app-shortcuts-heading">
        <div className="help-shortcuts__heading">
          <h2 id="app-shortcuts-heading">{isMac ? 'Mac' : 'Windows'} keyboard shortcuts</h2>
          <p>Shortcuts work when the page has focus. Navigation shortcuts are ignored while you are typing in a text field.</p>
        </div>
        <dl className="shortcut-list">
          {shortcuts.map(({ action, keys, note }) => (
            <div className="shortcut-list__item" key={action}>
              <dt>{action}{note && <span className="shortcut-list__note">{note}</span>}</dt>
              <dd><kbd>{keys}</kbd></dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="help-shortcuts help-shortcuts--standard" aria-labelledby="standard-shortcuts-heading">
        <div className="help-shortcuts__heading">
          <h2 id="standard-shortcuts-heading">Standard keyboard controls</h2>
          <p>These browser and accessibility controls work throughout the app.</p>
        </div>
        <dl className="shortcut-list">
          <div className="shortcut-list__item">
            <dt>Move to the next or previous control</dt>
            <dd><kbd>Tab</kbd><span aria-hidden="true"> / </span><kbd>Shift + Tab</kbd></dd>
          </div>
          <div className="shortcut-list__item">
            <dt>Activate a link or button</dt>
            <dd><kbd>Enter</kbd><span aria-hidden="true"> / </span><kbd>Space</kbd></dd>
          </div>
          <div className="shortcut-list__item">
            <dt>Close an open dialog or mobile menu</dt>
            <dd><kbd>Escape</kbd></dd>
          </div>
          <div className="shortcut-list__item">
            <dt>Open the browser context menu</dt>
            <dd><kbd>Shift + F10</kbd><span aria-hidden="true"> / </span><kbd>Menu</kbd></dd>
          </div>
        </dl>
      </section>
      <p className="help-shortcuts__note">
        The desktop app also has appointment-note and visit-list shortcuts. This web app does not include editable visit notes or a keyboard-operated visit list; use the visit links and the appointment form instead. Find visits opens the Search Visits page.
      </p>
    </>
  );
}

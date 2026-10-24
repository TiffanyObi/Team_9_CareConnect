import { Link } from 'react-router-dom';

export function RouteErrorPage() {
  return <main className="recovery-page"><h1>This page could not load</h1><p>Check your connection, then try again. Saved entries on this device have not been changed.</p><button className="button button--primary" type="button" onClick={() => window.location.reload()}>Try loading again</button><p><a href="/">Return to dashboard</a></p></main>;
}

export function NotFoundPage() {
  return <section className="message-panel"><h1>Page not found</h1><p>The link may be out of date. Choose a page from the menu or return to your dashboard.</p><Link className="button button--primary" to="/">Return to dashboard</Link></section>;
}

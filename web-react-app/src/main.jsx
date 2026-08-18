import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main>
      <header><span>Care</span>Connect</header>
      <section aria-labelledby="welcome-title">
        <p className="platform">React + Vite web application</p>
        <h1 id="welcome-title">Hello, SWEN 661!</h1>
        <p className="lead">The Team 9 React starter is running successfully.</p>
        <div className="status" role="status">
          <span className="check" aria-hidden="true">✓</span>
          <strong>Visual safety: no animation, autoplay, or flashing effects.</strong>
        </div>
      </section>
      <footer>Team 9 · Care Recipient UI · Photosensitive Epilepsy</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
);

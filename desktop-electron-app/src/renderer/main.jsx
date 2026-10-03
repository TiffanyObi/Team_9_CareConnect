import {createRoot} from 'react-dom/client';

import {App} from './App.jsx';
import {DemoSession} from './auth/DemoSession.jsx';

createRoot(document.getElementById('root')).render(
  <DemoSession>
    {(user, onLogout) => <App key={user.id} user={user} onLogout={onLogout}/>} 
  </DemoSession>,
);

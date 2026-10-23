import {createRoot} from 'react-dom/client';
import './index.css';

const isAdminRoute = /^\/admin\/?$/.test(window.location.pathname);
const root = createRoot(document.getElementById('root')!);
root.render(<div className="grid h-screen place-items-center bg-[#0b0809] text-sm text-amber-100/70">Opening Nimantran Studio…</div>);
if (isAdminRoute) {
  import('./components/AdminPanel').then(({ AdminPanel }) => root.render(<AdminPanel />));
} else {
  import('./App.tsx').then(({ default: App }) => root.render(<App />));
}

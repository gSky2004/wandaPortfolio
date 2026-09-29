import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiBarChart2, FiGrid, FiLogOut, FiMail, FiHome, FiMessageSquare, FiVideo,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { to: '/admin/media', label: 'Media', icon: FiVideo },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-ink-200 dark:border-white/10 bg-white dark:bg-ink-900/40">
        <div className="p-5 border-b border-ink-100 dark:border-white/10">
          <p className="font-display font-bold text-lg">Admin Panel</p>
          <p className="text-xs text-ink-500 mt-1">{admin?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-ink-100 dark:border-white/10 space-y-1">
          <NavLink to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800">
            <FiHome size={18} /> View Site
          </NavLink>
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-ink-200 dark:border-white/10 bg-white/80 dark:bg-ink-900/50 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <p className="font-semibold text-sm md:hidden">Admin</p>
          <p className="hidden md:block text-sm text-ink-500">Welcome, {admin?.name}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button type="button" onClick={handleLogout} className="md:hidden p-2 rounded-lg text-red-600" aria-label="Logout">
              <FiLogOut />
            </button>
          </div>
        </header>

        <div className="md:hidden flex gap-1 overflow-x-auto border-b border-ink-200 dark:border-white/10 px-2 py-2 bg-white dark:bg-ink-900/40">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

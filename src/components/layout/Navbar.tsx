import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Sparkles,
  Target,
  LayoutDashboard,
  Briefcase,
  History as HistoryIcon,
  Building2,
  LogIn,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROUTES } from '../../constants';
import { cn } from '../../lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  authOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.analyze, label: 'Analyze', icon: LayoutDashboard },
  { to: ROUTES.scan, label: 'Targeted Scan', icon: Target },
  { to: ROUTES.jobs, label: 'Job Matches', icon: Briefcase },
  { to: ROUTES.history, label: 'History', icon: HistoryIcon, authOnly: true },
  { to: ROUTES.applications, label: 'Applications', icon: Building2, authOnly: true },
];

export function Navbar() {
  const { user, signIn, logOut } = useAuth();
  const { notify } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn();
      notify('Signed in successfully.', 'success');
    } catch {
      notify('Sign-in was cancelled or failed.', 'error');
    }
  };

  const handleSignOut = async () => {
    await logOut();
    notify('Signed out.', 'info');
    setMobileOpen(false);
  };

  const items = NAV_ITEMS.filter((item) => !item.authOnly || user);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 text-sm font-medium transition-colors',
      isActive ? 'text-brand-700' : 'text-slate-500 hover:text-slate-900',
    );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={ROUTES.home} className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="p-2 bg-brand-600 rounded-xl text-white">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">ResuMatch AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <item.icon className="w-4 h-4" /> {item.label}
              </NavLink>
            ))}

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <Link to={ROUTES.account} className="flex items-center gap-2" title="Account">
                  <img
                    src={user.photoURL ?? ''}
                    alt={user.displayName ?? 'Account'}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100"
                  />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50',
                )
              }
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-2 border-t border-slate-100">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" /> Sign out ({user.displayName ?? user.email})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  void handleSignIn();
                }}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';

const tabs = [
  { path: '/menu', icon: Home, label: 'Главная' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
];

export default function AppLayout() {
  const location = useLocation();
  const isGameScreen = location.pathname === '/game' || location.pathname === '/custom';

  return (
    <div
      className="flex flex-col bg-background"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>

      {!isGameScreen && (
        <nav
          className="flex border-t border-border/50 bg-card shrink-0"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {tabs.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path || (path === '/menu' && location.pathname === '/');
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
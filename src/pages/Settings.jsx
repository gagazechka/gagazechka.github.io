import { useState } from 'react';
import { Trash2, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  const applyTheme = (t) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    const root = document.documentElement;
    if (t === 'dark') root.classList.add('dark');
    else if (t === 'light') root.classList.remove('dark');
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      prefersDark ? root.classList.add('dark') : root.classList.remove('dark');
    }
  };

  const handleDeleteAccount = async () => {
    await base44.auth.logout('/');
  };

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Светлая' },
    { value: 'system', icon: Monitor, label: 'Системная' },
    { value: 'dark', icon: Moon, label: 'Тёмная' },
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground mb-1">Настройки</h1>
        <p className="text-xs text-muted-foreground">Управление приложением</p>
      </div>

      <div className="px-4 space-y-3">
        {/* Theme */}
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <p className="text-sm font-semibold text-foreground mb-3">Тема оформления</p>
          <div className="flex gap-2">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => applyTheme(value)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  theme === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
          <p className="text-sm font-semibold text-foreground">О приложении</p>
          <p className="text-xs text-muted-foreground">Кроссворд — генератор кроссвордов</p>
          <p className="text-[10px] text-muted-foreground/60">Версия 1.0</p>
        </div>

        {/* Danger zone */}
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-sm font-semibold text-destructive mb-1">Опасная зона</p>
          <p className="text-xs text-muted-foreground mb-3">Эти действия необратимы</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full h-10 rounded-lg text-sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить аккаунт
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border rounded-2xl mx-4">
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                <AlertDialogDescription>
                  Все ваши данные будут удалены безвозвратно. Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Отмена</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-xl bg-destructive hover:bg-destructive/90"
                  onClick={handleDeleteAccount}
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
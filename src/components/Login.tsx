import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Logo } from "./Logo";
import { Leaf } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

interface LoginProps {
  onLogin: (email: string, role: 'employee' | 'hr') => void;
}

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<'employee' | 'hr'>('employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register') {
      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      // In a real app, you would register the user here
      onLogin(email, role);
    } else {
      // Simple demo logic: use selected role or infer from email
      const userRole = email.toLowerCase().includes('hr') ? 'hr' : 'employee';
      onLogin(email, userRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      {/* Theme Toggle - Top Right Corner */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto">
            <Logo className="w-16 h-16 mx-auto" />
          </div>
          <div className="space-y-2">
            <CardTitle>Портал оценки благополучия</CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Войдите, чтобы управлять своим путём к благополучию'
                : 'Создайте аккаунт для начала работы'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Toggle between Login and Register */}
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
            <Button
              type="button"
              variant={mode === 'login' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('login')}
            >
              Авторизация
            </Button>
            <Button
              type="button"
              variant={mode === 'register' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('register')}
            >
              Регистрация
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-3">
                <Label>Роль</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'employee' | 'hr')}>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="employee" id="employee" />
                    <Label htmlFor="employee" className="cursor-pointer flex-1">
                      Сотрудник
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="hr" id="hr" />
                    <Label htmlFor="hr" className="cursor-pointer flex-1">
                      HR-специалист
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Почта</Label>
              <Input
                id="email"
                type="email"
                placeholder="ваш@компания.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>
            
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-input-background"
                />
              </div>
            )}
            
            <Button type="submit" className="w-full">
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            
            {mode === 'login' && (
              <p className="text-xs text-center text-muted-foreground pt-2">
                Демо: Используйте 'hr@company.com' для HR роли или любой другой email для роли Сотрудника
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
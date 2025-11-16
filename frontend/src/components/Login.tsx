import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Logo } from "./Logo";
import { Leaf, Building2, Calendar, CheckCircle, Award, BookOpen } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface LoginProps {
  onLogin: (email: string, role: 'employee' | 'hr') => void;
}

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  userRole: string;
  lastVacation: string;
  hireDate: string;
  lastSickLeave: string;
  participatedInCorporateActivities: boolean;
  hasCertificate: boolean;
  completedTraining: boolean;
}

interface Role {
  id: number;
  name: string;
}

const departmentOptions = [
  "Инженерия",
  "Продажи",
  "Маркетинг",
  "Поддержка",
  "Продукт",
  "HR"
];

const API_BASE_URL = 'http://localhost:8000';

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    userRole: 'employee',
    lastVacation: "",
    hireDate: "",
    lastSickLeave: "",
    participatedInCorporateActivities: false,
    hasCertificate: false,
    completedTraining: false
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'register' && registrationStep === 2) {
      fetchRoles();
    }
  }, [mode, registrationStep]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.statusText}`);
      }
      const data: Role[] = await response.json();
      setRoles(data);
    } catch (err: any) {
      setError(`Ошибка загрузки ролей: ${err.message}`);
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (mode === 'login') {
      try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            username: email,
            password: password,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Login failed: ${errorData.detail || 'Unknown error'}`);
        }
        
        const { access_token, refresh_token } = await response.json();
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
        
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(`Failed to fetch user info: ${errorData.detail || 'Unknown error'}`);
        }
        
        const userData = await userResponse.json();
        
        if (!userData.role_id) {
          throw new Error('User role_id is missing');
        }
        
        const roleResponse = await fetch(`${API_BASE_URL}/roles/${userData.role_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
        
        if (!roleResponse.ok) {
          const errorData = await roleResponse.json();
          throw new Error(`Failed to fetch role: ${errorData.detail || 'Unknown error'}`);
        }
        
        const roleData = await roleResponse.json();
        
        if (!roleData || !roleData.name) {
          throw new Error('Role data is missing or invalid');
        }
        
        const userRole: 'employee' | 'hr' = roleData.name.toLowerCase().includes('hr') ? 'hr' : 'employee';
        
        onLogin(email, userRole);
      } catch (err: any) {
        setError(`Ошибка авторизации: ${err.message}`);
        console.error('Login error:', err);
      }
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          password_confirm: confirmPassword,
          username: null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Registration failed: ${errorData.detail || 'Unknown error'}`);
      }
      
      const userData = await response.json();
      setNewUserId(userData.id);
      
      setRegistrationData({
        ...registrationData,
        email,
        password,
        confirmPassword
      });
      setRegistrationStep(2);
    } catch (err: any) {
      setError(`Ошибка регистрации: ${err.message}`);
      console.error('Registration error:', err);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!registrationData.department || !registrationData.userRole || !registrationData.hireDate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (newUserId === null) {
      setError('Ошибка: ID пользователя не найден');
      return;
    }
    
    const selectedRole = roles.find(role => role.name.toLowerCase() === registrationData.userRole.toLowerCase());
    if (!selectedRole) {
      setError('Ошибка: Роль не найдена');
      return;
    }
    
    try {
      const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: registrationData.email,
          password: registrationData.password,
        }),
      });
      
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(`Auto-login failed: ${errorData.detail || 'Unknown error'}`);
      }
      
      const { access_token } = await loginResponse.json();
      localStorage.setItem('access_token', access_token);
      
      const updateResponse = await fetch(`${API_BASE_URL}/users/${newUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          email: registrationData.email,
          department: registrationData.department,
          role_id: selectedRole.id,
          employment_at: registrationData.hireDate ? `${registrationData.hireDate}T00:00:00` : null,
          last_vacation_at: registrationData.lastVacation ? `${registrationData.lastVacation}T00:00:00` : null,
          last_sickness_at: registrationData.lastSickLeave ? `${registrationData.lastSickLeave}T00:00:00` : null,
          is_participant_corp_activities: registrationData.participatedInCorporateActivities,
          is_certified: registrationData.hasCertificate,
          is_trained: registrationData.completedTraining,
          username: null,
        }),
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Update failed: ${errorData.detail || 'Unknown error'}`);
      }
      
      console.log('Registration completed');
      const normalizedRole: 'employee' | 'hr' = registrationData.userRole.toLowerCase().includes('hr') ? 'hr' : 'employee';
      onLogin(registrationData.email, normalizedRole);
    } catch (err: any) {
      setError(`Ошибка завершения регистрации: ${err.message}`);
      console.error('Registration step 2 error:', err);
    }
  };

  const handleBackToStep1 = () => {
    setRegistrationStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
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
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
            <Button
              type="button"
              variant={mode === 'login' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => {
                setMode('login');
                setRegistrationStep(1);
              }}
            >
              Авторизация
            </Button>
            <Button
              type="button"
              variant={mode === 'register' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => {
                setMode('register');
                setRegistrationStep(1);
              }}
            >
              Регистрация
            </Button>
          </div>

          {mode === 'register' && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-2 rounded-full transition-all ${registrationStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`flex-1 h-2 rounded-full transition-all ${registrationStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {registrationStep === 1 ? 'Шаг 1: Учётные данные' : 'Шаг 2: Анкета'}
                </span>
                <span className="text-xs text-muted-foreground">Шаг {registrationStep} из 2</span>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-5">
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
              
              <Button type="submit" className="w-full">
                Войти
              </Button>
              
              <p className="text-xs text-center text-muted-foreground pt-2">
                Демо: Используйте 'hr@company.com' для HR роли или любой другой email для роли Сотрудника
              </p>
            </form>
          )}

          {mode === 'register' && registrationStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Почта</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="ваш@компания.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-input-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-input-background"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Продолжить
              </Button>
            </form>
          )}

          {mode === 'register' && registrationStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Роль <span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={registrationData.userRole} onValueChange={(value) => setRegistrationData({ ...registrationData, userRole: value })}>
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value={role.name} id={`role-${role.id}`} />
                      <Label htmlFor={`role-${role.id}`} className="cursor-pointer flex-1">
                        {role.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Отдел <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="например, Инженерия"
                  value={registrationData.department}
                  onChange={(e) => setRegistrationData({ ...registrationData, department: e.target.value })}
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Дата приёма на работу <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={registrationData.hireDate}
                  onChange={(e) => setRegistrationData({ ...registrationData, hireDate: e.target.value })}
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastVacation" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Последний отпуск
                </Label>
                <Input
                  id="lastVacation"
                  type="date"
                  value={registrationData.lastVacation}
                  onChange={(e) => setRegistrationData({ ...registrationData, lastVacation: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastSickLeave" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Последний больничный
                </Label>
                <Input
                  id="lastSickLeave"
                  type="date"
                  value={registrationData.lastSickLeave}
                  onChange={(e) => setRegistrationData({ ...registrationData, lastSickLeave: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-sm text-muted-foreground">Дополнительная информация</Label>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <Label htmlFor="corporateActivities" className="cursor-pointer flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Участвовал в корпоративных мероприятиях
                  </Label>
                  <input
                    id="corporateActivities"
                    type="checkbox"
                    checked={registrationData.participatedInCorporateActivities}
                    onChange={(e) => setRegistrationData({ ...registrationData, participatedInCorporateActivities: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <Label htmlFor="certificate" className="cursor-pointer flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Имеется сертификат
                  </Label>
                  <input
                    id="certificate"
                    type="checkbox"
                    checked={registrationData.hasCertificate}
                    onChange={(e) => setRegistrationData({ ...registrationData, hasCertificate: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <Label htmlFor="training" className="cursor-pointer flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Прошёл обучение
                  </Label>
                  <input
                    id="training"
                    type="checkbox"
                    checked={registrationData.completedTraining}
                    onChange={(e) => setRegistrationData({ ...registrationData, completedTraining: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleBackToStep1} className="flex-1">
                  Назад
                </Button>
                <Button type="submit" className="flex-1">
                  Завершить регистрацию
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
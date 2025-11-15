import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Logo } from "./Logo";
import { Leaf, Building2, Calendar, CheckCircle, Award, BookOpen } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
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
  userRole: 'employee' | 'hr';
  lastVacation: string;
  hireDate: string;
  lastSickLeave: string;
  participatedInCorporateActivities: boolean;
  hasCertificate: boolean;
  completedTraining: boolean;
}

const departmentOptions = [
  "Инженерия",
  "Продажи",
  "Маркетинг",
  "Поддержка",
  "Продукт",
  "HR"
];

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Registration questionnaire data
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      // Simple demo logic: use selected role or infer from email
      const userRole = email.toLowerCase().includes('hr') ? 'hr' : 'employee';
      onLogin(email, userRole);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    // Save step 1 data and move to step 2
    setRegistrationData({
      ...registrationData,
      email,
      password,
      confirmPassword
    });
    setRegistrationStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate questionnaire
    if (!registrationData.department || !registrationData.userRole || !registrationData.hireDate) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Complete registration
    console.log('Registration completed:', registrationData);
    onLogin(email, registrationData.userRole);
  };

  const handleBackToStep1 = () => {
    setRegistrationStep(1);
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

          {/* Step Indicator for Registration */}
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

          {/* LOGIN FORM */}
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

          {/* REGISTRATION STEP 1: Credentials */}
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

          {/* REGISTRATION STEP 2: Questionnaire */}
          {mode === 'register' && registrationStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Роль <span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={registrationData.userRole} onValueChange={(value) => setRegistrationData({ ...registrationData, userRole: value as 'employee' | 'hr' })}>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="employee" id="employee-step2" />
                    <Label htmlFor="employee-step2" className="cursor-pointer flex-1">
                      Сотрудник
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="hr" id="hr-step2" />
                    <Label htmlFor="hr-step2" className="cursor-pointer flex-1">
                      HR-специалист
                    </Label>
                  </div>
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
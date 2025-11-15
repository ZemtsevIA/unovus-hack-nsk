import { Logo } from "./Logo";
import { AIMascot } from "./AIMascot";
import { ThemeToggle } from "./ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Heart,
  LogOut,
  Download,
  ArrowDown,
  TrendingDown,
  UserPlus,
  Mail,
  Building2,
  Trash2,
  Edit
} from "./Icons";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface HRDashboardProps {
  onLogout: () => void;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  score: number;
  status: string;
  lastAssessment: string;
}

// Mock data
const trendData = [
  { month: "Янв", risk: 28, average: 72 },
  { month: "Фев", risk: 32, average: 68 },
  { month: "Мар", risk: 35, average: 65 },
  { month: "Апр", risk: 30, average: 70 },
  { month: "Май", risk: 25, average: 75 },
  { month: "Июн", risk: 22, average: 78 },
];

const departmentData = [
  { department: "Инженерия", score: 72, employees: 45, burnedOut: 3, trend: 5, kpi: 87 },
  { department: "Продажи", score: 65, employees: 32, burnedOut: 5, trend: -2, kpi: 78 },
  { department: "Маркетинг", score: 78, employees: 28, burnedOut: 1, trend: 8, kpi: 92 },
  { department: "Поддержка", score: 58, employees: 38, burnedOut: 8, trend: -3, kpi: 65 },
  { department: "Продукт", score: 75, employees: 22, burnedOut: 2, trend: 4, kpi: 85 },
  { department: "HR", score: 82, employees: 15, burnedOut: 0, trend: 3, kpi: 95 },
];

const riskDistribution = [
  { name: "Равновесие", value: 58, color: "#2d8659", description: "70-100 баллов" },
  { name: "Напряжённость", value: 21, color: "#eab308", description: "50-69 баллов" },
  { name: "Истощение", value: 13, color: "#f97316", description: "30-49 баллов" },
  { name: "Бессилие", value: 8, color: "#dc2626", description: "0-29 баллов" },
];

const employeeData: Employee[] = [
  { id: 1, name: "Сара Джонсон", email: "sara.johnson@example.com", department: "Инженерия", score: 85, status: "low", lastAssessment: "2024-11-10" },
  { id: 2, name: "Майкл Чен", email: "michael.chen@example.com", department: "Продажи", score: 62, status: "medium", lastAssessment: "2024-11-12" },
  { id: 3, name: "Эмили Родригес", email: "emily.rodrigues@example.com", department: "Маркетинг", score: 78, status: "low", lastAssessment: "2024-11-09" },
  { id: 4, name: "Джеймс Уильямс", email: "james.williams@example.com", department: "Поддержка", score: 45, status: "high", lastAssessment: "2024-11-11" },
  { id: 5, name: "Лиза Андерсон", email: "lisa.anderson@example.com", department: "Инженерия", score: 72, status: "low", lastAssessment: "2024-11-13" },
  { id: 6, name: "Дэвид Мартинес", email: "david.martinez@example.com", department: "Продукт", score: 58, status: "medium", lastAssessment: "2024-11-08" },
  { id: 7, name: "Дженнифер Тейлор", email: "jennifer.taylor@example.com", department: "Поддержка", score: 38, status: "high", lastAssessment: "2024-11-10" },
  { id: 8, name: "Роберт Браун", email: "robert.brown@example.com", department: "Продажи", score: 68, status: "medium", lastAssessment: "2024-11-14" },
  { id: 9, name: "Аманда Уайт", email: "amanda.white@example.com", department: "Маркетинг", score: 82, status: "low", lastAssessment: "2024-11-12" },
  { id: 10, name: "Кристофер Ли", email: "christopher.li@example.com", department: "Инженерия", score: 55, status: "medium", lastAssessment: "2024-11-09" },
];

export function HRDashboard({ onLogout }: HRDashboardProps) {
  const departmentSectionRef = useRef<HTMLDivElement>(null);
  const [employees, setEmployees] = useState<Employee[]>(employeeData);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: ""
  });

  const scrollToDepartments = () => {
    departmentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      return;
    }

    const employee: Employee = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      department: newEmployee.department,
      score: 0,
      status: "low",
      lastAssessment: "Не пройдена"
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: "", email: "", department: "" });
    setShowAddEmployeeModal(false);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "high":
        return <span className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20">Высокий риск</span>;
      case "medium":
        return <span className="px-2 py-1 text-xs rounded-full bg-warning/10 text-warning border border-warning/20">Средний риск</span>;
      case "low":
        return <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">Низкий риск</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border">Не оценен</span>;
    }
  };

  const highRiskCount = employees.filter(e => e.status === "high").length;
  const averageScore = employees.length > 0 
    ? Math.round(employees.reduce((sum, e) => sum + e.score, 0) / employees.length) 
    : 0;

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-40">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <div>
                <h1>Панель аналитики HR</h1>
                <p className="text-xs text-muted-foreground">Обзор благополучия сотрудников</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Экспорт отчёта
              </Button>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 py-8 pb-32">
          {/* KPI Cards - Interactive Buttons */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={scrollToDepartments}
              className="group text-left bg-card border-2 border-border rounded-lg shadow-lg p-6 hover:border-destructive hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Сотрудники высокого риска</p>
                  <p className="text-4xl text-destructive group-hover:scale-110 transition-transform duration-300">{highRiskCount}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs text-muted-foreground">Требует внимания</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                    <AlertTriangle className="w-7 h-7 text-destructive" />
                  </div>
                  <ArrowDown className="w-5 h-5 text-muted-foreground group-hover:text-destructive group-hover:translate-y-1 transition-all" />
                </div>
              </div>
            </button>

            <button
              onClick={scrollToDepartments}
              className="group text-left bg-card border-2 border-border rounded-lg shadow-lg p-6 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Средняя оценка благополучия</p>
                  <p className="text-4xl text-primary group-hover:scale-110 transition-transform duration-300">{averageScore}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs text-primary">+5 от прошлого месяца</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <ArrowDown className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-y-1 transition-all" />
                </div>
              </div>
            </button>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle>Тренды риска выгорания</CardTitle>
                <CardDescription>Ежемесячный риск выгорания и средняя оценка благополучия</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-64 gap-2 px-4">
                    {trendData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                        <div className="w-full flex gap-1 items-end h-full relative">
                          <div className="flex-1 flex flex-col items-center justify-end h-full">
                            <span className="text-xs text-primary mb-1">{data.average}</span>
                            <div 
                              className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                              style={{ height: `${(data.average / 100) * 100}%` }}
                              title={`Средняя: ${data.average}`}
                            />
                          </div>
                          <div className="flex-1 flex flex-col items-center justify-end h-full">
                            <span className="text-xs text-destructive mb-1">{data.risk}%</span>
                            <div 
                              className="w-full bg-destructive rounded-t transition-all hover:opacity-80"
                              style={{ height: `${(data.risk / 100) * 100}%` }}
                              title={`Риск: ${data.risk}%`}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary" />
                      <span className="text-sm text-muted-foreground">Средняя оценка</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-destructive" />
                      <span className="text-sm text-muted-foreground">Риск выгорания %</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Распределение рисков</CardTitle>
                <CardDescription>Четыре уровня благополучия сотрудников</CardDescription>
              </CardHeader>
              <CardContent className="py-8">
                <div className="space-y-6">
                  {riskDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: item.color }} 
                          />
                          <div className="flex flex-col">
                            <span className="text-sm">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                          </div>
                        </div>
                        <span className="text-lg" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden ml-7">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${item.value}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">
                    Всего оценённых сотрудников: <span className="text-foreground">{employeeData.length}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mb-8" ref={departmentSectionRef}>
            {/* Employee Statistics Overview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Статистика персонала</CardTitle>
                <CardDescription>Общий обзор сотрудников компании</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Employees */}
                  <div className="bg-muted/30 rounded-lg p-6 border border-border hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl text-primary mb-1">{employees.length}</p>
                    <p className="text-sm text-muted-foreground">Всего сотрудников</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-primary">+{employees.filter(e => e.id > 5).length} за месяц</p>
                    </div>
                  </div>

                  {/* By Department Breakdown */}
                  <div className="bg-muted/30 rounded-lg p-6 border border-border hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl text-primary mb-1">{departmentData.length}</p>
                    <p className="text-sm text-muted-foreground">Активных отделов</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Средний размер: {Math.round(employees.length / departmentData.length)} чел.
                      </p>
                    </div>
                  </div>

                  {/* High Risk Employees */}
                  <div className="bg-muted/30 rounded-lg p-6 border border-border hover:border-destructive/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      </div>
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    </div>
                    <p className="text-3xl text-destructive mb-1">{highRiskCount}</p>
                    <p className="text-sm text-muted-foreground">Высокий риск</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-destructive">
                        {((highRiskCount / employees.length) * 100).toFixed(1)}% от общего числа
                      </p>
                    </div>
                  </div>

                  {/* Average Wellness Score */}
                  <div className="bg-muted/30 rounded-lg p-6 border border-border hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl text-primary mb-1">{averageScore}</p>
                    <p className="text-sm text-muted-foreground">Средний балл</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${averageScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Distribution */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm mb-4 text-muted-foreground">Распределение по отделам</h3>
                  <div className="space-y-3">
                    {departmentData.slice(0, 6).map((dept, index) => {
                      const deptEmployees = employees.filter(e => e.department === dept.department);
                      const percentage = ((deptEmployees.length / employees.length) * 100).toFixed(1);
                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-32 text-sm">{dept.department}</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-20 text-right text-sm text-muted-foreground">
                            {deptEmployees.length} ({percentage}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Management Section */}
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление персоналом</CardTitle>
                    <CardDescription>Добавление и просмотр сотрудников компании</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddEmployeeModal(true)} className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Добавить сотрудника
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="overflow-x-auto custom-scrollbar rounded-lg border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left py-4 px-6 font-medium text-sm text-muted-foreground">Сотрудник</th>
                        <th className="text-left py-4 px-6 font-medium text-sm text-muted-foreground">Email</th>
                        <th className="text-left py-4 px-6 font-medium text-sm text-muted-foreground">Отдел</th>
                        <th className="text-center py-4 px-6 font-medium text-sm text-muted-foreground">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card">
                      {employees.map((emp, index) => (
                        <tr 
                          key={emp.id} 
                          className={`border-b border-border hover:bg-muted/30 transition-colors ${
                            index === employees.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <span className="font-medium">{emp.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">{emp.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span>{emp.department}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteEmployee(emp.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {employees.length === 0 && (
                    <div className="text-center py-16 bg-card">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-4">Сотрудники не найдены</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddEmployeeModal(true)}
                        className="gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Добавить первого сотрудника
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg scroll-mt-8">
              <CardHeader>
                <CardTitle>Анализ по отделам</CardTitle>
                <CardDescription>Детальная статистика по каждому отделу</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departmentData.map((dept, index) => {
                    const burnoutPercentage = ((dept.burnedOut / dept.employees) * 100).toFixed(1);
                    return (
                      <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg">{dept.department}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Total Employees */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Количество сотрудников</span>
                            <span className="text-lg">{dept.employees}</span>
                          </div>
                          
                          {/* Average Score */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Средняя оценка</span>
                            <span className="text-lg text-primary">{dept.score}</span>
                          </div>
                          
                          {/* Department KPI */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">KPI отдела</span>
                            <span className="text-lg text-primary">{dept.kpi}%</span>
                          </div>
                          
                          {/* Burned Out Count */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Выгоревших сотрудников</span>
                            <span className={`text-lg ${dept.burnedOut > 0 ? 'text-destructive' : 'text-primary'}`}>
                              {dept.burnedOut}
                            </span>
                          </div>
                          
                          {/* Burnout Percentage */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Процент выгорания</span>
                              <span className={`text-lg ${parseFloat(burnoutPercentage) > 15 ? 'text-destructive' : 'text-primary'}`}>
                                {burnoutPercentage}%
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${parseFloat(burnoutPercentage) > 15 ? 'bg-destructive' : 'bg-primary'}`}
                                style={{ width: `${burnoutPercentage}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Monthly Trend */}
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <span className="text-sm text-muted-foreground">Тенденция за месяц</span>
                            <div className="flex items-center gap-1.5">
                              {dept.trend > 0 ? (
                                <>
                                  <TrendingUp className="w-4 h-4 text-primary" />
                                  <span className="text-sm text-primary">+{dept.trend}</span>
                                </>
                              ) : dept.trend < 0 ? (
                                <>
                                  <TrendingDown className="w-4 h-4 text-destructive" />
                                  <span className="text-sm text-destructive">{dept.trend}</span>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">0</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Employee Modal */}
          <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Добавить сотрудника</DialogTitle>
                <DialogDescription>Введите информацию о новом сотруднике</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department">Отдел</Label>
                  <div className="col-span-3">
                    <Select
                      value={newEmployee.department}
                      onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите отдел" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentData.map((dept) => (
                          <SelectItem key={dept.department} value={dept.department}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                <span>{dept.department}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>{dept.employees} чел.</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  onClick={handleAddEmployee}
                >
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
      <AIMascot message="Привет! Я помогу вам проанализировать тренды благополучия." />
    </>
  );
}
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
import { useRef, useState, useEffect } from "react";
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

import {
  Badge
} from "./ui/badge";

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

const API_BASE_URL = 'http://localhost:8000';

export function HRDashboard({ onLogout }: HRDashboardProps) {
  const departmentSectionRef = useRef<HTMLDivElement>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    email: ""
  });
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentHRId, setCurrentHRId] = useState<number | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);

  const scrollToDepartments = () => {
    departmentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fetchEmployees = async (token: string) => {
    try {
      const employeesRes = await fetch(`${API_BASE_URL}/users/hr/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!employeesRes.ok) throw new Error('Failed to fetch employees');
      const employeesData = await employeesRes.json();

      const employeePromises = employeesData.map(async (emp: any) => {
        const metricsRes = await fetch(`${API_BASE_URL}/metrics/by_user/${emp.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const metricsData = metricsRes.ok ? await metricsRes.json() : [];
        const lastMetric = metricsData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

        let score = 0;
        let status = 'high';
        let lastAssessment = 'Не пройдена';

        if (lastMetric) {
          score = lastMetric.total_score;
          lastAssessment = new Date(lastMetric.created_at).toLocaleDateString('ru-RU');
          if (score >= 70) status = 'low';
          else if (score >= 50) status = 'medium';
          else status = 'high';
        }

        return {
          id: emp.id,
          name: emp.username || emp.email.split('@')[0].split('.').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
          email: emp.email,
          department: emp.department || 'Не указан',
          score,
          status,
          lastAssessment
        };
      });

      const processedEmployees = await Promise.all(employeePromises);
      setEmployees(processedEmployees);

      // Aggregate department data
      const departmentsMap: { [key: string]: any } = {};
      employeesData.forEach((emp: any) => {
        const dept = emp.department || 'Не указан';
        if (!departmentsMap[dept]) {
          departmentsMap[dept] = {
            department: dept,
            score: 0,
            employees: 0,
            burnedOut: 0,
            trend: 0,
            kpi: 0
          };
        }
        departmentsMap[dept].employees += 1;
      });

      const departmentPromises = Object.keys(departmentsMap).map(async (dept) => {
        const deptEmployees = employeesData.filter((emp: any) => (emp.department || 'Не указан') === dept);
        let totalScore = 0;
        let burnedOut = 0;
        let totalKPI = 0;
        let trend = 0;

        for (const emp of deptEmployees) {
          const metricsRes = await fetch(`${API_BASE_URL}/metrics/by_user/${emp.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const metrics = metricsRes.ok ? await metricsRes.json() : [];
          const lastTwo = metrics.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2);
          const lastScore = lastTwo[0]?.total_score || 0;
          const prevScore = lastTwo[1]?.total_score || lastScore;
          totalScore += lastScore;
          if (lastScore < 50) burnedOut += 1;
          trend += (lastScore - prevScore);

          const kpiRes = await fetch(`${API_BASE_URL}/kpis/by_user/${emp.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const kpis = kpiRes.ok ? await kpiRes.json() : [];
          const lastKPI = kpis.sort((a: any, b: any) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime())[0]?.kpi_rate || 0;
          totalKPI += lastKPI;
        }

        departmentsMap[dept].score = deptEmployees.length > 0 ? Math.round(totalScore / deptEmployees.length) : 0;
        departmentsMap[dept].burnedOut = burnedOut;
        departmentsMap[dept].trend = deptEmployees.length > 0 ? Math.round(trend / deptEmployees.length) : 0;
        departmentsMap[dept].kpi = deptEmployees.length > 0 ? Math.round(totalKPI / deptEmployees.length) : 0;
      });

      await Promise.all(departmentPromises);
      setDepartmentData(Object.values(departmentsMap));

      // Calculate riskDistribution
      const risks = [0, 0, 0, 0]; // [70-100, 50-69, 30-49, 0-29]
      const riskPromises = employeesData.map(async (emp: any) => {
        const metricsRes = await fetch(`${API_BASE_URL}/metrics/by_user/${emp.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const metrics = metricsRes.ok ? await metricsRes.json() : [];
        const lastScore = metrics.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.total_score || 0;
        if (lastScore >= 70) risks[0]++;
        else if (lastScore >= 50) risks[1]++;
        else if (lastScore >= 30) risks[2]++;
        else risks[3]++;
      });
      await Promise.all(riskPromises);
      const total = employeesData.length;
      setRiskDistribution([
        { name: "Равновесие", value: total > 0 ? Math.round((risks[0] / total) * 100) : 0, color: "#2d8659", description: "70-100 баллов" },
        { name: "Напряжённость", value: total > 0 ? Math.round((risks[1] / total) * 100) : 0, color: "#eab308", description: "50-69 баллов" },
        { name: "Истощение", value: total > 0 ? Math.round((risks[2] / total) * 100) : 0, color: "#f97316", description: "30-49 баллов" },
        { name: "Бессилие", value: total > 0 ? Math.round((risks[3] / total) * 100) : 0, color: "#dc2626", description: "0-29 баллов" },
      ]);

      // Trend data: Aggregate monthly averages and risks
      const monthlyMap: { [key: string]: { totalScore: number, count: number, burnedOut: number } } = {};
      const trendPromises = employeesData.map(async (emp: any) => {
        const metricsRes = await fetch(`${API_BASE_URL}/metrics/by_user/${emp.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const metrics = metricsRes.ok ? await metricsRes.json() : [];
        metrics.forEach((m: any) => {
          const date = new Date(m.created_at);
          const monthKey = date.toLocaleString('ru-RU', { month: 'short' });
          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { totalScore: 0, count: 0, burnedOut: 0 };
          }
          monthlyMap[monthKey].totalScore += m.total_score;
          monthlyMap[monthKey].count += 1;
          if (m.total_score < 50) monthlyMap[monthKey].burnedOut += 1;
        });
      });
      await Promise.all(trendPromises);

      const trends = Object.keys(monthlyMap).map(month => ({
        month,
        average: monthlyMap[month].count > 0 ? Math.round(monthlyMap[month].totalScore / monthlyMap[month].count) : 0,
        risk: monthlyMap[month].count > 0 ? Math.round((monthlyMap[month].burnedOut / monthlyMap[month].count) * 100) : 0
      })).sort((a, b) => new Date(`2024-${a.month}-01`).getTime() - new Date(`2024-${b.month}-01`).getTime()); // Sort by month

      setTrendData(trends);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch current HR
        const hrRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!hrRes.ok) throw new Error('Failed to fetch HR data');
        const hrData = await hrRes.json();
        setCurrentHRId(hrData.id);

        // Fetch roles
        const rolesRes = await fetch(`${API_BASE_URL}/roles/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!rolesRes.ok) throw new Error('Failed to fetch roles');
        setRoles(await rolesRes.json());

        await fetchEmployees(token);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddEmployee = async () => {
    if (!newEmployee.email) {
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found.');
      return;
    }

    try {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // Generate username from email
      const username = newEmployee.email.split('@')[0].split('.').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');

      // Register new user
      const registerRes = await fetch(`${API_BASE_URL}/users/hr/employees/by_email?email=${newEmployee.email}`, {
        
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: newEmployee.email,
          password: tempPassword,
          password_confirm: tempPassword,
          username: username
        })
      });
      if (!registerRes.ok) throw new Error('Failed to register employee');
      const newUser = await registerRes.json();

      // Find employee role id
      const employeeRole = roles.find((r: any) => r.name.toLowerCase().includes('employee'));
      if (!employeeRole) throw new Error('Employee role not found');

      // Update user with role, hr_id, username (department null)
      const updateRes = await fetch(`${API_BASE_URL}/users/${newUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          role_id: employeeRole.id,
          hr_id: currentHRId,
          username: username,
          department: null  // or '' if needed
        })
      });
      if (!updateRes.ok) throw new Error('Failed to update employee');

      // Assign to HR
      const assignRes = await fetch(`${API_BASE_URL}/users/hr/employees`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify([newUser.id])
      });
      if (!assignRes.ok) throw new Error('Failed to assign employee to HR');

      // Refresh data
      await fetchEmployees(token);

      setNewEmployee({ email: "" });
      setShowAddEmployeeModal(false);

      // In real app, send email with tempPassword
      console.log(`Temporary password for ${newEmployee.email}: ${tempPassword}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditEmployee = async () => {
    if (!editEmployee) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found.');
      return;
    }

    try {
      const updateRes = await fetch(`${API_BASE_URL}/users/${editEmployee.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          department: editEmployee.department,
          username: editEmployee.name,
          email: editEmployee.email
        })
      });
      if (!updateRes.ok) throw new Error('Failed to update employee');

      await fetchEmployees(token);
      setShowEditEmployeeModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found.');
      return;
    }

    try {
      const deleteRes = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!deleteRes.ok) throw new Error('Failed to delete employee');

      await fetchEmployees(token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low':
        return <Badge variant="default" className="bg-success/10 text-success">Низкий риск</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-warning/10 text-warning">Средний риск</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-destructive/10 text-destructive">Высокий риск</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const filteredEmployees = employees.filter(emp => 
    !departmentSearch || emp.department.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => a.score - b.score);

  const totalEmployees = employees.length;
  const averageScore = totalEmployees > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.score, 0) / totalEmployees) : 0;
  const atRiskEmployees = employees.filter(emp => emp.score < 50).length;
  const burnoutPercentage = totalEmployees > 0 ? Math.round((atRiskEmployees / totalEmployees) * 100) : 0;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-destructive">{error}</div>;
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-bold">HR Дашборд</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Overview */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Обзор благополучия команды
            </CardTitle>
            <CardDescription>Ключевые метрики за последний месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Всего сотрудников
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalEmployees}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Средний балл благополучия
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{averageScore}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    В зоне риска
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{atRiskEmployees}</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="mb-4 flex items-center gap-2 font-medium">
                <TrendingUp className="w-4 h-4 text-primary" />
                Тренды благополучия
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {trendData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <span className="text-sm font-medium mb-2">{item.month}</span>
                    <Badge variant="outline" className="mb-1">
                      {item.average}
                    </Badge>
                    <span className="text-xs text-destructive">{item.risk}% в риске</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="mb-4 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-primary" />
                Распределение рисков
              </h3>
              <div className="space-y-4">
                {riskDistribution.map((risk, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium truncate">{risk.name}</div>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${risk.value}%`, backgroundColor: risk.color }}
                      />
                    </div>
                    <span className="w-12 text-sm text-muted-foreground">{risk.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments */}
        <div ref={departmentSectionRef}>
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Отделы
                  </CardTitle>
                  <CardDescription>Анализ по отделам</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                  <Button size="sm" onClick={() => setShowAddEmployeeModal(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Добавить сотрудника
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Input
                  placeholder="Поиск по отделу..."
                  value={departmentSearch}
                  onChange={(e) => setDepartmentSearch(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentData
                  .filter(dept => !departmentSearch || dept.department.toLowerCase().includes(departmentSearch.toLowerCase()))
                  .map((dept, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            {dept.department}
                          </CardTitle>
                          <Badge variant="outline">{dept.employees} чел.</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Wellness Score */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Heart className="w-4 h-4" />
                            Средний балл
                          </span>
                          <span className="font-medium">{dept.score}</span>
                        </div>

                        {/* Burned Out */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            В зоне выгорания
                          </span>
                          <Badge variant={dept.burnedOut > 0 ? "destructive" : "default"}>
                            {dept.burnedOut}
                          </Badge>
                        </div>

                        {/* KPI */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" />
                            Средний KPI
                          </span>
                          <span className="font-medium">{dept.kpi}%</span>
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
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Сотрудники с высоким риском
            </CardTitle>
            <CardDescription>Мониторинг и поддержка</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{emp.name}</h4>
                          <p className="text-sm text-muted-foreground">{emp.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{emp.score}</p>
                          <p className="text-xs text-muted-foreground">{emp.lastAssessment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(emp.status)}
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditEmployee(emp);
                      setShowEditEmployeeModal(true);
                    }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(emp.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Employee Modal */}
      <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить сотрудника</DialogTitle>
            <DialogDescription>Введите информацию о новом сотруднике</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddEmployee}>
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={showEditEmployeeModal} onOpenChange={setShowEditEmployeeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать сотрудника</DialogTitle>
            <DialogDescription>Измените информацию о сотруднике</DialogDescription>
          </DialogHeader>
          {editEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name">Имя</Label>
                <Input
                  id="edit-name"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-department">Отдел</Label>
                <div className="col-span-3">
                  <Input
                    id="edit-department"
                    value={editEmployee.department}
                    onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={handleEditEmployee}>
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AIMascot message="Привет! Я помогу вам проанализировать тренды благополучия." />
    </>
  );
}
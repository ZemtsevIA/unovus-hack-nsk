import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { HRDashboard } from "./components/HRDashboard";
import { WellnessAssessment } from "./components/WellnessAssessment";
import { ThemeProvider } from "./components/ThemeProvider";

type UserRole = 'employee' | 'hr' | null;
type AppView = 'login' | 'employee-dashboard' | 'hr-dashboard' | 'assessment';

interface User {
  email: string;
  role: UserRole;
  name: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [wellnessScore, setWellnessScore] = useState<number | undefined>(undefined);

  // Add meta theme-color tag for mobile browsers
  useEffect(() => {
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#fafbfa';
      document.head.appendChild(meta);
    }
  }, []);

  const handleLogin = (email: string, role: UserRole) => {
    // Extract name from email for demo
    const name = email.split('@')[0].split('.').map(n => 
      n.charAt(0).toUpperCase() + n.slice(1)
    ).join(' ');

    setUser({ email, role, name });
    
    if (role === 'hr') {
      setView('hr-dashboard');
    } else {
      setView('employee-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setHasCompletedAssessment(false);
    setWellnessScore(undefined);
  };

  const handleStartAssessment = () => {
    setView('assessment');
  };

  const handleCompleteAssessment = (score: number) => {
    setWellnessScore(score);
    setHasCompletedAssessment(true);
    setView('employee-dashboard');
  };

  return (
    <ThemeProvider>
      {view === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {view === 'employee-dashboard' && user?.role === 'employee' && (
        <EmployeeDashboard
          userName={user.name}
          hasCompletedAssessment={hasCompletedAssessment}
          wellnessScore={wellnessScore}
          onStartAssessment={handleStartAssessment}
          onLogout={handleLogout}
        />
      )}

      {view === 'assessment' && (
        <WellnessAssessment onComplete={handleCompleteAssessment} />
      )}

      {view === 'hr-dashboard' && user?.role === 'hr' && (
        <HRDashboard onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}
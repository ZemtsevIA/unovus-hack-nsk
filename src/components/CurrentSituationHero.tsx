import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Activity, 
  Heart, 
  Brain, 
  Zap, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  Calendar,
  Sparkles
} from './Icons';
import { useState, useEffect } from 'react';

interface CurrentSituationHeroProps {
  userName: string;
  wellnessScore?: number;
  lastAssessmentDate?: string;
  hasHistoricalData?: boolean;
  onStartAssessment: () => void;
}

export function CurrentSituationHero({ 
  userName, 
  wellnessScore, 
  lastAssessmentDate,
  hasHistoricalData = true,
  onStartAssessment 
}: CurrentSituationHeroProps) {
  const [isLoading, setIsLoading] = useState(!hasHistoricalData);
  
  // Simulate loading historical data
  useEffect(() => {
    if (!hasHistoricalData) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [hasHistoricalData]);
  
  // Calculate metrics based on score (simulated historical data)
  const emotionalExhaustion = wellnessScore ? Math.max(0, 100 - wellnessScore - 5) : 0;
  const depersonalization = wellnessScore ? Math.max(0, 100 - wellnessScore - 10) : 0;
  const personalAccomplishment = wellnessScore ? Math.min(100, wellnessScore + 8) : 0;
  
  // Simulated trend data (would come from backend)
  const previousScore = wellnessScore ? wellnessScore - 4 : 0;
  const trend = wellnessScore && wellnessScore > previousScore ? 'up' : wellnessScore && wellnessScore < previousScore ? 'down' : 'stable';
  const trendValue = wellnessScore ? Math.abs(wellnessScore - previousScore) : 0;
  
  // Determine wellness state with theme-aware colors
  const getWellnessState = (score: number) => {
    if (score >= 70) return {
      label: "Низкий Риск",
      subtitle: "Равновесие",
      color: "#4caf50",
      gradient: "from-[#4caf50]/10 to-[#4caf50]/5",
      icon: CheckCircle,
      message: "Стабильные тренды",
      insight: "Вы в отличной форме! Продолжайте поддерживать здоровые привычки и текущий уровень активности."
    };
    if (score >= 50) return {
      label: "Средний Риск",
      subtitle: "Напряжённость",
      color: "#ffc107",
      gradient: "from-[#ffc107]/10 to-[#ffc107]/5",
      icon: Info,
      message: "Требуется внимание",
      insight: "Обратите внимание на баланс между работой и отдыхом. Рекомендуем практики релаксации."
    };
    if (score >= 30) return {
      label: "Повышенный Риск",
      subtitle: "Истощение",
      color: "#ff9800",
      gradient: "from-[#ff9800]/10 to-[#ff9800]/5",
      icon: AlertCircle,
      message: "Нужны действия",
      insight: "Рекомендуем уделить больше времени восстановлению и обратиться к практикам осознанности."
    };
    return {
      label: "Высокий Риск",
      subtitle: "Бессилие",
      color: "#f44336",
      gradient: "from-[#f44336]/10 to-[#f44336]/5",
      icon: AlertCircle,
      message: "Требуется поддержка",
      insight: "Настоятельно рекомендуем обратиться к специалисту для получения профессиональной поддержки."
    };
  };
  
  // Default state for no data
  const defaultState = {
    label: "Нет данных",
    subtitle: "Пройдите тест",
    color: "#9e9e9e",
    gradient: "from-muted to-muted/50",
    icon: Activity,
    message: "Начните отслеживание",
    insight: "Пройдите первую оценку, чтобы получить персональные рекомендации и начать отслеживать ваше благополучие."
  };

  const wellnessState = wellnessScore ? getWellnessState(wellnessScore) : defaultState;
  const StateIcon = wellnessState.icon;

  // Skeleton loader
  if (isLoading) {
    return (
      <Card className="shadow-xl border-2 border-primary/10 overflow-hidden animate-fade-in">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-5 gap-8 animate-pulse">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-8 bg-muted rounded-lg w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded-xl"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-full bg-muted rounded-xl"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden elevated animate-slide-up">
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-5 gap-0">
          {/* Left Section - Main Info */}
          <div className="lg:col-span-3 p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-primary" />
                  Текущее состояние
                </h3>
                {lastAssessmentDate && wellnessScore && (
                  <Badge variant="outline" className="text-xs gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {lastAssessmentDate}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Обзор вашего благополучия на основе предыдущих тестов
              </p>
            </div>

            {/* Main Score Display */}
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${wellnessState.gradient} border border-border relative overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="currentColor" />
                </svg>
              </div>

              <div className="relative grid sm:grid-cols-2 gap-6">
                {/* Score */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Интегральный индекс ρ (rho)
                  </p>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span 
                      className="text-5xl font-medium tabular-nums"
                      style={{ color: wellnessState.color }}
                    >
                      {wellnessScore || '--'}
                    </span>
                    <span className="text-2xl text-muted-foreground">/ 100</span>
                  </div>
                  
                  {/* Status and Trend */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      className="px-2.5 py-1 text-xs border-0"
                      style={{ 
                        backgroundColor: `${wellnessState.color}20`,
                        color: wellnessState.color 
                      }}
                    >
                      {wellnessState.label}
                    </Badge>
                    
                    {wellnessScore && trend !== 'stable' && (
                      <Badge 
                        variant="outline" 
                        className="px-2 py-1 text-xs gap-1"
                      >
                        {trend === 'up' && <TrendingUp className="w-3 h-3 text-success" />}
                        {trend === 'down' && <TrendingDown className="w-3 h-3 text-destructive" />}
                        {trendValue} pts
                      </Badge>
                    )}
                    
                    {wellnessScore && trend === 'stable' && (
                      <Badge variant="outline" className="px-2 py-1 text-xs gap-1">
                        <span className="text-xs">—</span>
                        Стабильно
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Circular Gauge */}
                <div className="flex items-center justify-center sm:justify-end">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="currentColor"
                        className="text-muted opacity-20"
                        strokeWidth="8"
                      />
                      {/* Progress circle with gradient */}
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke={wellnessState.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${((wellnessScore || 0) / 100) * 301.6} 301.6`}
                        className="transition-all duration-1000 ease-out"
                        style={{
                          filter: `drop-shadow(0 0 6px ${wellnessState.color}40)`
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <StateIcon 
                        className="w-10 h-10 transition-transform duration-300 hover:scale-110" 
                        style={{ color: wellnessState.color }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Message */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/30 border border-border">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${wellnessState.color}20` }}
              >
                <Sparkles 
                  className="w-4 h-4" 
                  style={{ color: wellnessState.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium mb-1.5">
                  {wellnessState.message}
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {wellnessState.insight}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={onStartAssessment}
              size="lg"
              className="w-full sm:w-auto group"
            >
              {wellnessScore ? 'Пройти новый тест' : 'Начать первый тест'}
              <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right Section - Key Metrics */}
          <div className="lg:col-span-2 bg-muted/30 p-8 border-l border-border">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-1">Ключевые показатели</h4>
                <p className="text-xs text-muted-foreground">
                  Трёхфакторная модель Maslach
                </p>
              </div>

              {wellnessScore ? (
                <div className="space-y-6">
                  {/* Emotional Exhaustion */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: '#ef444420' }}
                        >
                          <Heart className="w-4 h-4" style={{ color: '#ef4444' }} />
                        </div>
                        <span className="text-sm font-medium">EE</span>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {emotionalExhaustion}%
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${emotionalExhaustion}%`,
                          backgroundColor: '#ef4444'
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Эмоциональное истощение
                    </p>
                  </div>

                  {/* Depersonalization */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: '#3b82f620' }}
                        >
                          <Brain className="w-4 h-4" style={{ color: '#3b82f6' }} />
                        </div>
                        <span className="text-sm font-medium">DP</span>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {depersonalization}%
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${depersonalization}%`,
                          backgroundColor: '#3b82f6'
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Деперсонализация
                    </p>
                  </div>

                  {/* Personal Accomplishment */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: '#22c55e20' }}
                        >
                          <Zap className="w-4 h-4" style={{ color: '#22c55e' }} />
                        </div>
                        <span className="text-sm font-medium">PA</span>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {personalAccomplishment}%
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${personalAccomplishment}%`,
                          backgroundColor: '#22c55e'
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Профессиональная реализация
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Нет исторических данных
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Пройдите тест для отслеживания
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
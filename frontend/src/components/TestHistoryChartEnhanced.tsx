import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  Info
} from './Icons';
import { useState } from 'react';

interface TestHistoryData {
  date: string;
  score: number;
  label: string;
}

interface TestHistoryChartEnhancedProps {
  data: TestHistoryData[];
}

export function TestHistoryChartEnhanced({ data }: TestHistoryChartEnhancedProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'all' | '3m' | '6m'>('all');

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === 'all') return data;
    const months = timeRange === '3m' ? 3 : 6;
    return data.slice(-months);
  };

  const filteredData = getFilteredData();

  // Calculate statistics
  const averageScore = Math.round(filteredData.reduce((sum, d) => sum + d.score, 0) / filteredData.length);
  const latestScore = filteredData[filteredData.length - 1]?.score || 0;
  const previousScore = filteredData[filteredData.length - 2]?.score || latestScore;
  const trend = latestScore - previousScore;
  const minScore = Math.min(...filteredData.map(d => d.score));
  const maxScore = Math.max(...filteredData.map(d => d.score));

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 280;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Scale data points
  const scoreMax = 100;
  const scoreMin = 0;
  const scoreRange = scoreMax - scoreMin;

  // Calculate positions for data points with smooth bezier curves
  const points = filteredData.map((d, index) => {
    const x = (index / Math.max(1, filteredData.length - 1)) * graphWidth + padding.left;
    const y = chartHeight - padding.bottom - ((d.score - scoreMin) / scoreRange) * graphHeight;
    return { x, y, ...d };
  });

  // Create smooth bezier curve path
  const createSmoothPath = () => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };

  const linePath = createSmoothPath();

  // Create area path
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`
    : '';

  // Y-axis labels
  const yAxisLabels = [0, 25, 50, 75, 100];

  // Get color based on score with risk levels
  const getScoreColor = (score: number) => {
    if (score >= 70) return { color: '#4caf50', label: 'Низкий риск', bg: '#4caf5015' };
    if (score >= 50) return { color: '#ffc107', label: 'Средний риск', bg: '#ffc10715' };
    if (score >= 30) return { color: '#ff9800', label: 'Повышенный риск', bg: '#ff980015' };
    return { color: '#f44336', label: 'Высокий риск', bg: '#f4433615' };
  };

  const currentStatus = getScoreColor(latestScore);

  // Risk zones for background
  const riskZones = [
    { min: 70, max: 100, color: '#4caf50', opacity: 0.05, label: 'Низкий риск' },
    { min: 50, max: 70, color: '#ffc107', opacity: 0.05, label: 'Средний риск' },
    { min: 30, max: 50, color: '#ff9800', opacity: 0.05, label: 'Повышенный риск' },
    { min: 0, max: 30, color: '#f44336', opacity: 0.05, label: 'Высокий риск' },
  ];

  return (
    <Card className="shadow-xl border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-primary" />
              История оценок благополучия
            </CardTitle>
            <CardDescription>
              Динамика индекса выгорания ρ (rho) с трендовым анализом
            </CardDescription>
          </div>
          
          {/* Time range filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant={timeRange === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('all')}
              className="text-xs"
            >
              Все
            </Button>
            <Button
              variant={timeRange === '6m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('6m')}
              className="text-xs"
              disabled={data.length < 6}
            >
              6 мес
            </Button>
            <Button
              variant={timeRange === '3m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('3m')}
              className="text-xs"
              disabled={data.length < 3}
            >
              3 мес
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {/* Latest Score */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Текущий</p>
            <p 
              className="text-2xl font-medium tabular-nums"
              style={{ color: currentStatus.color }}
            >
              {latestScore}
            </p>
            <Badge 
              className="mt-2 text-[10px] px-2 py-0.5 border-0"
              style={{ backgroundColor: currentStatus.bg, color: currentStatus.color }}
            >
              {currentStatus.label}
            </Badge>
          </div>

          {/* Average */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Средний</p>
            <p className="text-2xl font-medium tabular-nums">{averageScore}</p>
            <p className="text-[10px] text-muted-foreground mt-2">
              За период
            </p>
          </div>

          {/* Trend */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Изменение</p>
            <div className="flex items-center gap-1.5">
              <p 
                className={`text-2xl font-medium tabular-nums ${
                  trend > 0 ? 'text-success' : trend < 0 ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {trend > 0 ? '+' : ''}{trend}
              </p>
              {trend > 0 && <TrendingUp className="w-4 h-4 text-success" />}
              {trend < 0 && <TrendingDown className="w-4 h-4 text-destructive" />}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {trend > 0 ? 'Улучшение' : trend < 0 ? 'Снижение' : 'Стабильно'}
            </p>
          </div>

          {/* Range */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Диапазон</p>
            <p className="text-2xl font-medium tabular-nums">{minScore}-{maxScore}</p>
            <p className="text-[10px] text-muted-foreground mt-2">
              Размах: {maxScore - minScore}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Chart */}
        <div className="relative w-full overflow-x-auto custom-scrollbar pb-4">
          <svg 
            width={chartWidth} 
            height={chartHeight} 
            className="min-w-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
              </linearGradient>
              
              {/* Glow filter for line */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Risk zone backgrounds */}
            {riskZones.map((zone, index) => {
              const y = chartHeight - padding.bottom - ((zone.max - scoreMin) / scoreRange) * graphHeight;
              const height = ((zone.max - zone.min) / scoreRange) * graphHeight;
              
              return (
                <rect
                  key={index}
                  x={padding.left}
                  y={y}
                  width={graphWidth}
                  height={height}
                  fill={zone.color}
                  opacity={zone.opacity}
                />
              );
            })}

            {/* Horizontal grid lines */}
            {yAxisLabels.map((label) => {
              const y = chartHeight - padding.bottom - ((label - scoreMin) / scoreRange) * graphHeight;
              return (
                <line
                  key={label}
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
              );
            })}

            {/* Y-axis labels */}
            {yAxisLabels.map((label) => {
              const y = chartHeight - padding.bottom - ((label - scoreMin) / scoreRange) * graphHeight;
              return (
                <text
                  key={label}
                  x={padding.left - 15}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="11"
                  className="select-none"
                >
                  {label}
                </text>
              );
            })}

            {/* Y-axis label */}
            <text
              x={20}
              y={chartHeight / 2}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="11"
              transform={`rotate(-90 20 ${chartHeight / 2})`}
              className="select-none"
            >
              Индекс ρ (rho)
            </text>

            {/* Area fill with gradient */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#areaGradient)"
              />
            )}

            {/* Main line with glow effect */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                className="transition-all duration-300"
              />
            )}

            {/* Data points with animation */}
            {points.map((point, index) => {
              const isHovered = hoveredPoint === index;
              const pointColor = getScoreColor(point.score);
              
              return (
                <g key={index}>
                  {/* Larger invisible hitbox for better hover stability */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={15}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* Outer ring on hover */}
                  {isHovered && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={12}
                      fill="none"
                      stroke={pointColor.color}
                      strokeWidth="2"
                      opacity="0.3"
                      className="animate-pulse pointer-events-none"
                    />
                  )}
                  
                  {/* Main point */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? 7 : 5}
                    fill={pointColor.color}
                    stroke="hsl(var(--card))"
                    strokeWidth="2.5"
                    className="pointer-events-none transition-all duration-200"
                    style={{ filter: isHovered ? 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' : 'none' }}
                  />
                  
                  {/* Center dot */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={2}
                    fill="white"
                    className="pointer-events-none"
                  />
                </g>
              );
            })}

            {/* X-axis labels with rotation for better fit */}
            {points.map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={chartHeight - padding.bottom + 20}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
                className="select-none"
              >
                {point.date}
              </text>
            ))}

            {/* X-axis label */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="11"
              className="select-none"
            >
              Дата прохождения теста
            </text>
          </svg>

          {/* Enhanced Tooltip */}
          {hoveredPoint !== null && points[hoveredPoint] && (
            <div
              className="absolute bg-card/95 backdrop-blur-sm border-2 rounded-xl shadow-2xl p-4 pointer-events-none z-20 min-w-[200px] animate-in fade-in-50 zoom-in-95 duration-200"
              style={{
                left: `${points[hoveredPoint].x}px`,
                top: `${Math.max(10, points[hoveredPoint].y - 120)}px`,
                transform: 'translateX(-50%)',
                borderColor: getScoreColor(points[hoveredPoint].score).color,
              }}
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="font-medium">{points[hoveredPoint].date}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Индекс ρ:</span>
                  <span 
                    className="text-2xl font-medium tabular-nums"
                    style={{ color: getScoreColor(points[hoveredPoint].score).color }}
                  >
                    {points[hoveredPoint].score}
                  </span>
                </div>
                
                <Badge 
                  className="w-full justify-center text-xs border-0"
                  style={{ 
                    backgroundColor: getScoreColor(points[hoveredPoint].score).bg,
                    color: getScoreColor(points[hoveredPoint].score).color 
                  }}
                >
                  {points[hoveredPoint].label}
                </Badge>

                {/* Show change from previous */}
                {hoveredPoint > 0 && (
                  <div className="pt-2 mt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Изменение:</span>
                      <span className={`font-medium ${
                        points[hoveredPoint].score > points[hoveredPoint - 1].score 
                          ? 'text-success' 
                          : points[hoveredPoint].score < points[hoveredPoint - 1].score 
                            ? 'text-destructive' 
                            : 'text-muted-foreground'
                      }`}>
                        {points[hoveredPoint].score > points[hoveredPoint - 1].score ? '+' : ''}
                        {points[hoveredPoint].score - points[hoveredPoint - 1].score}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Legend */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h5 className="text-sm font-medium">Уровни риска выгорания</h5>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card/50">
              <div className="w-3 h-3 rounded-full bg-[#4caf50] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium">Низкий риск</p>
                <p className="text-[10px] text-muted-foreground">70-100</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card/50">
              <div className="w-3 h-3 rounded-full bg-[#ffc107] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium">Средний риск</p>
                <p className="text-[10px] text-muted-foreground">50-69</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card/50">
              <div className="w-3 h-3 rounded-full bg-[#ff9800] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium">Повышенный риск</p>
                <p className="text-[10px] text-muted-foreground">30-49</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card/50">
              <div className="w-3 h-3 rounded-full bg-[#f44336] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium">Высокий риск</p>
                <p className="text-[10px] text-muted-foreground">0-29</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div 
          className="mt-6 p-4 rounded-xl border-2 transition-all duration-300"
          style={{ 
            backgroundColor: `${currentStatus.color}08`,
            borderColor: `${currentStatus.color}30`
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${currentStatus.color}20` }}
            >
              {trend > 10 && <span className="text-lg">🎉</span>}
              {trend > 0 && trend <= 10 && <span className="text-lg">✨</span>}
              {trend === 0 && <span className="text-lg">📊</span>}
              {trend < 0 && trend >= -10 && <span className="text-lg">⚠️</span>}
              {trend < -10 && <span className="text-lg">🔴</span>}
            </div>
            
            <div className="flex-1">
              <h5 className="text-sm font-medium mb-1">Анализ динамики</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trend > 10 && "Отличная динамика! Ваши показатели значительно улучшились. Продолжайте придерживаться выбранных практик благополучия."}
                {trend > 0 && trend <= 10 && "Позитивный тренд! Вы движетесь в правильном направлении. Небольшие последовательные изменения дают устойчивый результат."}
                {trend === 0 && "Стабильные показатели. Вы успешно поддерживаете текущий уровень благополучия. Продолжайте следовать установленным привычкам."}
                {trend < 0 && trend >= -10 && "Небольшое снижение показателей. Рекомендуем уделить внимание персональным рекомендациям и практикам восстановления."}
                {trend < -10 && "Значительное снижение показателей. Настоятельно рекомендуем обратиться к специалисту и активно следовать программе поддержки."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
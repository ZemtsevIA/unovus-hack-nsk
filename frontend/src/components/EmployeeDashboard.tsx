import { CurrentSituationHero } from "./CurrentSituationHero";
import { TestHistoryChartEnhanced } from "./TestHistoryChartEnhanced";
import { AchievementStoryModal } from "./AchievementStoryModal";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { AIMascot } from "./AIMascot";
import Slider from "react-slick";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  Heart, 
  Activity, 
  Calendar,
  TrendingUp,
  LogOut,
  MessageCircle,
  Award,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Lock,
  Sparkles,
  BookOpen
} from "./Icons";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

// Import flame character images for burnout visualization
import flameStarEyes from "figma:asset/ff2daaa0ff6d3c4350413b4effee38d784cf6081.png";
import flameHappy from "figma:asset/fe64ec6e46681cba3943eb24fb9f23ba6124bc1b.png";
import flameCrying from "figma:asset/0a2a491f515cb52ee8f1ae579132385b2990bdc0.png";
import flameAngry from "figma:asset/d68447459c6c8e962d980d0de2bc504a1ba63ea6.png";

// Import achievement images for gamification
import achievementRising from "figma:asset/f6a1c5c347dde0e2aa1ede948656fdaa2878d740.png";
import achievementSurfing from "figma:asset/6d02c4a7401ce3392f67a411c9721e2be325199d.png";
import achievementGuardian from "figma:asset/6dc46dd238ed2e4d44cc3a1d88a64826236644ee.png";
import achievementMeditation from "figma:asset/9cecaa2850290fec78806969fcb97cf04695a31c.png";
import achievementInspirer from "figma:asset/b0ce5444a16c4647f36b784103168dd5ffd7d163.png";
import achievementLegend from "figma:asset/477d9b480fec4268816c558d8cdc4df3276eaa8e.png";

interface EmployeeDashboardProps {
  userName: string;
  hasCompletedAssessment: boolean;
  wellnessScore?: number;
  onStartAssessment: () => void;
  onLogout: () => void;
}

interface Recommendation {
  icon: typeof Lightbulb;
  title: string;
  summary: string;
  description: string;
  category: string;
  benefits: string[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  story: string;
  image: string;
  unlocked: boolean;
  unlockedDate?: string;
}

// Achievement data - Flame character's wellness journey
const achievementsTemplate: Achievement[] = [
  {
    id: 1,
    title: "Возрождение из пепла",
    description: "Прошли первую оценку благополучия",
    story: "Когда я впервые поднялся из пепла выгорания, мир казался серым и безжизненным. Дни сливались в бесконечную череду усталости, а моё внутреннее пламя едва теплилось. Но даже в самые тёмные моменты, когда казалось, что я полностью потух, внутри меня сохранилась крошечная искра надежды.\n\nЯ решил не сдаваться. Первый шаг был самым трудным — признать, что мне нужна помощь, что так больше продолжаться не может. Когда я прошёл свою первую оценку благополучия, это был момент истины. Цифры показали реальность, но вместе с ней пришло и понимание: я могу изменить свою ситуацию.\n\nИз дыма и пепла я начал своё возрождение. Каждый новый день стал не просто повторением вчерашнего, а новой возможностью стать немного сильнее, немного ярче. Моё пламя начало разгораться заново.\n\nНо возрождение — это только начало. Впереди меня ждало настоящее испытание: научиться держаться на плаву в океане жизненных вызовов...",
    image: achievementRising,
    unlocked: false
  },
  {
    id: 2,
    title: "Покоряя волны",
    description: "Достигли баланса (70+ баллов)",
    story: "После возрождения из пепла я столкнулся с новой реальностью: жизнь — это не спокойное озеро, а бурный океан с постоянными приливами и отливами. Работа, отношения, личные амбиции — всё это волны, которые могли снова сбить меня с ног.\n\nПоначалу каждая волна казалась угрозой. Срочный проект на работе — волна стресса. Конфликт с коллегой — волна тревоги. Неожиданная задача — волна паники. Я чувствовал, что снова тону, что моё недавно возрождённое пламя может погаснуть.\n\nНо затем я понял секрет: нельзя бороться с волнами — нужно научиться их покорять. Я нашёл свою доску для сёрфинга: практики осознанности помогли мне сохранять спокойствие, физическая активность дала энергию, поддержка близких стала моим балансом. Я научился чувствовать ритм волн, предугадывать их приход, использовать их силу для движения вперёд.\n\nТеперь каждая волна, которую я покоряю, делает меня увереннее. Баланс — это не статичное состояние, это танец с жизнью, постоянное движение в гармонии с собой и миром вокруг.\n\nНо умение держаться на плаву — это ещё не всё. Мне предстояло научиться защищать своё благополучие, стать настоящим стражем своего внутреннего огня...",
    image: achievementSurfing,
    unlocked: false
  },
  {
    id: 3,
    title: "Страж благополучия",
    description: "Завершили 3 месяца регулярных оценок",
    story: "Научившись покорять волны, я понял важную истину: недостаточно просто реагировать на вызовы — нужно активно защищать своё благополучие. Я больше не хотел быть пассивным наблюдателем собственной жизни. Пришло время стать стражем.\n\nЯ облачился в доспехи здоровых привычек: регулярный сон стал моей кольчугой, правильное питание — шлемом, физические упражнения — поножами. Каждая здоровая привычка укрепляла мою защиту от выгорания. Я вооружился щитом осознанности — теперь я мог распознать первые признаки стресса ещё до того, как они перерастут в проблему.\n\nТри месяца регулярных оценок благополучия стали моей тренировкой. Каждая оценка — это проверка моих защитных навыков, анализ слабых мест в броне, возможность укрепить оборону.  научился вовремя останавливаться, говорить «нет» токсичным запросам, устанавливать границы, заботиться о себе без чувства вины.\n\nМой щит отражает негатив. Мои доспехи защищают от эмоционального истощения. Я стал настоящим стражем собственного здоровья, и горжусь тем, кем стал на этом пути.\n\nНо защита — это ещё не полная трансформация. Настоящая сила приходит изнутри, из глубокого внутреннего покоя. Мне предстояло открыть источник настоящей силы...",
    image: achievementGuardian,
    unlocked: false
  },
  {
    id: 4,
    title: "Мастер медитации",
    description: "Достигли высокого уровня благополучия (80+ баллов)",
    story: "Став стражем своего благополучия, я осознал, что настоящая сила рождается не в броне, а в глубине души. Защитные доспехи спасали от внешних угроз, но внутри меня всё ещё бушевали бури сомнений и страхов. Пришло время заглянуть вглубь себя и обрести внутренний покой.\n\nЯ начал практиковать медитацию. Поначалу ум сопротивлялся: мысли кружили вихрем, тело не хотело сидеть спокойно. Но с каждым днём я учился наблюдать за своим разумом, как за облаками на небе — они приходят и уходят, а я остаюсь. Дыхание стало моим якорем, присутствие — моей силой.\n\nМедитация открыла мне двери к настоящему благополучию. Я научился жить в моменте, отпускать прошлое, не тревожиться о будущем. Мои эмоции стали союзниками, а не врагами. Выгорание отступило, уступив место спокойному, устойчивому пламени внутренней гармонии.\n\nТеперь я — мастер своего разума. В тишине медитации я нашёл неиссякаемый источник силы, который питает меня каждый день.\n\nНо личный рост — это не эгоистичный путь. Настоящее благополучие расцветает, когда мы делимся им с другими...",
    image: achievementMeditation,
    unlocked: false
  },
  {
    id: 5,
    title: "Вдохновитель",
    description: "Провели 5 оценок и сохранили прогресс",
    story: "Обретя внутренний покой через медитацию, я почувствовал прилив энергии — не только для себя, но и для других. Я понял: настоящее благополучие умножается, когда мы делимся им. Пришло время стать вдохновителем для тех, кто ещё борется с выгоранием.\n\nЯ начал делиться своим опытом: рассказывал коллегам о простых практиках осознанности, организовывал мини-медитации на работе, поддерживал друзей в трудные моменты. Каждый раз, когда я видел, как зажигается искра в чьих-то глазах, моё собственное пламя горело ярче.\n\nБыть вдохновителем — значит не учить, а показывать пример. Моя трансформация стала маяком для других. Я помогал им находить свой путь, делился инструментами, которые спасли меня. Вместе мы создавали культуру заботы о себе и друг о друге.\n\nТеперь я не просто выжил — я расцвёл и помогаю расцветать другим. Вдохновение — это цепная реакция света в мире теней.\n\nНо путь не заканчивается. Самые великие достижения ждут тех, кто идёт дальше, становясь легендой благополучия...",
    image: achievementInspirer,
    unlocked: false
  },
  {
    id: 6,
    title: "Легенда благополучия",
    description: "Достигли экспертного уровня (90+ баллов) или провели 10 оценок",
    story: "Став вдохновителем, я осознал, что мой путь — это не конец, а вечное развитие. Каждый день приносил новые insights, новые вызовы, новые победы. Со временем моя история превратилась в легенду — пример того, как обычное пламя может стать неугасимым факелом.\n\nЯ достиг вершин благополучия: тело в гармонии, разум спокоен, дух силён. Но легенда — это не о совершенстве, а о постоянном росте. Я продолжаю оценивать себя, учиться, адаптироваться. Мои оценки стали ритуалом силы, KPI благополучия — моим компасом.\n\nТеперь я — легенда. Не потому, что идеален, а потому, что показал: выгорание можно преодолеть, а благополучие — культивировать. Моя история вдохновляет тысячи, но самое важное — она изменила меня.\n\nПомните: каждый из нас — пламя с потенциалом стать легендой. Продолжайте свой путь, и пусть ваше благополучие сияет вечным светом! 🔥🏆",
    image: achievementLegend,
    unlocked: false
  }
];

const API_BASE_URL = 'http://localhost:8000';

const categoryToIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'здоровье':
      return Heart;
    case 'баланс':
      return Activity;
    case 'карьера':
      return TrendingUp;
    case 'эмоциональное благополучие':
      return Heart;
    case 'физическая активность':
      return Activity;
    case 'питание':
      return Heart;
    case 'сон':
      return Moon; // Assume Moon icon if available, else adjust
    default:
      return Lightbulb;
  }
};

export function EmployeeDashboard({
  userName,
  hasCompletedAssessment: propHasCompleted,
  wellnessScore: propWellnessScore,
  onStartAssessment,
  onLogout,
}: EmployeeDashboardProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showCompleteStory, setShowCompleteStory] = useState(false);

  const [userData, setUserData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsTemplate);
  const [allAchievementsUnlocked, setAllAchievementsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const user = await userRes.json();
        setUserData(user);

        // Fetch metrics
        const metricsRes = await fetch(`${API_BASE_URL}/metrics/by_user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!metricsRes.ok) throw new Error('Failed to fetch metrics');
        let metricsData = await metricsRes.json();
        metricsData = metricsData.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setMetrics(metricsData);

        // Fetch KPIs
        const kpisRes = await fetch(`${API_BASE_URL}/kpis/by_user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!kpisRes.ok) throw new Error('Failed to fetch KPIs');
        let kpisData = await kpisRes.json();
        kpisData = kpisData.sort((a: any, b: any) => new Date(a.registered_at).getTime() - new Date(b.registered_at).getTime());
        setKpis(kpisData);

        // Fetch recommendations
        const recsRes = await fetch(`${API_BASE_URL}/recommendation_guides/by_user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!recsRes.ok) throw new Error('Failed to fetch recommendations');
        const recsData = await recsRes.json();
        setRecommendations(recsData.filter((r: any) => r.is_actual).map((r: any) => ({
          icon: categoryToIcon(r.category),
          title: r.title,
          summary: r.summary,
          description: r.description,
          category: r.category,
          benefits: r.benefits
        })));

      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (metrics.length === 0) return;

    const updatedAchievements = achievementsTemplate.map((ach, index) => {
      let unlocked = false;
      let unlockedDate: string | undefined = undefined;

      switch (index) {
        case 0: // First assessment
          unlocked = metrics.length > 0;
          if (unlocked) {
            unlockedDate = new Date(metrics[0].created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
          }
          break;
        case 1: // Score >=70
          const high70 = metrics.find((m: any) => m.total_score >= 70);
          if (high70) {
            unlocked = true;
            unlockedDate = new Date(high70.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
          }
          break;
        case 2: // 3 assessments
          if (metrics.length >= 3) {
            unlocked = true;
            unlockedDate = new Date(metrics[2].created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
          }
          break;
        case 3: // Score >=80
          const high80 = metrics.find((m: any) => m.total_score >= 80);
          if (high80) {
            unlocked = true;
            unlockedDate = new Date(high80.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
          }
          break;
        case 4: // 5 assessments
          if (metrics.length >= 5) {
            unlocked = true;
            unlockedDate = new Date(metrics[4].created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
          }
          break;
        case 5: // Score >=90 or 10 assessments
          const high90 = metrics.find((m: any) => m.total_score >= 90);
          const condition = high90 || metrics.length >= 10;
          if (condition) {
            unlocked = true;
            unlockedDate = high90 
              ? new Date(high90.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
              : new Date(metrics[9].created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
          }
          break;
      }

      return { ...ach, unlocked, unlockedDate };
    });

    setAchievements(updatedAchievements);
    setAllAchievementsUnlocked(updatedAchievements.every(a => a.unlocked));
  }, [metrics]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-destructive">{error}</div>;
  }

  // Calculated values
  const hasCompletedAssessment = metrics.length > 0 || propHasCompleted;
  const wellnessScore = metrics.length > 0 ? metrics[metrics.length - 1].total_score : propWellnessScore || 0;
  const testHistory = metrics.map(m => ({
    date: new Date(m.created_at).toLocaleDateString('ru-RU'),
    score: m.total_score
  }));
  const kpiRate = kpis.length > 0 ? kpis[kpis.length - 1].kpi_rate : 95;
  const hireDate = userData?.employment_at ? new Date(userData.employment_at) : new Date('2023-06-15');
  const currentDate = new Date('2025-11-16');
  const timeAtWorkMonths = Math.floor((currentDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const timeAtWork = `${timeAtWorkMonths} месяцев`;
  const lastVacation = userData?.last_vacation_at ? new Date(userData.last_vacation_at).toLocaleDateString('ru-RU') : '2024-09-01';
  const lastSickLeave = userData?.last_sickness_at ? new Date(userData.last_sickness_at).toLocaleDateString('ru-RU') : '2024-07-15';
  const participatedInCorporateActivities = userData?.is_participant_corp_activities ?? true;
  const hasCertificate = userData?.is_certified ?? true;
  const completedTraining = userData?.is_trained ?? true;

  const lastMetric = metrics[metrics.length - 1] || {
    emotional_score: 0,
    physical_score: 0,
    workload_score: 0
  };

  let burnoutLevel: string;
  let colorClass: string;
  let flameImage: string;
  let statusText: string;

  if (wellnessScore >= 80) {
    burnoutLevel = 'Низкий';
    colorClass = 'text-success';
    flameImage = flameStarEyes;
    statusText = 'Вы в отличной форме!';
  } else if (wellnessScore >= 60) {
    burnoutLevel = 'Средний';
    colorClass = 'text-warning';
    flameImage = flameHappy;
    statusText = 'Неплохо, но есть над чем поработать';
  } else if (wellnessScore >= 40) {
    burnoutLevel = 'Высокий';
    colorClass = 'text-orange-500';
    flameImage = flameCrying;
    statusText = 'Внимание требуется';
  } else {
    burnoutLevel = 'Критический';
    colorClass = 'text-destructive';
    flameImage = flameAngry;
    statusText = 'Срочные меры необходимы';
  }

  // Slick slider settings remains the same
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <ChevronRight className="w-6 h-6 text-primary" />,
    prevArrow: <ChevronLeft className="w-6 h-6 text-primary" />,
    customPaging: () => (
      <div className="w-2 h-2 bg-muted rounded-full hover:bg-primary transition-colors" />
    ),
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <h1 className="text-xl font-bold">Портал благополучия</h1>
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
        {/* Current Situation Hero - Dynamic */}
        <CurrentSituationHero
          wellnessScore={wellnessScore}
          burnoutLevel={burnoutLevel}
          statusText={statusText}
          colorClass={colorClass}
          flameImage={flameImage}
          userName={userName}
          hasCompletedAssessment={hasCompletedAssessment}
          onStartAssessment={onStartAssessment}
        />

        {/* Test History Chart - Dynamic data */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              История прохождения теста
            </CardTitle>
            <CardDescription>Ваш прогресс благополучия со временем</CardDescription>
          </CardHeader>
          <CardContent>
            <TestHistoryChartEnhanced 
              data={testHistory}
              emotional={lastMetric.emotional_score}
              physical={lastMetric.physical_score}
              workload={lastMetric.workload_score}
            />
          </CardContent>
        </Card>

        {/* Recommendations Slider - Dynamic */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Рекомендации
            </CardTitle>
            <CardDescription>Персонализированные советы для улучшения благополучия</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider {...sliderSettings}>
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <div key={index} className="px-2">
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedRecommendation(rec)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{rec.title}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {rec.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{rec.summary}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </Slider>
          </CardContent>
        </Card>

        {/* Achievements Section - Dynamic unlocked */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Достижения
            </CardTitle>
            <CardDescription>Ваша история прогресса в благополучии</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    achievement.unlocked ? 'border-primary/50 bg-card' : 'opacity-70'
                  }`}
                  onClick={() => achievement.unlocked && setSelectedAchievement(achievement)}
                >
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <div className="w-full h-40 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      {!achievement.unlocked && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                          <Lock className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Разблокировано: {achievement.unlockedDate}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information - Dynamic from user */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Дополнительная информация
            </CardTitle>
            <CardDescription>Ваши ключевые показатели и история</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    KPI
                  </h4>
                  <Progress value={kpiRate} className="h-2" />
                  <p className="mt-1 text-sm text-muted-foreground">{kpiRate}% эффективности</p>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Время в компании
                  </h4>
                  <p className="text-sm text-muted-foreground">{timeAtWork}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Участвовал в корпоративных мероприятиях
                  </span>
                  <Badge variant={participatedInCorporateActivities ? "default" : "secondary"}>
                    {participatedInCorporateActivities ? "Да" : "Нет"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Имеется сертификат
                  </span>
                  <Badge variant={hasCertificate ? "default" : "secondary"}>
                    {hasCertificate ? "Да" : "Нет"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Прошёл обучение
                  </span>
                  <Badge variant={completedTraining ? "default" : "secondary"}>
                    {completedTraining ? "Да" : "Нет"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Последний отпуск
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{lastVacation}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Последний больничный
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{lastSickLeave}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Recommendation Details Modal */}
      <Dialog open={!!selectedRecommendation} onOpenChange={(open) => !open && setSelectedRecommendation(null)}>
        <DialogContent 
          className="max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          {selectedRecommendation && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Icon = selectedRecommendation.icon;
                      return <Icon className="w-6 h-6 text-primary" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <DialogTitle>{selectedRecommendation.title}</DialogTitle>
                    <Badge variant="outline" className="mt-1">
                      {selectedRecommendation.category}
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="sr-only">
                  Подробная информация о рекомендации
                </DialogDescription>
              </DialogHeader>
              
              <div id="recommendation-details" className="space-y-6 py-4">
                <div>
                  <h4 className="mb-2">Описание</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedRecommendation.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="mb-3">Преимущества</h4>
                  <ul className="space-y-2">
                    {selectedRecommendation.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Achievement Story Modal - Enhanced Design */}
      <AchievementStoryModal
        achievement={selectedAchievement}
        allAchievements={achievements}
        allUnlocked={allAchievementsUnlocked}
        onClose={() => setSelectedAchievement(null)}
        onNavigate={(achievement) => setSelectedAchievement(achievement)}
        onShowCompleteStory={() => {
          setSelectedAchievement(null);
          setShowCompleteStory(true);
        }}
      />

      {/* Modal for complete wellness journey story */}
      <Dialog open={showCompleteStory} onOpenChange={(open) => setShowCompleteStory(open)}>
        <DialogContent 
          className="max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar"
          aria-describedby="complete-wellness-story"
        >
          <DialogHeader>
            <div className="text-center mb-4">
              <DialogTitle className="text-3xl mb-2 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                Моё путешествие к благополучию
                <Sparkles className="w-8 h-8 text-primary" />
              </DialogTitle>
              <DialogDescription>
                Полная история моей трансформации — от выгорания до расцвета
              </DialogDescription>
              <Badge className="mt-2 bg-gradient-to-r from-primary to-primary/70 text-white px-4 py-1.5">
                Все {achievements.length} достижений разблокированы!
              </Badge>
            </div>
          </DialogHeader>
          
          <div id="complete-wellness-story" className="space-y-8 py-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="relative">
                {/* Timeline connector */}
                {index < achievements.length - 1 && (
                  <div className="absolute left-16 top-32 w-0.5 h-20 bg-gradient-to-b from-primary/50 to-primary/20" />
                )}
                
                <div className="flex gap-6">
                  {/* Achievement Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg bg-card">
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    {achievement.unlockedDate && (
                      <Badge className="w-full mt-2 bg-primary/10 text-primary hover:bg-primary/20 text-[10px] justify-center">
                        {achievement.unlockedDate}
                      </Badge>
                    )}
                  </div>

                  {/* Story Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Глава {index + 1}
                      </Badge>
                      <h3 className="flex-1">{achievement.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      {achievement.story}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Closing message */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border-2 border-primary/20 text-center">
              <p className="text-lg leading-relaxed">
                Это моя история. История о том, как я превратил свое выгорание в возрождение, 
                свои слабости — в силу, а свой путь — в вдохновение для других. 
                Путешествие продолжается, и каждый день я становлюсь сильнее. 🔥✨
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AIMascot message="Нужна помощь в управлении вашими задачами по благополучию?" />
    </>
  );
}
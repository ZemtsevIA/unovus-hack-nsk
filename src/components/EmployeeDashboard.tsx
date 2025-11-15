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
import { useState } from "react";

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
const achievements: Achievement[] = [
  {
    id: 1,
    title: "Возрождение из пепла",
    description: "Прошли первую оценку благополучия",
    story: "Когда я впервые поднялся из пепла выгорания, мир казался серым и безжизненным. Дни сливались в бесконечную череду усталости, а моё внутреннее пламя едва теплилось. Но даже в самые тёмные моменты, когда казалось, что я полностью потух, внутри меня сохранилась крошечная искра надежды.\n\nЯ решил не сдаваться. Первый шаг был самым трудным — признать, что мне нужна помощь, что так больше продолжаться не может. Когда я прошёл свою первую оценку благополучия, это был момент истины. Цифры показали реальность, но вместе с ней пришло и понимание: я могу изменить свою ситуацию.\n\nИз дыма и пепла я начал своё возрождение. Каждый новый день стал не просто повторением вчерашнего, а новой возможностью стать немного сильнее, немного ярче. Моё пламя начало разгораться заново.\n\nНо возрождение — это только начало. Впереди меня ждало настоящее испытание: научиться держаться на плаву в океане жизненных вызовов...",
    image: achievementRising,
    unlocked: true,
    unlockedDate: "15 июн 2025"
  },
  {
    id: 2,
    title: "Покоряя волны",
    description: "Достигли баланса (70+ баллов)",
    story: "После возрождения из пепла я столкнулся с новой реальностью: жизнь — это не спокойное озеро, а бурный океан с постоянными приливами и отливами. Работа, отношения, личные амбиции — всё это волны, которые могли снова сбить меня с ног.\n\nПоначалу каждая волна казалась угрозой. Срочный проект на работе — волна стресса. Конфликт с коллегой — волна тревоги. Неожиданная задача — волна паники. Я чувствовал, что снова тону, что моё недавно возрождённое пламя может погаснуть.\n\nНо затем я понял секрет: нельзя бороться с волнами — нужно научиться их покорять. Я нашёл свою доску для сёрфинга: практики осознанности помогли мне сохранять спокойствие, физическая активность дала энергию, поддержка близких стала моим балансом. Я научился чувствовать ритм волн, предугадывать их приход, использовать их силу для движения вперёд.\n\nТеперь каждая волна, которую я покоряю, делает меня увереннее. Баланс — это не статичное состояние, это танец с жизнью, постоянное движение в гармонии с собой и миром вокруг.\n\nНо умение держаться на плаву — это ещё не всё. Мне предстояло научиться защищать своё благополучие, стать настоящим стражем своего внутреннего огня...",
    image: achievementSurfing,
    unlocked: true,
    unlockedDate: "15 июн 2025"
  },
  {
    id: 3,
    title: "Страж благополучия",
    description: "Завершили 3 месяца регулярных оценок",
    story: "Научившись покорять волны, я понял важную истину: недостаточно просто реагировать на вызовы — нужно активно защищать своё благополучие. Я больше не хотел быть пассивным наблюдателем собственной жизни. Пришло время стать стражем.\n\nЯ облачился в доспехи здоровых привычек: регулярный сон стал моей кольчугой, правильное питание — шлемом, физические упражнения — поножами. Каждая здоровая привычка укрепляла мою защиту от выгорания. Я вооружился щитом осознанности — теперь я мог распознать первые признаки стресса ещё до того, как они перерастут в проблему.\n\nТри месяца регулярных оценок благополучия стали моей тренировкой. Каждая оценка — это проверка моих защитных навыков, анализ слабых мест в броне, возможность укрепить оборону.  научился вовремя останавливаться, говорить «нет» токсичным запросам, устанавливать границы, заботиться о себе без чувства вины.\n\nМой щит отражает негатив. Мои доспехи защищают от эмоционального истощения. Я стал настоящим стражем собственного здоровья, и горжусь тем, кем стал на этом пути.\n\nНо защита — это ещё не полная трансформация. Настоящая сила приходит изнутри, из глубокого внутреннего покоя. Мне предстояло открыть источник настоящей силы...",
    image: achievementGuardian,
    unlocked: true,
    unlockedDate: "15 июн 2025"
  },
  {
    id: 4,
    title: "Мастер медитации",
    description: "Практиковали осознанность 30 дней подряд",
    story: "Став стражем своего благополучия, я обнаружил, что внешняя защита — это только половина пути. Настоящая непоколебимость рождается внутри, в тишине и покое разума. Мне нужно было углубиться, найти корни своей силы.\n\nТридцать дней ежедневной медитации стали моим путешествием к центру себя. Поначалу было трудно: мысли метались как буря, тело сопротивлялось неподвижности, разум требовал действия. Но я продолжал, день за днём, медленно прорастая сквозь слои беспокойства к чистому источнику внутреннего покоя.\n\nКак семя, пробивающееся сквозь почву к свету, я пробивался сквозь хаос к ясности. С каждым днём практики я чувствовал, как во мне прорастают корни осознанности — глубокие, прочные, питающие моё существо. Листья спокойствия раскрывались навстречу жизни. Я научился находить тишину среди шума, центр покоя в буре эмоций.\n\nТеперь медитация — моя суперсила. В любой момент я могу вернуться к этому источнику силы внутри себя, к этому зелёному оазису спокойствия. Практика осознанности помогает мне оставаться сфокусированным, присутствующим здесь и сейчас, полностью живым.\n\nНо величайшее открытие ждало меня впереди: я понял, что моя трансформация может вдохновить других. Пришло время делиться светом...",
    image: achievementMeditation,
    unlocked: false
  },
  {
    id: 5,
    title: "Вдохновитель команды",
    description: "Помогли 5 коллегам начать путь к благополучию",
    story: "Обретя внутренний покой через медитацию, я сделал удивительное открытие: чем ярче горит моё пламя, тем больше света я могу дать другим. Моя история трансформации начала вдохновлять коллег, и это стало самой большой наградой на моём пути.\n\nПервым был Алексей, который признался мне в обеденный перерыв: «Я устал так же, как ты был устал год назад». Я поделился своей историей, и увидел искру надежды в его глазах. Потом была Мария, затем Дмитрий, Елена и Сергей. Пятеро коллег начали свой путь к благополучию, вдохновлённые моей трансформацией.\n\nКогда я делюсь своим опытом, моё пламя не уменьшается — оно становится ярче, сильнее, жарче. Поддерживая других, я укрепляю собственное благополучие. Вместе мы создали культуру заботы, где можно говорить о стрессе без стыда, просить о помощи без страха, праздновать маленькие победы вместе.\n\nЯ понял фундаментальную истину: благополучие — это не индивидуальное достижение, а коллективное путешествие. Мы растём вместе, поддерживаем друг друга, создаём атмосферу, где каждый может процветать. Моя радость стала общей радостью.\n\nИ вот, пройдя весь этот путь, я стоял на пороге величайшего достижения: стать живой легендой благополучия...",
    image: achievementInspirer,
    unlocked: false
  },
  {
    id: 6,
    title: "Легенда благополучия",
    description: "Поддерживали высокий уровень благополучия 6 месяцев",
    story: "Я прошел полный цикл трансформации. От пепла выгорания до яркого, устойчивого пламени благополучия. Теперь моя история — это легенда, которая вдохновляет других. Я доказал себе и миру, что изменения возможны, что выгорание можно преодолеть, что жизнь может быть наполнена энергией и радостью. Мое путешествие продолжается, но теперь я знаю: я способен на великие свершения, когда забочусь о себе.",
    image: achievementLegend, // Placeholder for future achievement  
    unlocked: false
  }
];

const recommendations: Recommendation[] = [
  {
    icon: Lightbulb,
    title: "Практика осознанности",
    summary: "Медитация для снижения стресса и улучшения концентрации",
    description: "Практикуйте 10-минутную управляемую медитацию каждый день. Это поможет снизить уровень стресса, улучшить концентрацию и развить осознанность. Начните с простых дыхательных упражнений: сядьте удобно, закройте глаза и сосредоточьтесь на своём дыхании. Вдыхайте на 4 счёта, задерживайте дыхание на 4 счёта, выдыхайте на 6 счётов. Повторяйте это в течение 10 минут. Также рекомендуем использовать приложения для медитации, такие как Headspace или Calm.",
    category: "Психическое здоровье",
    benefits: ["Снижение стресса", "Улучшение концентрации", "Эмоциональный баланс"]
  },
  {
    icon: Activity,
    title: "Физическая активность",
    summary: "Регулярные упражнения для поддержания энергии и здоровья",
    description: "Запланируйте минимум 30 минут физической активности в день. Это может быть прогулка в парке, лёгкая пробежка, йога или посещение тренажёрного зала. Регулярные упражнения помогают снизить уровень стресса, улучшить настроение и повысить энергию. Старайтесь двигаться в обеденный перерыв - это отличный способ перезагрузиться и улучшить продуктивность во второй половине дня. Даже короткая 10-минутная прогулка может значительно улучшить ваше самочувствие.",
    category: "Физическое здоровье",
    benefits: ["Повышение энергии", "Улучшение настроения", "Снижение стресса"]
  },
  {
    icon: Clock,
    title: "Гигиена сна",
    summary: "Качественный сон для восстановления сил",
    description: "Установите постоянный режим сна: ложитесь и просыпайтесь в одно и то же время каждый день. Старайтесь спать 7-8 часов в сутки. Создайте комфортную обстановку в спальне: темнота, прохлада (18-20°C), тишина. За час до сна избегайте экранов (телефон, компьютер, телевизор), так как синий свет подавляет выработку мелатонина. Вместо этого почитайте книгу, примите тёплую ванну или послушайте спокойную музыку. Избегайте кофеина после 14:00.",
    category: "Отдых",
    benefits: ["Улучшение качества сна", "Восстановление энергии", "Укрепление иммунитета"]
  },
  {
    icon: MessageCircle,
    title: "Общение с коллегами",
    summary: "Социальная поддержка для эмоционального благополучия",
    description: "Присоединяйтесь к нашей группе благополучия для поддержки и обмена опытом. Социальные связи играют важную роль в поддержании психического здоровья. Регулярно общайтесь с коллегами не только о работе, но и на личные темы. Участвуйте в корпоративных мероприятиях, совместных обедах или неформальных встречах. Если чувствуете стресс или выгорание, не стесняйтесь обращаться за поддержкой к коллегам или руководителю. Помните: вы не одиноки в своих переживаниях.",
    category: "Социальное",
    benefits: ["Эмоциональная поддержка", "Снижение одиночества", "Улучшение командной работы"]
  },
  {
    icon: Award,
    title: "Обучающие ресурсы",
    summary: "Развитие навыков управления стрессом",
    description: "Получите доступ к нашей обширной библиотеке курсов по управлению стрессом и развитию устойчивости. Мы предлагаем программы по эмоциональному интеллекту, тайм-менеджменту, управлению конфликтами и профилактике выгорания. Все курсы разработаны экспертами в области психологии и организационного развития. Вы можете учиться в удобном темпе и применять полученные знания на практике. Доступны как видеоуроки, так и интерактивные упражнения.",
    category: "Образование",
    benefits: ["Развитие навыков", "Профилактика выгорания", "Личностный рост"]
  },
  {
    icon: Target,
    title: "Постановка целей",
    summary: "Чёткие цели для мотивации и контроля",
    description: "Установите чёткие, достижимые цели как для работы, так и для личной жизни. Используйте метод SMART: цели должны быть конкретными (Specific), измеримыми (Measurable), достижимыми (Achievable), релевантными (Relevant) и ограниченными во времени (Time-bound). Разбивайте большие цели на маленькие шаги. Отмечайте свои достижения, даже самые небольшие. Регулярно пересматривайте свои цели и корректируйте их при необходимости.",
    category: "Развитие",
    benefits: ["Повышение мотивации", "Чувство контроля", "Личностный рост"]
  }
];

// Historical assessment data
const assessmentHistory = [
  { date: "15 янв 2025", score: 65, label: "Напряжённость" },
  { date: "22 фев 2025", score: 58, label: "Напряжённость" },
  { date: "15 мар 2025", score: 72, label: "Равновесие" },
  { date: "10 апр 2025", score: 68, label: "Напряжённость" },
  { date: "5 май 2025", score: 78, label: "Равновесие" },
  { date: "15 июн 2025", score: 82, label: "Равновесие" },
];

// Custom arrow components for carousel
function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors z-10 shadow-lg"
      aria-label="Next"
    >
      <ChevronRight className="w-5 h-5 text-primary-foreground" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors z-10 shadow-lg"
      aria-label="Previous"
    >
      <ChevronLeft className="w-5 h-5 text-primary-foreground" />
    </button>
  );
}

export function EmployeeDashboard({ 
  userName, 
  hasCompletedAssessment, 
  wellnessScore,
  onStartAssessment,
  onLogout
}: EmployeeDashboardProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showCompleteStory, setShowCompleteStory] = useState(false);
  
  // Check if all achievements are unlocked
  const allAchievementsUnlocked = achievements.every(a => a.unlocked);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // New state-based system with 4 levels
  const getWellnessState = (score: number) => {
    if (score >= 70) return {
      label: "Равновесие",
      color: "#2d8659", // green
      badgeClass: "bg-[#2d8659] text-white hover:bg-[#2d8659]/90"
    };
    if (score >= 50) return {
      label: "Напряжённость",
      color: "#eab308", // yellow
      badgeClass: "bg-[#eab308] text-black hover:bg-[#eab308]/90"
    };
    if (score >= 30) return {
      label: "Истощение",
      color: "#f97316", // orange
      badgeClass: "bg-[#f97316] text-white hover:bg-[#f97316]/90"
    };
    return {
      label: "Бессилие",
      color: "#dc2626", // red
      badgeClass: "bg-[#dc2626] text-white hover:bg-[#dc2626]/90"
    };
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (!hasCompletedAssessment) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <header className="border-b border-border bg-card">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo className="w-10 h-10" />
                <h1>Портал благополучия</h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button variant="ghost" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2>Добро пожаловать, {userName}</h2>
                <p className="text-muted-foreground mt-2">
                  Просмотрите вашу историю и пройдите следующую оценку благополучия
                </p>
              </div>

              {/* Current Situation Hero Block - Prominent placement on landing page */}
              <div className="mb-8">
                <CurrentSituationHero 
                  userName={userName}
                  wellnessScore={82}
                  lastAssessmentDate="15 июн 2025"
                  hasHistoricalData={true}
                  onStartAssessment={onStartAssessment}
                />
              </div>

              {/* Test History Chart - Enhanced visualization on landing page */}
              <div className="mb-8">
                <TestHistoryChartEnhanced data={assessmentHistory} />
              </div>

              {/* Start Assessment CTA */}
              <Card className="shadow-lg overflow-hidden border-2 border-primary/20">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Achievement Bank - replacing image */}
                  <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          Достижения
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {unlockedCount}/{achievements.length}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ваш путь к благополучию
                      </p>
                    </div>

                    {/* Achievement Grid - 3x2 layout */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {achievements.map((achievement, index) => (
                        <button
                          key={achievement.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (achievement.unlocked) {
                              setSelectedAchievement(achievement);
                            }
                          }}
                          type="button"
                          className={`
                            relative aspect-square rounded-xl overflow-hidden border-2 
                            transition-all duration-300 group touch-manipulation
                            ${achievement.unlocked 
                              ? 'border-primary/30 hover:border-primary hover:scale-105 cursor-pointer shadow-md hover:shadow-lg active:scale-100' 
                              : 'border-border opacity-50 cursor-not-allowed'
                            }
                          `}
                          aria-label={achievement.unlocked ? achievement.title : 'Заблокировано'}
                          aria-pressed={selectedAchievement?.id === achievement.id}
                          disabled={!achievement.unlocked}
                        >
                          {/* Achievement Image */}
                          <div className={`
                            w-full h-full p-2 bg-card
                            ${achievement.unlocked ? '' : 'grayscale brightness-75'}
                          `}>
                            <img
                              src={achievement.image}
                              alt={achievement.unlocked ? achievement.title : 'Locked'}
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>

                          {/* Lock overlay for locked achievements */}
                          {!achievement.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                              <Lock className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}

                          {/* Unlock date badge for unlocked achievements */}
                          {achievement.unlocked && achievement.unlockedDate && (
                            <div className="absolute bottom-1 left-1 right-1">
                              <Badge className="w-full text-[10px] px-1 py-0.5 justify-center bg-primary/90 hover:bg-primary">
                                {achievement.unlockedDate}
                              </Badge>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* View Complete Story Button - shown when all unlocked */}
                    {allAchievementsUnlocked && (
                      <Button
                        variant="outline"
                        className="w-full border-primary/50 hover:bg-primary/10"
                        onClick={() => setShowCompleteStory(true)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Просмотреть полную историю
                      </Button>
                    )}

                    {/* Progress indicator */}
                    {!allAchievementsUnlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Прогресс</span>
                          <span>{Math.round((unlockedCount / achievements.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-8 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle>Готовы к следующей оценке?</CardTitle>
                      <CardDescription className="mt-2">
                        Уделите несколько минут для прохождения конфиденциальной оценки. 
                        Мы предоставим персональные рекомендации для поддержки вашего благополучия.
                      </CardDescription>
                    </CardHeader>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-foreground">5-10 минут на прохождение</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Heart className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-foreground">Полностью конфиденциально</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-foreground">Получите персональные рекомендации</p>
                        </div>
                      </div>
                      <Button onClick={onStartAssessment} className="w-full mt-4" size="lg">
                        Начать оценку
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </main>
        </div>
        <AIMascot message="Привет! Готовы начать путь к благополучию?" />
      </>
    );
  }

  const wellnessState = getWellnessState(wellnessScore || 0);
  
  // Get appropriate flame character image based on score with 4 emotional levels
  const getFlameImage = (score: number) => {
    if (score >= 80) return flameStarEyes; // Thriving - star eyes (80-100)
    if (score >= 60) return flameHappy; // Balanced - happy (60-79)
    if (score >= 35) return flameCrying; // Stressed - crying (35-59)
    return flameAngry; // Burned out - angry/exhausted (0-34)
  };

  // Assessment completed view
  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <h1>Портал благополучия</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
          <div className="mb-8">
            <h2>Ваш дашборд благополучия</h2>
            <p className="text-muted-foreground mt-2">
              Здесь ваш персональный обзор благополучия и рекомендации
            </p>
          </div>

          {/* Wellness Score and Breakdown */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Gauge visualization */}
            <Card className="lg:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle>Оценка благополучия</CardTitle>
                <CardDescription>На основе вашей последней оценки</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  {/* Redesigned gauge with flame character */}
                  <div className="relative w-64 h-64 mb-6 group">
                    {/* Subtle circular progress ring */}
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
                      {/* Minimal background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="4"
                      />
                      
                      {/* Colored progress arc */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke={wellnessState.color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${(wellnessScore || 0) * 5.65} 565`}
                        transform="rotate(-90 100 100)"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    
                    {/* Flame character in center */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <img
                        src={getFlameImage(wellnessScore || 0)}
                        alt="Wellness character"
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Score positioned outside center - top right */}
                    <div 
                      className="absolute -top-2 -right-2 flex flex-col items-center justify-center bg-card border-2 rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105"
                      style={{ borderColor: wellnessState.color }}
                    >
                      <span 
                        className="text-3xl leading-none"
                        style={{ color: wellnessState.color }}
                      >
                        {wellnessScore}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">из 100</span>
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  <Badge className={`${wellnessState.badgeClass} text-base px-4 py-1.5`}>
                    {wellnessState.label}
                  </Badge>
                  
                  {/* Optional contextual message */}
                  <p className="text-sm text-muted-foreground text-center mt-4 max-w-xs leading-relaxed">
                    {wellnessScore >= 80 && "Превосходно! Вы в отличной форме. Продолжайте поддерживать свои здоровые привычки!"}
                    {wellnessScore >= 60 && wellnessScore < 80 && "Хорошая работа! Вы сохраняете баланс. Следите за рекомендациями для поддержки."}
                    {wellnessScore >= 35 && wellnessScore < 60 && "Обратите внимание на рекомендации ниже для улучшения самочувствия."}
                    {wellnessScore < 35 && "Рекомендуем обратиться к специалисту для получения поддержки и заботы о себе."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Simplified 3 metrics */}
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle>Разбор оценки</CardTitle>
                <CardDescription>Ключевые показатели благополучия</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span>Эмоциональное состояние</span>
                    <span className="text-muted-foreground">
                      {Math.min(100, (wellnessScore || 0) + 5)}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, (wellnessScore || 0) + 5)} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span>Физическое состояние</span>
                    <span className="text-muted-foreground">
                      {Math.min(100, (wellnessScore || 0) + 8)}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, (wellnessScore || 0) + 8)} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span>Нагрузка и контроль</span>
                    <span className="text-muted-foreground">
                      {Math.max(0, (wellnessScore || 0) - 10)}%
                    </span>
                  </div>
                  <Progress value={Math.max(0, (wellnessScore || 0) - 10)} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carousel with recommendations */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Персональные рекомендации</CardTitle>
              <CardDescription>
                Действия, которые вы можете предпринять для улучшения вашего благополучия
              </CardDescription>
            </CardHeader>
            <CardContent className="px-12">
              <Slider {...carouselSettings}>
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <div key={index} className="px-3">
                      <div
                        className="p-6 rounded-lg border-2 border-border bg-card hover:border-primary transition-all cursor-pointer h-full"
                        onClick={() => setSelectedRecommendation(rec)}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="mb-2">{rec.title}</h4>
                            <Badge variant="outline" className="mb-3">
                              {rec.category}
                            </Badge>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {rec.summary}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Подробнее
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </CardContent>
          </Card>

          {/* Test Completion History Chart */}
          <div className="mt-8">
            <TestHistoryChartEnhanced data={assessmentHistory} />
          </div>
        </main>
      </div>

      {/* Modal for detailed recommendations */}
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
                      <Badge className="w-full mt-2 text-[10px] justify-center bg-primary/10 text-primary hover:bg-primary/20">
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
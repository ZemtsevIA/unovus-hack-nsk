import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Lock 
} from './Icons';

interface Achievement {
  id: number;
  title: string;
  description: string;
  story: string;
  image: string;
  unlocked: boolean;
  unlockedDate?: string;
}

interface AchievementStoryModalProps {
  achievement: Achievement | null;
  allAchievements: Achievement[];
  allUnlocked: boolean;
  onClose: () => void;
  onNavigate: (achievement: Achievement) => void;
  onShowCompleteStory: () => void;
}

export function AchievementStoryModal({ 
  achievement, 
  allAchievements, 
  allUnlocked,
  onClose, 
  onNavigate,
  onShowCompleteStory 
}: AchievementStoryModalProps) {
  if (!achievement) return null;

  const handlePrevious = () => {
    const prevIndex = achievement.id - 2;
    if (prevIndex >= 0 && allAchievements[prevIndex].unlocked) {
      onNavigate(allAchievements[prevIndex]);
    }
  };

  const handleNext = () => {
    const nextIndex = achievement.id;
    if (nextIndex < allAchievements.length && allAchievements[nextIndex].unlocked) {
      onNavigate(allAchievements[nextIndex]);
    }
  };

  const canGoPrevious = achievement.id > 1 && allAchievements[achievement.id - 2]?.unlocked;
  const canGoNext = achievement.id < allAchievements.length && allAchievements[achievement.id]?.unlocked;
  const nextAchievement = achievement.id < allAchievements.length ? allAchievements[achievement.id] : null;

  return (
    <Dialog open={!!achievement} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-4xl max-h-[95vh] overflow-hidden p-0 gap-0 border-2 border-primary/30"
      >
        <div className="flex flex-col h-full">
          {/* Header Section with Gradient Background */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 border-b border-border">
            <DialogHeader>
              <div className="flex flex-col items-center text-center">
                {/* Journey Progress Indicator */}
                <div className="w-full max-w-md mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Глава {achievement.id} из {allAchievements.length}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-primary/30 bg-primary/5"
                    >
                      {achievement.id === allAchievements.length ? '👑 Финал' : '📖 В пути'}
                    </Badge>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="relative w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${(achievement.id / allAchievements.length) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: 'shimmer 2s infinite' }} />
                    </div>
                  </div>
                  
                  {/* Mini chapter indicators */}
                  <div className="flex justify-between mt-2 px-1">
                    {allAchievements.map((ach, idx) => (
                      <div 
                        key={ach.id}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          idx < achievement.id 
                            ? 'bg-primary scale-110' 
                            : 'bg-muted scale-75'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Achievement Image with Enhanced Styling */}
                <div className="relative mb-6 animate-in fade-in-50 zoom-in-95 duration-700">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 animate-pulse" />
                  
                  {/* Image container */}
                  <div className="relative w-48 h-48 rounded-3xl overflow-hidden border-4 border-primary/40 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full h-full object-contain p-4 animate-in zoom-in-50 duration-700 delay-150"
                    />
                  </div>

                  {/* Decorative corner accents */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
                </div>

                {/* Title and Description */}
                <DialogTitle className="text-3xl mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-300">
                  {achievement.title}
                </DialogTitle>
                
                <DialogDescription className="flex items-center gap-2 text-base animate-in fade-in-50 duration-500 delay-400">
                  <Award className="w-5 h-5 text-primary" />
                  {achievement.description}
                </DialogDescription>

                {/* Unlock Badge */}
                {achievement.unlockedDate && (
                  <Badge className="mt-4 bg-primary/15 text-primary hover:bg-primary/25 px-5 py-1.5 text-xs border border-primary/30 animate-in fade-in-50 duration-500 delay-500">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    Открыто: {achievement.unlockedDate}
                  </Badge>
                )}
              </div>
            </DialogHeader>
          </div>
          
          {/* Scrollable Story Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Story Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border animate-in fade-in-50 slide-in-from-left-4 duration-500 delay-600">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium">История достижения</h4>
                  <p className="text-xs text-muted-foreground">Часть большого пути к благополучию</p>
                </div>
              </div>

              {/* Story Paragraphs */}
              <div className="space-y-5">
                {achievement.story.split('\n\n').map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="text-[15px] leading-[1.8] text-muted-foreground animate-in fade-in-50 slide-in-from-bottom-2 duration-700"
                    style={{ 
                      animationDelay: `${700 + index * 150}ms`,
                      textAlign: 'justify',
                      textIndent: index > 0 ? '2em' : '0'
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Next Achievement Hint */}
              {nextAchievement && (
                <div className="mt-10 p-6 bg-gradient-to-br from-primary/8 to-primary/3 rounded-2xl border-2 border-primary/20 animate-in fade-in-50 zoom-in-95 duration-500 delay-1000 hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-5">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-primary/30 bg-card shadow-lg">
                      <img
                        src={nextAchievement.image}
                        alt="Next achievement"
                        className={`w-full h-full object-contain p-2 transition-all duration-300 ${
                          nextAchievement.unlocked 
                            ? 'grayscale-0 opacity-100' 
                            : 'grayscale opacity-40'
                        }`}
                      />
                      {!nextAchievement.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                          <Lock className="w-6 h-6 text-white/80" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <h5 className="font-medium text-primary">Следующая глава</h5>
                      </div>
                      <p className="font-medium mb-1.5">{nextAchievement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {nextAchievement.unlocked 
                          ? '✨ Уже открыта! Нажмите "Следующая" для просмотра.' 
                          : `🔒 ${nextAchievement.description}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Achievement Celebration */}
              {achievement.id === allAchievements.length && (
                <div className="mt-10 p-8 bg-gradient-to-br from-primary/15 via-primary/8 to-primary/5 rounded-2xl border-2 border-primary/30 text-center animate-in fade-in-50 zoom-in-95 duration-500 delay-1000">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h4 className="text-xl font-medium mb-2">
                    Поздравляем! Путешествие завершено 🎉
                  </h4>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Вы прошли весь путь от возрождения до легенды. Теперь ваша история вдохновляет других начать свой путь к благополучию.
                  </p>
                  {allUnlocked && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShowCompleteStory}
                      className="gap-2 border-primary/50 hover:bg-primary/10 mt-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Прочитать полную историю
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-border bg-card/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Предыдущая
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Глава {achievement.id}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{allAchievements.filter(a => a.unlocked).length} из {allAchievements.length}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={!canGoNext}
              className="gap-2"
            >
              Следующая
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

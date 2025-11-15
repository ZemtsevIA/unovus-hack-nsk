import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ThemeToggle } from "./ThemeToggle";
import { ScaleSlider } from "./ScaleSlider";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "./Icons";

interface Question {
  id: string;
  text: string;
  scale: 'EE' | 'DP' | 'PA';
  scaleLabel: string;
}

// 22-question burnout assessment based on three-factor model
const questions: Question[] = [
  // Emotional Exhaustion (EE) Scale — Questions 1–9
  { id: "q1", text: "Я прихожу домой с работы совершенно опустошённым.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q2", text: "К концу рабочего дня у меня почти не остаётся энергии.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q3", text: "Рабочие задачи отнимают слишком много моих нервов и энергии.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q4", text: "Я чувствую, что работа эмоционально истощает меня.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q5", text: "Я часто ощущаю сильную усталость уже в середине рабочего дня.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q6", text: "Даже в выходные мне трудно восстановиться после работы.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q7", text: "Мысли о работе вызывают у меня напряжение и усталость.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q8", text: "Я чувствую, что всё чаще работаю на пределе своих возможностей.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  { id: "q9", text: "Иногда мне кажется, что я больше не справляюсь с текущей нагрузкой.", scale: "EE", scaleLabel: "Эмоциональное истощение" },
  
  // Depersonalization / Cynicism (DP) Scale — Questions 10–14
  { id: "q10", text: "Я всё чаще отношусь к клиентам и коллегам безэмоционально, как к задачам.", scale: "DP", scaleLabel: "Деперсонализация" },
  { id: "q11", text: "Я ловлю себя на циничных или раздражённых мыслях о клиентах/коллегах.", scale: "DP", scaleLabel: "Деперсонализация" },
  { id: "q12", text: "Мне становится сложно проявлять эмпатию к чужим проблемам на работе.", scale: "DP", scaleLabel: "Деперсонализация" },
  { id: "q13", text: "Я стараюсь свести личные контакты на работе к минимуму.", scale: "DP", scaleLabel: "Деперсонализация" },
  { id: "q14", text: "Иногда мне кажется, что окружающим всё равно на мои усилия, а мне — на их.", scale: "DP", scaleLabel: "Деперсонализация" },
  
  // Personal Accomplishment (PA) Scale — Questions 15–22
  { id: "q15", text: "Я чувствую, что занимаюсь важной и полезной работой.", scale: "PA", scaleLabel: "Профессиональная реализация" },
  { id: "q16", text: "Я часто вижу реальные результаты своего труда.", scale: "PA", scaleLabel: "Профессиональная реализация" },
  { id: "q17", text: "Я справляюсь даже со сложными рабочими задачами.", scale: "PA", scaleLabel: "Профессиональная реализация" },
  { id: "q18", text: "Я чувствую, что профессионально развиваюсь на текущей работе.", scale: "PA", scaleLabel: "Профессиональная реализация" },
  { id: "q19", text: "Я регулярно получаю признание за хорошо выполненную работу.", scale: "PA", scaleLabel: "Профессиональная реализация" },
  { id: "q20", text: "Я чувствую, что моя работа имеет значение для других людей.", scale: "PA", scaleLabel: "Профессиональная реализация" },
  { id: "q21", text: "На работе я чаще всего чувствую себя компетентным специалистом.", scale: "PA", scaleLabel: "Профессиональная реализация" },
  { id: "q22", text: "В большинстве рабочих ситуаций я нахожу эффективные решения.", scale: "PA", scaleLabel: "Профессиональная реализация" },
];

// 7-point Likert scale (0-6)
const options = [
  { value: "0", label: "Никогда" },
  { value: "1", label: "Очень редко" },
  { value: "2", label: "Редко" },
  { value: "3", label: "Иногда" },
  { value: "4", label: "Часто" },
  { value: "5", label: "Очень часто" },
  { value: "6", label: "Каждый день" },
];

interface WellnessAssessmentProps {
  onComplete: (score: number) => void;
}

export function WellnessAssessment({ onComplete }: WellnessAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: parseInt(value) });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate burnout score using the three-factor model
      const score = calculateBurnoutScore(answers);
      onComplete(score);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[questions[currentQuestion].id];
  const isAnswered = currentAnswer !== undefined;
  
  // Check if we're at the start of a new scale section
  const isNewSection = currentQuestion === 0 || 
    questions[currentQuestion].scale !== questions[currentQuestion - 1]?.scale;
  const currentScale = questions[currentQuestion].scaleLabel;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      {/* Theme Toggle - Top Right Corner */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
              <span>Выполнено {Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div>
            <CardTitle>Оценка выгорания</CardTitle>
            <CardDescription className="mt-2">
              Пожалуйста, отвечайте честно. Ваши ответы конфиденциальны и помогут нам поддержать ваше благополучие.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            {/* Subtle section header */}
            {isNewSection && (
              <div className="pb-2 border-b border-border">
                <p className="text-sm text-muted-foreground">
                  {currentScale}
                </p>
              </div>
            )}
            
            <h3 className="text-lg leading-relaxed">{questions[currentQuestion].text}</h3>
            
            {/* Replace RadioGroup with ScaleSlider */}
            <div className="py-6">
              <ScaleSlider
                value={currentAnswer?.toString() || ""}
                onChange={handleAnswer}
                options={options}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              aria-label="Предыдущий вопрос"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              aria-label={currentQuestion === questions.length - 1 ? "Завершить оценку" : "Следующий вопрос"}
            >
              {currentQuestion === questions.length - 1 ? "Завершить оценку" : "Далее"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Calculate burnout score based on the three-factor model
function calculateBurnoutScore(answers: Record<string, number>): number {
  // Separate answers by scale
  const eeAnswers: number[] = [];
  const dpAnswers: number[] = [];
  const paAnswers: number[] = [];

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (answer !== undefined) {
      if (q.scale === 'EE') eeAnswers.push(answer);
      else if (q.scale === 'DP') dpAnswers.push(answer);
      else if (q.scale === 'PA') paAnswers.push(answer);
    }
  });

  // Calculate raw scores
  const EE_raw = eeAnswers.reduce((sum, val) => sum + val, 0);
  const DP_raw = dpAnswers.reduce((sum, val) => sum + val, 0);
  const PA_raw = paAnswers.reduce((sum, val) => sum + val, 0);

  // Normalize (0-1 range)
  const EE_norm = EE_raw / 54.0; // 9 questions × 6 max = 54
  const DP_norm = DP_raw / 30.0; // 5 questions × 6 max = 30
  const PA_norm_inv = 1.0 - (PA_raw / 48.0); // 8 questions × 6 max = 48, inverted

  // Calculate integral burnout index (rho)
  const rho = Math.sqrt((Math.pow(EE_norm, 2) + Math.pow(DP_norm, 2) + Math.pow(PA_norm_inv, 2)) / 3);

  // Convert to 0-100 scale for display (inverted so higher is better)
  // rho 0.0 (low burnout) → score 100 (excellent wellness)
  // rho 1.0 (high burnout) → score 0 (poor wellness)
  const wellnessScore = Math.round((1 - rho) * 100);

  return wellnessScore;
}
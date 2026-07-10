import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/rewarded-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Earnings Quiz — Get Paid to Play" },
      {
        name: "description",
        content:
          "Take the 60-second Earnings Quiz and discover how much you could earn daily by playing games and trying new apps.",
      },
      { property: "og:title", content: "Earnings Quiz — Get Paid to Play" },
      {
        property: "og:description",
        content: "Take the 60-second Earnings Quiz and discover your daily reward potential.",
      },
    ],
  }),
  component: Index,
});

type Question = {
  q: string;
  options: string[];
  tip?: string;
};

const QUESTIONS: Question[] = [
  {
    q: "Are you 21 or older?",
    options: ["✅ Yes, I'm 21 or older", "🚫 No, I'm under 21"],
  },
  {
    q: "What is your primary goal today?",
    options: [
      "💰 Earn extra pocket money / gift cards",
      "🎮 Discover fun new games to play",
      "⏱️ Kill some spare time",
      "📱 Try out new apps and products",
    ],
  },
  {
    q: "What types of games or apps do you enjoy most?",
    options: [
      "🧩 Casual / Puzzle / Matching games",
      "🏙️ Strategy / City Builders",
      "⚔️ Action / Role-Playing (RPG)",
      "🏃 Fitness / Walking / Lifestyle apps",
      "💳 Trying new services (Fintech, entertainment apps)",
    ],
  },
  {
    q: "How much time do you typically spend on your phone daily?",
    options: ["📵 Less than 30 minutes", "📱 1 to 2 hours", "🔥 3+ hours"],
  },
  {
    q: "When leveling up or progressing in a game, what's your style?",
    options: [
      "🧑‍🌾 I like the grind—I'll take my time to earn everything for free.",
      "🚀 I like a boost—I don't mind a small purchase to get ahead faster.",
      "🤷 It depends entirely on how much I enjoy the app.",
    ],
    tip: "💡 PRO TIP: In our app, making a tiny, $10 purchase in partner games often unlocks massive, exclusive reward tiers that pay back up to 10x the value!",
  },
  {
    q: "How do you prefer to redeem your rewards?",
    options: [
      "💵 Direct cash / PayPal",
      "🎁 Retail gift cards (Amazon, Walmart, etc.)",
      "🎮 Gaming gift cards (Steam, Google Play)",
      "👑 In-app perks or exclusive tiers",
    ],
  },
];

const LOADER_MESSAGES = ["Analyzing profile...", "Matching partner tiers...", "Optimizing reward multipliers..."];

type Stage = "start" | "quiz" | "loading" | "result";

function Index() {
  const [stage, setStage] = useState<Stage>("start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const [loaderIdx, setLoaderIdx] = useState(0);

  const handleAnswer = (opt: string) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (step === QUESTIONS.length - 1) {
      setStage("loading");
    } else {
      setStep(step + 1);
      setAnimKey((k) => k + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setAnswers(answers.slice(0, -1));
    setStep(step - 1);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    if (stage !== "loading") return;
    const cycle = setInterval(() => {
      setLoaderIdx((i) => (i + 1) % LOADER_MESSAGES.length);
    }, 800);
    const done = setTimeout(() => setStage("result"), 3000);
    return () => {
      clearInterval(cycle);
      clearTimeout(done);
    };
  }, [stage]);

  return (
    <main className="min-h-screen w-full px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[420px]">
        {stage !== "result" && (
          <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8">
            <img
              src={logo}
              alt="Rewarded Play logo"
              className="drop-gold h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11"
            />
            {stage !== "start" && (
              <span className="text-lg font-black italic tracking-tight text-secondary text-glow sm:text-xl">
                rewarded <span className="text-foreground">play</span>
              </span>
            )}
          </div>
        )}

        <div className="relative rounded-2xl border border-border bg-card/90 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
          {stage === "quiz" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="glow-gold inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-secondary-foreground">
                Earnings Quiz
              </span>
            </div>
          )}

          {stage === "quiz" && (
            <header className="flex items-center justify-between">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="text-sm">←</span> Back
                </button>
              ) : (
                <div className="h-4 w-4" />
              )}
              <span className="text-[10px] font-semibold text-muted-foreground">
                {step + 1} / {QUESTIONS.length}
              </span>
            </header>
          )}

          {stage === "start" && <StartScreen onStart={() => setStage("quiz")} />}

          {stage === "quiz" && (
            <QuizStep
              key={animKey}
              step={step}
              total={QUESTIONS.length}
              question={QUESTIONS[step]}
              onAnswer={handleAnswer}
              isFirstQuestion={step === 0}
            />
          )}

          {stage === "loading" && <Loading message={LOADER_MESSAGES[loaderIdx]} />}

          {stage === "result" && <Result />}
        </div>
      </div>
    </main>
  );
}

function QuizStep({
  step,
  total,
  question,
  onAnswer,
  isFirstQuestion,
}: {
  step: number;
  total: number;
  question: Question;
  onAnswer: (opt: string) => void;
  isFirstQuestion: boolean;
}) {
  const progress = ((step + 1) / total) * 100;
  return (
    <section className={`slide-up ${isFirstQuestion ? "flex min-h-[300px] flex-col justify-center" : ""}`}>
      <div>
        <div className={`mb-4 text-center sm:mb-5 ${isFirstQuestion ? "mb-5 sm:mb-6" : ""}`}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Question {step + 1} of {total}
          </p>
          <h1 className={`mt-1 font-semibold leading-tight text-foreground text-base sm:text-xl`}>{question.q}</h1>
        </div>

        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-muted sm:mb-6">
          <div
            className="h-full rounded-full bg-secondary transition-all duration-500"
            style={{ width: `${progress}%`, boxShadow: "var(--shadow-gold)" }}
          />
        </div>

        <div className="flex flex-col gap-2.5 sm:gap-3">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onAnswer(opt)}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-4 text-left text-sm font-semibold text-card-foreground transition-all hover:border-secondary hover:bg-secondary/10 hover:shadow-[0_0_20px_-6px_var(--gold)] active:scale-[0.99] sm:px-5 sm:text-base"
            >
              <span className="min-w-0 flex-1">{opt}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-xs text-muted-foreground transition-all group-hover:border-secondary group-hover:bg-secondary group-hover:text-secondary-foreground sm:h-9 sm:w-9 sm:text-sm">
                →
              </span>
            </button>
          ))}
        </div>

        {question.tip && (
          <div className="mt-5 rounded-2xl border border-secondary/40 bg-secondary/10 p-4 text-xs leading-relaxed text-foreground">
            <span className="font-semibold text-secondary">{question.tip}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function Loading({ message }: { message: string }) {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center text-center slide-up sm:min-h-[60vh]">
      <div className="relative mb-6 h-20 w-20 sm:mb-8 sm:h-24 sm:w-24">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        <div className="absolute inset-2 grid place-items-center rounded-full bg-primary/10 text-lg font-black text-primary sm:inset-3 sm:text-xl">
          $
        </div>
      </div>
      <h2 className="mb-3 text-lg font-black sm:text-2xl">
        Estimating your <span className="text-gradient">potential income</span>...
      </h2>
      <p key={message} className="text-xs font-medium text-muted-foreground slide-up">
        {message}
      </p>
    </section>
  );
}

function Result() {
  return (
    <section className="slide-up">
      <div className="mb-0.5 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-primary">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        ESTIMATE READY
      </div>
      <h1 className="mb-2 text-lg font-black sm:text-2xl">
        Here's what you can <span className="text-gradient">earn</span>
      </h1>
      <p className="mb-6 text-xs text-muted-foreground sm:mb-8">
        Based on your quiz responses and current partner tiers.
      </p>

      <div className="mb-4 rounded-2xl border border-border bg-card p-5 sm:rounded-3xl sm:p-6">
        <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">YOUR ESTIMATE</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-black text-foreground sm:text-5xl">$58–$184</span>
          <span className="text-xs font-semibold text-muted-foreground">daily</span>
        </div>
      </div>

      <div
        className="relative mb-4 overflow-hidden rounded-2xl border border-primary/50 p-5 sm:mb-6 sm:rounded-3xl sm:p-6"
        style={{
          background: "var(--gradient-card)",
          boxShadow: "var(--shadow-neon)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px shimmer" />
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-primary">
            🚀 You're eligible for boosted earnings daily
          </div>
          <span className="shrink-0 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-black tracking-widest text-destructive-foreground animate-pulse sm:px-2.5 sm:py-1">
            LIMITED TIME
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-gradient sm:text-5xl">$238–$416</span>
          <span className="text-xs font-semibold text-muted-foreground">daily</span>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card/60 p-4 sm:mb-8 sm:p-5">
        <div className="mb-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">HOW TO PARTICIPATE</div>
        <p className="text-xs leading-relaxed text-foreground sm:text-sm">
          If you wish to participate, simply spend <span className="font-black text-primary">$10</span> on an app of
          your choice, make <span className="font-black text-secondary">$100</span> back.
        </p>
      </div>

      <div className="text-center">
        <div className="mb-2 text-[10px] font-black tracking-[0.3em] text-secondary sm:mb-3">
          ★ START NOW — LIMITED SPOTS ★
        </div>
        <button
          onClick={() => (window.location.href = "https://linkthem.net/aff_c?tl_id=37bc56ac")}
          className="pulse-glow w-full rounded-2xl bg-primary px-6 py-4 text-sm font-black uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99] sm:px-8 sm:py-5 sm:text-base"
        >
          Claim My Spot
        </button>
        <p className="mt-3 text-[10px] text-muted-foreground">No credit card required · Instant activation</p>
      </div>
    </section>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="slide-up flex flex-col items-center justify-center py-10 text-center sm:py-14">
      <p className="mb-8 text-sm font-semibold text-foreground sm:text-base">
        Click here to get started
      </p>
      <button
        onClick={onStart}
        className="pulse-glow w-full rounded-2xl bg-primary px-6 py-4 text-sm font-black uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99] sm:text-base"
      >
        Start
      </button>
    </section>
  );
}

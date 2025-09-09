import React, { useState } from "react";

// Drop this component into your routes where the current Intro/YouTube embed lives.
// Props:
// - onStart: () => void   // called when the user clicks the primary CTA
// TailwindCSS assumed. No external libs required.

export default function IntroModule({ onStart = () => {} }) {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  const handleQuiz = (answer) => {
    const correct = answer === "all";
    setQuizCorrect(correct);
    setQuizAnswered(true);
  };

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      {/* Step 1 – Welcome */}
      <section className="text-center mb-10" aria-labelledby="welcome-title">
        <h1 id="welcome-title" className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Welcome to Your <span className="underline decoration-wavy decoration-indigo-400">AI Adventure</span>!
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Today you’ll discover how computers learn from <strong>data</strong> — just like you learn from practice.
        </p>
      </section>

      {/* Step 2 – Real-life examples */}
      <section aria-labelledby="examples-title" className="mb-12">
        <h2 id="examples-title" className="text-2xl font-bold mb-4">Where do you already use AI?</h2>
        <p className="text-slate-600 mb-6">Click a card to reveal how AI helps behind the scenes.</p>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {[
            {
              front: "Movie & show suggestions",
              back: "Recommendation systems learn from what people watch to suggest new titles.",
              icon: "🎬",
            },
            {
              front: "Spam filters in email",
              back: "Classifiers learn patterns of junk mail to keep your inbox clean.",
              icon: "📧",
            },
            {
              front: "Voice assistants",
              back: "Speech models turn sound into text so the assistant can respond.",
              icon: "🗣️",
            },
          ].map((card, idx) => (
            <FlipCard key={idx} {...card} />
          ))}
        </ul>
      </section>

      {/* Step 3 – Micro interaction (quiz) */}
      <section aria-labelledby="quiz-title" className="mb-12">
        <h2 id="quiz-title" className="text-2xl font-bold mb-4">Quick question</h2>
        <p className="text-slate-700 mb-4">Which of these use AI?</p>
        <div className="grid sm:grid-cols-2 gap-3" role="group" aria-label="AI uses quiz">
          <QuizButton onClick={() => handleQuiz("netflix")} label="Netflix suggestions" />
          <QuizButton onClick={() => handleQuiz("cars")} label="Self‑driving cars" />
          <QuizButton onClick={() => handleQuiz("weather")} label="Weather forecasting" />
          <QuizButton onClick={() => handleQuiz("all")} label="All of them" />
        </div>
        {quizAnswered && (
          <div
            role="status"
            className={`mt-4 rounded-xl p-4 border ${
              quizCorrect
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <p className="font-semibold">
              {quizCorrect ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-1 text-sm">
              All three use AI in different ways — recommending content, recognizing surroundings, and finding patterns in large datasets.
            </p>
          </div>
        )}
      </section>

      {/* Step 4 – Learning path */}
      <section aria-labelledby="path-title" className="mb-12">
        <h2 id="path-title" className="text-2xl font-bold mb-6">What you’ll do next</h2>
        <ol className="grid gap-4 md:grid-cols-4" aria-label="Learning path">
          {[
            { title: "Explore Data", desc: "See how charts change what we notice.", emoji: "📊" },
            { title: "See How ML Works", desc: "Walk through data → model → prediction.", emoji: "🧠" },
            { title: "Spot Bias", desc: "Check how unbalanced data affects results.", emoji: "⚖️" },
            { title: "Try It Yourself", desc: "Run a tiny hands-on activity.", emoji: "✅" },
          ].map((step, i) => (
            <li key={i} className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm">
              <div className="text-3xl" aria-hidden>{step.emoji}</div>
              <h3 className="mt-2 font-semibold">{i + 1}. {step.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Step 5 – CTA */}
      <section className="text-center">
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          aria-label="Start your first activity"
        >
          Start Your First Activity
          <span className="ml-2" aria-hidden>→</span>
        </button>
        <p className="mt-3 text-xs text-slate-500">
          No account needed. No personal data collected.
        </p>
      </section>
    </main>
  );
}

function QuizButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {label}
    </button>
  );
}

function FlipCard({ front, back, icon }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <li>
      <button
        className="group perspective w-full"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`Toggle info for ${front}`}
      >
        <div className={`relative h-40 w-full [transform-style:preserve-3d] transition-transform duration-500 ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
          {/* front */}
          <div className="absolute inset-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm [backface-visibility:hidden] flex flex-col items-start justify-center">
            <div className="text-3xl mb-2" aria-hidden>{icon}</div>
            <p className="font-semibold">{front}</p>
            <p className="text-xs text-slate-500 mt-1">Click to reveal</p>
          </div>
          {/* back */}
          <div className="absolute inset-0 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-slate-800">{back}</p>
          </div>
        </div>
      </button>
    </li>
  );
}

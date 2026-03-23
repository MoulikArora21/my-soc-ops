import { useState, useCallback } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const TOTAL_STEPS = 3;

const RULES = [
  {
    title: 'Mingle & Find Matches',
    desc: 'Walk around and ask classmates if they fit each square clue. Real answers only!',
  },
  {
    title: 'Mark Your Board',
    desc: "Tap a square when you've found a match. It lights up in chalk on your board.",
  },
  {
    title: 'Call BINGO!',
    desc: 'Complete 5 in a row — any row, column, or diagonal — then shout BINGO!',
  },
];

export function StartScreen({ onStart }: StartScreenProps) {
  const [step, setStep] = useState(1);

  // Callback ref: focuses the mounted element when step > 1 (so keyboard users land on new content)
  const focusOnMount = useCallback(
    (el: HTMLElement | null) => {
      if (el && step > 1) {
        el.focus();
      }
    },
    [step],
  );

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="page-shell">
      <section
        className="chalkboard-panel px-5 py-7 sm:px-8 sm:py-10 board-reveal"
        aria-label="Game onboarding"
      >
        <div className="mx-auto max-w-2xl">

          {/* ── Step progress indicator ── */}
          <div
            className="mb-6 flex items-center justify-center gap-2"
            role="status"
            aria-label={`Step ${step} of ${TOTAL_STEPS}`}
            aria-live="polite"
          >
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                className={`step-dot${step === i + 1 ? ' step-dot-active' : ''}`}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* ── Step 1: Hero intro ── */}
          {step === 1 && (
            <div className="step-panel text-center">
              <p className="chalk-hand reveal text-2xl text-accent sm:text-3xl">
                Homeroom Mixer
              </p>
              <h1 className="chalk-heading reveal reveal-delay-1 mt-3 text-5xl text-chalk sm:text-6xl">
                Soc Ops
              </h1>
              <p className="chalk-subtext reveal reveal-delay-2 mx-auto mt-4 max-w-xl text-base sm:text-lg">
                Time to break out of your shell. Meet your crew, fill your board, and be
                first to call BINGO.
              </p>

              {/* Social proof chips */}
              <div
                className="reveal reveal-delay-3 mt-6 flex flex-wrap justify-center gap-2"
                aria-label="Game details"
              >
                <span className="social-chip">25 Squares</span>
                <span className="social-chip">5 in a Row Wins</span>
                <span className="social-chip">Class Ice-Breaker</span>
              </div>

              <button
                onClick={goNext}
                className="chalk-button reveal reveal-delay-3 mt-8 w-full rounded-xl px-8 py-4 text-lg font-extrabold sm:mt-10 sm:text-xl"
                aria-label="Continue to how to play"
              >
                How To Play →
              </button>
            </div>
          )}

          {/* ── Step 2: How to play ── */}
          {step === 2 && (
            <div className="step-panel text-center">
              <h2
                ref={focusOnMount}
                className="chalk-heading reveal text-3xl text-chalk sm:text-4xl"
                tabIndex={-1}
              >
                Here's How It Works
              </h2>
              <p className="chalk-subtext reveal reveal-delay-1 mt-3 text-sm sm:text-base">
                Three steps. One mission. Maximum mingling.
              </p>

              <ol className="reveal reveal-delay-2 mt-6 space-y-3 text-left" aria-label="Game rules">
                {RULES.map(({ title, desc }, idx) => (
                  <li key={idx} className="rule-card">
                    <span className="rule-card-number" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="chalk-heading text-base text-chalk sm:text-lg">{title}</p>
                      <p className="chalk-subtext mt-1 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="reveal reveal-delay-3 mt-8 flex gap-3">
                <button
                  onClick={goBack}
                  className="step-back-button flex-1 rounded-xl px-6 py-3 text-base font-bold"
                  aria-label="Back to intro"
                >
                  ← Back
                </button>
                <button
                  onClick={goNext}
                  className="chalk-button flex-[2] rounded-xl px-8 py-3 text-base font-extrabold sm:text-lg"
                  aria-label="Continue to launch screen"
                >
                  I'm Ready →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Launch ── */}
          {step === 3 && (
            <div className="step-panel text-center">
              <p className="chalk-hand reveal text-2xl text-accent sm:text-3xl">
                Let's Go!
              </p>
              <h2
                ref={focusOnMount}
                className="chalk-heading reveal reveal-delay-1 mt-3 text-4xl text-chalk sm:text-5xl"
                tabIndex={-1}
              >
                You're All Set!
              </h2>
              <p className="chalk-subtext reveal reveal-delay-2 mx-auto mt-4 max-w-md text-base sm:text-lg">
                Your board is shuffled and ready. First one to fill a line wins the round!
              </p>

              <div className="reveal reveal-delay-3 mt-8 flex gap-3">
                <button
                  onClick={goBack}
                  className="step-back-button flex-1 rounded-xl px-6 py-4 text-base font-bold"
                  aria-label="Back to how to play"
                >
                  ← Back
                </button>
                <button
                  onClick={onStart}
                  className="chalk-button flex-[2] rounded-xl px-8 py-4 text-lg font-extrabold sm:text-xl"
                >
                  Ring The Bell And Start
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

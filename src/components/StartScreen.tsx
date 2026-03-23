interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="page-shell">
      <section className="chalkboard-panel px-5 py-7 sm:px-8 sm:py-10 board-reveal">
        <div className="mx-auto max-w-2xl text-center">
          <p className="chalk-hand reveal text-2xl text-accent sm:text-3xl">Homeroom Mixer</p>
          <h1 className="chalk-heading reveal reveal-delay-1 mt-3 text-5xl text-chalk sm:text-6xl">
            Soc Ops
          </h1>
          <p className="chalk-subtext reveal reveal-delay-2 mx-auto mt-4 max-w-xl text-base sm:text-lg">
            Roll call is open. Find classmates who match each clue and mark your board in chalk.
          </p>

          <div className="reveal reveal-delay-3 mt-8 rounded-2xl border border-white/15 bg-white/7 p-5 text-left shadow-lg sm:p-6">
            <h2 className="chalk-heading text-xl text-chalk sm:text-2xl">Class Rules</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-chalk-soft sm:text-base">
              <li>Ask around and find someone that fits each square.</li>
              <li>Tap each match to chalk it on your board.</li>
              <li>Land 5 in a row to call out BINGO.</li>
            </ul>
          </div>

          <button
            onClick={onStart}
            className="chalk-button reveal reveal-delay-3 mt-8 w-full rounded-xl px-8 py-4 text-lg font-extrabold sm:mt-10 sm:text-xl"
          >
            Ring The Bell And Start
          </button>
        </div>
      </section>
    </div>
  );
}

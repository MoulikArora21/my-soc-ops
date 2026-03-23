interface StartScreenProps {
  onStart: () => void;
}

const RULES = [
  { num: '01', title: 'Ask Around', desc: 'Find a classmate who fits each square on your board.' },
  { num: '02', title: 'Chalk It In', desc: 'Tap a square to mark it when you find your match.' },
  { num: '03', title: 'Call BINGO', desc: 'Land five in a row — any direction — to win.' },
] as const;

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="start-page">
      {/* ── Hero ──────────────────────────────────────── */}
      <header className="start-hero">
        <span className="chalk-hand start-pretitle reveal">Homeroom Mixer</span>

        <h1 className="start-title">
          <span
            className="chalk-heading start-title-soc chalk-pop"
            style={{ animationDelay: '80ms' }}
          >
            Soc Ops
          </span>
          <span
            className="chalk-hand start-title-bingo reveal"
            style={{ animationDelay: '200ms' }}
          >
            Bingo
          </span>
        </h1>

        <p className="chalk-subtext start-tagline reveal" style={{ animationDelay: '320ms' }}>
          Roll call is open — find classmates who match each clue, chalk your board,
          and be first to call BINGO.
        </p>
      </header>

      {/* ── Rules Rail ────────────────────────────────── */}
      <section className="start-rules">
        <div className="start-rules-rail">
          {RULES.map(({ num, title, desc }, i) => (
            <div
              key={num}
              className="start-rule-card reveal"
              style={{ animationDelay: `${420 + i * 90}ms` }}
            >
              <span className="start-rule-num">{num}</span>
              <h3 className="chalk-heading start-rule-title">{title}</h3>
              <p className="start-rule-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Zone ──────────────────────────────────── */}
      <footer className="start-cta reveal" style={{ animationDelay: '700ms' }}>
        <button onClick={onStart} className="chalk-button start-cta-btn">
          Ring The Bell & Start
        </button>
        <p className="chalk-subtext start-cta-note">No sign-in needed · just find your people</p>
      </footer>
    </main>
  );
}

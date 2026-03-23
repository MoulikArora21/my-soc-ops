import type { BingoSquareData } from '../types';
import { BingoBoard } from './BingoBoard';

interface GameScreenProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  onSquareClick: (squareId: number) => void;
  onReset: () => void;
}

export function GameScreen({
  board,
  winningSquareIds,
  hasBingo,
  onSquareClick,
  onReset,
}: GameScreenProps) {
  return (
    <div className="page-shell">
      <section className="chalkboard-panel w-full max-w-5xl overflow-hidden board-reveal">
        <header className="wood-rail reveal flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3">
          <button
            onClick={onReset}
            className="rounded-lg border border-black/25 bg-black/15 px-3 py-1.5 text-sm font-bold tracking-wide text-chalk transition-colors hover:bg-black/25"
          >
            Back To Hallway
          </button>
          <h1 className="chalk-heading text-lg text-chalk sm:text-2xl">Classroom Bingo</h1>
          <span className="chalk-chip px-3 py-1 text-xs font-bold tracking-wide sm:text-sm">5 x 5 Board</span>
        </header>

        <div className="px-4 pb-6 pt-5 sm:px-8 sm:pb-8">
          <div className="reveal reveal-delay-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/8 px-4 py-3">
            <p className="chalk-subtext text-sm sm:text-base">
              Circle matches as you meet people. Any full row, column, or diagonal wins.
            </p>
            <span className="chalk-hand text-2xl text-accent sm:text-3xl">Keep moving, keep mingling.</span>
          </div>

          {hasBingo && (
            <div className="chalk-pop reveal mt-4 rounded-xl border border-bingo/45 bg-bingo/18 px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-bingo sm:text-base">
              Bingo unlocked! Your line lit up in chalk.
            </div>
          )}

          <div className="mt-5 sm:mt-6">
            <BingoBoard
              board={board}
              winningSquareIds={winningSquareIds}
              onSquareClick={onSquareClick}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

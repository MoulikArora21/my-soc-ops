import type {
  BingoSquareData,
  CardDeckState,
  GameMode,
  ScavengerItem,
  ScavengerProgress,
} from "../types";
import { BingoBoard } from "./BingoBoard";
import { CardDeckShuffle } from "./CardDeckShuffle";
import { ScavengerHuntList } from "./ScavengerHuntList";

interface GameScreenProps {
  gameMode: GameMode;
  board: BingoSquareData[];
  scavengerItems: ScavengerItem[];
  scavengerProgress: ScavengerProgress;
  cardDeck: CardDeckState;
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  onSquareClick: (squareId: number) => void;
  onScavengerToggle: (itemId: number) => void;
  onDrawDeckCard: () => void;
  onResetMode: () => void;
  onBackToStart: () => void;
}

export function GameScreen({
  gameMode,
  board,
  scavengerItems,
  scavengerProgress,
  cardDeck,
  winningSquareIds,
  hasBingo,
  onSquareClick,
  onScavengerToggle,
  onDrawDeckCard,
  onResetMode,
  onBackToStart,
}: GameScreenProps) {
  const modeTitle =
    gameMode === "bingo"
      ? "Classroom Bingo"
      : gameMode === "scavenger"
        ? "Scavenger Hunt"
        : "Card Deck Shuffle";

  const modeDescription =
    gameMode === "bingo"
      ? "Circle matches as you meet people. Any full row, column, or diagonal wins."
      : gameMode === "scavenger"
        ? "Use the same prompts as a checklist. Check every line to finish the hunt."
        : "Every tap draws a random card with a question for your player.";

  const modeTagline =
    gameMode === "bingo"
      ? "Keep moving, keep mingling."
      : gameMode === "scavenger"
        ? "Check it off, then chase the next clue."
        : "Tap, reveal, ask, repeat.";

  return (
    <div className="page-shell">
      <section className="chalkboard-panel w-full max-w-5xl overflow-hidden board-reveal">
        <header className="wood-rail reveal flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3">
          <button
            onClick={onBackToStart}
            className="rounded-lg border border-black/25 bg-black/15 px-3 py-1.5 text-sm font-bold tracking-wide text-chalk transition-colors hover:bg-black/25"
          >
            Back To Hallway
          </button>
          <h1 className="chalk-heading text-lg text-chalk sm:text-2xl">
            {modeTitle}
          </h1>
          <button
            onClick={onResetMode}
            className="chalk-chip px-3 py-1 text-xs font-bold tracking-wide transition-colors hover:bg-white/16 sm:text-sm"
          >
            Reset Mode
          </button>
        </header>

        <div className="px-4 pb-6 pt-5 sm:px-8 sm:pb-8">
          <div className="reveal reveal-delay-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/8 px-4 py-3">
            <p className="chalk-subtext text-sm sm:text-base">
              {modeDescription}
            </p>
            <span className="chalk-hand text-2xl text-accent sm:text-3xl">
              {modeTagline}
            </span>
          </div>

          {gameMode === "bingo" && hasBingo && (
            <div className="chalk-pop reveal mt-4 rounded-xl border border-bingo/45 bg-bingo/18 px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-bingo sm:text-base">
              Bingo unlocked! Your line lit up in chalk.
            </div>
          )}

          <div className="mt-5 sm:mt-6">
            {gameMode === "bingo" ? (
              <BingoBoard
                board={board}
                winningSquareIds={winningSquareIds}
                onSquareClick={onSquareClick}
              />
            ) : gameMode === "scavenger" ? (
              <ScavengerHuntList
                items={scavengerItems}
                progress={scavengerProgress}
                onToggle={onScavengerToggle}
              />
            ) : (
              <CardDeckShuffle deck={cardDeck} onDrawCard={onDrawDeckCard} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

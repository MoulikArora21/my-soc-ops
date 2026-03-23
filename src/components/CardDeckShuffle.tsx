import { useEffect, useMemo, useRef, useState } from "react";
import type { CardDeckState } from "../types";

interface CardDeckShuffleProps {
  deck: CardDeckState;
  onDrawCard: () => void;
}

export function CardDeckShuffle({ deck, onDrawCard }: CardDeckShuffleProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const drawTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (drawTimerRef.current !== null) {
        window.clearTimeout(drawTimerRef.current);
      }
    };
  }, []);

  const drawnCards = deck.drawCount;
  const totalCards = drawnCards + deck.remainingCards.length;
  const hasCard = deck.currentCard !== null;

  const suitMeta = useMemo(() => {
    if (!deck.currentCard) {
      return { symbol: "♠", toneClass: "deck-suit-black" };
    }

    const suits = [
      { symbol: "♠", toneClass: "deck-suit-black" },
      { symbol: "♥", toneClass: "deck-suit-red" },
      { symbol: "♦", toneClass: "deck-suit-red" },
      { symbol: "♣", toneClass: "deck-suit-black" },
    ] as const;

    let hash = 0;
    for (const ch of deck.currentCard) {
      hash += ch.charCodeAt(0);
    }

    return suits[hash % suits.length];
  }, [deck.currentCard]);

  function handleDraw() {
    if (isDrawing) {
      return;
    }

    setIsDrawing(true);
    drawTimerRef.current = window.setTimeout(() => {
      onDrawCard();
      setIsDrawing(false);
      drawTimerRef.current = null;
    }, 620);
  }

  return (
    <section className="space-y-4" aria-label="Card deck shuffle mode">
      <div className="deck-stats reveal reveal-delay-1">
        <span className="chalk-chip px-3 py-1 text-xs font-bold tracking-wide sm:text-sm">
          Drawn {drawnCards}
        </span>
        <span className="chalk-chip px-3 py-1 text-xs font-bold tracking-wide sm:text-sm">
          Remaining {deck.remainingCards.length}
        </span>
        <span className="chalk-chip px-3 py-1 text-xs font-bold tracking-wide sm:text-sm">
          Total {totalCards}
        </span>
      </div>

      <div className="deck-table reveal reveal-delay-2">
        <div
          className={`deck-stack${isDrawing ? " deck-stack-shuffle" : ""}`}
          aria-hidden="true"
        >
          <span className="deck-stack-card deck-stack-card-1" />
          <span className="deck-stack-card deck-stack-card-2" />
          <span className="deck-stack-card deck-stack-card-3" />
          <span className="deck-stack-card deck-stack-card-4" />
        </div>

        <article
          className={`deck-card${isDrawing ? " deck-card-drawing" : ""}`}
          aria-live="polite"
        >
          <header className="flex items-center justify-between gap-2">
            <p className="chalk-hand text-3xl text-accent sm:text-4xl">Question Card</p>
            <span className={`deck-suit ${suitMeta.toneClass}`}>{suitMeta.symbol}</span>
          </header>

          <p className="mt-3 text-base leading-7 text-chalk sm:text-lg">
            {deck.currentCard ?? "Tap the button to draw your first random card."}
          </p>

          <footer className="mt-4 flex items-center justify-between text-sm text-chalk-soft">
            <span>{hasCard ? `Card ${drawnCards}` : "Waiting for draw"}</span>
            <span className={`deck-suit ${suitMeta.toneClass}`}>{suitMeta.symbol}</span>
          </footer>
        </article>
      </div>

      <button
        type="button"
        onClick={handleDraw}
        disabled={isDrawing}
        className="chalk-button reveal reveal-delay-3 w-full rounded-xl px-6 py-3 text-base font-extrabold sm:text-lg"
      >
        {isDrawing
          ? "Shuffling..."
          : deck.currentCard
            ? "Draw Next Card"
            : "Draw A Card"}
      </button>
    </section>
  );
}

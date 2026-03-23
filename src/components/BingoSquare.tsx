import type { BingoSquareData } from "../types";

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    "relative flex min-h-[60px] items-center justify-center rounded-md border px-1 py-1 text-center text-[11px] leading-tight transition-all duration-200 select-none sm:text-xs";

  const stateClasses = square.isMarked
    ? isWinning
      ? "border-bingo/75 bg-bingo/35 text-[#4d3703] shadow-[0_0_0_2px_rgb(255_212_93_/_0.25)]"
      : "border-marked-border bg-marked text-chalk shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.07)]"
    : "border-white/20 bg-board/40 text-chalk hover:bg-board/65";

  const freeSpaceClasses = square.isFreeSpace
    ? "chalk-heading border-accent/70 bg-accent/88 text-[#3d2a03] sm:text-sm"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={square.isFreeSpace}
      className={`${baseClasses} ${stateClasses} ${freeSpaceClasses}`}
      aria-pressed={square.isMarked}
      aria-label={square.isFreeSpace ? "Free space" : square.text}
    >
      <span className="wrap-break-word hyphens-auto px-0.5">{square.text}</span>
      {square.isMarked && !square.isFreeSpace && (
        <span className="chalk-hand absolute right-1 top-0.5 text-base text-marked-border">
          x
        </span>
      )}
    </button>
  );
}

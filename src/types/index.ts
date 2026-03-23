/** Domain types for the Bingo game */

export interface BingoSquareData {
  id: number;
  text: string;
  isMarked: boolean;
  isFreeSpace: boolean;
}

export interface BingoLine {
  type: 'row' | 'column' | 'diagonal';
  index: number;
  squares: number[];
}

export type GameMode = 'bingo' | 'scavenger' | 'cardDeck';

export type GameState = 'start' | 'playing' | 'bingo';

export interface ScavengerItem {
  id: number;
  text: string;
  isChecked: boolean;
}

export interface ScavengerProgress {
  completedCount: number;
  totalCount: number;
  percent: number;
  isComplete: boolean;
}

export interface CardDeckState {
  currentCard: string | null;
  remainingCards: string[];
  drawCount: number;
}

/** Onboarding personalisation collected on the StartScreen. */
export interface PlayerProfile {
  /** Optional display name the player typed; empty string means not set. */
  nickname: string;
  /** Id of the selected vibe chip, or null if none was chosen. */
  vibe: string | null;
  /** Selected game mode. */
  mode: GameMode;
}

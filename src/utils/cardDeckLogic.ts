import { questions } from '../data/questions';
import type { CardDeckState } from '../types';

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function createCardDeckState(): CardDeckState {
  return {
    currentCard: null,
    remainingCards: shuffleArray(questions),
    drawCount: 0,
  };
}

export function drawCard(state: CardDeckState): CardDeckState {
  const sourceDeck = state.remainingCards.length > 0 ? state.remainingCards : shuffleArray(questions);
  const [nextCard, ...remainingCards] = sourceDeck;

  if (!nextCard) {
    return {
      ...state,
      currentCard: null,
    };
  }

  return {
    currentCard: nextCard,
    remainingCards,
    drawCount: state.drawCount + 1,
  };
}

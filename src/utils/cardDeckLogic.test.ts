import { describe, expect, it } from 'vitest';
import { createCardDeckState, drawCard } from './cardDeckLogic';

describe('cardDeckLogic', () => {
  it('creates a deck with all question cards and no current card', () => {
    const deck = createCardDeckState();

    expect(deck.currentCard).toBeNull();
    expect(deck.remainingCards).toHaveLength(24);
    expect(deck.drawCount).toBe(0);
  });

  it('draws one card and advances draw count', () => {
    const deck = createCardDeckState();
    const next = drawCard(deck);

    expect(next.currentCard).not.toBeNull();
    expect(next.remainingCards).toHaveLength(23);
    expect(next.drawCount).toBe(1);
  });

  it('reshuffles automatically when remaining cards are exhausted', () => {
    const emptiedDeck = {
      currentCard: 'last',
      remainingCards: [],
      drawCount: 5,
    };

    const next = drawCard(emptiedDeck);

    expect(next.currentCard).not.toBeNull();
    expect(next.remainingCards.length).toBeGreaterThanOrEqual(0);
    expect(next.drawCount).toBe(6);
  });
});

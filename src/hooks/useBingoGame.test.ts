import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useBingoGame } from './useBingoGame';

function startBingoGame() {
  return {
    nickname: 'Test Player',
    vibe: null,
    mode: 'bingo' as const,
  };
}

describe('useBingoGame', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  async function completeTopRow(result: { current: ReturnType<typeof useBingoGame> }) {
    act(() => {
      [0, 1, 2, 3, 4].forEach((id) => result.current.handleSquareClick(id));
    });

    await waitFor(() => {
      expect(result.current.gameState).toBe('bingo');
    });
  }

  it('clears winning line when returning to hallway after bingo', async () => {
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame(startBingoGame());
    });

    await completeTopRow(result);
    expect(result.current.winningLine).not.toBeNull();

    act(() => {
      result.current.backToStart();
    });

    expect(result.current.gameState).toBe('start');
    expect(result.current.winningLine).toBeNull();
  });

  it('starts scavenger mode with no stale bingo winning line', async () => {
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame(startBingoGame());
    });

    await completeTopRow(result);
    expect(result.current.winningLine).not.toBeNull();

    act(() => {
      result.current.backToStart();
      result.current.startGame({
        nickname: 'Hunter',
        vibe: null,
        mode: 'scavenger',
      });
    });

    expect(result.current.gameMode).toBe('scavenger');
    expect(result.current.gameState).toBe('playing');
    expect(result.current.winningLine).toBeNull();
  });
});

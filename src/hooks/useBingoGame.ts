import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  BingoSquareData,
  BingoLine,
  CardDeckState,
  GameMode,
  GameState,
  PlayerProfile,
  ScavengerItem,
} from '../types';
import {
  generateBoard,
  toggleSquare,
  checkBingo,
  getWinningSquareIds,
} from '../utils/bingoLogic';
import {
  calculateScavengerProgress,
  clearScavengerItems,
  generateScavengerItems,
  toggleScavengerItem,
} from '../utils/scavengerHuntLogic';
import { createCardDeckState, drawCard } from '../utils/cardDeckLogic';

export interface BingoGameState {
  gameState: GameState;
  gameMode: GameMode;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  winningSquareIds: Set<number>;
  showBingoModal: boolean;
  scavengerItems: ScavengerItem[];
  scavengerProgress: ReturnType<typeof calculateScavengerProgress>;
  cardDeck: CardDeckState;
  playerProfile: PlayerProfile;
}

export interface BingoGameActions {
  startGame: (profile: PlayerProfile) => void;
  handleSquareClick: (squareId: number) => void;
  handleScavengerToggle: (itemId: number) => void;
  drawDeckCard: () => void;
  resetCurrentMode: () => void;
  backToStart: () => void;
  dismissModal: () => void;
}

const STORAGE_KEY = 'bingo-game-state';
const STORAGE_VERSION = 3;
const LEGACY_STORAGE_VERSION = 2;

const BINGO_BOARD_SQUARES = 25;
const SCAVENGER_ITEM_COUNT = 24;
const CARD_DECK_QUESTION_COUNT = 24;

const VALID_GAME_STATES: readonly GameState[] = ['start', 'playing', 'bingo'];
const VALID_LINE_TYPES: readonly BingoLine['type'][] = ['row', 'column', 'diagonal'];

const DEFAULT_PROFILE: PlayerProfile = { nickname: '', vibe: null, mode: 'bingo' };

interface LegacyStoredGameData {
  version: 2;
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  playerProfile: {
    nickname: string;
    vibe: string | null;
  };
}

interface StoredGameData {
  version: number;
  gameState: GameState;
  gameMode: GameMode;
  bingoBoard: BingoSquareData[];
  winningLine: BingoLine | null;
  scavengerItems: ScavengerItem[];
  cardDeck: CardDeckState;
  playerProfile: PlayerProfile;
}

interface LoadedState {
  gameState: GameState;
  gameMode: GameMode;
  bingoBoard: BingoSquareData[];
  winningLine: BingoLine | null;
  scavengerItems: ScavengerItem[];
  cardDeck: CardDeckState;
  playerProfile: PlayerProfile;
}

function isValidSquare(square: unknown): square is BingoSquareData {
  if (!square || typeof square !== 'object') return false;

  const value = square as Record<string, unknown>;
  return (
    typeof value.id === 'number' &&
    typeof value.text === 'string' &&
    typeof value.isMarked === 'boolean' &&
    typeof value.isFreeSpace === 'boolean'
  );
}

function isValidGameState(state: unknown): state is GameState {
  return typeof state === 'string' && VALID_GAME_STATES.includes(state as GameState);
}

function isValidWinningLine(lineValue: unknown): lineValue is BingoLine | null {
  if (lineValue === null) {
    return true;
  }

  if (!lineValue || typeof lineValue !== 'object') {
    return false;
  }

  const line = lineValue as Record<string, unknown>;

  return (
    typeof line.type === 'string' &&
    VALID_LINE_TYPES.includes(line.type as BingoLine['type']) &&
    typeof line.index === 'number' &&
    Array.isArray(line.squares)
  );
}

function isValidScavengerItem(item: unknown): item is ScavengerItem {
  if (!item || typeof item !== 'object') return false;

  const value = item as Record<string, unknown>;
  return (
    typeof value.id === 'number' &&
    typeof value.text === 'string' &&
    typeof value.isChecked === 'boolean'
  );
}

function isValidCardDeckState(deck: unknown): deck is CardDeckState {
  if (!deck || typeof deck !== 'object') return false;

  const value = deck as Record<string, unknown>;

  return (
    (value.currentCard === null || typeof value.currentCard === 'string') &&
    Array.isArray(value.remainingCards) &&
    value.remainingCards.every((card) => typeof card === 'string') &&
    typeof value.drawCount === 'number'
  );
}

function validatePlayerProfile(profile: unknown): profile is PlayerProfile {
  if (!profile || typeof profile !== 'object') return false;
  const p = profile as Record<string, unknown>;
  return (
    typeof p.nickname === 'string' &&
    (p.vibe === null || typeof p.vibe === 'string') &&
    (p.mode === 'bingo' || p.mode === 'scavenger' || p.mode === 'cardDeck')
  );
}

function validateLegacyStoredData(data: unknown): data is LegacyStoredGameData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (obj.version !== LEGACY_STORAGE_VERSION) {
    return false;
  }

  if (!isValidGameState(obj.gameState)) {
    return false;
  }

  if (!Array.isArray(obj.board) || (obj.board.length !== 0 && obj.board.length !== BINGO_BOARD_SQUARES)) {
    return false;
  }

  const validSquares = obj.board.every(isValidSquare);
  
  if (!validSquares) {
    return false;
  }

  if (!isValidWinningLine(obj.winningLine)) {
    return false;
  }

  if (!obj.playerProfile || typeof obj.playerProfile !== 'object') {
    return false;
  }

  const profile = obj.playerProfile as Record<string, unknown>;
  if (typeof profile.nickname !== 'string' || (profile.vibe !== null && typeof profile.vibe !== 'string')) {
    return false;
  }

  return true;
}

function validateStoredData(data: unknown): data is StoredGameData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (obj.version !== STORAGE_VERSION) {
    return false;
  }

  if (!isValidGameState(obj.gameState)) {
    return false;
  }

  if (obj.gameMode !== 'bingo' && obj.gameMode !== 'scavenger' && obj.gameMode !== 'cardDeck') {
    return false;
  }

  if (!Array.isArray(obj.bingoBoard) || (obj.bingoBoard.length !== 0 && obj.bingoBoard.length !== BINGO_BOARD_SQUARES)) {
    return false;
  }

  if (!Array.isArray(obj.scavengerItems) || obj.scavengerItems.length !== SCAVENGER_ITEM_COUNT) {
    return false;
  }

  if (!isValidCardDeckState(obj.cardDeck) || obj.cardDeck.remainingCards.length > CARD_DECK_QUESTION_COUNT) {
    return false;
  }

  if (!obj.bingoBoard.every(isValidSquare) || !obj.scavengerItems.every(isValidScavengerItem)) {
    return false;
  }

  if (!isValidWinningLine(obj.winningLine)) {
    return false;
  }

  if (!validatePlayerProfile(obj.playerProfile)) {
    return false;
  }

  return true;
}

function migrateLegacyData(data: LegacyStoredGameData): LoadedState {
  return {
    gameState: data.gameState,
    gameMode: 'bingo',
    bingoBoard: data.board,
    winningLine: data.winningLine,
    scavengerItems: generateScavengerItems(),
    cardDeck: createCardDeckState(),
    playerProfile: {
      nickname: data.playerProfile.nickname,
      vibe: data.playerProfile.vibe,
      mode: 'bingo',
    },
  };
}

function loadGameState(): LoadedState | null {
  // SSR guard
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);

    if (validateStoredData(parsed)) {
      return {
        gameState: parsed.gameState,
        gameMode: parsed.gameMode,
        bingoBoard: parsed.bingoBoard,
        winningLine: parsed.winningLine,
        scavengerItems: parsed.scavengerItems,
        cardDeck: parsed.cardDeck,
        playerProfile: parsed.playerProfile,
      };
    }

    if (validateLegacyStoredData(parsed)) {
      const migrated = migrateLegacyData(parsed);
      saveGameState(migrated);
      return migrated;
    } else {
      console.warn('Invalid game state data in localStorage, clearing...');
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to load game state:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return null;
}

function saveGameState(state: LoadedState): void {
  // SSR guard
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const data: StoredGameData = {
      version: STORAGE_VERSION,
      gameState: state.gameState,
      gameMode: state.gameMode,
      bingoBoard: state.bingoBoard,
      winningLine: state.winningLine,
      scavengerItems: state.scavengerItems,
      cardDeck: state.cardDeck,
      playerProfile: state.playerProfile,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

export function useBingoGame(): BingoGameState & BingoGameActions {
  const loadedState = useMemo(() => loadGameState(), []);

  const [gameState, setGameState] = useState<GameState>(
    () => loadedState?.gameState || 'start'
  );
  const [gameMode, setGameMode] = useState<GameMode>(
    () => loadedState?.gameMode || 'bingo'
  );
  const [board, setBoard] = useState<BingoSquareData[]>(
    () => loadedState?.bingoBoard || []
  );
  const [winningLine, setWinningLine] = useState<BingoLine | null>(
    () => loadedState?.winningLine || null
  );
  const [scavengerItems, setScavengerItems] = useState<ScavengerItem[]>(
    () => loadedState?.scavengerItems || generateScavengerItems()
  );
  const [cardDeck, setCardDeck] = useState<CardDeckState>(
    () => loadedState?.cardDeck || createCardDeckState()
  );
  const [showBingoModal, setShowBingoModal] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(
    () => loadedState?.playerProfile ?? DEFAULT_PROFILE
  );

  const scavengerProgress = useMemo(
    () => calculateScavengerProgress(scavengerItems),
    [scavengerItems]
  );

  const winningSquareIds = useMemo(
    () => getWinningSquareIds(winningLine),
    [winningLine]
  );

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState({
      gameState,
      gameMode,
      bingoBoard: board,
      winningLine,
      scavengerItems,
      cardDeck,
      playerProfile,
    });
  }, [gameState, gameMode, board, winningLine, scavengerItems, cardDeck, playerProfile]);

  const startGame = useCallback((profile: PlayerProfile) => {
    const normalizedProfile: PlayerProfile = {
      nickname: profile.nickname.trim(),
      vibe: profile.vibe,
      mode: profile.mode,
    };

    setPlayerProfile(normalizedProfile);
    setGameMode(normalizedProfile.mode);

    if (normalizedProfile.mode === 'bingo') {
      setBoard((currentBoard) =>
        currentBoard.length === BINGO_BOARD_SQUARES ? currentBoard : generateBoard()
      );
    } else if (normalizedProfile.mode === 'scavenger') {
      setScavengerItems((currentItems) =>
        currentItems.length === SCAVENGER_ITEM_COUNT ? currentItems : generateScavengerItems()
      );
    } else {
      setCardDeck((currentDeck) =>
        currentDeck.remainingCards.length <= CARD_DECK_QUESTION_COUNT
          ? currentDeck
          : createCardDeckState()
      );
    }

    setGameState('playing');
  }, []);

  const handleSquareClick = useCallback((squareId: number) => {
    if (gameMode !== 'bingo') {
      return;
    }

    setBoard((currentBoard) => {
      const newBoard = toggleSquare(currentBoard, squareId);

      // Check for bingo after toggling
      const bingo = checkBingo(newBoard);
      if (bingo && !winningLine) {
        // Schedule state updates to avoid synchronous setState in effect
        queueMicrotask(() => {
          setWinningLine(bingo);
          setGameState('bingo');
          setShowBingoModal(true);
        });
      }
      
      return newBoard;
    });
  }, [gameMode, winningLine]);

  const handleScavengerToggle = useCallback((itemId: number) => {
    if (gameMode !== 'scavenger') {
      return;
    }

    setScavengerItems((currentItems) => toggleScavengerItem(currentItems, itemId));
  }, [gameMode]);

  const drawDeckCard = useCallback(() => {
    if (gameMode !== 'cardDeck') {
      return;
    }

    setCardDeck((currentDeck) => drawCard(currentDeck));
  }, [gameMode]);

  const resetCurrentMode = useCallback(() => {
    if (gameMode === 'bingo') {
      setBoard(generateBoard());
      setWinningLine(null);
      setShowBingoModal(false);
      setGameState('playing');
      return;
    }

    if (gameMode === 'cardDeck') {
      setCardDeck(createCardDeckState());
      setGameState('playing');
      return;
    }

    setScavengerItems((items) => clearScavengerItems(items));
    setGameState('playing');
  }, [gameMode]);

  const backToStart = useCallback(() => {
    setGameState('start');
    setWinningLine(null);
    setShowBingoModal(false);
  }, []);

  const dismissModal = useCallback(() => {
    setShowBingoModal(false);
  }, []);

  return {
    gameState,
    gameMode,
    board,
    winningLine,
    winningSquareIds,
    showBingoModal,
    scavengerItems,
    scavengerProgress,
    cardDeck,
    playerProfile,
    startGame,
    handleSquareClick,
    handleScavengerToggle,
    drawDeckCard,
    resetCurrentMode,
    backToStart,
    dismissModal,
  };
}

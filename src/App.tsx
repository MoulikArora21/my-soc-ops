import { useBingoGame } from './hooks/useBingoGame';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { BingoModal } from './components/BingoModal';

function App() {
  const {
    gameState,
    gameMode,
    board,
    scavengerItems,
    scavengerProgress,
    winningSquareIds,
    showBingoModal,
    startGame,
    handleSquareClick,
    handleScavengerToggle,
    resetCurrentMode,
    backToStart,
    dismissModal,
  } = useBingoGame();

  if (gameState === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <>
      <GameScreen
        gameMode={gameMode}
        board={board}
        scavengerItems={scavengerItems}
        scavengerProgress={scavengerProgress}
        winningSquareIds={winningSquareIds}
        hasBingo={gameMode === 'bingo' && gameState === 'bingo'}
        onSquareClick={handleSquareClick}
        onScavengerToggle={handleScavengerToggle}
        onResetMode={resetCurrentMode}
        onBackToStart={backToStart}
      />
      {gameMode === 'bingo' && showBingoModal && (
        <BingoModal onDismiss={dismissModal} />
      )}
    </>
  );
}

export default App;

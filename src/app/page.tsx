"use client";
import GameBoard from '../components/Tetris/GameBoard';
import { useEffect, useCallback, useRef, useState } from 'react';
import { TETROMINOES, TETROMINO_COLORS } from '../components/Tetris/tetrisLogic';
import { useTetrisGame } from '../components/Tetris/useTetrisGame';
import NextTetrominoPreview from '../components/Tetris/NextTetrominoPreview';
import HoldTetrominoPreview from '../components/Tetris/HoldTetrominoPreview';
import Scoreboard from '../components/Tetris/Scoreboard';
import GameModeSelector from '../components/GameModeSelector';
import SettingsModal from '../components/SettingsModal';
import { GameMode, Settings } from '../types';

export default function TetrisPage() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [selectingSprintLines, setSelectingSprintLines] = useState(false);
  const [sprintLineGoal, setSprintLineGoal] = useState<number>(40);
  const [selectingDigLines, setSelectingDigLines] = useState(false);
  const [digLineGoal, setDigLineGoal] = useState<number>(10);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    autoRepeatDelay: 160,
    autoRepeatRate: 50,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('tetrisSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      document.documentElement.className = '';
      document.documentElement.classList.add(`theme-${parsedSettings.theme}`);
    } else {
      document.documentElement.classList.add(`theme-dark`);
    }
  }, []);

  const {
    board,
    activeTetromino,
    nextTetromino,
    heldTetromino,
    ghostTetromino,
    gameOver,
    gameWon,
    score,
    linesCleared,
    level,
    paused,
    timer,
    sprintGoal,
    digGoal,
    startMoving,
    stopMoving,
    hardDrop,
    hold,
    togglePause,
    restartGame,
    isMuted,
    toggleMute,
  } = useTetrisGame({ gameMode, sprintGoal: sprintLineGoal, digGoal: digLineGoal, settings });

  // Accessibility: focus main container on mount
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [gameMode]); // Refocus when game starts

  const handleSelectMode = (mode: GameMode) => {
    if (mode === 'sprint') {
      setSelectingSprintLines(true);
    } else if (mode === 'dig') {
      setSelectingDigLines(true);
    } else {
      setGameMode(mode);
      setSelectingSprintLines(false);
      setSelectingDigLines(false);
    }
  };

  const handleSelectSprintLines = (lines: number) => {
    setSprintLineGoal(lines);
    setGameMode('sprint');
    setSelectingSprintLines(false);
  };

  const handleSelectDigLines = (lines: number) => {
    setDigLineGoal(lines);
    setGameMode('dig');
    setSelectingDigLines(false);
  };

  const handleBackToMenu = useCallback(() => {
    restartGame(); // Reset internal game state
    setGameMode(null);
    setSelectingSprintLines(false);
    setSelectingDigLines(false);
  }, [restartGame]);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('tetrisSettings', JSON.stringify(newSettings));
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${newSettings.theme}`);
    setIsSettingsModalOpen(false);
  };

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (gameMode) {
        togglePause();
      }
      return;
    }
    if (!gameMode && !selectingSprintLines && !selectingDigLines) return;

    if (e.key === 'r' || e.key === 'R') {
      restartGame();
      return;
    }
    if (e.key === 'c' || e.key === 'C') {
      hold();
      return;
    }
    if (e.key === 'm' || e.key === 'M') {
      toggleMute();
      return;
    }
    if (gameOver || paused) return;
    if (e.key === 'ArrowLeft') {
      startMoving('left');
    } else if (e.key === 'ArrowRight') {
      startMoving('right');
    } else if (e.key === 'ArrowDown') {
      startMoving('down');
    } else if (e.key === 'ArrowUp') {
      startMoving('rotate');
    } else if (e.key === ' ') {
      hardDrop();
    }
  }, [gameOver, paused, startMoving, hardDrop, hold, togglePause, restartGame, toggleMute, gameMode, selectingSprintLines, selectingDigLines]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      stopMoving();
    }
  }, [stopMoving]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Overlay logic
  const showOverlay = (paused && !gameOver) || gameOver;
  let overlayText = '';
  if (paused && !gameOver) {
    overlayText = 'Paused';
  } else if (gameOver) {
    overlayText = gameWon ? `Finished! Time: ${timer}s` : 'Game Over';
  }
  const overlayColor = 'bg-gray-900 opacity-70';
  let overlayTextColor = 'text-yellow-300';
  if (gameOver) {
    overlayTextColor = gameWon ? 'text-green-400' : 'text-red-400';
  }

  if (!gameMode && !selectingSprintLines && !selectingDigLines) {
    return (
      <>
        <GameModeSelector
          onSelectMode={handleSelectMode}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={handleSaveSettings}
          currentSettings={settings}
        />
      </>
    );
  }

  if (selectingSprintLines) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Select Sprint Lines</h2>
        <div className="grid grid-cols-2 gap-4">
          {[10, 40, 100, 1000].map((lines) => (
            <button
              key={lines}
              onClick={() => handleSelectSprintLines(lines)}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-md text-xl font-bold"
            >
              {lines} Lines
            </button>
          ))}
        </div>
        <button
          onClick={handleBackToMenu}
          className="mt-8 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
        >
          Back to Mode Select
        </button>
      </div>
    );
  }

  if (selectingDigLines) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Select Dig Lines</h2>
        <div className="grid grid-cols-2 gap-4">
          {[10, 40, 100, 1000].map((lines) => (
            <button
              key={lines}
              onClick={() => handleSelectDigLines(lines)}
              className="px-6 py-3 bg-teal-700 hover:bg-teal-600 rounded-md text-xl font-bold"
            >
              {lines} Lines
            </button>
          ))}
        </div>
        <button
          onClick={handleBackToMenu}
          className="mt-8 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
        >
          Back to Mode Select
        </button>
      </div>
    );
  }

  return (
    <div
      ref={mainRef}
      tabIndex={0}
      aria-label="Vibe Tetris Game Area"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-2"
    >
      <div className="flex flex-row items-center justify-center gap-12">
        {/* Left Column: Title + Board */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white mb-4 capitalize">{gameMode} Mode</h1>
          <div className="relative">
            <GameBoard board={board} activeTetromino={activeTetromino} ghostTetromino={ghostTetromino} tetrominoColors={TETROMINO_COLORS} />
            {showOverlay && (
              <div className={`absolute inset-0 flex items-center justify-center ${overlayColor}`} style={{zIndex: 10}}>
                <span className={`text-3xl font-bold ${overlayTextColor} opacity-100`} aria-live="polite">{overlayText}</span>
              </div>
            )}
          </div>
        </div>
        {/* Right Column: Next, Hold, Scoreboard */}
        <div
          className="flex flex-col items-center justify-start"
          style={{ height: '100%' }}
        >
          <div
            className="flex flex-col items-center justify-between"
            style={{ height: '100%' }}
          >
            <div className="flex flex-col items-center" style={{ minHeight: '180px' }}>
              <div className="text-white text-lg font-mono mb-1 text-center">Next</div>
              <NextTetrominoPreview nextTetromino={nextTetromino} TETROMINOES={TETROMINOES} TETROMINO_COLORS={TETROMINO_COLORS} />
              <div className="text-white text-lg font-mono mb-1 text-center">Hold</div>
              <HoldTetrominoPreview heldTetromino={heldTetromino} TETROMINOES={TETROMINOES} TETROMINO_COLORS={TETROMINO_COLORS} />
            </div>
            <Scoreboard
              gameMode={gameMode}
              level={level}
              score={score}
              linesCleared={linesCleared}
              timer={timer}
              sprintGoal={sprintGoal}
              digGoal={digGoal}
            />
          </div>
        </div>
      </div>
      <div className="text-gray-400 text-xs mt-4 flex items-center justify-center gap-4">
        <span>Press <b>Esc</b> to pause, <b>R</b> to restart, <b>C</b> to hold, <b>M</b> to mute</span>
        <button
          onClick={handleBackToMenu}
          className="ml-8 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md"
        >
          Back to Menu
        </button>
        <button onClick={toggleMute} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md">
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  );
} 
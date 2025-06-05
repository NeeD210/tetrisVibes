"use client";
import GameBoard from '../components/Tetris/GameBoard';
import { useEffect, useCallback, useRef } from 'react';
import { TETROMINOES, TETROMINO_COLORS } from '../components/Tetris/tetrisLogic';
import { useTetrisGame } from '../components/Tetris/useTetrisGame';
import NextTetrominoPreview from '../components/Tetris/NextTetrominoPreview';
import HoldTetrominoPreview from '../components/Tetris/HoldTetrominoPreview';
import Scoreboard from '../components/Tetris/Scoreboard';

export default function TetrisPage() {
  const {
    board,
    activeTetromino,
    nextTetromino,
    heldTetromino,
    ghostTetromino,
    gameOver,
    score,
    linesCleared,
    level,
    paused,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    hold,
    togglePause,
    restartGame,
  } = useTetrisGame();

  // Accessibility: focus main container on mount
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      togglePause();
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      restartGame();
      return;
    }
    if (e.key === 'c' || e.key === 'C') {
      hold();
      return;
    }
    if (gameOver || paused) return;
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowDown') {
      moveDown();
    } else if (e.key === 'ArrowUp') {
      rotate();
    } else if (e.key === ' ') {
      hardDrop();
    }
  }, [gameOver, paused, moveLeft, moveRight, moveDown, rotate, hardDrop, hold, togglePause, restartGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Overlay logic
  const showOverlay = (paused && !gameOver) || gameOver;
  const overlayText = paused && !gameOver ? 'Paused' : gameOver ? 'Game Over' : '';
  const overlayColor = 'bg-gray-900 opacity-70';
  const overlayTextColor = paused && !gameOver ? 'text-yellow-300' : 'text-red-400';

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
          <h1 className="text-3xl font-bold text-white mb-4">Vibe Tetris</h1>
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
            <Scoreboard level={level} score={score} linesCleared={linesCleared} />
          </div>
        </div>
      </div>
      <div className="text-gray-400 text-xs mt-2">Press <b>Esc</b> to pause/resume, <b>R</b> to restart, <b>C</b> to hold</div>
    </div>
  );
} 
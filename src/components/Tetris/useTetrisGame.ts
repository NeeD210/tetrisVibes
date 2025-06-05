import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TETROMINOES,
  BOARD_WIDTH,
  Tetromino,
  getNextRotationIndex,
  createEmptyBoard,
  getRandomTetromino,
  isValidPosition,
  placeTetromino,
  clearLines,
  getHardDropY,
  getLevel,
  BoardCell,
} from './tetrisLogic';
import { playSound } from '../../soundManager';

/**
 * Custom hook encapsulating Tetris game logic and state management.
 * @returns {object} Game state and handlers for UI integration.
 */
export function useTetrisGame() {
  const [board, setBoard] = useState<BoardCell[][]>(createEmptyBoard());
  const [activeTetromino, setActiveTetromino] = useState<Tetromino | null>(null);
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(getRandomTetromino());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const level = getLevel(linesCleared);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [heldTetromino, setHeldTetromino] = useState<Tetromino | null>(null);
  const [hasHeldThisTurn, setHasHeldThisTurn] = useState(false);

  // Spawn a random tetromino at the start or after locking
  const spawnTetromino = useCallback(() => {
    const newTetromino = nextTetromino;
    const upcomingTetromino = getRandomTetromino();
    setHasHeldThisTurn(false);
    if (!isValidPosition(board, newTetromino)) {
      setGameOver(true);
      setActiveTetromino(null);
      playSound('gameover');
    } else {
      setActiveTetromino(newTetromino);
      setNextTetromino(upcomingTetromino);
    }
  }, [board, nextTetromino]);

  // Restart the game
  const restartGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLinesCleared(0);
    setGameOver(false);
    setPaused(false);
    setActiveTetromino(getRandomTetromino());
    setNextTetromino(getRandomTetromino());
    setHeldTetromino(null);
    setHasHeldThisTurn(false);
  }, []);

  useEffect(() => {
    if (!activeTetromino && !gameOver && !paused) {
      spawnTetromino();
    }
  }, [activeTetromino, gameOver, paused, spawnTetromino]);

  // Handle line clear and scoring
  const handleLineClear = useCallback((linesClearedCount: number) => {
    if (linesClearedCount > 0) {
      const tetrisBonus = linesClearedCount === 4 ? 2 : 1;
      setScore(s => s + linesClearedCount * 100 * tetrisBonus);
      setLinesCleared(lc => lc + linesClearedCount);
      playSound('clear');
    }
  }, []);

  // Game loop: move tetromino down every X ms (speed depends on level)
  const dropTetromino = useCallback(() => {
    setActiveTetromino(prev => {
      if (!prev) return prev;
      const next = { ...prev, y: prev.y + 1 };
      if (isValidPosition(board, next)) {
        return next;
      } else {
        // Lock tetromino and clear lines
        const placed = placeTetromino(board, prev);
        const { newBoard, linesCleared: linesClearedCount } = clearLines(placed);
        setActiveTetromino(null);
        setBoard(newBoard);
        handleLineClear(linesClearedCount);
        return null;
      }
    });
  }, [board, handleLineClear]);

  useEffect(() => {
    if (gameOver || !activeTetromino || paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    const speed = Math.max(100, 500 - (level - 1) * 40);
    intervalRef.current = setInterval(() => {
      dropTetromino();
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTetromino, board, gameOver, paused, level, dropTetromino]);

  // Input handlers
  const moveLeft = useCallback(() => {
    if (!activeTetromino || gameOver || paused) return;
    const next = { ...activeTetromino, x: activeTetromino.x - 1 };
    if (isValidPosition(board, next)) setActiveTetromino(next);
  }, [activeTetromino, board, gameOver, paused]);

  const moveRight = useCallback(() => {
    if (!activeTetromino || gameOver || paused) return;
    const next = { ...activeTetromino, x: activeTetromino.x + 1 };
    if (isValidPosition(board, next)) setActiveTetromino(next);
  }, [activeTetromino, board, gameOver, paused]);

  const moveDown = useCallback(() => {
    if (!activeTetromino || gameOver || paused) return;
    const next = { ...activeTetromino, y: activeTetromino.y + 1 };
    if (isValidPosition(board, next)) {
      setActiveTetromino(next);
    } else {
      dropTetromino();
    }
  }, [activeTetromino, board, gameOver, paused, dropTetromino]);

  const rotate = useCallback(() => {
    if (!activeTetromino || gameOver || paused) return;
    const nextRotation = getNextRotationIndex(activeTetromino.type, activeTetromino.rotation);
    let next = { ...activeTetromino, rotation: nextRotation };
    if (isValidPosition(board, next)) {
      setActiveTetromino(next);
    } else {
      // Wall kick left
      next = { ...activeTetromino, rotation: nextRotation, x: activeTetromino.x - 1 };
      if (isValidPosition(board, next)) {
        setActiveTetromino(next);
      } else {
        // Wall kick right
        next = { ...activeTetromino, rotation: nextRotation, x: activeTetromino.x + 1 };
        if (isValidPosition(board, next)) {
          setActiveTetromino(next);
        }
      }
    }
  }, [activeTetromino, board, gameOver, paused]);

  const hardDrop = useCallback(() => {
    if (!activeTetromino || gameOver || paused) return;
    const dropY = getHardDropY(board, activeTetromino);
    const dropped = { ...activeTetromino, y: dropY };
    setActiveTetromino(dropped);
    setTimeout(() => dropTetromino(), 0);
    playSound('drop');
  }, [activeTetromino, board, gameOver, paused, dropTetromino]);

  const hold = useCallback(() => {
    if (!activeTetromino || gameOver || paused || hasHeldThisTurn) return;
    setHasHeldThisTurn(true);
    setActiveTetromino(prev => {
      if (!prev) return prev;
      if (!heldTetromino) {
        setHeldTetromino({ ...prev, x: 0, y: 0, rotation: 0 });
        setTimeout(() => setActiveTetromino(null), 0);
        return null;
      } else {
        const swap = heldTetromino;
        setHeldTetromino({ ...prev, x: 0, y: 0, rotation: 0 });
        return { ...swap, x: Math.floor((BOARD_WIDTH - TETROMINOES[swap.type][0][0].length) / 2), y: 0, rotation: 0 };
      }
    });
  }, [activeTetromino, heldTetromino, gameOver, paused, hasHeldThisTurn]);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  // Ghost tetromino (preview position)
  let ghostTetromino: Tetromino | null = null;
  if (activeTetromino) {
    const dropY = getHardDropY(board, activeTetromino);
    ghostTetromino = { ...activeTetromino, y: dropY };
  }

  return {
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
  };
} 
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TETROMINOES,
  BOARD_WIDTH,
  Tetromino,
  getNextRotationIndex,
  createEmptyBoard,
  createBoardWithGarbage,
  getRandomTetromino,
  isValidPosition,
  placeTetromino,
  clearLines,
  getHardDropY,
  getLevel,
  BoardCell,
  addGarbageLine,
} from './tetrisLogic';
import { playSound, toggleMute as smToggleMute, getMutedState } from '../../soundManager';
import { GameMode, Settings } from '../../types';

// const DAS_DELAY = 120; // ms, delay before auto-repeat starts
// const DAS_INTERVAL = 40; // ms, speed of auto-repeat
const SPRINT_GOAL = 40; // Default sprint goal
const DIG_GOAL = 10; // Default dig goal
const DIG_START_LINES = 10; // Initial garbage lines for Dig mode

interface UseTetrisGameProps {
  gameMode: GameMode | null;
  sprintGoal?: number;
  digGoal?: number;
  settings: Settings;
}

/**
 * Custom hook encapsulating Tetris game logic and state management.
 * @returns {object} Game state and handlers for UI integration.
 */
export function useTetrisGame({ gameMode, sprintGoal, digGoal, settings }: UseTetrisGameProps) {
  const [board, setBoard] = useState<BoardCell[][]>(createEmptyBoard());
  const [activeTetromino, setActiveTetromino] = useState<Tetromino | null>(null);
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(getRandomTetromino());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const level = gameMode === 'zen' ? 1 : getLevel(linesCleared);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState(0);
  const [heldTetromino, setHeldTetromino] = useState<Tetromino | null>(null);
  const [hasHeldThisTurn, setHasHeldThisTurn] = useState(false);
  const [isMuted, setIsMuted] = useState(getMutedState());

  const sprintGoalValue = sprintGoal ?? SPRINT_GOAL;
  const digGoalValue = digGoal ?? DIG_GOAL;

  // DAS (Delayed Auto Shift) state
  const dasTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dasIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeMoveName = useRef<string | null>(null);

  useEffect(() => {
    const handleBlur = () => {
      // Pause the game if it's running
      if (!paused && !gameOver && gameMode) {
        setPaused(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);


    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [paused, gameOver, gameMode]);

  const addGarbageLineIfNeeded = useCallback((board: BoardCell[][]) => {
    const remainingLines = digGoalValue - linesCleared;
    const maxGarbageLines = Math.max(0, Math.min(10, remainingLines));
    const garbageLineCount = board.filter(row => row.some(cell => cell === 'Garbage')).length;

    if (garbageLineCount < maxGarbageLines) {
      const { newBoard: boardWithGarbage, gameOver: newGameOver } = addGarbageLine(board);
      if (newGameOver) {
        setGameOver(true);
        playSound('gameover');
      }
      setBoard(boardWithGarbage);
    } else {
      setBoard(board);
    }
  }, [digGoalValue, linesCleared]);

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
    if (gameMode === 'dig') {
      setBoard(createBoardWithGarbage(DIG_START_LINES));
    } else {
      setBoard(createEmptyBoard());
    }
    setScore(0);
    setLinesCleared(0);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
    setPaused(false);
    setActiveTetromino(getRandomTetromino());
    setNextTetromino(getRandomTetromino());
    setHeldTetromino(null);
    setHasHeldThisTurn(false);
  }, [gameMode]);

  useEffect(() => {
    // Don't spawn a tetromino if there's no game mode selected
    if (!gameMode) {
      // Clear any existing interval when returning to menu
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (!activeTetromino && !gameOver && !paused) {
      spawnTetromino();
    }
  }, [activeTetromino, gameOver, paused, spawnTetromino, gameMode]);

  // Handle line clear and scoring
  const handleLineClear = useCallback((linesClearedCount: number, garbageLinesCleared: number) => {
    if (linesClearedCount > 0) {
      const isDigMode = gameMode === 'dig';
      const linesToAdd = isDigMode ? garbageLinesCleared : linesClearedCount;

      if (linesToAdd > 0) {
        const newTotalLines = linesCleared + linesToAdd;
        // Score bonus for clearing multiple lines at once (Tetris, etc.)
        const scoreBonus = linesClearedCount === 4 ? 2 : 1;
        setScore(s => s + linesToAdd * 100 * scoreBonus);
        setLinesCleared(newTotalLines);

        if (gameMode === 'sprint' && newTotalLines >= sprintGoalValue) {
          setGameWon(true);
          setGameOver(true);
          playSound('gameover');
        } else if (gameMode === 'dig' && newTotalLines >= digGoalValue) {
          setGameWon(true);
          setGameOver(true);
          playSound('gameover');
        }
      }
      playSound('clear');
    }
  }, [gameMode, linesCleared, sprintGoalValue, digGoalValue]);

  const lockTetromino = useCallback(() => {
    let pieceToLock: Tetromino | null = null;
    setActiveTetromino(prev => {
      pieceToLock = prev;
      return null;
    });

    if (pieceToLock) {
      const placed = placeTetromino(board, pieceToLock);
      const { newBoard, linesCleared: linesClearedCount, garbageLinesCleared } = clearLines(placed);

      if (linesClearedCount > 0) {
        setBoard(newBoard);
        handleLineClear(linesClearedCount, garbageLinesCleared);
      } else if (gameMode === 'dig') {
        addGarbageLineIfNeeded(newBoard);
      } else {
        setBoard(newBoard);
      }
    }
  }, [board, handleLineClear, gameMode, addGarbageLineIfNeeded]);

  // Game loop: move tetromino down every X ms (speed depends on level)
  const dropTetromino = useCallback(() => {
    if (!activeTetromino) return;
    const next = { ...activeTetromino, y: activeTetromino.y + 1 };
    if (isValidPosition(board, next)) {
      setActiveTetromino(next);
    } else {
      lockTetromino();
    }
  }, [activeTetromino, board, lockTetromino]);

  useEffect(() => {
    if (gameOver || !activeTetromino || paused || !gameMode) {
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
  }, [activeTetromino, board, gameOver, paused, level, dropTetromino, gameMode]);

  // Timer for Sprint and Cheese mode
  useEffect(() => {
    if ((gameMode !== 'sprint' && gameMode !== 'dig') || gameOver || paused) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameMode, gameOver, paused]);

  // Garbage line interval for Survival mode
  useEffect(() => {
    if (gameMode !== 'survival' || gameOver || paused) {
      return;
    }

    const getGarbageInterval = (level: number) => {
      // Interval starts at 20s and decreases by 2s per level, with a minimum of 5s.
      return Math.max(5000, 20000 - (level - 1) * 2000);
    };

    const garbageInterval = setInterval(() => {
      setBoard(prevBoard => {
        const { newBoard, gameOver: newGameOver } = addGarbageLine(prevBoard);
        if (newGameOver) {
          setGameOver(true);
          playSound('gameover');
        }
        return newBoard;
      });
    }, getGarbageInterval(level));

    return () => clearInterval(garbageInterval);
  }, [gameMode, gameOver, paused, level]);

  const stopMoving = useCallback(() => {
    if (dasTimeoutRef.current) clearTimeout(dasTimeoutRef.current);
    if (dasIntervalRef.current) clearInterval(dasIntervalRef.current);
    dasTimeoutRef.current = null;
    dasIntervalRef.current = null;
    activeMoveName.current = null;
  }, []);

  const startMoving = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    if (paused || !activeTetromino) return;

    // --- Single-action movements ---
    if (direction === 'rotate') {
      setActiveTetromino(prev => {
        if (!prev) return null;
        const nextRotation = getNextRotationIndex(prev.type, prev.rotation);
        let next: Tetromino = { ...prev, rotation: nextRotation };
        if (isValidPosition(board, next)) return next;
        
        // Basic wall kick
        next = { ...prev, rotation: nextRotation, x: prev.x - 1 };
        if (isValidPosition(board, next)) return next;
        next = { ...prev, rotation: nextRotation, x: prev.x + 1 };
        if (isValidPosition(board, next)) return next;

        return prev;
      });
      return; // No repeat for rotation
    }
    
    if (direction === 'down') {
      dropTetromino();
      return; // Let the game loop handle subsequent drops, or implement separate soft-drop logic if needed
    }

    // --- Auto-repeat movements (DAS) ---
    const move = () => {
      setActiveTetromino(prev => {
        if (!prev) return null;
        const delta = direction === 'left' ? -1 : 1;
        const next = { ...prev, x: prev.x + delta };
        return isValidPosition(board, next) ? next : prev;
      });
    };

    move(); // Immediate move

    // Clear any existing timers and restart DAS
    stopMoving();
    activeMoveName.current = direction;

    dasTimeoutRef.current = setTimeout(() => {
      dasIntervalRef.current = setInterval(() => {
        if (activeMoveName.current === direction) {
          move();
        }
      }, settings.autoRepeatRate);
    }, settings.autoRepeatDelay);

  }, [activeTetromino, board, paused, dropTetromino, settings, stopMoving]);

  const hardDrop = useCallback(() => {
    if (gameOver || paused) return;

    setActiveTetromino(activeTetromino => {
      if (!activeTetromino) {
        return null;
      }
      const y = getHardDropY(board, activeTetromino);
      const pieceToLock = { ...activeTetromino, y };

      const placed = placeTetromino(board, pieceToLock);
      const { newBoard, linesCleared: linesClearedCount, garbageLinesCleared } = clearLines(placed);
      if (linesClearedCount > 0) {
        setBoard(newBoard);
        handleLineClear(linesClearedCount, garbageLinesCleared);
      } else if (gameMode === 'dig') {
        addGarbageLineIfNeeded(newBoard);
      } else {
        setBoard(newBoard);
      }
      playSound('drop');
      return null;
    });
  }, [board, gameOver, paused, handleLineClear, gameMode, addGarbageLineIfNeeded]);

  const hold = useCallback(() => {
    if (gameOver || paused || hasHeldThisTurn) return;
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
  }, [heldTetromino, gameOver, paused, hasHeldThisTurn]);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(smToggleMute());
  }, []);

  // Ghost tetromino (preview position)
  let ghostTetromino: Tetromino | null = null;
  if (activeTetromino) {
    const dropY = getHardDropY(board, activeTetromino);
    ghostTetromino = { ...activeTetromino, y: dropY };
  }

  const returnValues = {
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
    sprintGoal: sprintGoalValue,
    digGoal: digGoalValue,
    startMoving,
    stopMoving,
    hardDrop,
    hold,
    togglePause,
    restartGame,
    isMuted,
    toggleMute,
  };

  return returnValues;
} 
"use client";
import GameBoard from '../components/Tetris/GameBoard';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TETROMINOES, BOARD_WIDTH, BOARD_HEIGHT, Tetromino, TetrominoType, getNextRotationIndex, TETROMINO_COLORS } from '../components/Tetris/tetrisLogic';
import { playSound } from '../soundManager';

// Type for tetromino
/**
 * @typedef {Object} Tetromino
 * @property {keyof typeof TETROMINOES} type
 * @property {number} rotation
 * @property {number} x
 * @property {number} y
 */

function getRandomTetromino(): Tetromino {
  const keys = Object.keys(TETROMINOES) as TetrominoType[];
  const type = keys[Math.floor(Math.random() * keys.length)];
  return { type, rotation: 0, x: Math.floor((BOARD_WIDTH - TETROMINOES[type][0][0].length) / 2), y: 0 };
}

// Store the tetromino type in the board for color rendering
type ActiveCell = { active: true; type: TetrominoType };
type GhostCell = { ghost: true; type: TetrominoType };
type BoardCell = TetrominoType | 0 | ActiveCell | GhostCell; // 0 = empty, ActiveCell = active, GhostCell = ghost, TetrominoType = locked

function createEmptyBoard(): BoardCell[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
}

function isValidPosition(board: BoardCell[][], tetromino: Tetromino): boolean {
  const shape = TETROMINOES[tetromino.type][tetromino.rotation];
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const boardY = tetromino.y + i;
        const boardX = tetromino.x + j;
        if (
          boardY < 0 ||
          boardY >= BOARD_HEIGHT ||
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          board[boardY][boardX] !== 0 &&
          !(typeof board[boardY][boardX] === 'object' && 'active' in board[boardY][boardX] && board[boardY][boardX].active)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Store the tetromino type in the board for color rendering
function placeTetromino(board: BoardCell[][], tetromino: Tetromino): BoardCell[][] {
  const newBoard = board.map(row => [...row]);
  const shape = TETROMINOES[tetromino.type][tetromino.rotation];
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const boardY = tetromino.y + i;
        const boardX = tetromino.x + j;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = tetromino.type;
        }
      }
    }
  }
  return newBoard;
}

function clearLines(board: BoardCell[][]): { newBoard: BoardCell[][], linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  return { newBoard, linesCleared };
}

// Helper to find the lowest valid Y for a tetromino (for hard drop)
function getHardDropY(board: BoardCell[][], tetromino: Tetromino): number {
  let y = tetromino.y;
  while (true) {
    const next = { ...tetromino, y: y + 1 };
    if (isValidPosition(board, next)) {
      y++;
    } else {
      break;
    }
  }
  return y;
}

// Level state, derived from linesCleared
const getLevel = (lines: number) => {
  if (lines >= 40) return 5 + Math.floor((lines - 40) / 40);
  if (lines >= 20) return 4;
  if (lines >= 10) return 3;
  if (lines >= 5) return 2;
  return 1;
};

// Helper to handle score and lines cleared update
function handleLineClear(linesCleared: number, setScore: React.Dispatch<React.SetStateAction<number>>, setLinesCleared: React.Dispatch<React.SetStateAction<number>>) {
  if (linesCleared > 0) {
    const tetrisBonus = linesCleared === 4 ? 2 : 1;
    setScore(s => s + linesCleared * 100 * tetrisBonus);
    setLinesCleared(lc => lc + linesCleared);
    console.log('Lines cleared:', linesCleared, 'Calling playSound(clear)');
    playSound('clear');
  }
}

export default function TetrisPage() {
  const [board, setBoard] = useState<BoardCell[][]>(createEmptyBoard());
  const [activeTetromino, setActiveTetromino] = useState<Tetromino | null>(null);
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(getRandomTetromino());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  // Level state, derived from linesCleared
  const level = getLevel(linesCleared);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [heldTetromino, setHeldTetromino] = useState<Tetromino | null>(null);
  const [hasHeldThisTurn, setHasHeldThisTurn] = useState(false);

  // Spawn a random tetromino at the start or after locking
  const spawnTetromino = useCallback(() => {
    const newTetromino = nextTetromino;
    const upcomingTetromino = getRandomTetromino();
    setHasHeldThisTurn(false); // Reset hold lock on new spawn
    if (!isValidPosition(board, newTetromino)) {
      setGameOver(true);
      setActiveTetromino(null);
      console.log('Game Over triggered, calling playSound(gameover)');
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
  }, []);

  useEffect(() => {
    if (!activeTetromino && !gameOver && !paused) {
      spawnTetromino();
    }
  }, [activeTetromino, gameOver, paused, spawnTetromino]);

  // Game loop: move tetromino down every X ms (speed depends on level)
  const dropTetromino = useCallback(() => {
    if (!activeTetromino) return;
    const next = { ...activeTetromino, y: activeTetromino.y + 1 };
    if (isValidPosition(board, next)) {
      setActiveTetromino(next);
    } else {
      // 1. Place tetromino
      const placed = placeTetromino(board, activeTetromino);
      // 2. Clear lines
      const { newBoard, linesCleared: numCleared } = clearLines(placed);
      // 3. Update score and lines cleared
      handleLineClear(numCleared, setScore, setLinesCleared);
      // 4. Update board and active tetromino
      setBoard(newBoard);
      setActiveTetromino(null);
    }
  }, [activeTetromino, board, setActiveTetromino, setBoard, setScore, setLinesCleared]);

  useEffect(() => {
    if (gameOver || !activeTetromino || paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    // Speed: 500ms at level 1, -40ms per level, min 100ms
    const speed = Math.max(100, 500 - (level - 1) * 40);
    intervalRef.current = setInterval(() => {
      dropTetromino();
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTetromino, board, gameOver, paused, level, dropTetromino]);

  // Keyboard controls with collision, locking, pause, and restart
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setPaused(p => !p);
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      restartGame();
      return;
    }
    // Hold logic
    if ((e.key === 'c' || e.key === 'C') && activeTetromino && !gameOver && !paused && !hasHeldThisTurn) {
      setHasHeldThisTurn(true);
      setActiveTetromino(prev => {
        if (!prev) return prev;
        if (!heldTetromino) {
          setHeldTetromino({ ...prev, x: 0, y: 0, rotation: 0 });
          // Spawn new tetromino
          setTimeout(() => setActiveTetromino(null), 0);
          return null;
        } else {
          // Swap
          const swap = heldTetromino;
          setHeldTetromino({ ...prev, x: 0, y: 0, rotation: 0 });
          // Place swap at spawn position
          return { ...swap, x: Math.floor((BOARD_WIDTH - TETROMINOES[swap.type][0][0].length) / 2), y: 0, rotation: 0 };
        }
      });
      return;
    }
    if (!activeTetromino || gameOver || paused) return;
    let moved: Tetromino | null = null;
    if (e.key === 'ArrowLeft') {
      const next = { ...activeTetromino, x: activeTetromino.x - 1 };
      if (isValidPosition(board, next)) moved = next;
    } else if (e.key === 'ArrowRight') {
      const next = { ...activeTetromino, x: activeTetromino.x + 1 };
      if (isValidPosition(board, next)) moved = next;
    } else if (e.key === 'ArrowDown') {
      const next = { ...activeTetromino, y: activeTetromino.y + 1 };
      if (isValidPosition(board, next)) {
        moved = next;
      } else {
        // Do nothing here! Let the interval handle the lock/clear.
        // Force the interval logic to run immediately.
        dropTetromino();
        return;
      }
    } else if (e.key === 'ArrowUp') {
      const nextRotation = getNextRotationIndex(activeTetromino.type, activeTetromino.rotation);
      // Try rotate in place
      let next = { ...activeTetromino, rotation: nextRotation };
      if (isValidPosition(board, next)) {
        moved = next;
      } else {
        // Try wall kick left
        next = { ...activeTetromino, rotation: nextRotation, x: activeTetromino.x - 1 };
        if (isValidPosition(board, next)) {
          moved = next;
        } else {
          // Try wall kick right
          next = { ...activeTetromino, rotation: nextRotation, x: activeTetromino.x + 1 };
          if (isValidPosition(board, next)) {
            moved = next;
          }
        }
      }
    } else if (e.key === ' ') {
      // Hard drop
      const dropY = getHardDropY(board, activeTetromino);
      const dropped = { ...activeTetromino, y: dropY };
      setActiveTetromino(dropped);
      // Force the interval logic to run immediately to lock and clear lines
      setTimeout(() => dropTetromino(), 0);
      playSound('drop');
      return;
    }
    if (moved) setActiveTetromino(moved);
  }, [activeTetromino, board, gameOver, paused, restartGame, heldTetromino, hasHeldThisTurn, dropTetromino]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Overlay logic
  const showOverlay = (paused && !gameOver) || gameOver;
  const overlayText = paused && !gameOver ? 'Paused' : gameOver ? 'Game Over' : '';
  const overlayColor = 'bg-gray-900 opacity-70';
  const overlayTextColor = paused && !gameOver ? 'text-yellow-300' : 'text-red-400';

  // Compute ghost tetromino (preview position)
  let ghostTetromino: Tetromino | null = null;
  if (activeTetromino) {
    const dropY = getHardDropY(board, activeTetromino);
    ghostTetromino = { ...activeTetromino, y: dropY };
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-2">
      <div className="flex flex-row items-center justify-center gap-12">
        {/* Left Column: Title + Board */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white mb-4">Vibe Tetris</h1>
          <div className="relative">
            <GameBoard board={board} activeTetromino={activeTetromino} ghostTetromino={ghostTetromino} tetrominoColors={TETROMINO_COLORS} />
            {showOverlay && (
              <div className={`absolute inset-0 flex items-center justify-center ${overlayColor}`} style={{zIndex: 10}}>
                <span className={`text-3xl font-bold ${overlayTextColor} opacity-100`}>{overlayText}</span>
              </div>
            )}
          </div>
        </div>
        {/* Right Column: Next, Score, Lines Cleared (centered vertically to board) */}
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
              <div className="flex flex-col items-center mb-6">
                {/* Next Tetromino Preview: always 4x4 grid */}
                {nextTetromino && (
                  <div className="inline-block bg-gray-700 rounded p-2">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="flex">
                        {[0, 1, 2, 3].map(j => {
                          const shape = TETROMINOES[nextTetromino.type][0];
                          const shapeRows = shape.length;
                          const shapeCols = shape[0].length;
                          const offsetY = Math.floor((4 - shapeRows) / 2);
                          const offsetX = Math.floor((4 - shapeCols) / 2);
                          let cell = 0;
                          if (
                            i >= offsetY && i < offsetY + shapeRows &&
                            j >= offsetX && j < offsetX + shapeCols
                          ) {
                            cell = shape[i - offsetY][j - offsetX];
                          }
                          return (
                            <div
                              key={j}
                              className={`w-4 h-4 border border-gray-600 ${cell ? TETROMINO_COLORS[nextTetromino.type] : 'bg-gray-700'}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Hold Tetromino UI */}
              <div className="text-white text-lg font-mono mb-1 text-center">Hold</div>
              <div className="flex flex-col items-center mb-6">
                {heldTetromino ? (
                  <div className="inline-block bg-gray-700 rounded p-2">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="flex">
                        {[0, 1, 2, 3].map(j => {
                          const shape = TETROMINOES[heldTetromino.type][0];
                          const shapeRows = shape.length;
                          const shapeCols = shape[0].length;
                          const offsetY = Math.floor((4 - shapeRows) / 2);
                          const offsetX = Math.floor((4 - shapeCols) / 2);
                          let cell = 0;
                          if (
                            i >= offsetY && i < offsetY + shapeRows &&
                            j >= offsetX && j < offsetX + shapeCols
                          ) {
                            cell = shape[i - offsetY][j - offsetX];
                          }
                          return (
                            <div
                              key={j}
                              className={`w-4 h-4 border border-gray-600 ${cell ? TETROMINO_COLORS[heldTetromino.type] : 'bg-gray-700'}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="inline-block bg-gray-700 rounded p-2 opacity-50">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="flex">
                        {[0, 1, 2, 3].map(j => (
                          <div key={j} className="w-4 h-4 border border-gray-600 bg-gray-700" />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
                {/* Level display */}
                Level: {level}
              </div>
              <div className="text-white text-lg font-mono mb-2 text-center w-full flex justify-center">
                Score: {score}
              </div>
              <div className="text-white text-lg font-mono text-center w-full flex justify-center">
                Lines Cleared: {linesCleared}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-gray-400 text-xs mt-2">Press <b>Esc</b> to pause/resume, <b>R</b> to restart, <b>C</b> to hold</div>
    </div>
  );
} 
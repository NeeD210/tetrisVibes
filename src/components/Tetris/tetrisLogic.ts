// Tetris core logic: board, tetromino shapes, and rotation

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
  type: TetrominoType;
  rotation: number;
  x: number;
  y: number;
}

// Cell types for board rendering and logic
export type ActiveCell = { active: true; type: TetrominoType };
export type GhostCell = { ghost: true; type: TetrominoType };
export type BoardCell = TetrominoType | 0 | ActiveCell | GhostCell; // 0 = empty, ActiveCell = active, GhostCell = ghost, TetrominoType = locked

// Tetromino shapes and their rotation states
export const TETROMINOES: Record<TetrominoType, number[][][]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

// Tetromino colors
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: 'bg-cyan-400',
  O: 'bg-yellow-300',
  T: 'bg-purple-400',
  S: 'bg-green-400',
  Z: 'bg-red-400',
  J: 'bg-blue-500',
  L: 'bg-orange-400',
};

// Create an empty board
export function createEmptyBoard(): BoardCell[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
}

// Get a random tetromino at spawn position
export function getRandomTetromino(): Tetromino {
  const keys = Object.keys(TETROMINOES) as TetrominoType[];
  const type = keys[Math.floor(Math.random() * keys.length)];
  return {
    type,
    rotation: 0,
    x: Math.floor((BOARD_WIDTH - TETROMINOES[type][0][0].length) / 2),
    y: 0,
  };
}

// Check if a tetromino is in a valid position
export function isValidPosition(board: BoardCell[][], tetromino: Tetromino): boolean {
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
          (board[boardY][boardX] !== 0 &&
            !(typeof board[boardY][boardX] === 'object' && 'active' in board[boardY][boardX] && board[boardY][boardX].active))
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Lock a tetromino into the board
export function placeTetromino(board: BoardCell[][], tetromino: Tetromino): BoardCell[][] {
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

// Clear completed lines and return new board and number of lines cleared
export function clearLines(board: BoardCell[][]): { newBoard: BoardCell[][]; linesCleared: number } {
  // A full line is a row where every cell is a string (TetrominoType)
  const isFullLine = (row: BoardCell[]) => row.every(cell => typeof cell === 'string');
  const filtered = board.filter(row => !isFullLine(row));
  const linesCleared = BOARD_HEIGHT - filtered.length;
  while (filtered.length < BOARD_HEIGHT) {
    filtered.unshift(Array(BOARD_WIDTH).fill(0));
  }
  return { newBoard: filtered, linesCleared };
}

// Find the lowest valid Y for a tetromino (for hard drop)
export function getHardDropY(board: BoardCell[][], tetromino: Tetromino): number {
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

// Rotate a tetromino (returns the next rotation index)
export function getNextRotationIndex(tetromino: TetrominoType, currentRotation: number): number {
  const numRotations = TETROMINOES[tetromino].length;
  return (currentRotation + 1) % numRotations;
}

// Level calculation based on lines cleared
export function getLevel(lines: number): number {
  if (lines >= 40) return 5 + Math.floor((lines - 40) / 40);
  if (lines >= 20) return 4;
  if (lines >= 10) return 3;
  if (lines >= 5) return 2;
  return 1;
} 
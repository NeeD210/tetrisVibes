// Tetris core logic: board, tetromino shapes, and rotation

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type BlockType = TetrominoType | 'Garbage';

export interface Tetromino {
  type: TetrominoType;
  rotation: number;
  x: number;
  y: number;
}

// Cell types for board rendering and logic
export type ActiveCell = { active: true; type: TetrominoType };
export type GhostCell = { ghost: true; type: TetrominoType };
export type BoardCell = BlockType | 0 | ActiveCell | GhostCell; // 0 = empty, ActiveCell = active, GhostCell = ghost, BlockType = locked

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
export const TETROMINO_COLORS: Record<BlockType, string> = {
  I: 'bg-cyan-400',
  O: 'bg-yellow-300',
  T: 'bg-purple-400',
  S: 'bg-green-400',
  Z: 'bg-red-400',
  J: 'bg-blue-500',
  L: 'bg-orange-400',
  Garbage: 'bg-gray-500',
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
export function clearLines(board: BoardCell[][]): {
  newBoard: BoardCell[][];
  linesCleared: number;
  garbageLinesCleared: number;
} {
  const isFullLine = (row: BoardCell[]) => row.every(cell => typeof cell === 'string');

  const fullLines = board.filter(isFullLine);
  const garbageLinesCleared = fullLines.filter(row => row.some(cell => cell === 'Garbage')).length;

  const filtered = board.filter(row => !isFullLine(row));
  const linesCleared = BOARD_HEIGHT - filtered.length;
  while (filtered.length < BOARD_HEIGHT) {
    filtered.unshift(Array(BOARD_WIDTH).fill(0));
  }
  return { newBoard: filtered, linesCleared, garbageLinesCleared };
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
  return Math.floor(lines / 10) + 1;
}

// Function to add a garbage line, returns new board and whether game is over
export function addGarbageLine(board: BoardCell[][]): { newBoard: BoardCell[][]; gameOver: boolean } {
  // Check for game over: if the top visible row has locked pieces, game is over
  if (board[0].some(cell => typeof cell === 'string')) {
    return { newBoard: board, gameOver: true };
  }

  const newBoard = board.slice(1); // Shift all rows up
  const holePosition = Math.floor(Math.random() * BOARD_WIDTH);
  const garbageLine: BoardCell[] = Array(BOARD_WIDTH)
    .fill('Garbage')
    .map((cell, i) => (i === holePosition ? 0 : cell));
  newBoard.push(garbageLine); // Add garbage to bottom

  return { newBoard, gameOver: false };
}

// Create a board with garbage lines
export function createBoardWithGarbage(numLines: number): BoardCell[][] {
  let board = createEmptyBoard();
  for (let i = 0; i < numLines; i++) {
    // We can ignore the gameOver check here since we're building from an empty board
    board = addGarbageLine(board).newBoard;
  }
  return board;
} 
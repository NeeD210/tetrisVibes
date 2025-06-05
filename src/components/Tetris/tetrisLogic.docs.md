# Tetris Logic: JSDoc Documentation

---

## Types

### `TetrominoType`
```
type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
```
Represents the 7 possible tetromino shapes.

### `Tetromino`
```
interface Tetromino {
  type: TetrominoType;
  rotation: number;
  x: number;
  y: number;
}
```
Represents a tetromino's type, rotation, and position on the board.

### `ActiveCell`, `GhostCell`, `BoardCell`
```
type ActiveCell = { active: true; type: TetrominoType };
type GhostCell = { ghost: true; type: TetrominoType };
type BoardCell = TetrominoType | 0 | ActiveCell | GhostCell;
```
Represents the possible states of a cell on the board.

---

## Constants

### `BOARD_WIDTH`, `BOARD_HEIGHT`
```
BOARD_WIDTH: number // 10
BOARD_HEIGHT: number // 20
```
Dimensions of the Tetris board.

### `TETROMINOES`
```
TETROMINOES: Record<TetrominoType, number[][][]>
```
Precomputed rotation states for each tetromino type.

### `TETROMINO_COLORS`
```
TETROMINO_COLORS: Record<TetrominoType, string>
```
Maps tetromino types to their color classes.

---

## Functions

### `createEmptyBoard()`
```
/**
 * Create an empty Tetris board.
 * @returns {BoardCell[][]} A 2D array representing an empty board.
 */
```

### `getRandomTetromino()`
```
/**
 * Generate a random tetromino at the spawn position.
 * @returns {Tetromino} A new tetromino object.
 */
```

### `isValidPosition(board, tetromino)`
```
/**
 * Check if a tetromino is in a valid position on the board.
 * @param {BoardCell[][]} board - The current board state.
 * @param {Tetromino} tetromino - The tetromino to check.
 * @returns {boolean} True if the position is valid, false otherwise.
 */
```

### `placeTetromino(board, tetromino)`
```
/**
 * Lock a tetromino into the board and return the new board state.
 * @param {BoardCell[][]} board - The current board state.
 * @param {Tetromino} tetromino - The tetromino to place.
 * @returns {BoardCell[][]} The new board state with the tetromino placed.
 */
```

### `clearLines(board)`
```
/**
 * Clear completed lines from the board.
 * @param {BoardCell[][]} board - The current board state.
 * @returns {{ newBoard: BoardCell[][], linesCleared: number }}
 *   An object with the new board and the number of lines cleared.
 */
```

### `getHardDropY(board, tetromino)`
```
/**
 * Find the lowest valid Y position for a hard drop.
 * @param {BoardCell[][]} board - The current board state.
 * @param {Tetromino} tetromino - The tetromino to drop.
 * @returns {number} The Y position for a hard drop.
 */
```

### `getNextRotationIndex(tetromino, currentRotation)`
```
/**
 * Get the next rotation index for a tetromino.
 * @param {TetrominoType} tetromino - The tetromino type.
 * @param {number} currentRotation - The current rotation index.
 * @returns {number} The next rotation index.
 */
```

### `getLevel(lines)`
```
/**
 * Calculate the level based on lines cleared.
 * @param {number} lines - The number of lines cleared.
 * @returns {number} The current level.
 */
``` 
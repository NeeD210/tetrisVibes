# Vibe Tetris Webapp: Components Summary

## Main Page (`src/app/page.tsx`)
- **TetrisPage**: The main page for the app. Renders the Tetris game area, including the board, next/hold previews, and scoreboard. Handles keyboard controls and overlays for pause/game over.

## Layout (`src/app/layout.tsx`)
- **RootLayout**: Sets up global fonts, metadata, and wraps the app in a styled `<body>`. No additional components are defined here.

## Tetris Components (`src/components/Tetris/`)

### 1. GameBoard.tsx
- **Purpose**: Renders the Tetris board grid, including active and ghost tetrominoes.
- **Type**: Main game board UI.

### 2. NextTetrominoPreview.tsx
- **Purpose**: Shows a preview of the next tetromino.
- **Type**: UI preview component.

### 3. HoldTetrominoPreview.tsx
- **Purpose**: Shows a preview of the currently held tetromino (or an empty slot if none is held).
- **Type**: UI preview component.

### 4. Scoreboard.tsx
- **Purpose**: Displays the current level, score, and lines cleared.
- **Type**: UI stats component.

### 5. Controls.tsx
- **Purpose**: Renders four buttons for Tetris controls: left, rotate, right, and down.
- **Type**: UI control component (not currently used in the main page, as controls are handled via keyboard).

### 6. Score.tsx
- **Purpose**: Displays the score (simple, legacy component; not used in the main page).
- **Type**: UI component.

### 7. Tetromino.tsx
- **Purpose**: Placeholder for future tetromino rendering.
- **Type**: Not currently used.

### 8. useTetrisGame.ts
- **Purpose**: Custom React hook encapsulating all Tetris game logic and state management.
- **Type**: Logic/state hook (not a UI component).

### 9. tetrisLogic.ts
- **Purpose**: Contains core Tetris logic, types, constants, and utility functions.
- **Type**: Logic module (not a UI component).

---

## Summary Table

| Component              | File                                   | Purpose/Description                                 | Used in Main Page? |
|------------------------|----------------------------------------|-----------------------------------------------------|--------------------|
| TetrisPage             | src/app/page.tsx                       | Main app page, renders all Tetris UI                | Yes                |
| RootLayout             | src/app/layout.tsx                     | Global layout, fonts, and metadata                  | Yes (as layout)    |
| GameBoard              | src/components/Tetris/GameBoard.tsx    | Renders the Tetris board grid                       | Yes                |
| NextTetrominoPreview   | src/components/Tetris/NextTetrominoPreview.tsx | Shows preview of next tetromino             | Yes                |
| HoldTetrominoPreview   | src/components/Tetris/HoldTetrominoPreview.tsx | Shows preview of held tetromino             | Yes                |
| Scoreboard             | src/components/Tetris/Scoreboard.tsx   | Displays level, score, and lines cleared            | Yes                |
| Controls               | src/components/Tetris/Controls.tsx     | Renders control buttons for the game                | No                 |
| Score                  | src/components/Tetris/Score.tsx        | Displays the score (legacy, not used)               | No                 |
| Tetromino              | src/components/Tetris/Tetromino.tsx    | Placeholder for future tetromino rendering          | No                 |
| useTetrisGame          | src/components/Tetris/useTetrisGame.ts | Custom hook for Tetris game logic                   | Yes (as hook)      |
| tetrisLogic            | src/components/Tetris/tetrisLogic.ts   | Core Tetris logic and types                         | Yes (as logic)     |

---

*This summary reflects the current state of the codebase and will need updating as new components or features are added.* 
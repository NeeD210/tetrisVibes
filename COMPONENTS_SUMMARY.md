# Vibe Tetris Webapp: Components Summary

## Main Page (`src/app/page.tsx`)
- **TetrisPage**: The main page for the app. It renders the title and three components: `Score`, `GameBoard`, and `Controls`.

## Layout (`src/app/layout.tsx`)
- **RootLayout**: Sets up the global font, metadata, and wraps the app in a styled `<body>`. No additional components are defined here.

## Tetris Components (`src/components/Tetris/`)

### 1. Score.js
- **Purpose**: Displays the current score (currently hardcoded as "Score: 0").
- **Type**: Simple UI component.

### 2. GameBoard.js
- **Purpose**: Renders a 10x20 grid representing the Tetris board.
- **Details**: Each cell is styled but currently empty (no game logic or pieces rendered yet).

### 3. Controls.js
- **Purpose**: Renders four buttons for Tetris controls: left, rotate, right, and down.
- **Details**: Each button is styled with a different color and icon.

### 4. Tetromino.js
- **Purpose**: Placeholder component for future tetromino (Tetris piece) rendering.
- **Details**: Currently returns `null` and is not used in the main page.

---

## Summary Table

| Component      | File                              | Purpose/Description                                 | Used in Main Page? |
|---------------|-----------------------------------|-----------------------------------------------------|--------------------|
| TetrisPage    | src/app/page.tsx                  | Main app page, renders all Tetris UI                | Yes                |
| RootLayout    | src/app/layout.tsx                | Global layout, fonts, and metadata                  | Yes (as layout)    |
| Score         | src/components/Tetris/Score.js    | Displays the score                                  | Yes                |
| GameBoard     | src/components/Tetris/GameBoard.js| Renders the Tetris board grid                       | Yes                |
| Controls      | src/components/Tetris/Controls.js | Renders control buttons for the game                | Yes                |
| Tetromino     | src/components/Tetris/Tetromino.js| Placeholder for future tetromino rendering          | No                 |

---

*This summary reflects the current state of the codebase and will need updating as new components or features are added.* 
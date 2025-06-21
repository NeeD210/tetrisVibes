# Game Modes Implementation Plan

This document outlines the plan for adding different game modes to Vibe Tetris.

## Game Modes

### 1. Endless Mode

*   **Description:** The classic Tetris mode. The game gets progressively faster as the player clears lines and levels up. The game ends when the player's stack of blocks reaches the top of the board.
*   **Implementation:** This is the current implementation. We will refactor it to be explicitly "Endless" mode.

### 2. Sprint Mode

*   **Description:** The player must clear a set number of lines (e.g., 40 lines) as quickly as possible. The primary metric is the time taken to clear the lines.
*   **Winning Condition:** Clearing 40 lines.
*   **UI:**
    *   Display a timer.
    *   Display the number of lines remaining to be cleared.
    *   Show the final time upon completion.

### 3. Dig Race Mode

*   **Description:** The player starts with a board pre-filled with "garbage" lines (lines with a single empty hole). The goal is to clear all the garbage lines as quickly as possible.
*   **Winning Condition:** Clearing all the initial garbage lines.
*   **UI:**
    *   Display a timer.
    *   Display the number of garbage lines remaining.
    *   Show the final time upon completion.

### 4. Multiplayer Mode

*   **Description:** A mode for two or more players to compete. This will be marked as "Coming Soon" for the initial implementation.
*   **Implementation:** This will be a placeholder. The UI will show a disabled button or a page indicating that this feature is under development.

## Implementation Steps

1.  **Create Game Mode Selection UI:**
    *   Create a new component, `GameModeSelector.tsx`, which will be displayed when the app loads.
    *   This component will present the different game modes to the user.
    *   When a mode is selected, the app state will be updated, and the main game component will be rendered.

2.  **Refactor `useTetrisGame.ts`:**
    *   Modify the hook to accept a `gameMode` parameter (`'endless' | 'sprint' | 'dig'`).
    *   The core game logic will change based on the selected `gameMode`.
    - **Initial State:** The initial state of the game board will be different for 'dig' mode.
    - **Game Loop:** The game loop will need to check for mode-specific win/loss conditions.
    - **State variables:** Add new state for timer (for sprint and dig) and lines to clear (for sprint).

3.  **Update UI Components:**
    *   **`page.tsx`:** Update to show the `GameModeSelector` initially.
    *   **`GameBoard.tsx`:** Update to render the initial garbage lines for dig mode.
    *   **`Score.tsx` / `Scoreboard.tsx`:** Update to display relevant information for each game mode (e.g., timer, lines remaining).

4.  **State Management:**
    *   We need a way to manage the current game state, including the selected game mode and if a game is in progress.
    *   This could be managed in the root `page.tsx` component using `useState` or a more robust state management library if the complexity grows.

## File Structure Changes

-   `gamemodesPlan.md` (new file)
-   `src/components/GameModeSelector.tsx` (new component)
-   `src/app/page.tsx` (modified)
-   `src/components/Tetris/useTetrisGame.ts` (modified)
-   `src/components/Tetris/GameBoard.tsx` (modified)
-   `src/components/Tetris/Score.tsx` (modified) 
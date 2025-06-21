# Tetris Drop and Line Clear Logic Documentation

## Current Logic Overview

The Tetris game in `page.tsx` manages tetromino movement, locking, and line clearing using a combination of:
- An auto-drop interval (game loop)
- Keyboard event handlers (manual soft/hard drop)
- State and refs to track the active tetromino and drop source

### Key Functions and State
- `activeTetromino`: The current falling piece
- `setActiveTetromino`: Updates the active piece
- `setBoard`: Updates the board state
- `handleLineClear`: Updates score and lines cleared
- `justManuallyDroppedRef`: Ref flag to distinguish manual vs. auto drop

### Step-by-Step: What Happens When a Piece Drops

#### 1. Auto Drop (Interval)
- Every X ms, the interval tries to move the piece down.
- If the piece can't move down, it attempts to lock it:
  - If `justManuallyDroppedRef.current` is true, it skips locking (assuming a manual drop just happened).
  - Otherwise, it locks the piece, clears lines, updates score, and spawns a new piece.

#### 2. Manual Drop (Soft/Hard Drop)
- When the user presses ArrowDown or Space:
  - If the piece can't move down, it locks the piece, clears lines, updates score, and spawns a new piece.
  - Sets `justManuallyDroppedRef.current = true` to signal the interval to skip its own lock for this tick.

#### 3. The Problem
- **Race Condition:** Both the manual drop handler and the interval can process the lock event for the same piece in the same tick, especially if the user drops a piece just before the interval fires.
- **Result:** The line clear and score logic can run twice for a single piece, causing double counting.
- Attempts to fix this with a ref flag (`justManuallyDroppedRef`) have not been robust due to the asynchronous nature of React state and event timing.

---

## Proposed Refactor: Single Source of Truth for Locking

### Principle
**All locking and line clear logic should be handled in one place, and only once per tetromino.**

### Step-by-Step Plan

1. **Remove all lock/clear logic from the manual drop handler.**
   - Manual drop should only update the tetromino's position (move it down or hard drop it to the bottom).
   - It should _not_ lock the piece or clear lines directly.

2. **Centralize lock/clear logic in the auto-drop interval.**
   - The interval should always be responsible for detecting when a piece can no longer move down, locking it, clearing lines, and spawning a new piece.
   - After a manual drop (soft/hard), the interval will immediately run and process the lock if the piece is at the bottom.

3. **Trigger the interval immediately after a manual drop.**
   - After a hard/soft drop, force the interval logic to run (e.g., by calling the drop function or using a short timeout).
   - This ensures the lock/clear happens right after the manual drop, but still in the centralized place.

4. **Benefits:**
   - No need for a manual/auto drop flag.
   - No race conditions or double counting.
   - Simpler, more maintainable logic.

### Example Pseudocode

```js
// Manual drop handler:
if (canMoveDown) {
  moveTetrominoDown();
} else {
  // Do nothing here! Let the interval handle the lock/clear.
  // Optionally, force the interval to run immediately.
}

// Auto-drop interval:
if (!canMoveDown) {
  lockTetromino();
  clearLines();
  spawnNewTetromino();
}
```

---

## Summary
- **Current logic** tries to split lock/clear between manual and auto drop, leading to race conditions and double counting.
- **Proposed refactor** centralizes all lock/clear logic in the auto-drop interval, making the code simpler and more robust.
- **Next steps:** Refactor the code to follow this single-source-of-truth approach for locking and line clearing. 
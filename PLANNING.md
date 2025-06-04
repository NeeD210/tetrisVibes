# Vibe Tetris Webapp: High-Level Development Plan

This document outlines the high-level plan to develop a classical and minimalist, fully functioning Tetris app.

---

## Phase 1: Core Game Mechanics
- [x] Implement tetromino shapes and their rotations
- [x] Handle tetromino spawning and movement (left, right, down)
- [x] Implement collision detection with board boundaries and other pieces
- [x] Lock tetrominoes in place when they reach the bottom or land on another piece
- [x] Clear completed lines and update the score
- [x] Implement game over detection

## Phase 2: User Interface & Controls
- [x] Display the current score
- [x] Display the lines cleared
- [x] Add a preview for the next tetromino
- [x] Implement keyboard controls (arrow keys, space for hard drop, etc.)
- [x] Add minimalist visual styling for the board and pieces

## Phase 3: Game Loop & State Management
- [x] Implement the game loop (automatic downward movement of tetrominoes)
- [x] Add pause/resume functionality
- [x] Manage game state (start, running, paused, game over)

## Phase 4: Polish & Enhancements
- [ ] Add sound effects for line clears, drops, and game over
- [ ] Add simple animations for line clears and piece drops
- [ ] Responsive design for desktop and mobile
- [x] Add a restart button and basic menu
- [ ] Optimize performance and code structure

## Phase 5: Optional Features (Stretch Goals)
- [ ] Customizable controls
- [ ] Light/dark mode toggle
- [ ] Shareable score or leaderboard

---

## Milestones
- **MVP:** Playable Tetris game with keyboard controls, line clearing, and scoring
- **Polished Release:** Minimalist UI, responsive design, sound, and animations
- **Enhanced Version:** Optional features and user experience improvements

---

*This plan is iterative. Each phase builds on the previous one, allowing for testing and feedback at every step.* 